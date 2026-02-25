import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Power, 
  Fan, 
  Navigation, 
  Music, 
  Phone, 
  Settings, 
  Battery, 
  Thermometer,
  Car,
  ChevronRight,
  Fingerprint,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Bluetooth,
  RefreshCw,
  Check
} from 'lucide-react';

// --- Types ---
type Screen = 'login' | 'dashboard' | 'climate' | 'media' | 'engineering' | 'settings' | 'bluetooth';

// --- Components ---

const IconButton = ({ icon: Icon, label, active, onClick, color = "blue" }: any) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
      active 
        ? `bg-${color}-500/20 border-${color}-500/50 border shadow-[0_0_15px_rgba(59,130,246,0.3)]` 
        : 'bg-white/5 border border-white/10 hover:bg-white/10'
    }`}
  >
    <Icon className={`w-6 h-6 mb-2 ${active ? `text-${color}-400` : 'text-white/60'}`} />
    <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">{label}</span>
  </motion.button>
);

const StatCard = ({ label, value, unit, icon: Icon }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
    <div className="p-2 bg-white/5 rounded-lg">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-bold">{value}</span>
        <span className="text-xs text-white/40">{unit}</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [isLocked, setIsLocked] = useState(true);
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [temp, setTemp] = useState(22);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd",
    progress: 45
  });

  const [engineeringData, setEngineeringData] = useState({
    motorTemp: 64,
    inverterTemp: 52,
    batteryVoltage: 398.4,
    canBusLoad: 12.4,
    cellImbalance: 0.002
  });

  const [bluetoothDevices, setBluetoothDevices] = useState([
    { id: 1, name: "iPhone 15 Pro", connected: true, type: "phone" },
    { id: 2, name: "Sony WH-1000XM5", connected: false, type: "audio" },
    { id: 3, name: "Pixel 8", connected: false, type: "phone" },
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleSeek = (e: React.PointerEvent) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCurrentTrack(prev => ({ ...prev, progress: percentage }));
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    setScreen('dashboard');
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
    // Simulate haptic feedback
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto relative overflow-hidden bg-[#050505] flex flex-col">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Status Bar */}
      <div className="px-6 pt-4 flex justify-between items-center z-10">
        <span className="text-sm font-mono font-medium opacity-60">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-3 opacity-60">
          <Battery className="w-4 h-4" />
          <span className="text-xs font-mono">84%</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {screen === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center px-8 z-10"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <Car className="w-24 h-24 text-blue-500 relative z-10" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tighter mb-2 text-center">AutoKey</h1>
            <p className="text-white/40 text-sm mb-12 text-center">Secure Mobile Entry System</p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full py-6 rounded-3xl bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              <Fingerprint className="w-6 h-6" />
              <span className="font-bold tracking-wide">AUTHENTICATE</span>
            </motion.button>
            
            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
              Encrypted Connection Active
            </p>

            <button 
              onDoubleClick={() => setScreen('engineering')}
              className="mt-12 opacity-0 w-12 h-12 cursor-default"
              aria-hidden="true"
            />
          </motion.div>
        ) : screen === 'engineering' ? (
          <motion.div
            key="engineering"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-12 z-10 font-mono"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-blue-400">SYS_DIAGNOSTICS_V4</h2>
              <button 
                onClick={() => setScreen('dashboard')}
                className="text-[10px] border border-white/20 px-2 py-1 rounded hover:bg-white/10"
              >
                EXIT_ROOT
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-8">
              {[
                { label: "MOTOR_TEMP", value: engineeringData.motorTemp, unit: "C" },
                { label: "INV_TEMP", value: engineeringData.inverterTemp, unit: "C" },
                { label: "HV_BATT_V", value: engineeringData.batteryVoltage, unit: "V" },
                { label: "CAN_LOAD", value: engineeringData.canBusLoad, unit: "%" },
                { label: "CELL_IMB", value: engineeringData.cellImbalance, unit: "V" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 border-b border-white/10">
                  <span className="text-xs text-white/40">{item.label}</span>
                  <span className="text-sm font-bold text-blue-300">{item.value} <span className="text-[10px] opacity-50">{item.unit}</span></span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <p className="text-[10px] text-blue-500/50 mb-2 uppercase tracking-widest">Live_CAN_Stream</p>
              <div className="flex-1 bg-black/40 rounded border border-white/5 p-3 overflow-y-auto text-[10px] space-y-1 text-green-500/70">
                <p>[0.0012] ID:0x12A DATA: 04 1F 22 00 00 FF</p>
                <p>[0.0045] ID:0x2B1 DATA: 12 00 00 00 45 12</p>
                <p>[0.0089] ID:0x08F DATA: FF FF FF FF 00 12</p>
                <p className="animate-pulse">[0.0123] ID:0x442 DATA: 00 12 45 11 22 33</p>
                <p>[0.0156] ID:0x12A DATA: 04 1F 22 00 00 FF</p>
                <p>[0.0198] ID:0x2B1 DATA: 12 00 00 00 45 12</p>
                <p>[0.0245] ID:0x08F DATA: FF FF FF FF 00 12</p>
              </div>
            </div>
          </motion.div>
        ) : screen === 'settings' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-12 z-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setScreen('dashboard')} className="p-2 bg-white/5 rounded-lg">
                <ChevronRight className="w-5 h-5 rotate-180 text-white/60" />
              </button>
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setScreen('bluetooth')}
                className="w-full flex items-center justify-between p-4 glass-panel hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Bluetooth className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Bluetooth</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Pair new devices</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </button>

              <div className="p-4 glass-panel opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Settings className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">System Updates</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">v12.4.1 Installed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : screen === 'bluetooth' ? (
          <motion.div
            key="bluetooth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-12 z-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setScreen('settings')} className="p-2 bg-white/5 rounded-lg">
                  <ChevronRight className="w-5 h-5 rotate-180 text-white/60" />
                </button>
                <h2 className="text-2xl font-bold tracking-tight">Bluetooth</h2>
              </div>
              <button 
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => setIsScanning(false), 2000);
                }}
                className={`p-2 rounded-lg ${isScanning ? 'bg-blue-500/20' : 'bg-white/5'}`}
              >
                <RefreshCw className={`w-5 h-5 text-blue-400 ${isScanning ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 px-2">My Devices</p>
            <div className="space-y-3 mb-8">
              {bluetoothDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 glass-panel">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${device.connected ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <Bluetooth className={`w-5 h-5 ${device.connected ? 'text-blue-400' : 'text-white/40'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{device.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">
                        {device.connected ? 'Connected' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  {device.connected ? (
                    <Check className="w-5 h-5 text-blue-400" />
                  ) : (
                    <button 
                      onClick={() => {
                        setBluetoothDevices(prev => prev.map(d => d.id === device.id ? { ...d, connected: true } : { ...d, connected: false }));
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl"
              >
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Searching for devices...</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col px-6 pt-8 pb-12 z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Model S Plaid</h2>
                <p className="text-white/40 text-xs font-mono">VIN: 5YJ3E1EB...892</p>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <Settings 
                  className="w-5 h-5 text-white/60 cursor-pointer" 
                  onClick={() => setScreen('settings')}
                />
              </div>
            </div>

            {/* Car Visualization Placeholder */}
            <div className="relative h-48 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl" />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Car className="w-40 h-40 text-white/10" />
              </motion.div>
              
              {/* Status Indicators */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {isLocked ? 'Locked' : 'Unlocked'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isEngineOn ? 'bg-blue-500 pulse-ring' : 'bg-white/20'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {isEngineOn ? 'Engine Running' : 'Engine Off'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard label="Range" value="412" unit="km" icon={Battery} />
              <StatCard label="Temp" value={temp} unit="°C" icon={Thermometer} />
            </div>

            {/* Main Controls */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <IconButton 
                icon={isLocked ? Lock : Unlock} 
                label={isLocked ? "Unlock" : "Lock"} 
                active={!isLocked}
                onClick={toggleLock}
                color={isLocked ? "blue" : "green"}
              />
              <IconButton 
                icon={Power} 
                label="Start" 
                active={isEngineOn}
                onClick={() => setIsEngineOn(!isEngineOn)}
                color="blue"
              />
              <IconButton 
                icon={Fan} 
                label="Climate" 
                onClick={() => {}} 
              />
            </div>

            {/* Media Control Panel */}
            <div className="mb-8 glass-panel p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                  <Music className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{currentTrack.title}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{currentTrack.artist}</p>
                </div>
              </div>
              
              {/* Progress Bar Container with larger hit area */}
              <div 
                ref={progressBarRef}
                className="w-full h-6 flex items-center cursor-pointer group mb-2 touch-none"
                onPointerDown={handleSeek}
                onPointerMove={(e) => e.buttons === 1 && handleSeek(e)}
              >
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="h-full bg-blue-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentTrack.progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-8">
                <button className="text-white/40 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </motion.button>
                <button className="text-white/40 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* Secondary Controls List */}
            <div className="space-y-3">
              {[
                { icon: Navigation, label: "Navigation", sub: "Send to vehicle" },
                { icon: Phone, label: "Phone", sub: "Connected via Bluetooth" },
              ].map((item, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center justify-between p-4 glass-panel hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <item.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Only if logged in) */}
      {screen !== 'login' && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-6 z-20">
          <Car className="w-6 h-6 text-blue-500" />
          <Navigation className="w-6 h-6 text-white/40" />
          <Music className="w-6 h-6 text-white/40" />
          <Settings className="w-6 h-6 text-white/40" />
        </div>
      )}
    </div>
  );
}
