import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Activity, 
  Users, 
  Lock, 
  Globe, 
  ChevronRight,
  Database,
  Terminal,
  Search,
  MessageSquare,
  Command
} from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-6 p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
    <div className="shrink-0 w-12 h-12 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
      <Icon size={24} />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-primary-500/30">
      <Navbar />

      {/* Hero Section: Optimized Typography */}
      <section className="relative pt-40 pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-10">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">
               <Command size={14} />
               Protocol v2.4.0 Live
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl">
              Professional Incident Response <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-slate-500">for Modern Infrastructure.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              Detect, coordinate, and resolve incidents with surgical precision. The unified command center for high-performance engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/signup" className="h-12 px-10 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-500 transition-all active:scale-95 shadow-lg shadow-primary-600/20">
                Deploy System <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="h-12 px-10 rounded-lg border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                Enter Gateway
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Balanced Proportions */}
      <section className="py-24 bg-[#010411]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              A smarter layer for <br /> handling the unexpected.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed">
              We built IncidentX to bridge the gap between detection and resolution. No more hunting through logs during a critical outage.
            </p>
            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-white/5 max-w-xs mx-auto lg:mx-0">
               <div>
                  <p className="text-2xl font-bold text-white tracking-tight">40%</p>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Faster Resolution</p>
               </div>
               <div>
                  <p className="text-2xl font-bold text-white tracking-tight">99.9%</p>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Uptime Target</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid md:grid-cols-2 gap-4">
             <FeatureItem icon={Zap} title="Automated Triage" description="Instant severity classification using infrastructure patterns." />
             <FeatureItem icon={Search} title="Deep Forensics" description="One-click access to logs, traces, and metrics surrounding events." />
             <FeatureItem icon={MessageSquare} title="Unified Chat" description="Context-aware channels synced with your timeline." />
             <FeatureItem icon={Activity} title="Live Monitoring" description="Real-time health dashboards that update as you work." />
             <FeatureItem icon={Terminal} title="CLI Tool" description="Manage incidents directly from your local terminal." />
             <FeatureItem icon={Globe} title="Public Status" description="Beautiful portals to keep your customers informed." />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
           <div className="space-y-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                 Stable code. Secure ops. <br /> Happy engineering teams.
              </h2>
              <div className="space-y-6">
                 <p className="text-base text-slate-400 leading-relaxed font-medium">
                    IncidentX isn't just a tool; it's a culture of reliability. We provide the structure so you can focus on solving the problem.
                 </p>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto md:mx-0">
                    {[
                      "Role-based access",
                      "Automated updates",
                      "Incident analytics",
                      "Slack & PagerDuty"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold text-white">
                         <ShieldCheck className="text-primary-500" size={16} />
                         {text}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
           <div className="relative">
              <div className="p-8 rounded-lg border border-white/5 bg-slate-900/50 backdrop-blur-xl space-y-6">
                 <h3 className="text-xl font-bold text-white tracking-tight">The IncidentX Standard</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">
                    Built for the modern cloud stack. Monoliths to microservices, we've got you covered.
                 </p>
                 <div className="grid grid-cols-3 gap-4 opacity-20 grayscale">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-6 bg-white/20 rounded"></div>)}
                 </div>
                 <div className="pt-6 border-t border-white/5 flex justify-center">
                    <Link to="/signup" className="text-xs font-bold text-primary-400 hover:text-white transition-colors flex items-center gap-2">
                       Architecture Overview <ChevronRight size={14} />
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Redesigned Premium CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative p-12 md:p-20 rounded-2xl bg-gradient-to-br from-primary-600 to-blue-700 overflow-hidden shadow-2xl shadow-primary-500/20">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  Ready to master your infrastructure?
                </h2>
                <p className="text-primary-100 text-lg max-w-xl mx-auto font-medium">
                  Join the engineering elite who trust IncidentX to manage their most critical systems with absolute confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Link to="/signup" className="h-14 px-12 rounded-lg bg-white text-primary-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
                    Get Started Now <ArrowRight size={20} />
                 </Link>
                 <Link to="/login" className="h-14 px-10 rounded-lg border border-white/20 text-white font-bold flex items-center justify-center hover:bg-white/10 transition-all">
                    Access Portal
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-white font-bold text-lg italic tracking-tighter">
            <ShieldCheck className="text-primary-500" size={18} />
            IncidentX
          </div>
          <div className="flex items-center gap-8 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/status" className="hover:text-white transition-colors">Status</Link>
            <span className="text-slate-700">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
