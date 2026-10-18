import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Wrench, HardHat, CheckCircle2, Flame, Eye, Wind } from 'lucide-react';
import { DismantleStep, MaterialSummary } from '../types/pcb';

interface HazardousSafetyPanelProps {
  materials: MaterialSummary;
  environmental: {
    co2OffsetKg: number;
    rohsComplianceStatus: string;
    weeeCategory: string;
    ppeRequired: string[];
  };
  dismantleSteps: DismantleStep[];
}

export const HazardousSafetyPanel: React.FC<HazardousSafetyPanelProps> = ({
  materials,
  environmental,
  dismantleSteps,
}) => {
  const getDangerBadge = (danger: 'Low' | 'Medium' | 'High') => {
    switch (danger) {
      case 'High':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'Low':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Hazardous Substances & Dismantling Protocol</h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                environmental.rohsComplianceStatus === 'Compliant'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-red-500/15 text-red-300 border-red-500/30'
              }`}
            >
              RoHS: {environmental.rohsComplianceStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            WEEE Directive (2012/19/EU) compliant safe extraction sequences & chemical toxicology audit
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">WEEE Classification</span>
          <span className="text-xs font-mono font-bold text-slate-200">{environmental.weeeCategory}</span>
        </div>
      </div>

      {/* Hazardous Substances & Lead Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Substances list */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Detected Regulated Substances
            </span>
            <span className="text-[11px] font-mono text-red-400 font-semibold">
              Lead Risk: {materials.leadRiskScore}
            </span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-300">
            {materials.hazardousSubstances.map((sub, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required PPE Gear */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <HardHat className="w-4 h-4 text-cyan-400" />
            Mandatory Personal Protective Equipment (PPE)
          </span>

          <div className="space-y-1.5 text-xs">
            {environmental.ppeRequired.map((ppe, idx) => (
              <div key={idx} className="flex items-center gap-2.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{ppe}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Dismantling Sequence */}
      <div>
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-emerald-400" />
          <span>Recommended Circular Economy Disassembly Workflow</span>
        </h4>

        <div className="space-y-2.5">
          {dismantleSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 shrink-0">
                  {step.stepNumber}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white mb-0.5">{step.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.instruction}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                <div className="text-right hidden md:block">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Tooling</span>
                  <span className="text-xs font-mono text-slate-300">{step.toolNeeded}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getDangerBadge(step.dangerLevel)}`}>
                  {step.dangerLevel} Hazard
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
