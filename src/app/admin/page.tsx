import AdminGate from "@/components/AdminGate";
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminGate>
      <main className="min-h-screen p-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <AdminDashboard />
        </div>
      </main>
    </AdminGate>
  );
}
