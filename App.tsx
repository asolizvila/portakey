
import React, { useState, useEffect, useRef } from 'react';
import { PortaKeyDevice } from './components/PortaKeyDevice';
import { PortaBoxDevice } from './components/PortaBoxDevice';
import { askGemini } from './services/geminiService';
import { SimulationState, DeliveryLog, View } from './types';
import { 
  ShieldCheck, Smartphone, Package, MessageSquare, ChevronRight, X,
  Clock, CheckCircle2, Lock, Zap, Activity, Shield, Eye, Settings,
  Database, Terminal as TerminalIcon, Wifi, Thermometer, Cpu, Radio,
  Video, Power, RefreshCw, AlertTriangle, Home, LayoutDashboard, Microscope, Info
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [simState, setSimState] = useState<SimulationState>(SimulationState.IDLE);
  const [simLogs, setSimLogs] = useState<string[]>(["STATUS: Ready for connection..."]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remoteLocked, setRemoteLocked] = useState(true);
  const [systemOnline, setSystemOnline] = useState(true);
  const [logs, setLogs] = useState<DeliveryLog[]>([
    { id: '1', time: '10:30 AM', carrier: 'Amazon Prime', status: 'Entregado', packageId: 'AMZ-4421' },
    { id: '2', time: 'Ayer', carrier: 'UPS Premium', status: 'Entregado', packageId: 'UPS-9901' },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    if (terminalEndRef.current) terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [simLogs]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    const response = await askGemini(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: response || '' }]);
    setLoading(false);
  };

  const startSimulation = () => {
    setSimLogs(["INITIALIZING..."]);
    setSimState(SimulationState.SCANNING);
    setTimeout(() => {
      setSimLogs(p => [...p, "[AUTH] Scanning digital key..."]);
      setSimState(SimulationState.VERIFYING);
      setTimeout(() => {
        setSimLogs(p => [...p, "[SYS] Identity verified: DHL Node 4"]);
        setSimState(SimulationState.OPENING);
        setRemoteLocked(false);
        setTimeout(() => {
          setSimLogs(p => [...p, "[SUCCESS] Package deposited. Vault re-locked."]);
          setSimState(SimulationState.DELIVERED);
          setRemoteLocked(true);
          setLogs(prev => [{ id: Date.now().toString(), time: 'Ahora', carrier: 'Simulated', status: 'Entregado', packageId: 'SIM-99' }, ...prev]);
        }, 2000);
      }, 1500);
    }, 1500);
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-700">
      <section className="pt-20 pb-40 px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-block px-3 py-1 blueprint-border text-[8px] font-bold uppercase tracking-widest text-white mb-8">
            <span className="flex items-center gap-2"><Zap size={10} /> Valencia Engineering</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold font-heading text-white leading-none tracking-tighter mb-10">
            PORTA <br/><span className="text-zinc-700">SYSTEMS</span>
          </h1>
          <p className="text-xl text-zinc-500 font-light max-w-lg mb-12">
            La infraestructura definitiva para el hogar inteligente. Seguridad de grado militar para la última milla de entrega, diseñada en el corazón de Valencia.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setCurrentView(View.LAB)} className="px-8 py-4 bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:invert transition-all">
              Probar Demo
            </button>
            <button onClick={() => setCurrentView(View.SPECS)} className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
              Hardware
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
            <PortaKeyDevice />
          </div>
        </div>
      </section>
    </div>
  );

  const renderSpecs = () => (
    <div className="animate-in slide-in-from-bottom-5 duration-700 pt-20 pb-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-5xl font-bold font-heading text-white tracking-tighter mb-4">Especificaciones.</h2>
        <p className="text-zinc-500 font-light tracking-[0.3em] uppercase text-[10px]">Technical Breakdown v4.1 | Valencia R&D</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        {[
          { icon: <Cpu />, title: "Procesador Enclave", data: "Dual-Core ARM Cortex-M4 con seguridad criptográfica basada en hardware." },
          { icon: <Wifi />, title: "Red Ultrarrápida", data: "Módulo 5G NR con fallback a Wi-Fi 6E y Bluetooth 5.3 Low Energy." },
          { icon: <Shield />, title: "Chasis Monolítico", data: "Acero al carbono de 3.5mm forjado en frío, resistente a impactos de hasta 500kg." },
          { icon: <Eye />, title: "Visión Nocturna", data: "Sensor IR Sony Starvis de 4K con reconocimiento biométrico de repartidores." },
          { icon: <Thermometer />, title: "Climatización", data: "Sistema de refrigeración pasiva para paquetes sensibles a la temperatura." },
          { icon: <Activity />, title: "Sensores de Peso", data: "Células de carga de alta precisión (±0.1g) para confirmar entregas." }
        ].map((item, i) => (
          <div key={i} className="blueprint-border p-10 glass-panel hover:border-white/30 transition-all group">
            <div className="mb-6 text-white group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">{item.title}</h3>
            <p className="text-zinc-500 text-xs font-light leading-relaxed">{item.data}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLab = () => (
    <div className="animate-in slide-in-from-bottom-5 duration-700 pt-20 pb-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-5xl font-bold font-heading text-white tracking-tighter mb-4">Laboratorio.</h2>
        <p className="text-zinc-500 font-light tracking-[0.3em] uppercase text-[10px]">Protocol Simulation Sandbox</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-10">
          <div className="bg-black border border-white/10 rounded-2xl p-8 font-mono text-[11px] h-80 overflow-y-auto scrollbar-hide shadow-inner scan-effect">
            <div className="flex justify-between border-b border-white/5 pb-4 mb-4 text-white/40">
              <span>PORTA_OS_CORE v4.2.0</span>
              <span>TERMINAL_VAL_01</span>
            </div>
            {simLogs.map((log, i) => (
              <div key={i} className="mb-1 flex gap-4">
                <span className="text-white/20">0{i+1}</span>
                <span className={log.includes("SUCCESS") ? "text-emerald-500" : "text-zinc-500"}>{log}</span>
              </div>
            ))}
            <div ref={terminalEndRef}></div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={startSimulation}
              disabled={simState !== SimulationState.IDLE && simState !== SimulationState.DELIVERED}
              className="flex-grow py-5 bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:invert transition-all disabled:opacity-20"
            >
              Run Protocol
            </button>
            <button 
              onClick={() => {setSimState(SimulationState.IDLE); setSimLogs(["STATUS: System reset."]);}}
              className="px-6 py-5 border border-white/10 text-white rounded-xl hover:bg-white/5"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-20">
          <div className={`transition-all duration-1000 ${simState === SimulationState.SCANNING ? 'scale-110' : 'opacity-40'}`}>
            <PortaKeyDevice />
          </div>
          <div className={`transition-all duration-1000 ${simState === SimulationState.OPENING || simState === SimulationState.DELIVERED ? 'scale-110' : 'opacity-40'}`}>
            <PortaBoxDevice isOpen={simState === SimulationState.OPENING || simState === SimulationState.DELIVERED} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-in slide-in-from-bottom-5 duration-700 pt-20 pb-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-bold font-heading text-white tracking-tighter mb-4">Consola Central.</h2>
          <p className="text-zinc-500 font-light tracking-[0.3em] uppercase text-[10px]">Real-time Fleet Operations | Valencia Hub</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Link Active</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 blueprint-border glass-panel overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest">Logs de Entrega</span>
            <Activity size={14} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                  <th className="p-6">Proveedor</th>
                  <th className="p-6">Tiempo</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6">ID</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400 text-xs font-light">
                {logs.map(log => (
                  <tr key={log.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 font-bold text-white">{log.carrier}</td>
                    <td className="p-6 font-mono opacity-60">{log.time}</td>
                    <td className="p-6"><span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold">{log.status}</span></td>
                    <td className="p-6 font-mono opacity-40">{log.packageId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="blueprint-border glass-panel p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-white/40">Remote Controls</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-[10px] font-bold uppercase">Master Lock</span>
                <button onClick={() => setRemoteLocked(!remoteLocked)} className={`w-12 h-6 rounded-full relative transition-all ${remoteLocked ? 'bg-white' : 'bg-zinc-800'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${remoteLocked ? 'right-1' : 'left-1 bg-zinc-400'}`}></div>
                </button>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-[10px] font-bold uppercase">System Link</span>
                <button onClick={() => setSystemOnline(!systemOnline)} className={`w-12 h-6 rounded-full relative transition-all ${systemOnline ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${systemOnline ? 'right-1' : 'left-1 bg-zinc-400'}`}></div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="blueprint-border p-6 text-center">
                <Thermometer size={16} className="mx-auto mb-4 opacity-30" />
                <p className="text-[9px] font-bold text-zinc-600 mb-1">BOX TEMP</p>
                <p className="text-xl font-bold text-white">18.4°C</p>
             </div>
             <div className="blueprint-border p-6 text-center">
                <Wifi size={16} className="mx-auto mb-4 opacity-30" />
                <p className="text-[9px] font-bold text-zinc-600 mb-1">LATENCY</p>
                <p className="text-xl font-bold text-white">4ms</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass-panel border-b border-white/5 px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(View.HOME)}>
          <div className="w-7 h-7 bg-white text-black flex items-center justify-center rounded">
            <Lock size={16} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold font-heading text-white tracking-tighter">PORTA</span>
        </div>
        
        <div className="hidden md:flex gap-10">
          {[
            { id: View.HOME, label: 'Inicio', icon: <Home size={14} /> },
            { id: View.SPECS, label: 'Hardware', icon: <Info size={14} /> },
            { id: View.LAB, label: 'Laboratorio', icon: <Microscope size={14} /> },
            { id: View.DASHBOARD, label: 'Consola', icon: <LayoutDashboard size={14} /> }
          ].map(link => (
            <button 
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 transition-all ${currentView === link.id ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
            >
              {link.icon} {link.label}
            </button>
          ))}
        </div>

        <button className="px-5 py-2 blueprint-border text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
          Reservar
        </button>
      </nav>

      {/* Main Content (Router) */}
      <main className="flex-grow">
        {currentView === View.HOME && renderHome()}
        {currentView === View.SPECS && renderSpecs()}
        {currentView === View.LAB && renderLab()}
        {currentView === View.DASHBOARD && renderDashboard()}
      </main>

      {/* Footer */}
      <footer className="p-12 border-t border-white/5 bg-black flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-bold uppercase tracking-[0.5em]">
        <p className="text-zinc-700">Engineered in Valencia, Spain © 2026 PORTA SYSTEMS</p>
        <div className="flex gap-10 text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Tech Stack</a>
          <a href="#" className="hover:text-white transition-colors">Compliance</a>
        </div>
      </footer>

      {/* Chat Bot */}
      <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 ${chatOpen ? 'w-80 md:w-[400px]' : 'w-16'}`}>
        {chatOpen ? (
          <div className="blueprint-border glass-panel h-[500px] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-5">
            <div className="p-6 bg-zinc-900/50 flex justify-between items-center border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Soporte IA</span>
              <button onClick={() => setChatOpen(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4 font-light text-xs">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-xl ${m.role === 'user' ? 'bg-white text-black font-bold' : 'bg-zinc-900 text-zinc-400 border border-white/5'}`}>
                     {m.text}
                   </div>
                 </div>
               ))}
               {loading && <div className="text-[8px] font-bold uppercase text-white/30 animate-pulse">Consultando Porta Cloud...</div>}
            </div>
            <div className="p-4 bg-black border-t border-white/5 flex gap-2">
               <input 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Consulta técnica..."
                 className="flex-grow bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 text-[10px] focus:outline-none text-white font-bold tracking-widest placeholder:opacity-20"
               />
               <button onClick={handleSendMessage} className="bg-white text-black p-3 rounded-lg"><ChevronRight size={18} /></button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
          >
            <MessageSquare size={24} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
