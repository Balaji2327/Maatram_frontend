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

// Request Interceptor: Attach Bearer JWT Token automatically (student auth or admin token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAdminRoute = Boolean(config.url && config.url.includes("/admin"));

    // For admin routes, prioritize admin token
    const token = isAdminRoute
      ? (getAdminToken() || getAuthToken())
      : (getAuthToken() || getAdminToken());

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isAdminRoute && config.headers) {
      const adminUser = getStoredAdminUser();
      if (adminUser?.email) {
        config.headers["x-admin-email"] = adminUser.email;
      }
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
  // Student Registration with Password (No OTP)
  signup: async (payload: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/auth/signup", payload));
  },

  // Student Login with Email and Password (No OTP)
  login: async (payload: {
    email?: string;
    identifier?: string;
    password: string;
  }): Promise<ApiResponse> => {
    const result = await callApi(() => apiClient.post("/auth/login", payload));
    if (result.success && result.session?.access_token) {
      setAuthToken(result.session.access_token);
      if (result.user) saveUser(result.user);
    }
    return result;
  },

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

export function getStoredAdminUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("maatram_admin_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function saveAdminUser(user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("maatram_admin_user", JSON.stringify(user));
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
  login: async (credentials: { email: string; password: string; otp?: string }): Promise<ApiResponse> => {
    const res = await callApi(() => apiClient.post("/admin/login", credentials));
    if (res.success && res.adminToken) {
      setAdminToken(res.adminToken);
      if (typeof window !== "undefined" && res.user) {
        localStorage.setItem("maatram_admin_user", JSON.stringify(res.user));
      }
    }
    return res;
  },

  getProfile: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/profile"));
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/admin/change-password", passwords));
  },

  changeEmail: async (payload: { newEmail: string }): Promise<ApiResponse> => {
    const res = await callApi(() => apiClient.post("/admin/change-email", payload));
    if (res.success && res.adminToken) {
      setAdminToken(res.adminToken);
      if (typeof window !== "undefined" && res.user) {
        localStorage.setItem("maatram_admin_user", JSON.stringify(res.user));
      }
    }
    return res;
  },

  toggle2FA: async (payload: { enable: boolean; verificationCode?: string }): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/admin/toggle-2fa", payload));
  },

  getAdministrators: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/administrators"));
  },

  addAdministrator: async (adminData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/admin/administrators", adminData));
  },

  deleteAdministrator: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.delete(`/admin/administrators/${id}`));
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

  updateVolunteerSuggestion: async (
    id: string,
    suggestion: string,
    volunteer_name?: string
  ): Promise<ApiResponse> => {
    return callApi(() =>
      apiClient.patch(`/admin/applications/${id}/volunteer-suggestion`, {
        suggestion,
        volunteer_name,
      })
    );
  },

  bulkUpdateVolunteerSuggestions: async (
    suggestions: Array<{ id?: string; application_number?: string; suggestion: string; volunteer_name?: string }>
  ): Promise<ApiResponse> => {
    return callApi(() =>
      apiClient.post("/admin/applications/bulk-volunteer-suggestions", { suggestions })
    );
  },

  deleteApplication: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.delete(`/admin/applications/${id}`));
  },

  // Posts API
  getPosts: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/posts"));
  },

  createPost: async (postData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/admin/posts", postData));
  },

  updatePost: async (id: string, postData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.put(`/admin/posts/${id}`, postData));
  },

  deletePost: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.delete(`/admin/posts/${id}`));
  },

  // Events API
  getEvents: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/events"));
  },

  createEvent: async (eventData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.post("/admin/events", eventData));
  },

  updateEvent: async (id: string, eventData: any): Promise<ApiResponse> => {
    return callApi(() => apiClient.put(`/admin/events/${id}`, eventData));
  },

  deleteEvent: async (id: string): Promise<ApiResponse> => {
    return callApi(() => apiClient.delete(`/admin/events/${id}`));
  },

  // Approve Volunteer Assignment (Hybrid AI Matching trigger)
  approveVolunteerAssignment: async (eventId: string, volunteerEmail: string, batchSize: number = 10): Promise<ApiResponse> => {
    return callApi(() =>
      apiClient.post(`/admin/events/${eventId}/approve-assignment`, {
        volunteerEmail,
        batchSize,
      })
    );
  },

  // Get Assigned Applicants for an Event
  getEventAssignments: async (eventId: string, email?: string): Promise<ApiResponse> => {
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    return callApi(() => apiClient.get(`/admin/events/${eventId}/assignments${query}`));
  },

  // Students Directory
  getStudents: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/students"));
  },

  // Alumni Directory
  getAlumni: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/alumni"));
  },

  // Volunteers Directory
  getRegisteredVolunteers: async (): Promise<ApiResponse> => {
    return callApi(() => apiClient.get("/admin/volunteers/list"));
  },

  logout: () => {
    clearAdminToken();
  },
};

