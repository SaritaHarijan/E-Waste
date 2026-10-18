import React from 'react';
import { X, Flame, ShieldAlert, DollarSign, Wrench, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import { DetectedComponent } from '../types/pcb';

interface ComponentDetailModalProps {
  component: DetectedComponent | null;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({ component, onClose }) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Component Diagnostic Dossier
              </span>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                {component.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Key Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">PACKAGE</span>
              <span className="font-mono font-bold text-slate-200 truncate block">{component.package}</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">SALVAGE VALUE</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                ₹{component.estimatedValueINR.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">CONFIDENCE</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round(component.confidence * 100)}%
              </span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">RECOVERY CATEGORY</span>
              <span className="font-mono font-bold text-cyan-300 truncate block capitalize">
                {component.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed text-xs">
            {component.description}
          </div>

          {/* Elemental Metallurgy Breakdown */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recoverable Elemental Material Content</span>
            </h4>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[11px] font-mono text-slate-400 bg-slate-900/60">
                    <th className="py-2 px-3">Element</th>
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3 text-right">Est. Mass</th>
                    <th className="py-2 px-3 text-right">Yield Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {component.estimatedMaterials.map((mat, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 flex items-center gap-2 text-slate-200">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: mat.color }}
                        ></span>
                        <span className="font-medium">{mat.metal}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{mat.symbol}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                        {mat.estimatedWeightMg >= 1000
                          ? `${(mat.estimatedWeightMg / 1000).toFixed(2)} g`
                          : `${mat.estimatedWeightMg.toFixed(1)} mg`}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mat.recoveryGrade === 'Ultra-High'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : mat.recoveryGrade === 'High'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {mat.recoveryGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desoldering & Salvage Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Desoldering heat guide */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-orange-400 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Thermal Harvesting Profile</span>
              </span>
              <p className="text-xs text-slate-300">{component.temperatureGuide}</p>
            </div>

            {/* Action pathway */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recommended Disposition</span>
              </span>
              <p className="text-xs font-medium text-emerald-300">{component.salvageAction}</p>
            </div>
          </div>

          {/* Hazardous Alert if present */}
          {component.hazardousNotes && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-red-300 mb-0.5">RoHS / WEEE Safety Notice</h5>
                <p className="text-xs text-red-200/90 leading-relaxed">{component.hazardousNotes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
