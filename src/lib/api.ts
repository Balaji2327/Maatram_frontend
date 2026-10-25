import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

// Token & User storage helpers
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("maatram_auth_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("maatram_auth_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maatram_auth_token");
    localStorage.removeItem("maatram_user");
  }
}

export function saveUser(user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("maatram_user", JSON.stringify(user));
  }
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("maatram_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  session?: any;
  user?: any;
  target?: string;
  applicationNumber?: string;
  [key: string]: any;
}

// Create dedicated Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer JWT Token automatically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract response data and handle network/auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    // If 401 Unauthorized, token might be expired
    if (error.response?.status === 401) {
      console.warn("Unauthorized API call. Session may have expired.");
    }
    return Promise.reject(error);
  }
);

// Safe helper to wrap axios calls into standard ApiResponse
async function callApi<T = any>(
  requestFn: () => Promise<{ data: any }>
): Promise<ApiResponse<T>> {
  try {
    const response = await requestFn();
    return response.data as ApiResponse<T>;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data?.message ||
          `Request failed with status ${error.response.status}`,
        error: error.response.data?.error || error.message,
      };
    }
    return {
      success: false,
      message: error?.message || "Failed to communicate with API server",
    };
  }
}

// Auth API Endpoints (Powered by Axios)
export const authApi = {
  // Send OTP to Phone (SMS) or Email via Supabase Auth
  sendOtp: async (payload: {
    phone?: string;
    email?: string;
    type?: "login" | "signup";
    fullName?: string;
    channel?: "phone" | "email";
  }): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/auth/send-otp", payload));
  },

  // Verify 6-digit OTP code and retrieve Supabase session
  verifyOtp: async (payload: {
    phone?: string;
    email?: string;
    token: string;
    type?: "login" | "signup";
    fullName?: string;
    channel?: "phone" | "email";
  }): Promise<ApiResponse> => {
    const result = await callApi(() => apiClient.post("/auth/verify-otp", payload));

    // Store token automatically upon successful OTP verification ONLY for login
    if (result.success && result.session?.access_token) {
      if (payload.type !== "signup") {
        setAuthToken(result.session.access_token);
        if (result.user) saveUser(result.user);
      }
    }

    return result;
  },

  // Get current user profile from auth.users
  getMe: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/auth/me"));
  },

  logout: () => {
    clearAuthToken();
  },
};

// Application Form API Endpoints (Powered by Axios)
export const applicationApi = {
  // Fetch current student's application data
  getMyApplication: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/application/me"));
  },

  // Save partial draft into Supabase database
  saveDraft: async (formData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/application/save-draft", formData));
  },

  // Final submission of scholarship application
  submitApplication: async (formData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/application/submit", formData));
  },

  // Get selection stage progress
  getStatus: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/application/status"));
  },
};

// Admin Storage helpers
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("maatram_admin_token");
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("maatram_admin_token", token);
  }
}

export function clearAdminToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maatram_admin_token");
    localStorage.removeItem("maatram_admin_user");
  }
}

// Admin Management API Endpoints
export const adminApi = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const res = await callApi(() => apiClient.post("/admin/login", credentials));
    if (res.success && res.adminToken) {
      setAdminToken(res.adminToken);
      if (typeof window !== "undefined" && res.user) {
        localStorage.setItem("maatram_admin_user", JSON.stringify(res.user));
      }
    }
    return res;
  },

  getApplications: async (params?: {
    status?: string;
    search?: string;
    district?: string;
  }): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/applications", { params }));
  },

  getApplicationById: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.get(`/admin/applications/${id}`));
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.patch(`/admin/applications/${id}/status`, { status }));
  },

  deleteApplication: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.delete(`/admin/applications/${id}`));
  },

  logout: () => {
    clearAdminToken();
  },
};
