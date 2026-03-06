import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, Server, FileText, Cpu, Activity } from 'lucide-react';

// ── Site identity ──────────────────────────────────────────────────
const SITE_ID = "CSE-IDX-2024";
const AGENT_VERSION = "v2.4.1";

// Mock Data
const generateMockData = (count = 150) => {
  const data = [];
  const names = ["Aarav Patel", "Diya Sharma", "Reyansh Kumar", "Ananya Singh", "Vivaan Gupta", "Myra Das", "Aditya Joshi", "Saanvi Rao", "Arjun Reddy", "Kavya Iyer", "Ishaan Kapoor", "Nia Mehta", "Kabir Chatterjee", "Aisha Khan", "Dev Joshi", "Rahul Verma", "Sneha Patil", "Aman Desai"];
  const stages = ["PRELIMS", "MAINS", "INTERVIEW"];
  const exams = ["CIVIL SERVICES"];
  
  for (let i = 0; i < count; i++) {
    const rollStr = Math.floor(1000000 + Math.random() * 9000000).toString();
    data.push({
      id: i,
      roll_no: rollStr,
      name: names[Math.floor(Math.random() * names.length)],
      exam: exams[Math.floor(Math.random() * exams.length)],
      stage: stages[Math.floor(Math.random() * stages.length)],
      year: 2024,
      status: "QUALIFIED",
      rank: Math.random() > 0.85 ? Math.floor(Math.random() * 500) + 1 : "-"
    });
  }
  return data;
};

const DUMMY_DATA = generateMockData(200);

// Reusable graphic components
const CrossMark = ({ className }: { className?: string }) => (
  <div className={`absolute flex items-center justify-center pointer-events-none opacity-60 ${className}`}>
    <div className="absolute w-[1px] h-8 bg-black" />
    <div className="absolute h-[1px] w-8 bg-black" />
    <div className="absolute w-4 h-4 rounded-full border border-black" />
  </div>
);

const BlockMarker = ({ className }: { className?: string }) => (
  <div className={`absolute flex flex-col gap-[2px] pointer-events-none opacity-80 mix-blend-multiply ${className}`}>
    <div className="w-12 h-12 bg-black" />
    <div className="w-12 h-[3px] bg-black" />
    <div className="w-12 h-[3px] bg-black" />
    <div className="w-12 h-3 bg-black" />
  </div>
);

export default function App() {
  const [filter, setFilter] = useState({ stage: 'ALL', search: '' });
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState("IDLE");
  const [terminalLogs, setTerminalLogs] = useState([
    `> SYSTEM INITIALIZED: ${SITE_ID}_AI_SYNC_${AGENT_VERSION}`,
    "> AWAITING COMMAND..."
  ]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Derived data via useMemo — no extra useState + useEffect needed ──
  const data = useMemo(() => {
    return DUMMY_DATA.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(filter.search.toLowerCase()) || item.roll_no.includes(filter.search);
      const matchStage = filter.stage === 'ALL' || item.stage === filter.stage;
      return matchSearch && matchStage;
    });
  }, [filter]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ── Simulate AI Fetching ──────────────────────────────────────────
  const triggerSync = useCallback(() => {
    setSyncStatus("SYNCING...");
    setTerminalLogs(prev => [...prev, "> INITIATING API CONNECTION...", "> TARGET: HTTPS://UPSC.GOV.IN/RESULTS", "> PARSING LATEST PDF DATABASES..."]);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setTerminalLogs(prev => [...prev, "[AI MODULE] EXTRACTING OCR DATA...", "> CROSS-REFERENCING MASTER ROLLS..."]);
      } else if (step === 2) {
        setTerminalLogs(prev => [...prev, "[VALIDATION] MATCHING AGAINST GOV RECORDS", `> ${DUMMY_DATA.length} RECORDS VERIFIED WITH 99.8% CONFIDENCE.`]);
      } else {
        clearInterval(interval);
        setSyncStatus("SYNCED OK");
        setTerminalLogs(prev => [...prev, "> DATABASE UPDATED SUCCESSFULLY. SYNC COMPLETE."]);
        setTimeout(() => setSyncStatus("IDLE"), 5000);
      }
    }, 1200);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = filter.search.toLowerCase();
    if (!searchTerm) return;

    const foundRow = data.find(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.roll_no.includes(searchTerm)
    );

    if (foundRow) {
      const rowElement = document.getElementById(`row-${foundRow.id}`);
      rowElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedRow(foundRow.id);
      setTimeout(() => setHighlightedRow(null), 1500);
    }
  }, [data, filter.search]);


  return (
    <div className="min-h-screen w-full relative overflow-x-hidden pb-32">
      
      {/* --- BACKGROUND GRAPHICS (own compositing layer via gpu-layer) --- */}
      <div className="gpu-layer fixed top-[10%] -left-20 text-[25vw] font-brutal text-black/[0.03] pointer-events-none z-[-1] leading-none select-none mix-blend-multiply whitespace-nowrap">
        UPSC
      </div>
      <div className="gpu-layer fixed top-[50%] -right-10 text-[20vw] font-brutal text-black/[0.04] pointer-events-none z-[-1] leading-none select-none mix-blend-multiply whitespace-nowrap">
        DATA
      </div>

      {/* Neon Green Accent Lines — composited layers */}
      <div className="gpu-layer fixed top-[20vh] left-0 w-full h-[1px] bg-[#39ff14] z-0 opacity-80 shadow-[0_0_8px_#39ff14]" />
      <div className="gpu-layer fixed top-[70vh] right-0 w-[80vw] h-[1px] bg-[#39ff14] z-0 opacity-40 mix-blend-overlay hidden md:block" />
      <div className="gpu-layer fixed top-0 left-[8vw] w-[1px] h-full bg-[#39ff14] z-0 opacity-50 mix-blend-overlay hidden lg:block" />

      {/* Registration Marks */}
      <CrossMark className="top-12 left-12 hidden md:flex" />
      <CrossMark className="top-12 right-12 hidden md:flex" />
      <CrossMark className="bottom-12 left-12 hidden md:flex" />
      <CrossMark className="bottom-12 right-12 hidden md:flex" />
      
      <BlockMarker className="top-[35vh] -left-2" />
      <BlockMarker className="top-[65vh] right-0 opacity-40" />


      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-24 pt-16 md:pt-32 max-w-[1800px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end border-b-[3px] border-black pb-8 relative">
          <div className="relative w-full md:w-auto">
            {/* Overlapping small text element from image vibe */}
            <div className="absolute -top-12 left-1 font-tech text-xs uppercase opacity-70 tracking-widest hidden md:block border border-black p-1 bg-[#d1d1d1]">
              [UPSC] &amp; [AI-PARSED]<br/>req_level: highest
            </div>
            
            <div className="font-tech text-xs md:text-sm uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              <Activity size={16} className="text-[#39ff14]" />
              <span>[LIVE] QUALIFIER REGISTRY</span>
              <span className="bg-black text-[#d1d1d1] px-2 py-[2px] ml-2 tracking-tighter shadow-[2px_2px_0_0_#39ff14]">{AGENT_VERSION}</span>
              {/* Site ID badge */}
              <span className="ml-auto md:ml-4 bg-[#39ff14] text-black px-2 py-[2px] tracking-tighter font-bold border border-black shadow-[2px_2px_0_0_#000]">{SITE_ID}</span>
            </div>
            
            <h1 className="font-brutal text-[16vw] sm:text-[12vw] md:text-8xl lg:text-[11rem] tracking-tighter leading-[0.85] relative z-10 break-words w-full">
              CANDIDATE<br/>
              <span className="relative inline-block mt-2">
                INDEX
                {/* Neon green strike/underline effect */}
                <div className="absolute bottom-[15%] -left-[10%] w-[120%] h-[6px] bg-[#39ff14] z-[-1] opacity-90" />
              </span>
            </h1>
          </div>

          <div className="mt-12 md:mt-0 font-tech text-right w-full md:max-w-xs flex-shrink-0">
            <div className="border-[3px] border-black p-4 bg-[#e5e5e5] shadow-[6px_6px_0_0_#000]">
              <span className="block font-bold mb-2 border-b-2 border-black pb-2 text-sm tracking-widest flex justify-between items-center">
                AI SYNC AGENT
                <div className={`w-3 h-3 rounded-none ${syncStatus === 'SYNCING...' ? 'bg-[#39ff14] animate-pulse' : 'bg-black'}`}></div>
              </span>
              <div className="text-xs space-y-1 text-left">
                <div className="flex justify-between"><span>STATUS:</span> <span className={syncStatus === "SYNCING..." ? "text-[#1da809] font-bold" : "text-black font-bold"}>{syncStatus}</span></div>
                <div className="flex justify-between"><span>LAST CRAWL:</span> <span>{new Date().toLocaleTimeString()}</span></div>
                <div className="flex justify-between"><span>SOURCE:</span> <span className="font-bold underline">UPSC.GOV.IN</span></div>
                <div className="flex justify-between"><span>SITE ID:</span> <span className="font-bold text-[#39ff14] bg-black px-1">{SITE_ID}</span></div>
              </div>
              <button 
                onClick={triggerSync}
                disabled={syncStatus === "SYNCING..."}
                className="mt-4 w-full bg-black text-[#d1d1d1] hover:bg-[#39ff14] hover:text-black transition-colors py-3 uppercase font-bold disabled:opacity-50 flex items-center justify-center gap-2 border-[2px] border-transparent hover:border-black active:translate-y-[2px]"
              >
                <Cpu size={18} /> INITIALIZE SYNC
              </button>
            </div>
          </div>
        </header>


        {/* MIDDLE SECTION: TERMINAL & CONTROLS */}
        <div className="flex flex-col xl:flex-row gap-8 mb-12 items-start">
          
          {/* TERMINAL / LOGS */}
          <section className="w-full xl:w-[450px] border-[3px] border-black bg-[#111] text-[#e0e0e0] font-tech p-5 h-56 overflow-y-auto scroll-contain shadow-[10px_10px_0_0_#000] flex-shrink-0 relative">
            {/* Terminal decorative header */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#333] border-b border-black"></div>
            
            <div className="text-[#39ff14] mb-4 mt-2 flex items-center justify-between border-b border-[#333] pb-3 font-bold tracking-widest text-sm uppercase">
               <span className="flex items-center gap-2"><Server size={16} /> [SYS.TERMINAL]</span>
               <span className="text-[10px] text-white/50">READ ONLY</span>
            </div>
            <div className="text-xs space-y-1 opacity-90 leading-relaxed font-mono">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`${log.includes('[AI MODULE]') || log.includes('[VALIDATION]') ? 'text-[#39ff14]' : ''}`}>{log}</div>
              ))}
              {syncStatus === "SYNCING..." && <div className="animate-pulse w-2 h-4 bg-[#e0e0e0] mt-1"></div>}
            </div>
          </section>

          {/* CONTROLS */}
          <section className="w-full flex-grow flex flex-col md:flex-row gap-6 justify-between items-end bg-[#d1d1d1]/90 backdrop-blur-md p-6 border-[3px] border-black shadow-[10px_10px_0_0_#000]">
            
            <div className="w-full md:w-auto">
              <div className="font-brutal text-sm mb-3 uppercase tracking-widest border-b-[2px] border-black pb-1 inline-block pr-8">Filter Stage</div>
              <div className="flex gap-3 w-full overflow-x-auto pb-2 md:pb-0">
                 {['ALL', 'PRELIMS', 'MAINS', 'INTERVIEW'].map(stage => (
                   <button
                     key={stage}
                     onClick={() => setFilter(f => ({ ...f, stage }))}
                     className={`font-tech uppercase text-xs sm:text-sm border-[2px] border-black px-5 py-2 whitespace-nowrap transition-colors shadow-[3px_3px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-bold ${
                       filter.stage === stage ? 'bg-black text-[#d1d1d1] shadow-none translate-x-[3px] translate-y-[3px]' : 'bg-[#f0f0f0] hover:bg-white'
                     }`}
                   >
                     {stage}
                   </button>
                 ))}
              </div>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-[400px] flex-shrink-0">
              <div className="font-brutal text-sm mb-3 uppercase tracking-widest border-b-[2px] border-black pb-1 inline-block pr-8">Query Database</div>
              <div className="relative shadow-[4px_4px_0_0_#000]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 text-black" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="SEARCH ID OR NAME..." 
                  value={filter.search}
                  onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
                  className="w-full bg-white border-[3px] border-black pl-12 pr-4 py-3 font-tech text-sm uppercase placeholder-black/30 focus:outline-none focus:bg-[#f8f8f8] transition-colors font-bold"
                />
              </div>
            </form>
          </section>
        </div>

        {/* DATA TABLE */}
        <section className="relative w-full">
          {/* Decorative element for table */}
          <div className="absolute -left-16 top-0 bottom-0 w-12 border-r-[3px] border-black hidden 2xl:flex flex-col items-center py-8 text-xs font-tech gap-12 opacity-40">
            <span className="rotate-90 origin-left whitespace-nowrap font-bold tracking-widest">DATASTREAM ACTV</span>
            <div className="w-[3px] h-full bg-black"></div>
          </div>

          {/* scroll-contain: keeps scroll isolation to this element only — cheaper for high-Hz displays */}
          <div className="overflow-x-auto border-[3px] border-black shadow-[16px_16px_0_0_#000] bg-[#e0e0e0] relative z-20 max-h-[800px] overflow-y-auto scroll-contain">
            <table className="w-full text-left border-collapse min-w-[900px] bg-transparent relative z-10">
              <thead className="sticky top-0 z-30 shadow-md">
                <tr className="border-b-[4px] border-black font-brutal text-2xl bg-black text-[#d1d1d1]">
                  <th className="px-6 py-5 border-r border-[#444] whitespace-nowrap w-[15%]">ID / ROLL</th>
                  <th className="px-6 py-5 border-r border-[#444] w-[25%]">CANDIDATE NAME</th>
                  <th className="px-6 py-5 border-r border-[#444] w-[20%]">DESIGNATION</th>
                  <th className="px-6 py-5 border-r border-[#444] w-[15%] text-center">STAGE</th>
                  <th className="px-6 py-5 border-r border-[#444] w-[15%]">STATUS</th>
                  <th className="px-6 py-5 text-center w-[10%]">RANK</th>
                </tr>
              </thead>
              <tbody className="font-tech text-[14px] md:text-[16px] uppercase font-bold bg-[#e8e8e8]">
                {data.length > 0 ? data.map((row, idx) => (
                  <tr id={`row-${row.id}`} key={row.id} className={`table-row-hover border-b border-black hover:bg-black hover:text-[#d1d1d1] group ${idx % 2 === 0 ? 'bg-black/[0.03]' : 'bg-transparent'} ${highlightedRow === row.id ? 'bg-[#39ff14] text-black' : ''}`}>
                    <td className="px-6 py-4 border-r border-black tracking-wider font-mono">
                      <span className="group-hover:text-[#39ff14] transition-colors">{row.roll_no}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-black">{row.name}</td>
                    <td className="px-6 py-4 border-r border-black opacity-80 tracking-tight">{row.exam}</td>
                    <td className="px-6 py-4 border-r border-black text-center">
                      <span className="bg-white text-black px-2 py-1 border border-black shadow-[2px_2px_0_0_#000] inline-block whitespace-nowrap text-xs tracking-widest group-hover:bg-[#222] group-hover:text-white group-hover:border-white group-hover:shadow-[2px_2px_0_0_#fff]">
                        [{row.stage}]
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-black">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-none bg-[#39ff14] shadow-[0_0_6px_#39ff14] border border-black group-hover:border-none"></div>
                        {row.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-brutal text-xl">
                       {row.rank}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-24 text-center">
                      <div className="font-brutal text-4xl md:text-6xl opacity-20 mb-4">NO MATCHES</div>
                      <div className="font-tech text-sm tracking-widest uppercase opacity-50">Adjust your query parameters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* FOOTER & DISCLOSURES */}
      <footer className="mt-32 border-t-[6px] border-black bg-[#0a0a0a] text-[#a0a0a0] pt-20 pb-12 px-6 md:px-16 lg:px-24 relative z-20 font-tech text-xs md:text-sm shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
         <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16">
            
            <div className="col-span-1 xl:col-span-2">
              <h3 className="font-brutal text-4xl text-white mb-8 uppercase flex items-center gap-4">
                Source & Method <span className="bg-[#39ff14] text-black text-sm px-2 py-1 inline-block shadow-[2px_2px_0_0_#fff]">DOC. REQ</span>
              </h3>
              <p className="mb-6 text-justify leading-relaxed max-w-2xl text-[14px]">
                This database is autonomously populated by an AI scraping agent ({AGENT_VERSION}). 
                The agent periodically scans the official website of the Union Public Service Commission (<a href="https://upsc.gov.in" className="text-[#39ff14] hover:underline font-bold" target="_blank" rel="noreferrer">UPSC.GOV.IN</a>) 
                and other verified government portals to maintain a real-time ledger.
              </p>
              <p className="mb-6 text-justify leading-relaxed max-w-2xl text-[14px]">
                Official result PDFs are ingested, parsed using OCR, and cross-referenced against historical databanks to ensure maximum accuracy.
              </p>
              <div className="flex items-center gap-3 text-white border-2 border-[#333] p-4 inline-flex bg-[#111] hover:border-[#39ff14] transition-colors mt-4">
                <FileText size={20} className="text-[#39ff14]"/>
                <span className="font-bold tracking-widest">100% SOURCED FROM PUBLIC GOV RECORDS</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-brutal text-xl mb-6 uppercase border-b-2 border-[#333] pb-2">Site Info</h4>
              <ul className="space-y-3 opacity-80 text-[13px] tracking-widest">
                <li className="flex items-center gap-2"><span className="text-[#39ff14]">&gt;</span> Site ID: <span className="text-white font-bold">{SITE_ID}</span></li>
                <li className="flex items-center gap-2"><span className="text-[#39ff14]">&gt;</span> React + Vite Engine</li>
                <li className="flex items-center gap-2"><span className="text-[#39ff14]">&gt;</span> AI-Powered PDF Parsing</li>
                <li className="flex items-center gap-2"><span className="text-[#39ff14]">&gt;</span> Cloud Cron Sync</li>
                <li className="flex items-center gap-2"><span className="text-[#39ff14]">&gt;</span> GPU-Composited UI</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-brutal text-xl mb-6 uppercase border-b-2 border-[#333] pb-2">Disclaimer</h4>
              <p className="opacity-70 leading-relaxed text-[13px] text-justify">
                While every effort is made by our AI systems to cross-verify the data, this registry is NOT an official government document. 
                Errors may occur during AI PDF parsing. Candidates must verify their results independently on the official UPSC website. We hold no liability for discrepancies.
              </p>
            </div>
         </div>

         <div className="max-w-[1800px] mx-auto mt-20 pt-8 border-t-2 border-[#222] flex flex-col md:flex-row justify-between items-center gap-6 uppercase font-bold text-[#666] text-xs tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#39ff14]"></div> SYSTEM OPERATIONAL</span>
            <span>DATA REFRESHED: {new Date().toLocaleDateString()} // {new Date().toLocaleTimeString()}</span>
            <span className="text-[#39ff14]/60">{SITE_ID} · AI CONFIDENCE: 99.8%</span>
         </div>
      </footer>
    </div>
  );
}
