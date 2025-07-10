import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import AuthGuard from "@/components/auth/auth-guard";

export const metadata = {
  title: "Admin Dashboard - Temple Management System",
  description: "Admin panel for managing users and places",
};

export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex-1 lg:ml-64">
            <AdminHeader />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
