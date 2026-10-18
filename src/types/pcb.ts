export type ComponentCategory = 
  | 'precious_metal' 
  | 'hazardous' 
  | 'reusable_ic' 
  | 'passive_bulk' 
  | 'connector';

export interface MaterialFraction {
  metal: string;
  symbol: string;
  color: string;
  estimatedWeightMg: number; // in milligrams
  recoveryGrade: 'Ultra-High' | 'High' | 'Medium' | 'Trace';
}

export interface DetectedComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  // Normalized bounding box: [ymin, xmin, ymax, xmax] in percentages (0-100)
  box: [number, number, number, number];
  package: string; // e.g. "BGA-1151", "SOIC-8", "0805 SMD", "TO-220", "Gold Finger Array"
  confidence: number; // 0 to 1
  description: string;
  estimatedMaterials: MaterialFraction[];
  hazardousNotes: string | null;
  salvageAction: 'Desolder & Test for Resale' | 'Chemical Precious Metal Leaching' | 'Bulk Granulation' | 'Hazardous Hazardous Treatment' | 'Mechanical Disassembly';
  temperatureGuide: string;
  estimatedValueINR: number; // In Indian Rupees (₹)
}

export interface MaterialSummary {
  goldMg: number;       // Au (mg)
  silverMg: number;     // Ag (mg)
  copperGrams: number;  // Cu (g)
  tantalumMg: number;   // Ta (mg)
  palladiumMg: number;  // Pd (mg)
  aluminumGrams: number;// Al (g)
  tinGrams: number;     // Sn (g)
  leadRiskScore: 'RoHS Compliant (Lead-Free)' | 'Low Trace' | 'Moderate' | 'High (Leaded Sn-Pb 60/40 Solder)';
  hazardousSubstances: string[];
  hazardousMaterialPercentage: number; // Exact metric from problem statement (e.g. 8.4%)
  hazardousWeightGrams: number;
  reusableComponentsCount: number;
}

export interface DismantleStep {
  stepNumber: number;
  title: string;
  instruction: string;
  toolNeeded: string;
  dangerLevel: 'Low' | 'Medium' | 'High';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  boardName: string;
  boardType: string;
  overallGrade: 'Grade A (High Au/Pd Yield)' | 'Grade B (Medium Yield)' | 'Grade C (Base Metal / Bulk)';
  estimatedBoardWeightGrams: number;
  components: DetectedComponent[];
  materials: MaterialSummary;
  economics: {
    grossValueINR: number;
    refiningCostINR: number;
    netSalvageINR: number;
    secondHandMarketValueTotalINR: number; // Total second-hand resale value in ₹
    metricTonEquivalentINR: number;
    urbanMiningEfficiencyRatio: number; // e.g. 45x richer than natural gold ore
  };
  environmental: {
    co2OffsetKg: number;
    rohsComplianceStatus: 'Compliant' | 'Non-Compliant (Hazardous)' | 'Warning';
    weeeCategory: string;
    ppeRequired: string[];
    hazardousContentPercent: number; // Explicit percentage
  };
  dismantleSteps: DismantleStep[];
  aiSummary: string;
}

export interface SpotPrices {
  currency: string;
  currencySymbol: string;
  goldPerGram: number;     // INR ₹ per gram
  silverPerGram: number;   // INR ₹ per gram
  copperPerKg: number;     // INR ₹ per kg
  tantalumPerGram: number; // INR ₹ per gram
  palladiumPerGram: number;// INR ₹ per gram
  aluminumPerKg: number;   // INR ₹ per kg
  tinPerKg: number;        // INR ₹ per kg
  lastUpdated: string;
}
