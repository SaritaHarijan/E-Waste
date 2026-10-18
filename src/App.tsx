import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InspectionCanvas } from './components/InspectionCanvas';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { ComponentInventoryTable } from './components/ComponentInventoryTable';
import { MaterialYieldPanel } from './components/MaterialYieldPanel';
import { EconomicSimulator } from './components/EconomicSimulator';
import { HazardousSafetyPanel } from './components/HazardousSafetyPanel';
import { DossierExportModal } from './components/DossierExportModal';
import { UploadModal } from './components/UploadModal';
import { WebcamCaptureModal } from './components/WebcamCaptureModal';
import { AnalysisResult, DetectedComponent, SpotPrices } from './types/pcb';
import { SAMPLE_BOARDS, DEFAULT_SPOT_PRICES } from './data/sampleBoards';
import { ShieldAlert, DollarSign, Sparkles, Cpu, Layers, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function App() {
  const [currentBoard, setCurrentBoard] = useState<AnalysisResult>(SAMPLE_BOARDS[0]);
  const [selectedComponent, setSelectedComponent] = useState<DetectedComponent | null>(null);
  const [spotPrices, setSpotPrices] = useState<SpotPrices>(DEFAULT_SPOT_PRICES);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'materials' | 'economics' | 'safety'>('inventory');

  // Fetch spot prices on mount
  useEffect(() => {
    fetch('/api/spot-prices')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.goldPerGram) {
          setSpotPrices(data);
        }
      })
      .catch((err) => {
        console.warn('Using default spot prices:', err);
      });
  }, []);

  // API Call to analyze uploaded or camera PCB
  const handleAnalyzePcb = async (base64Image: string, hint: string = '') => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-pcb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          boardHint: hint,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const analyzedResult: AnalysisResult = await res.json();
      setCurrentBoard(analyzedResult);
      setSelectedComponent(null);
    } catch (err: any) {
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Application Header */}
      <Header
        currentBoard={currentBoard}
        onSelectBoard={(board) => {
          setCurrentBoard(board);
          setSelectedComponent(null);
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenWebcam={() => setIsWebcamOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        spotPrices={spotPrices}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Project Statement & Metric Highlight Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  PS 2 | AI/ML Deliverable
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">• Automated E-Waste Diagnostics</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Vision-Based Circuit Component Classifier & Material Analyzer
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Automated bounding-box detection over dismantled electronic boards. Inventories reusable ICs, microcontrollers, and connectors with second-hand market values, while auditing hazardous substances (RoHS/WEEE) and precious metal recovery yields.
              </p>
            </div>

            {/* Quick Summary Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono text-xs">
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Components</span>
                <span className="text-sm font-bold text-emerald-400">{currentBoard.components.length} Detected</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Second-Hand Value</span>
                <span className="text-sm font-bold text-amber-400">
                  ₹{currentBoard.economics.secondHandMarketValueTotalINR ? currentBoard.economics.secondHandMarketValueTotalINR.toLocaleString() : currentBoard.economics.grossValueINR.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Hazardous Ratio</span>
                <span
                  className={`text-sm font-bold ${
                    currentBoard.materials.hazardousMaterialPercentage > 10
                      ? 'text-red-400'
                      : currentBoard.materials.hazardousMaterialPercentage > 3
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {currentBoard.materials.hazardousMaterialPercentage.toFixed(1)}% Mass
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Urban Mining</span>
                <span className="text-sm font-bold text-cyan-400">
                  {currentBoard.economics.urbanMiningEfficiencyRatio}x Ore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Visual Inspection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left / Center 2 Columns: Inspection Canvas */}
          <div className="lg:col-span-2">
            <InspectionCanvas
              imageUrl={currentBoard.imageUrl}
              components={currentBoard.components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              boardName={currentBoard.boardName}
            />
          </div>

          {/* Right 1 Column: Telemetry & Live Selected Card */}
          <div className="space-y-4">
            {selectedComponent ? (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Inspecting Component
                    </span>
                    <h3 className="font-bold text-white text-sm tracking-tight">{selectedComponent.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComponent(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Deselect
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">PACKAGE</span>
                      <span className="font-bold text-slate-200 truncate block">{selectedComponent.package}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">SECOND-HAND VALUE</span>
                      <span className="font-bold text-amber-400">₹{selectedComponent.estimatedValueINR.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    {selectedComponent.description}
                  </p>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Material Content:
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {selectedComponent.estimatedMaterials.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800/80"
                        >
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                            {m.metal} ({m.symbol})
                          </span>
                          <span className="font-bold text-white">
                            {m.estimatedWeightMg >= 1000
                              ? `${(m.estimatedWeightMg / 1000).toFixed(2)} g`
                              : `${m.estimatedWeightMg.toFixed(1)} mg`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block">Salvage Disposition:</span>
                    <span className="font-semibold text-emerald-300 block">{selectedComponent.salvageAction}</span>
                    <span className="text-[10px] text-slate-400 block">{selectedComponent.temperatureGuide}</span>
                  </div>

                  {selectedComponent.hazardousNotes && (
                    <div className="bg-red-950/40 border border-red-500/40 p-2.5 rounded-lg text-red-200 text-[11px]">
                      <strong>RoHS Notice:</strong> {selectedComponent.hazardousNotes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm">Board Telemetry Overview</h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    {currentBoard.overallGrade.split(' ')[0]}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Board Classification:</span>
                    <span className="font-semibold text-slate-200 text-right truncate max-w-[170px]">
                      {currentBoard.boardType}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Estimated Weight:</span>
                    <span className="font-semibold text-slate-200">{currentBoard.estimatedBoardWeightGrams} grams</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Gold (Au):</span>
                    <span className="font-bold text-amber-400">{currentBoard.materials.goldMg} mg</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Copper (Cu):</span>
                    <span className="font-bold text-orange-400">{currentBoard.materials.copperGrams.toFixed(1)} g</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Tantalum (Ta):</span>
                    <span className="font-bold text-cyan-400">{currentBoard.materials.tantalumMg} mg</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Palladium (Pd):</span>
                    <span className="font-bold text-purple-400">{currentBoard.materials.palladiumMg} mg</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Net Salvage / Unit:</span>
                    <span className="font-bold text-emerald-400">₹{currentBoard.economics.netSalvageINR.toLocaleString()}</span>
                  </div>
                </div>

                {/* AI Executive Commentary */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[10px] uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Recycling Assessment</span>
                  </div>
                  <p>{currentBoard.aiSummary}</p>
                </div>
              </div>
            )}

            {/* Quick 10-Board Selector List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                Organizers' 10 Test Boards Suite
              </span>
              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                {SAMPLE_BOARDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setCurrentBoard(b);
                      setSelectedComponent(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center justify-between ${
                      currentBoard.id === b.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">{b.boardName}</span>
                    <ChevronRight className="w-3 h-3 shrink-0 ml-1 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Detailed Analytical Views */}
        <div className="flex border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>1. Component Inventory & Valuation</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Recoverable Precious Metals</span>
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'economics'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Batch Refinery Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'safety'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>4. Hazardous % & Safety Protocol</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'inventory' && (
          <ComponentInventoryTable
            components={currentBoard.components}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            hazardousPercentage={currentBoard.materials.hazardousMaterialPercentage}
            secondHandTotalINR={
              currentBoard.economics.secondHandMarketValueTotalINR ||
              currentBoard.economics.grossValueINR
            }
          />
        )}

        {activeTab === 'materials' && (
          <MaterialYieldPanel
            materials={currentBoard.materials}
            overallGrade={currentBoard.overallGrade}
            economics={currentBoard.economics}
            environmental={currentBoard.environmental}
            spotPrices={spotPrices}
          />
        )}

        {activeTab === 'economics' && (
          <EconomicSimulator
            boardWeightGrams={currentBoard.estimatedBoardWeightGrams}
            materials={currentBoard.materials}
            spotPrices={spotPrices}
            unitGrossINR={currentBoard.economics.grossValueINR}
            unitRefiningINR={currentBoard.economics.refiningCostINR}
          />
        )}

        {activeTab === 'safety' && (
          <HazardousSafetyPanel
            materials={currentBoard.materials}
            environmental={currentBoard.environmental}
            dismantleSteps={currentBoard.dismantleSteps}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        E-Cycle Lens • Intelligent E-Waste Circuit Component Classifier & Material Analyzer (PS 2) • WEEE & RoHS
        Compliant
      </footer>

      {/* Modals */}
      <ComponentDetailModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyze={handleAnalyzePcb}
        isAnalyzing={isAnalyzing}
      />

      <WebcamCaptureModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleAnalyzePcb}
        isAnalyzing={isAnalyzing}
      />

      {isExportOpen && (
        <DossierExportModal
          result={currentBoard}
          spotPrices={spotPrices}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
