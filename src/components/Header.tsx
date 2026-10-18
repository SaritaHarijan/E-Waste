import React from 'react';
import { Cpu, Camera, Upload, RefreshCw, FileText, Sparkles, Layers, ShieldAlert, DollarSign } from 'lucide-react';
import { AnalysisResult, SpotPrices } from '../types/pcb';
import { SAMPLE_BOARDS } from '../data/sampleBoards';

interface HeaderProps {
  currentBoard: AnalysisResult;
  onSelectBoard: (board: AnalysisResult) => void;
  onOpenUpload: () => void;
  onOpenWebcam: () => void;
  onOpenExport: () => void;
  spotPrices: SpotPrices;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentBoard,
  onSelectBoard,
  onOpenUpload,
  onOpenWebcam,
  onOpenExport,
  spotPrices,
  isAnalyzing,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Live Market Scrap Benchmark Ticker */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-emerald-400 font-semibold tracking-wide uppercase">MCX & IBJA Indian Spot Ticker</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
        </div>

        <div className="flex items-center gap-5 shrink-0 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Au (Gold 24K):</span>
            <span className="text-slate-200">₹{spotPrices.goldPerGram.toLocaleString()}/g</span>
            <span className="text-emerald-400 text-[10px]">+0.5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-bold">Ag (Silver):</span>
            <span className="text-slate-200">₹{spotPrices.silverPerGram.toFixed(2)}/g</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400 font-bold">Cu (Copper):</span>
            <span className="text-slate-200">₹{spotPrices.copperPerKg.toLocaleString()}/kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold">Ta (Tantalum):</span>
            <span className="text-slate-200">₹{spotPrices.tantalumPerGram.toFixed(2)}/g</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-purple-400 font-bold">Pd (Palladium):</span>
            <span className="text-slate-200">₹{spotPrices.palladiumPerGram.toLocaleString()}/g</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 shrink-0 hidden md:flex items-center gap-1 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>INR (₹) Indian Market Calibrated</span>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Cpu className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">E-Cycle Lens</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                AI Vision v3.8
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent E-Waste Circuit Component Classifier & Material Yield Analyzer
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2 order-3 lg:order-2 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Inspect Board:</span>
          </div>
          <select
            value={currentBoard.id}
            onChange={(e) => {
              const selected = SAMPLE_BOARDS.find((b) => b.id === e.target.value);
              if (selected) onSelectBoard(selected);
            }}
            disabled={isAnalyzing}
            className="bg-slate-900 border border-slate-700 hover:border-emerald-500/60 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer w-full sm:w-auto font-medium"
          >
            {SAMPLE_BOARDS.map((board) => (
              <option key={board.id} value={board.id}>
                {board.boardName}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 order-2 lg:order-3">
          <button
            onClick={onOpenWebcam}
            disabled={isAnalyzing}
            title="Scan physical PCB using device camera"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Webcam Scan</span>
          </button>

          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            title="Upload custom circuit board photo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Upload PCB'}</span>
          </button>

          <button
            onClick={onOpenExport}
            title="Generate printable certified WEEE dismantling manifest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export Manifest</span>
          </button>
        </div>
      </div>
    </header>
  );
};
