import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-primary-500/30">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-lg md:text-xl tracking-tighter italic">
          <ShieldCheck className="text-primary-500" size={20} />
          IncidentX
        </Link>
        <Link to="/" className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
           <ChevronLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 space-y-12">
        <div className="space-y-4">
           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Terms of Service</h1>
           <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Last Updated: May 2, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 By accessing or using the IncidentX platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Use of the Service</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 IncidentX provides an incident management and observability platform. You are responsible for all activity that occurs under your account and for maintaining the confidentiality of your credentials.
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">3. Data Usage & Integration</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 By integrating your infrastructure with IncidentX, you grant us the limited right to process your logs and metrics for the purpose of incident detection and resolution. You represent that you have the right to share this data.
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">4. Prohibited Conduct</h2>
              <ul className="list-disc pl-6 space-y-3 text-slate-400 text-base">
                 <li>Attempting to bypass platform security measures.</li>
                 <li>Using the service to process data that violates local laws.</li>
                 <li>Reverse engineering the IncidentX protocol or CLI tools.</li>
              </ul>
           </section>

           <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">5. Limitation of Liability</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 While we strive for 100% uptime, IncidentX is provided "as is." We are not liable for any indirect or consequential damages arising from the use or inability to use our platform during a network event.
              </p>
           </section>

           <section className="space-y-4 pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white tracking-tight">Contact</h2>
              <p className="text-base text-slate-400 leading-relaxed">
                 For legal inquiries, please reach out to <span className="text-primary-500 font-bold">legal@incidentx.com</span>.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
