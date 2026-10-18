import React from 'react';
import { Sparkles, TrendingUp, DollarSign, Leaf, Award, Compass, Scale, ShieldCheck } from 'lucide-react';
import { MaterialSummary, SpotPrices } from '../types/pcb';

interface MaterialYieldPanelProps {
  materials: MaterialSummary;
  overallGrade: string;
  economics: {
    grossValueINR: number;
    refiningCostINR: number;
    netSalvageINR: number;
    metricTonEquivalentINR: number;
    urbanMiningEfficiencyRatio: number;
  };
  environmental: {
    co2OffsetKg: number;
    rohsComplianceStatus: string;
  };
  spotPrices: SpotPrices;
}

export const MaterialYieldPanel: React.FC<MaterialYieldPanelProps> = ({
  materials,
  overallGrade,
  economics,
  environmental,
  spotPrices,
}) => {
  // Compute individual values in INR
  const goldValue = (materials.goldMg / 1000) * spotPrices.goldPerGram;
  const silverValue = (materials.silverMg / 1000) * spotPrices.silverPerGram;
  const copperValue = (materials.copperGrams / 1000) * spotPrices.copperPerKg;
  const tantalumValue = (materials.tantalumMg / 1000) * spotPrices.tantalumPerGram;
  const palladiumValue = (materials.palladiumMg / 1000) * spotPrices.palladiumPerGram;
  const aluminumValue = (materials.aluminumGrams / 1000) * spotPrices.aluminumPerKg;

  const elements = [
    {
      atomicNum: 79,
      symbol: 'Au',
      name: 'Gold',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
      tagColor: 'text-amber-400',
      mass: materials.goldMg >= 1000 ? `${(materials.goldMg / 1000).toFixed(3)} g` : `${materials.goldMg.toFixed(1)} mg`,
      valueINR: goldValue,
      primaryLocation: 'CPU sockets, PCIe pins, BGA wirebonds',
    },
    {
      atomicNum: 73,
      symbol: 'Ta',
      name: 'Tantalum',
      color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/40 text-cyan-300',
      tagColor: 'text-cyan-400',
      mass: materials.tantalumMg >= 1000 ? `${(materials.tantalumMg / 1000).toFixed(2)} g` : `${materials.tantalumMg.toFixed(1)} mg`,
      valueINR: tantalumValue,
      primaryLocation: 'SMD electrolytic capacitors, VRM stage',
    },
    {
      atomicNum: 46,
      symbol: 'Pd',
      name: 'Palladium',
      color: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/40 text-purple-300',
      tagColor: 'text-purple-400',
      mass: materials.palladiumMg >= 1000 ? `${(materials.palladiumMg / 1000).toFixed(2)} g` : `${materials.palladiumMg.toFixed(1)} mg`,
      valueINR: palladiumValue,
      primaryLocation: 'High-Q MLCC ceramic capacitors',
    },
    {
      atomicNum: 29,
      symbol: 'Cu',
      name: 'Copper',
      color: 'from-orange-500/20 to-amber-600/10 border-orange-500/40 text-orange-300',
      tagColor: 'text-orange-400',
      mass: `${materials.copperGrams.toFixed(1)} g`,
      valueINR: copperValue,
      primaryLocation: 'Internal ground planes, inductor chokes',
    },
    {
      atomicNum: 47,
      symbol: 'Ag',
      name: 'Silver',
      color: 'from-slate-400/20 to-zinc-400/10 border-slate-400/40 text-slate-200',
      tagColor: 'text-slate-300',
      mass: materials.silverMg >= 1000 ? `${(materials.silverMg / 1000).toFixed(2)} g` : `${materials.silverMg.toFixed(1)} mg`,
      valueINR: silverValue,
      primaryLocation: 'Lead-free SAC305 solder joints, switches',
    },
    {
      atomicNum: 13,
      symbol: 'Al',
      name: 'Aluminum',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-300',
      tagColor: 'text-blue-400',
      mass: `${materials.aluminumGrams.toFixed(1)} g`,
      valueINR: aluminumValue,
      primaryLocation: 'Heatsinks, electrolytic capacitor cans',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header and Grade */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Recoverable Material Yield</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              URBAN MINING ASSAY (INR)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Precious and industrial metals quantified via circuit visual geometry & Indian MCX bullion benchmarks
          </p>
        </div>

        {/* Board Grade Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center gap-2 shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase text-slate-400 block leading-none">Scrap Rating</span>
              <span className="text-xs font-bold font-mono text-emerald-400">{overallGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Periodic Table Style Elemental Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {elements.map((el) => (
          <div
            key={el.symbol}
            className={`bg-gradient-to-br ${el.color} border rounded-xl p-3 flex flex-col justify-between backdrop-blur-sm transition-all hover:scale-[1.02] shadow-md`}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">{el.atomicNum}</span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                ₹{el.valueINR >= 1000 ? el.valueINR.toLocaleString(undefined, { maximumFractionDigits: 0 }) : el.valueINR.toFixed(2)}
              </span>
            </div>

            <div className="my-1.5 text-center">
              <div className="font-mono text-2xl font-black text-white tracking-tighter">{el.symbol}</div>
              <div className="text-[11px] font-medium text-slate-200">{el.name}</div>
            </div>

            <div className="border-t border-slate-700/40 pt-1.5 text-center">
              <span className={`font-mono text-xs font-extrabold ${el.tagColor}`}>{el.mass}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Urban Mining Super-Comparison Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/50 border border-emerald-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Urban Mining Efficiency Multiplier
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                {economics.urbanMiningEfficiencyRatio}x Richer
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              1 Metric Ton of this scrap yields ~<strong className="text-emerald-400">₹{economics.metricTonEquivalentINR.toLocaleString()}</strong> in precious metals.
              Natural raw gold mine ore typically yields only ~4–5g of Au per ton, whereas this PCB delivers over{' '}
              <strong className="text-amber-400">
                {((materials.goldMg / 850) * 1000).toFixed(0)}g Au per ton
              </strong>!
            </p>
          </div>
        </div>

        {/* Environmental Offset */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl shrink-0">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Carbon Offset</span>
            <span className="text-xs font-bold text-white">-{environmental.co2OffsetKg} kg CO₂e</span>
          </div>
        </div>
      </div>
    </div>
  );
};
