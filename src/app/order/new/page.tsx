import LeadForm from "../../../components/LeadForm";

export default function NewOrderPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Quiero mi propia web</h1>
          <p className="text-white/70 mt-2">Completá el formulario y nos comunicamos a la brevedad.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
