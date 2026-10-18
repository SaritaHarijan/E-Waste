import React, { useState } from 'react';
import { Calculator, DollarSign, Scale, ArrowUpRight, Percent, Layers, ShieldCheck, Factory } from 'lucide-react';
import { MaterialSummary, SpotPrices } from '../types/pcb';

interface EconomicSimulatorProps {
  boardWeightGrams: number;
  materials: MaterialSummary;
  spotPrices: SpotPrices;
  unitGrossINR: number;
  unitRefiningINR: number;
}

export const EconomicSimulator: React.FC<EconomicSimulatorProps> = ({
  boardWeightGrams,
  materials,
  spotPrices,
  unitGrossINR,
  unitRefiningINR,
}) => {
  // Batch quantity in number of boards
  const [boardCount, setBoardCount] = useState<number>(50);

  // Total weight in kilograms
  const totalWeightKg = (boardCount * boardWeightGrams) / 1000;

  // Metal totals
  const totalGoldGrams = (materials.goldMg * boardCount) / 1000;
  const totalGoldTroyOz = totalGoldGrams / 31.1035;
  const totalCopperKg = (materials.copperGrams * boardCount) / 1000;
  const totalTantalumGrams = (materials.tantalumMg * boardCount) / 1000;
  const totalPalladiumGrams = (materials.palladiumMg * boardCount) / 1000;

  // Financials with economy-of-scale refining discount (in INR ₹)
  const scaleDiscountFactor = boardCount > 500 ? 0.75 : boardCount > 100 ? 0.85 : 1.0;
  const totalGrossINR = boardCount * unitGrossINR;
  const totalRefiningINR = boardCount * unitRefiningINR * scaleDiscountFactor;
  const totalNetINR = totalGrossINR - totalRefiningINR;
  const marginPercent = totalGrossINR > 0 ? (totalNetINR / totalGrossINR) * 100 : 0;

  const setPresetWeight = (targetKg: number) => {
    const calculatedCount = Math.max(1, Math.round((targetKg * 1000) / boardWeightGrams));
    setBoardCount(calculatedCount);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">E-Waste Batch Economics & Scaling Simulator</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              REFINERY MODEL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate commercial urban mining yields, hydrometallurgical refining overhead, and net operating margins
          </p>
        </div>

        {/* Quick Batch Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setBoardCount(1)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              boardCount === 1 ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1 Unit
          </button>
          <button
            onClick={() => setBoardCount(50)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              boardCount === 50 ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            50 Units
          </button>
          <button
            onClick={() => setPresetWeight(100)}
            className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            100 kg
          </button>
          <button
            onClick={() => setPresetWeight(1000)}
            className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            1 Ton (1,000kg)
          </button>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <Factory className="w-4 h-4 text-emerald-400" />
            Batch Size: <strong className="text-white text-sm">{boardCount.toLocaleString()} units</strong>
          </span>
          <span className="text-slate-400">
            Total Mass: <strong className="text-emerald-400 text-sm">{totalWeightKg.toFixed(1)} kg</strong>
            {totalWeightKg >= 1000 && ` (${(totalWeightKg / 1000).toFixed(2)} Metric Tons)`}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="2000"
          value={boardCount}
          onChange={(e) => setBoardCount(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>1 unit</span>
          <span>500 units</span>
          <span>1,000 units</span>
          <span>2,000 units</span>
        </div>
      </div>

      {/* Key Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Gross Revenue */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Gross Metal Scrap Value</span>
            <span className="text-emerald-400 font-bold font-mono">INR (₹)</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-white">
            ₹{totalGrossINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block">At current MCX/IBJA spot market pricing</span>
        </div>

        {/* Refining & Labor Costs */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Estimated Processing / Leaching</span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">
              {boardCount > 100 ? '-15% scale fee' : 'Base toll'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-red-400">
            -₹{totalRefiningINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 block">Hydrometallurgical reagent & labor costs</span>
        </div>

        {/* Net Salvage Profit */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-500/40 p-4 rounded-xl space-y-1 shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
            <span>Net Operating Margin</span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <Percent className="w-3.5 h-3.5" />
              {marginPercent.toFixed(1)}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
            ₹{totalNetINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-300/80 block">Net recoverable cash profit</span>
        </div>
      </div>

      {/* Physical Element Yield Ledger for this batch */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Cumulative Precious & Non-Ferrous Mass Recovered in this Batch
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-amber-400 text-[10px] block font-bold">Au (Pure Gold)</span>
            <span className="text-sm font-bold text-white block mt-0.5">{totalGoldGrams.toFixed(2)} g</span>
            <span className="text-[10px] text-slate-400">({totalGoldTroyOz.toFixed(3)} ozt)</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-orange-400 text-[10px] block font-bold">Cu (Bulk Copper)</span>
            <span className="text-sm font-bold text-white block mt-0.5">{totalCopperKg.toFixed(2)} kg</span>
            <span className="text-[10px] text-slate-400">Grade 1 Scrap</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 text-[10px] block font-bold">Ta (Tantalum Powder)</span>
            <span className="text-sm font-bold text-white block mt-0.5">{totalTantalumGrams.toFixed(2)} g</span>
            <span className="text-[10px] text-slate-400">Capacitor Grade</span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-purple-400 text-[10px] block font-bold">Pd (Palladium)</span>
            <span className="text-sm font-bold text-white block mt-0.5">{totalPalladiumGrams.toFixed(2)} g</span>
            <span className="text-[10px] text-slate-400">MLCC Electrode</span>
          </div>
        </div>
      </div>
    </div>
  );
};
