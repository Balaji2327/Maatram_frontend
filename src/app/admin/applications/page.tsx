import React, { Suspense } from "react";
import AdminApplicationsScreen from "../../../pages/admin/AdminApplicationsScreen";

export const metadata = {
  title: "Applications Management | Maatram Foundation",
  description: "View, filter and manage all student scholarship applications.",
};

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs text-slate-500 font-bold">Loading applications...</div>}>
      <AdminApplicationsScreen />
    </Suspense>
  );
}
