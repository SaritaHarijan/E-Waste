import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, FileText, QrCode } from 'lucide-react';
import { AnalysisResult, SpotPrices } from '../types/pcb';

interface DossierExportModalProps {
  result: AnalysisResult;
  spotPrices: SpotPrices;
  onClose: () => void;
}

export const DossierExportModal: React.FC<DossierExportModalProps> = ({
  result,
  spotPrices,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `E-Waste-Assay-${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    const md = `# E-WASTE DISMANTLING & MATERIAL RECOVERY MANIFEST
Document ID: ${result.id}
Date: ${new Date(result.timestamp).toUTCString()}
Board Classification: ${result.boardName} (${result.boardType})
Scrap Grade: ${result.overallGrade}
Estimated Board Weight: ${result.estimatedBoardWeightGrams} g

## 1. EXECUTIVE RECOVERY SUMMARY
${result.aiSummary}

## 2. RECOVERABLE ELEMENTAL METALS ASSAY (INR)
- Gold (Au): ${result.materials.goldMg} mg (~₹${((result.materials.goldMg / 1000) * spotPrices.goldPerGram).toFixed(2)})
- Silver (Ag): ${result.materials.silverMg} mg (~₹${((result.materials.silverMg / 1000) * spotPrices.silverPerGram).toFixed(2)})
- Copper (Cu): ${result.materials.copperGrams} g (~₹${((result.materials.copperGrams / 1000) * spotPrices.copperPerKg).toFixed(2)})
- Tantalum (Ta): ${result.materials.tantalumMg} mg (~₹${((result.materials.tantalumMg / 1000) * spotPrices.tantalumPerGram).toFixed(2)})
- Palladium (Pd): ${result.materials.palladiumMg} mg (~₹${((result.materials.palladiumMg / 1000) * spotPrices.palladiumPerGram).toFixed(2)})
- Aluminum (Al): ${result.materials.aluminumGrams} g (~₹${((result.materials.aluminumGrams / 1000) * spotPrices.aluminumPerKg).toFixed(2)})

Total Gross Scrap Value: ₹${result.economics.grossValueINR.toFixed(2)}
Net Salvage Value: ₹${result.economics.netSalvageINR.toFixed(2)}
Second-Hand Resale Value: ₹${result.economics.secondHandMarketValueTotalINR.toFixed(2)}
Urban Mining Efficiency Multiplier: ${result.economics.urbanMiningEfficiencyRatio}x Natural Gold Ore Concentration
Carbon Avoidance: ${result.environmental.co2OffsetKg} kg CO2e

## 3. ROHS & WEEE HAZARDOUS ASSESSMENT
- Compliance: ${result.environmental.rohsComplianceStatus}
- WEEE Category: ${result.environmental.weeeCategory}
- Lead Risk Level: ${result.materials.leadRiskScore}
- Regulated Substances:
${result.materials.hazardousSubstances.map((s) => `  * ${s}`).join('\n')}

## 4. REQUIRED DISMANTLING PPE
${result.environmental.ppeRequired.map((p) => `- [ ] ${p}`).join('\n')}

## 5. SEQUENTIAL DISMANTLING PROTOCOL
${result.dismantleSteps
  .map(
    (step) =>
      `### Step ${step.stepNumber}: ${step.title} [Danger: ${step.dangerLevel}]
Tooling: ${step.toolNeeded}
Instructions: ${step.instruction}`
  )
  .join('\n\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `E-Waste-Manifest-${result.id}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Certified E-Waste Recycling Manifest</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Manifest</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Manifest Document Body */}
        <div className="p-8 space-y-6 text-slate-100 bg-slate-900 print:bg-white print:text-black">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black font-mono text-xl text-emerald-400 print:text-black tracking-tight">
                  E-CYCLE METALLURGICAL INTELLIGENCE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 print:border print:border-black print:text-black uppercase">
                  WEEE CERTIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Official Bill of Materials & Hazardous Substance Recovery Manifest
              </p>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="font-bold text-white print:text-black">MANIFEST #{result.id}</div>
              <div className="text-slate-400 print:text-gray-600 text-[10px]">
                {new Date(result.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Unit Identification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 print:bg-gray-100 p-2.5 rounded-lg border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 text-[10px] block">BOARD NAME</span>
              <strong className="text-slate-200 print:text-black truncate block">{result.boardName}</strong>
            </div>
            <div className="bg-slate-950 print:bg-gray-100 p-2.5 rounded-lg border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 text-[10px] block">EST. WEIGHT</span>
              <strong className="text-slate-200 print:text-black">{result.estimatedBoardWeightGrams} g</strong>
            </div>
            <div className="bg-slate-950 print:bg-gray-100 p-2.5 rounded-lg border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 text-[10px] block">SCRAP GRADE</span>
              <strong className="text-emerald-400 print:text-black">{result.overallGrade}</strong>
            </div>
            <div className="bg-slate-950 print:bg-gray-100 p-2.5 rounded-lg border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 text-[10px] block">NET SCRAP VALUE</span>
              <strong className="text-amber-400 print:text-black">₹{result.economics.netSalvageINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>

          {/* Recoverable Elemental Assay Table */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black mb-2">
              1. Elemental Recovery Assay (Indian Spot Rates)
            </h4>
            <div className="border border-slate-800 print:border-gray-400 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 print:bg-gray-200 border-b border-slate-800 print:border-gray-400 text-slate-400 print:text-gray-700 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Element</th>
                    <th className="py-2 px-3">Recoverable Weight</th>
                    <th className="py-2 px-3 text-right">MCX Spot Rate</th>
                    <th className="py-2 px-3 text-right">Scrap Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-400 print:text-black">Gold (Au 24K)</td>
                    <td className="py-2 px-3">{result.materials.goldMg} mg</td>
                    <td className="py-2 px-3 text-right">₹{spotPrices.goldPerGram.toLocaleString()}/g</td>
                    <td className="py-2 px-3 text-right font-bold">
                      ₹{((result.materials.goldMg / 1000) * spotPrices.goldPerGram).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-cyan-400 print:text-black">Tantalum (Ta)</td>
                    <td className="py-2 px-3">{result.materials.tantalumMg} mg</td>
                    <td className="py-2 px-3 text-right">₹{spotPrices.tantalumPerGram.toFixed(2)}/g</td>
                    <td className="py-2 px-3 text-right font-bold">
                      ₹{((result.materials.tantalumMg / 1000) * spotPrices.tantalumPerGram).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-purple-400 print:text-black">Palladium (Pd)</td>
                    <td className="py-2 px-3">{result.materials.palladiumMg} mg</td>
                    <td className="py-2 px-3 text-right">₹{spotPrices.palladiumPerGram.toLocaleString()}/g</td>
                    <td className="py-2 px-3 text-right font-bold">
                      ₹{((result.materials.palladiumMg / 1000) * spotPrices.palladiumPerGram).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-orange-400 print:text-black">Copper (Cu)</td>
                    <td className="py-2 px-3">{result.materials.copperGrams.toFixed(1)} g</td>
                    <td className="py-2 px-3 text-right">₹{spotPrices.copperPerKg.toLocaleString()}/kg</td>
                    <td className="py-2 px-3 text-right font-bold">
                      ₹{((result.materials.copperGrams / 1000) * spotPrices.copperPerKg).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-300 print:text-black">Silver (Ag)</td>
                    <td className="py-2 px-3">{result.materials.silverMg} mg</td>
                    <td className="py-2 px-3 text-right">₹{spotPrices.silverPerGram.toFixed(2)}/g</td>
                    <td className="py-2 px-3 text-right font-bold">
                      ₹{((result.materials.silverMg / 1000) * spotPrices.silverPerGram).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hazardous Waste Declarations */}
          <div className="space-y-2 text-xs">
            <h4 className="font-mono font-bold uppercase tracking-wider text-slate-300 print:text-black">
              2. RoHS / Hazardous Material Protocol
            </h4>
            <div className="bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-300 p-3 rounded-lg space-y-1.5">
              <div className="flex justify-between font-mono">
                <span>Compliance Rating: <strong>{result.environmental.rohsComplianceStatus}</strong></span>
                <span>Lead Content: <strong>{result.materials.leadRiskScore}</strong></span>
              </div>
              <div className="text-slate-400 print:text-gray-600 text-[11px]">
                {result.materials.hazardousSubstances.join('; ')}
              </div>
            </div>
          </div>

          {/* Signatures & Chain of Custody */}
          <div className="border-t-2 border-slate-700 print:border-black pt-4 grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <div className="text-[10px] uppercase text-slate-400 print:text-gray-600 mb-6">
                DISMANTLING TECHNICIAN SIGN-OFF
              </div>
              <div className="border-b border-slate-600 print:border-black w-3/4"></div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 mt-1 block">Date / Tech ID</span>
            </div>

            <div>
              <div className="text-[10px] uppercase text-slate-400 print:text-gray-600 mb-6">
                CERTIFIED WEEE FACILITY AUDITOR
              </div>
              <div className="border-b border-slate-600 print:border-black w-3/4"></div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 mt-1 block">Seal / Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
