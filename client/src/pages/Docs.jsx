import { ShieldCheck, ChevronLeft, Book, Zap, Terminal, Lock, Globe, Search, Code, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocSection = ({ title, icon: Icon, children }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-500">
          <Icon size={20} />
       </div>
       <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed space-y-4">
       {children}
    </div>
  </section>
);

const Docs = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-primary-500/30">
      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter italic">
          <ShieldCheck className="text-primary-500" size={24} />
          IncidentX
        </Link>
        <div className="flex items-center gap-8">
           <Link to="/status" className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">System Status</Link>
           <Link to="/" className="h-9 px-4 rounded-lg bg-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2">
              <ChevronLeft size={16} /> Exit Docs
           </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-24 grid lg:grid-cols-12 gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 hidden lg:block space-y-8 sticky top-44 h-fit">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Core Concepts</h3>
              <nav className="flex flex-col gap-1">
                 {['Introduction', 'Quick Start', 'Architecture'].map((item) => (
                   <button key={item} className="text-left px-3 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                      {item}
                   </button>
                 ))}
              </nav>
           </div>
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Integration</h3>
              <nav className="flex flex-col gap-1">
                 {['REST API', 'Webhooks', 'CLI Tooling', 'SDKs'].map((item) => (
                   <button key={item} className="text-left px-3 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                      {item}
                   </button>
                 ))}
              </nav>
           </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-24 max-w-4xl">
           <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white tracking-tight">Documentation Hub</h1>
              <p className="text-lg text-slate-500 font-medium max-w-2xl">Master the IncidentX protocol. Learn how to automate your response, secure your infrastructure, and maintain 99.99% reliability.</p>
           </div>

           <DocSection title="Introduction" icon={Book}>
              <p>
                 IncidentX is a unified command center designed for modern engineering teams. It bridges the gap between infrastructure monitoring and manual coordination, using Gemini-powered AI to triage and automate the response lifecycle.
              </p>
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                 <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <Zap className="text-primary-500 mb-2" size={24} />
                    <h4 className="text-white font-bold">Fast Ingestion</h4>
                    <p className="text-sm">Ingest logs from any service via REST or our native CLI tool.</p>
                 </div>
                 <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <Cpu className="text-primary-500 mb-2" size={24} />
                    <h4 className="text-white font-bold">AI Forensics</h4>
                    <p className="text-sm">Gemini 2.0 automatically analyzes log patterns to identify root causes.</p>
                 </div>
              </div>
           </DocSection>

           <DocSection title="Quick Start" icon={Zap}>
              <p>Initialize your first operational unit in under 5 minutes. IncidentX is built to be "drop-in" ready.</p>
              <div className="space-y-4">
                 <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Terminal</span>
                       <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-slate-700" />
                          <div className="w-2 h-2 rounded-full bg-slate-700" />
                          <div className="w-2 h-2 rounded-full bg-slate-700" />
                       </div>
                    </div>
                    <pre className="p-6 text-sm font-mono text-primary-400">
                       <code>npm install -g @incidentx/cli<br />ix init --protocol=secure</code>
                    </pre>
                 </div>
                 <p className="text-sm italic text-slate-500">Note: Ensure your API tokens are configured in your environment variables before initialization.</p>
              </div>
           </DocSection>

           <DocSection title="API Integration" icon={Code}>
              <p>Send operational telemetry directly to our secure ingest gateway.</p>
              <pre className="bg-black/40 p-6 rounded-xl border border-white/5 text-sm font-mono text-slate-300">
                 <code>{`POST /api/ingest
Content-Type: application/json
Authorization: Bearer <Ix_Token>

{
  "service": "api-gateway",
  "log_level": "CRITICAL",
  "message": "Database connection pool exhausted"
}`}</code>
              </pre>
           </DocSection>

           <DocSection title="Security Protocol" icon={Lock}>
              <p>All data is encrypted using AES-256 at rest and TLS 1.3 in transit. IncidentX complies with SOC2 Type II and GDPR standards for enterprise infrastructure management.</p>
              <div className="flex items-center gap-6 p-6 rounded-xl bg-primary-600/5 border border-primary-500/20">
                 <ShieldCheck size={32} className="text-primary-500 shrink-0" />
                 <p className="text-sm font-medium text-slate-300">We utilize Role-Based Access Control (RBAC) to ensure that only authorized engineering units can access sensitive incident forensics.</p>
              </div>
           </DocSection>

           {/* Footer */}
           <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest">© 2026 IncidentX Protocol</p>
              <div className="flex gap-8">
                 <button className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Support Center</button>
                 <button className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Status Page</button>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
