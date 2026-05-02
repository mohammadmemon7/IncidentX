import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-primary-500/30">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter italic">
          <ShieldCheck className="text-primary-500" size={24} />
          IncidentX
        </Link>
        <Link to="/" className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
           <ChevronLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 space-y-12">
        <div className="space-y-4">
           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
           <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Last Updated: May 2, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Introduction</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 At IncidentX, we take your privacy and the security of your infrastructure data seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our incident management platform.
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-3 text-slate-400 text-base">
                 <li><strong>Account Data:</strong> Name, work email, and authentication credentials.</li>
                 <li><strong>System Metadata:</strong> Infrastructure logs, error rates, and system metrics provided during incident ingestion.</li>
                 <li><strong>Usage Data:</strong> Information on how you interact with the IncidentX dashboard and CLI tools.</li>
              </ul>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">3. How We Use Data</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 Your data is exclusively used to provide, maintain, and improve the IncidentX platform. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-slate-400 text-base">
                 <li>Generating automated postmortems and forensics.</li>
                 <li>Providing real-time alerts and team coordination.</li>
                 <li>Improving our machine-learning triage models.</li>
              </ul>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">4. Data Sovereignty</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 We believe in absolute data ownership. You retain full ownership of all infrastructure data ingested into IncidentX. We do not sell or trade your data to third parties.
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">5. Security</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 IncidentX utilizes industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. Access is strictly controlled via role-based access control (RBAC).
              </p>
           </section>

           <section className="space-y-4 pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white tracking-tight">Contact Us</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 If you have any questions about this Privacy Policy, please contact our security unit at <span className="text-primary-500 font-bold">security@incidentx.com</span>.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
