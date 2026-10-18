import { AnalysisResult } from '../types/pcb';

// Helper to generate visually authentic SVG PCB graphics for 10 diverse test boards
function createBoardSvg(type: string, title: string, subtitle: string, accentColor: string): string {
  const isDark = type.includes('phone') || type.includes('gpu') || type.includes('nvme');
  const baseFill = isDark ? '#111827' : type.includes('power') ? '#14532d' : type.includes('vintage') ? '#854d0e' : '#064e3b';
  const gridStroke = isDark ? '#1f2937' : '#047857';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
    <defs>
      <pattern id="pcbGrid_${type}" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 25 0 L 0 0 0 25" fill="none" stroke="${gridStroke}" stroke-width="0.75" stroke-opacity="0.4"/>
        <circle cx="12.5" cy="12.5" r="1.2" fill="${accentColor}" fill-opacity="0.3"/>
      </pattern>
      <linearGradient id="goldGrad_${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="icGrad_${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#262626"/>
        <stop offset="100%" stop-color="#09090b"/>
      </linearGradient>
    </defs>

    <!-- Substrate -->
    <rect width="1000" height="650" rx="16" fill="${baseFill}"/>
    <rect width="1000" height="650" rx="16" fill="url(#pcbGrid_${type})"/>
    <rect x="14" y="14" width="972" height="622" rx="12" fill="none" stroke="${accentColor}" stroke-width="2" stroke-opacity="0.6" stroke-dasharray="8 4"/>

    <!-- Mounting Holes -->
    <circle cx="45" cy="45" r="16" fill="#030712" stroke="#d1d5db" stroke-width="4"/>
    <circle cx="955" cy="45" r="16" fill="#030712" stroke="#d1d5db" stroke-width="4"/>
    <circle cx="45" cy="605" r="16" fill="#030712" stroke="#d1d5db" stroke-width="4"/>
    <circle cx="955" cy="605" r="16" fill="#030712" stroke="#d1d5db" stroke-width="4"/>

    <!-- Copper Traces -->
    <path d="M 60 120 H 280 L 320 160 V 380 L 450 380" stroke="#10b981" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M 60 140 H 260 L 300 180 V 460 L 520 460" stroke="#10b981" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M 940 180 H 750 L 710 220 V 480" stroke="#10b981" stroke-width="2.5" fill="none" opacity="0.6"/>

    <!-- Central Micro-Architectural Module -->
    <g transform="translate(300, 150)">
      <rect width="400" height="300" rx="10" fill="url(#icGrad_${type})" stroke="${accentColor}" stroke-width="2.5"/>
      <circle cx="30" cy="30" r="5" fill="#f59e0b"/>
      <text x="200" y="130" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">${title}</text>
      <text x="200" y="165" fill="${accentColor}" font-family="monospace" font-size="13" text-anchor="middle">${subtitle}</text>
      <rect x="40" y="210" width="320" height="40" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="200" y="235" fill="#a1a1aa" font-family="monospace" font-size="11" text-anchor="middle">REUSABLE SILICON DIE + GOLD BOND WIRES</text>
    </g>

    <!-- Edge Gold Connector Strip -->
    <g transform="translate(150, 560)">
      <rect width="700" height="45" rx="4" fill="#18181b" stroke="#71717a" stroke-width="1.5"/>
      <rect x="20" y="8" width="660" height="28" fill="url(#goldGrad_${type})"/>
      <text x="350" y="26" fill="#000000" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">IMMERSION GOLD CONTACT FINGERS (ENIG 30µ" SPEC)</text>
    </g>

    <!-- Side Capacitor Cluster -->
    <g transform="translate(80, 180)">
      <rect width="140" height="240" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5"/>
      <text x="70" y="28" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">CAPACITOR ARRAY</text>
      <circle cx="45" cy="75" r="22" fill="#cbd5e1" stroke="#2563eb" stroke-width="3"/>
      <circle cx="95" cy="75" r="22" fill="#cbd5e1" stroke="#2563eb" stroke-width="3"/>
      <rect x="25" y="120" width="40" height="24" rx="3" fill="#1c1917" stroke="#eab308" stroke-width="1.5"/>
      <rect x="75" y="120" width="40" height="24" rx="3" fill="#1c1917" stroke="#eab308" stroke-width="1.5"/>
      <rect x="25" y="160" width="90" height="35" rx="3" fill="#3f3f46" stroke="#ea580c" stroke-width="2"/>
      <text x="70" y="182" fill="#fed7aa" font-family="monospace" font-size="9" text-anchor="middle">COPPER INDUCTOR</text>
    </g>

    <!-- I/O Ports -->
    <g transform="translate(800, 180)">
      <rect width="130" height="240" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="20" y="30" width="90" height="45" rx="4" fill="#475569" stroke="#cbd5e1" stroke-width="1"/>
      <rect x="20" y="95" width="90" height="45" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="1"/>
      <rect x="20" y="160" width="90" height="45" rx="4" fill="#475569" stroke="#cbd5e1" stroke-width="1"/>
      <text x="65" y="58" fill="#f8fafc" font-family="monospace" font-size="9" text-anchor="middle">RJ45 GOLD PIN</text>
      <text x="65" y="122" fill="#f8fafc" font-family="monospace" font-size="9" text-anchor="middle">USB 3.0 / PCIe</text>
      <text x="65" y="188" fill="#f8fafc" font-family="monospace" font-size="9" text-anchor="middle">GOLD HEADER</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const SAMPLE_BOARDS: AnalysisResult[] = [
  // Board 1: Enterprise Dual-Socket Server Motherboard
  {
    id: 'server-motherboard-xeon',
    boardName: '1. Enterprise Dual-Socket Xeon Server Motherboard',
    boardType: 'High-Density Server / Data Center Node PCB',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 850,
    imageUrl: createBoardSvg('server', 'INTEL XEON DUAL LGA2011', 'HIGH DENSITY SERVER NODE', '#fbbf24'),
    timestamp: '2026-10-18T08:30:00Z',
    components: [
      {
        id: 'comp-cpu-socket-1',
        name: 'LGA 2011-V3 CPU Socket Gold Contact Array #1',
        category: 'precious_metal',
        box: [23, 30, 46, 50],
        package: 'LGA-2011 Contact Matrix',
        confidence: 0.98,
        description: '2,011 micro-pins electroplated with 30 micro-inch immersion gold (ENIG).',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 145, recoveryGrade: 'Ultra-High' },
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 1200, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Infrared bottom pre-heater 180°C + 380°C nozzle sweep.',
        estimatedValueINR: 1088.00
      },
      {
        id: 'comp-cpu-socket-2',
        name: 'LGA 2011-V3 CPU Socket Gold Contact Array #2',
        category: 'precious_metal',
        box: [23, 50, 46, 70],
        package: 'LGA-2011 Contact Matrix',
        confidence: 0.98,
        description: 'Secondary enterprise CPU socket with gold immersion contact pins.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 145, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Infrared bottom pre-heater 180°C + 380°C sweep.',
        estimatedValueINR: 1088.00
      },
      {
        id: 'comp-bga-chipset',
        name: 'Intel C612 Wellsburg PCH Southbridge IC',
        category: 'reusable_ic',
        box: [46, 30, 68, 70],
        package: 'FC-BGA 936',
        confidence: 0.95,
        description: 'High-performance server southbridge BGA packaging with high second-hand resale value.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 38, recoveryGrade: 'High' },
          { metal: 'Silicon', symbol: 'Si', color: '#64748b', estimatedWeightMg: 180, recoveryGrade: 'Medium' }
        ],
        hazardousNotes: 'BGA underfill epoxy requires controlled hot-air ramp.',
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'BGA rework station profile: ramp to 217°C, dwell at 245°C for 45s.',
        estimatedValueINR: 723.00
      },
      {
        id: 'comp-pcie-slots',
        name: 'PCIe Gen3 x16 Bus Slots with Immersion Gold Fingers',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'PCIe 164-pin Female Socket Pair',
        confidence: 0.96,
        description: 'Hard gold plating over phosphor bronze contacts for high durability.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 82, recoveryGrade: 'High' },
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 4200, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Desoldering bath wave pot dip at 260°C or mechanical shear.',
        estimatedValueINR: 612.00
      },
      {
        id: 'comp-vrm-tantalums',
        name: 'VRM Multi-Phase Tantalum Capacitors & Power Stage',
        category: 'precious_metal',
        box: [27, 8, 64, 22],
        package: 'SMD Case D Tantalum + R22 Chokes',
        confidence: 0.94,
        description: 'Solid tantalum electrolytic capacitors with sintered tantalum powder slug.',
        estimatedMaterials: [
          { metal: 'Tantalum', symbol: 'Ta', color: '#38bdf8', estimatedWeightMg: 1850, recoveryGrade: 'Ultra-High' },
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 6500, recoveryGrade: 'High' }
        ],
        hazardousNotes: 'Manganese dioxide dust irritant if mechanically crushed dry.',
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Hot air pencil at 320°C with tweezers.',
        estimatedValueINR: 544.00
      },
      {
        id: 'comp-io-stack',
        name: 'Dual 10GbE RJ45 & Legacy Wave Solder Joint Array',
        category: 'hazardous',
        box: [27, 80, 64, 93],
        package: 'Through-Hole Metal Cage Assembly',
        confidence: 0.93,
        description: 'Dual RJ45 cages with legacy wave-soldered pins with suspected Lead (Pb) alloy.',
        estimatedMaterials: [
          { metal: 'Lead', symbol: 'Pb', color: '#ef4444', estimatedWeightMg: 4500, recoveryGrade: 'Trace' },
          { metal: 'Tin', symbol: 'Sn', color: '#94a3b8', estimatedWeightMg: 6800, recoveryGrade: 'High' }
        ],
        hazardousNotes: 'High Pb concentration in through-hole joint bulk. Do NOT incinerate.',
        salvageAction: 'Hazardous Hazardous Treatment',
        temperatureGuide: 'Dedicated fume extractor required. Solder pot bath at 250°C.',
        estimatedValueINR: 179.00
      }
    ],
    materials: {
      goldMg: 496,
      silverMg: 110,
      copperGrams: 98,
      tantalumMg: 1850,
      palladiumMg: 48,
      aluminumGrams: 42,
      tinGrams: 28,
      leadRiskScore: 'Moderate',
      hazardousSubstances: ['Lead (Pb) in through-hole wave joints', 'Brominated Flame Retardants (TBBPA) in FR-4 core'],
      hazardousMaterialPercentage: 5.8, // 5.8% of board mass is hazardous/regulated
      hazardousWeightGrams: 49.3,
      reusableComponentsCount: 14
    },
    economics: {
      grossValueINR: 4616.00,
      refiningCostINR: 952.00,
      netSalvageINR: 3664.00,
      secondHandMarketValueTotalINR: 3128.00,
      metricTonEquivalentINR: 5429970,
      urbanMiningEfficiencyRatio: 48
    },
    environmental: {
      co2OffsetKg: 34.2,
      rohsComplianceStatus: 'Warning',
      weeeCategory: 'Category 3: IT and Telecommunications Equipment',
      ppeRequired: [
        'N95 / HEPA particulate respirator (lead fume & dust protection)',
        'Heat-resistant anti-static ESD gloves',
        'Direct-exhaust fume hood during hot desoldering'
      ],
      hazardousContentPercent: 5.8
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Safety Isolation & Fume Exhaust Setup',
        instruction: 'Turn on HEPA fume extraction. Put on P100 respirator to mitigate lead solder fumes.',
        toolNeeded: 'Laminar Benchtop Fume Hood',
        dangerLevel: 'Medium'
      },
      {
        stepNumber: 2,
        title: 'LGA CPU Sockets & Gold Pin Recovery',
        instruction: 'Preheat underside to 160°C. Sweep top hot air at 370°C to release socket gold pins.',
        toolNeeded: 'BGA / Hot Air Rework Station',
        dangerLevel: 'Medium'
      },
      {
        stepNumber: 3,
        title: 'Tantalum Capacitor Harvesting',
        instruction: 'Micro-desolder SMD Case D tantalum capacitors for high-purity tantalum slug recycling.',
        toolNeeded: 'Hot Air Micro-Tweezers (320°C)',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Dual-socket server motherboard delivering top-tier urban mining assay. Gold concentrated in dual LGA2011 sockets (290mg Au) and PCIe bus edge fingers. Tantalum capacitors account for 1.85g of pure Ta. Contains 5.8% hazardous mass (lead solder in wave joints and FR-4 flame retardants).'
  },

  // Board 2: Smartphone 5G Multi-Layer Logic Board
  {
    id: 'smartphone-logic-a16',
    boardName: '2. Smartphone 5G Multi-Layer Logic Board',
    boardType: 'Ultra-High Density Interconnect (HDI) Any-Layer PCB',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 28,
    imageUrl: createBoardSvg('phone', 'A16 BIONIC + 5G RF MODEM', 'ULTRA-DENSE HDI LOGIC', '#38bdf8'),
    timestamp: '2026-10-18T08:35:00Z',
    components: [
      {
        id: 'comp-soc-a16',
        name: 'A16 Bionic 4nm Application Processor SoC',
        category: 'reusable_ic',
        box: [23, 30, 46, 50],
        package: 'Package-on-Package (PoP) 0.3mm BGA',
        confidence: 0.99,
        description: 'Flagship mobile SoC layered with LPDDR5 SDRAM. High second-hand harvesting value.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 35, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Precision hot air at 240°C with 0.1mm micro-nozzle.',
        estimatedValueINR: 2040.00
      },
      {
        id: 'comp-nand-flash',
        name: '512GB 3D TLC BiCS NAND Flash Memory',
        category: 'reusable_ic',
        box: [23, 50, 46, 70],
        package: 'BGA-132 NAND Flash',
        confidence: 0.97,
        description: 'High-speed storage IC. Re-ballable for memory harvesting.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 18, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Pre-heat 150°C, hot air 230°C for 30s.',
        estimatedValueINR: 1233.00
      },
      {
        id: 'comp-rf-subsystem',
        name: '5G Modem & RF Front-End Ceramic Substrate with RF Shield',
        category: 'precious_metal',
        box: [46, 30, 68, 70],
        package: 'Nickel-Silver Can Shield + Micro-BGA',
        confidence: 0.96,
        description: 'Contains high-value Palladium (Pd) in multi-layer ceramic capacitors (MLCC).',
        estimatedMaterials: [
          { metal: 'Palladium', symbol: 'Pd', color: '#a78bfa', estimatedWeightMg: 24, recoveryGrade: 'Ultra-High' },
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 28, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'De-solder shield perimeter clips at 260°C.',
        estimatedValueINR: 833.00
      },
      {
        id: 'comp-battery-fpc',
        name: 'High-Karat Gold Plated Battery FPC Connector',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'Micro-Pitch Board-to-Board Gold Header',
        confidence: 0.95,
        description: 'Pure gold contact blades with ultra-low contact resistance.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 12, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Hot air 230°C.',
        estimatedValueINR: 298.00
      }
    ],
    materials: {
      goldMg: 93,
      silverMg: 32,
      copperGrams: 8.4,
      tantalumMg: 110,
      palladiumMg: 28,
      aluminumGrams: 1.2,
      tinGrams: 2.1,
      leadRiskScore: 'RoHS Compliant (Lead-Free)',
      hazardousSubstances: ['None detected (Halogen-free SAC305 lead-free solder)'],
      hazardousMaterialPercentage: 0.6, // Cleanest modern board
      hazardousWeightGrams: 0.17,
      reusableComponentsCount: 18
    },
    economics: {
      grossValueINR: 1428.00,
      refiningCostINR: 204.00,
      netSalvageINR: 1224.00,
      secondHandMarketValueTotalINR: 4403.00,
      metricTonEquivalentINR: 43714225,
      urbanMiningEfficiencyRatio: 320
    },
    environmental: {
      co2OffsetKg: 8.6,
      rohsComplianceStatus: 'Compliant',
      weeeCategory: 'Category 3: Small IT and Telecommunication Equipment',
      ppeRequired: [
        'ESD wrist strap and anti-static mat',
        'Safety glasses with side shields'
      ],
      hazardousContentPercent: 0.6
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'RF Shield De-soldering',
        instruction: 'Apply micro hot air at 250°C around perimeter clips to lift nickel-silver shield.',
        toolNeeded: 'Precision Hot-Air Station',
        dangerLevel: 'Low'
      },
      {
        stepNumber: 2,
        title: 'SoC & NAND Flash Harvesting',
        instruction: 'Desolder BGA packages with vacuum pickup tool for high second-hand market resale.',
        toolNeeded: 'Vacuum Pick-and-Place Pen',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Clean, modern lead-free smartphone logic board with outstanding urban mining density (over 300x richer than gold ore per gram). Contains only 0.6% hazardous material, making it ideal for component harvesting and hydrometallurgical leaching.'
  },

  // Board 3: Industrial 1200W SMPS Inverter Power Converter
  {
    id: 'industrial-smps-power',
    boardName: '3. Industrial 1200W SMPS Inverter Power Converter',
    boardType: 'Heavy Industrial Power Electronics PCB',
    overallGrade: 'Grade C (Base Metal / Bulk)',
    estimatedBoardWeightGrams: 1450,
    imageUrl: createBoardSvg('power', '1200W ISOLATED POWER INVERTER', 'HEAVY COPPER & EXT. ALUMINUM', '#f97316'),
    timestamp: '2026-10-18T08:40:00Z',
    components: [
      {
        id: 'comp-transformer-cu',
        name: 'High-Frequency Ferrite E-Core Transformer (Copper Windings)',
        category: 'passive_bulk',
        box: [23, 30, 68, 70],
        package: 'E-65 High Power Ferrite Assembly',
        confidence: 0.99,
        description: 'Multi-filar heavy enamel copper wire wound around Mn-Zn ferrite core. Massive bulk copper content.',
        estimatedMaterials: [
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 320000, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Bulk Granulation',
        temperatureGuide: 'Unwind manually or guillotine copper head.',
        estimatedValueINR: 264.00
      },
      {
        id: 'comp-aluminum-heatsink',
        name: 'Anodized Extruded Aluminum Cooling Heatsink',
        category: 'passive_bulk',
        box: [27, 8, 64, 22],
        package: 'Extrusion Profile 6063 Aluminum',
        confidence: 0.98,
        description: 'Heavy cooling block clamped to TO-247 MOSFET transistors.',
        estimatedMaterials: [
          { metal: 'Aluminum', symbol: 'Al', color: '#94a3b8', estimatedWeightMg: 480000, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: 'Thermal paste contains zinc oxide.',
        salvageAction: 'Mechanical Disassembly',
        temperatureGuide: 'Unscrew 4x M3 mounting screws.',
        estimatedValueINR: 106.00
      },
      {
        id: 'comp-electrolytic-caps',
        name: 'High-Voltage 450V Electrolytic Filter Can Capacitors (x2)',
        category: 'hazardous',
        box: [27, 80, 64, 93],
        package: 'Radial Aluminum Electrolytic Snap-In',
        confidence: 0.97,
        description: 'Retains lethal DC residual voltage. Liquid boric acid / glycol electrolyte.',
        estimatedMaterials: [
          { metal: 'Aluminum', symbol: 'Al', color: '#94a3b8', estimatedWeightMg: 65000, recoveryGrade: 'Medium' }
        ],
        hazardousNotes: 'EXPLOSION / SHOCK HAZARD: Must discharge with 100Ω power resistor before handling.',
        salvageAction: 'Hazardous Hazardous Treatment',
        temperatureGuide: 'Discharge with 100-ohm 50W power resistor before mechanical desoldering.',
        estimatedValueINR: 34.00
      }
    ],
    materials: {
      goldMg: 8,
      silverMg: 28,
      copperGrams: 460,
      tantalumMg: 0,
      palladiumMg: 4,
      aluminumGrams: 550,
      tinGrams: 42,
      leadRiskScore: 'High (Leaded Sn-Pb 60/40 Solder)',
      hazardousSubstances: ['High Voltage Residual Capacitance (400V+)', 'Lead-Tin 60/40 through-hole wave solder', 'Liquid organic electrolyte'],
      hazardousMaterialPercentage: 16.4, // High hazardous mass
      hazardousWeightGrams: 237.8,
      reusableComponentsCount: 6
    },
    economics: {
      grossValueINR: 757.00,
      refiningCostINR: 153.00,
      netSalvageINR: 604.00,
      secondHandMarketValueTotalINR: 1063.00,
      metricTonEquivalentINR: 416160,
      urbanMiningEfficiencyRatio: 3.2
    },
    environmental: {
      co2OffsetKg: 18.4,
      rohsComplianceStatus: 'Non-Compliant (Hazardous)',
      weeeCategory: 'Category 1: Large Household & Industrial Power Converters',
      ppeRequired: [
        'Insulated 1000V rated electricians gloves',
        'Safety face shield during capacitor discharge',
        'Leather work gloves for handling sharp aluminum fins and heavy copper'
      ],
      hazardousContentPercent: 16.4
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Safety Discharge of 450V Electrolytic Filter Capacitors',
        instruction: 'CRITICAL: Bridge capacitor terminals with 100Ω 50W resistor for 15 seconds until potential drops under 2V DC.',
        toolNeeded: 'Multimeter + 100Ω Discharge Probe',
        dangerLevel: 'High'
      },
      {
        stepNumber: 2,
        title: 'Aluminum Heatsink Mechanical Uncoupling',
        instruction: 'Unclip TO-247 power MOSFETs and unscrew heatsink standoffs to harvest 480g clean aluminum.',
        toolNeeded: 'Phillips Screwdriver',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Bulk base-metal powerhouse containing 460g copper and 550g aluminum. Has 16.4% hazardous content due to lead solder and high-voltage stored capacitance requiring mandatory pre-discharge.'
  },

  // Board 4: DDR4 ECC Registered Server Memory DIMM
  {
    id: 'ddr4-ecc-ram',
    boardName: '4. DDR4 ECC Registered Server Memory DIMM Stick',
    boardType: 'High-Density Server Memory Module',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 35,
    imageUrl: createBoardSvg('ram', '32GB DDR4 3200MHz ECC REG', '16x DRAM ICs + GOLD EDGE', '#eab308'),
    timestamp: '2026-10-18T08:45:00Z',
    components: [
      {
        id: 'comp-ram-gold-edge',
        name: '288-Pin Immersion Hard Gold Edge Fingers',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'DDR4 288-Pin Edge Card Contact',
        confidence: 0.99,
        description: '30µ-inch electroplated hard gold over nickel barrier. High purity recovery target.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 45, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Shear edge strip or hydrometallurgical strip directly.',
        estimatedValueINR: 332.00
      },
      {
        id: 'comp-ram-chips',
        name: '16x Micron 16Gb DDR4 SDRAM BGA Memory ICs',
        category: 'reusable_ic',
        box: [23, 30, 68, 70],
        package: '78-ball FBGA (9x11mm)',
        confidence: 0.98,
        description: 'Operational memory chips with high second-hand refurbishment value.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 32, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Hot air sweep at 235°C with vacuum nozzle.',
        estimatedValueINR: 2380.00
      }
    ],
    materials: {
      goldMg: 82,
      silverMg: 15,
      copperGrams: 12,
      tantalumMg: 14,
      palladiumMg: 18,
      aluminumGrams: 1.0,
      tinGrams: 1.8,
      leadRiskScore: 'RoHS Compliant (Lead-Free)',
      hazardousSubstances: ['None detected (Halogen-Free FR-4, SAC305 Lead-free)'],
      hazardousMaterialPercentage: 0.9,
      hazardousWeightGrams: 0.31,
      reusableComponentsCount: 17
    },
    economics: {
      grossValueINR: 1233.00,
      refiningCostINR: 153.00,
      netSalvageINR: 1080.00,
      secondHandMarketValueTotalINR: 2712.00,
      metricTonEquivalentINR: 35214225,
      urbanMiningEfficiencyRatio: 260
    },
    environmental: {
      co2OffsetKg: 6.8,
      rohsComplianceStatus: 'Compliant',
      weeeCategory: 'Category 3: IT Hardware Modules',
      ppeRequired: ['Anti-static ESD gloves', 'Safety goggles'],
      hazardousContentPercent: 0.9
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'DRAM IC Harvesting',
        instruction: 'Sweep hot air across FBGA chip row at 235°C to harvest reusable Micron memory dies.',
        toolNeeded: 'Hot Air Rework Bar',
        dangerLevel: 'Low'
      },
      {
        stepNumber: 2,
        title: 'Edge Finger Guillotine Stripping',
        instruction: 'Cut gold contact edge strip for targeted chemical leaching.',
        toolNeeded: 'PCB Shear',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Outstanding gold-to-weight ratio. 16x operational DRAM BGA chips provide ₹28 in second-hand resale value. Contact fingers yield 45mg Au with under 1% hazardous content.'
  },

  // Board 5: Embedded IoT Microcontroller Board
  {
    id: 'arduino-iot-mcu',
    boardName: '5. Embedded IoT ATmega328P Microcontroller Board',
    boardType: 'Prototyping & Edge Computing Development Board',
    overallGrade: 'Grade B (Medium Yield)',
    estimatedBoardWeightGrams: 25,
    imageUrl: createBoardSvg('iot', 'ATMEGA328P DIP-28 MCU', 'EMBEDDED ARDUINO COMPATIBLE', '#10b981'),
    timestamp: '2026-10-18T08:50:00Z',
    components: [
      {
        id: 'comp-atmega-mcu',
        name: 'Microchip ATmega328P 8-Bit AVR Microcontroller',
        category: 'reusable_ic',
        box: [23, 30, 46, 70],
        package: 'DIP-28 Through-Hole Socketed',
        confidence: 0.99,
        description: 'Socketed 8-bit RISC microcontroller with 32KB flash. 100% reusable plug-and-play IC.',
        estimatedMaterials: [
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 450, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'No heat required; extract with DIP IC puller tool.',
        estimatedValueINR: 238.00
      },
      {
        id: 'comp-ch340-uart',
        name: 'WCH CH340G USB to Serial UART Bridge IC',
        category: 'reusable_ic',
        box: [46, 30, 68, 70],
        package: 'SOIC-16 Surface Mount',
        confidence: 0.95,
        description: 'Standard USB-serial communication chip.',
        estimatedMaterials: [
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 120, recoveryGrade: 'Medium' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Hot air at 240°C.',
        estimatedValueINR: 55.00
      },
      {
        id: 'comp-pin-headers',
        name: 'Gold-Flashed Female 0.1" Expansion Pin Headers',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'Through-Hole 2.54mm Header Strip',
        confidence: 0.96,
        description: 'Gold-plated spring phosphor bronze pins.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 4, recoveryGrade: 'Medium' }
        ],
        hazardousNotes: null,
        salvageAction: 'Mechanical Disassembly',
        temperatureGuide: 'Desolder solder sucker at 300°C.',
        estimatedValueINR: 34.00
      }
    ],
    materials: {
      goldMg: 8,
      silverMg: 12,
      copperGrams: 5.2,
      tantalumMg: 0,
      palladiumMg: 2,
      aluminumGrams: 0.4,
      tinGrams: 1.5,
      leadRiskScore: 'RoHS Compliant (Lead-Free)',
      hazardousSubstances: ['None detected'],
      hazardousMaterialPercentage: 1.2,
      hazardousWeightGrams: 0.3,
      reusableComponentsCount: 8
    },
    economics: {
      grossValueINR: 332.00,
      refiningCostINR: 51.00,
      netSalvageINR: 281.00,
      secondHandMarketValueTotalINR: 412.00,
      metricTonEquivalentINR: 13260000,
      urbanMiningEfficiencyRatio: 18
    },
    environmental: {
      co2OffsetKg: 2.1,
      rohsComplianceStatus: 'Compliant',
      weeeCategory: 'Category 3: IT Prototyping Modules',
      ppeRequired: ['Basic ESD protection', 'Safety glasses'],
      hazardousContentPercent: 1.2
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Microcontroller Extraction',
        instruction: 'Lever socketed ATmega328P DIP chip using IC extractor tool. Test in test-rig for resale.',
        toolNeeded: 'DIP IC Extractor Tool',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'High reusability hobbyist/IoT microcontroller board. Socketed ATmega328P microcontroller requires zero desoldering and can be directly inventoried for educational resale.'
  },

  // Board 6: Gaming GPU Graphics Accelerator PCB
  {
    id: 'gaming-gpu-pcb',
    boardName: '6. High-Performance GPU Graphics Accelerator Board',
    boardType: 'Discrete Graphics Processing Unit (GDDR6)',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 380,
    imageUrl: createBoardSvg('gpu', 'NVIDIA GA104 GPU CORE', 'GDDR6 VRAM + 10-PHASE VRM', '#22c55e'),
    timestamp: '2026-10-18T08:55:00Z',
    components: [
      {
        id: 'comp-gpu-die',
        name: 'GA104 8nm High-Performance GPU Processor Core',
        category: 'reusable_ic',
        box: [23, 30, 46, 50],
        package: 'FC-BGA with Metal Substrate Reinforcement',
        confidence: 0.98,
        description: 'Large surface-area silicon die with micro-bump bonding array.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 42, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'BGA rework station preheat 160°C, peak 240°C.',
        estimatedValueINR: 3825.00
      },
      {
        id: 'comp-gddr6-vram',
        name: '8x Samsung 16Gbps GDDR6 VRAM Chips',
        category: 'reusable_ic',
        box: [23, 50, 46, 70],
        package: '180-ball BGA GDDR6',
        confidence: 0.97,
        description: 'High-speed graphic memory chips. High second-hand repair shop demand.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 24, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Hot air 230°C.',
        estimatedValueINR: 3060.00
      },
      {
        id: 'comp-gpu-pcie',
        name: 'PCIe 4.0 x16 Immersion Gold Bus Connector Strip',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'PCIe 164-contact ENIG gold edge',
        confidence: 0.99,
        description: 'Immersion hard gold plating for high insertion cycles.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 55, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Mechanical shear.',
        estimatedValueINR: 408.00
      }
    ],
    materials: {
      goldMg: 165,
      silverMg: 48,
      copperGrams: 58,
      tantalumMg: 420,
      palladiumMg: 35,
      aluminumGrams: 18,
      tinGrams: 12,
      leadRiskScore: 'RoHS Compliant (Lead-Free)',
      hazardousSubstances: ['None detected (Halogen-Free Multi-layer FR-4)'],
      hazardousMaterialPercentage: 1.8,
      hazardousWeightGrams: 6.8,
      reusableComponentsCount: 22
    },
    economics: {
      grossValueINR: 2423.00,
      refiningCostINR: 357.00,
      netSalvageINR: 2066.00,
      secondHandMarketValueTotalINR: 7293.00, // Substantial resale value of GPU core + GDDR6
      metricTonEquivalentINR: 6375000,
      urbanMiningEfficiencyRatio: 52
    },
    environmental: {
      co2OffsetKg: 24.5,
      rohsComplianceStatus: 'Compliant',
      weeeCategory: 'Category 3: Computer Graphics Modules',
      ppeRequired: ['ESD anti-static gear', 'HEPA fume extraction', 'Safety glasses'],
      hazardousContentPercent: 1.8
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'GDDR6 VRAM Harvesting',
        instruction: 'Desolder 8x GDDR6 BGA chips for testing and re-balling in GPU repair facilities.',
        toolNeeded: 'Infrared BGA Preheater + Hot Air Pen',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Premium GPU graphics board featuring high-demand second-hand reusable silicon. The GDDR6 memory chips and GA104 core represent over ₹80 in secondary market value, alongside 165mg recoverable gold.'
  },

  // Board 7: M.2 NVMe Solid-State Drive PCB
  {
    id: 'm2-nvme-ssd',
    boardName: '7. M.2 NVMe High-Speed Solid-State Drive PCB',
    boardType: 'PCIe Gen4 NVMe Storage Drive (Form Factor 2280)',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 12,
    imageUrl: createBoardSvg('nvme', 'PCIE GEN4 SSD CONTROLLER', '2TB 3D TLC FLASH + GOLD M.2', '#06b6d4'),
    timestamp: '2026-10-18T09:00:00Z',
    components: [
      {
        id: 'comp-ssd-ctrl',
        name: 'Phison PS5018-E18 PCIe 4.0 8-Channel NVMe Controller',
        category: 'reusable_ic',
        box: [23, 30, 46, 50],
        package: 'FC-BGA Controller with Nickel Heatspreader',
        confidence: 0.98,
        description: 'High-speed storage controller IC with embedded ARM triple-core CPU.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 15, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Hot air 235°C.',
        estimatedValueINR: 808.00
      },
      {
        id: 'comp-ssd-nand',
        name: '2x 1TB 176-Layer 3D TLC NAND Flash Modules',
        category: 'reusable_ic',
        box: [23, 50, 46, 70],
        package: 'BGA-132 Flash',
        confidence: 0.97,
        description: 'Pristine flash storage dies with minimal write wear.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 28, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Pre-heat 140°C, hot air 225°C.',
        estimatedValueINR: 2210.00
      },
      {
        id: 'comp-m2-edge',
        name: 'M.2 M-Key 75-Pin Immersion Gold Contact Edge',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'M.2 Gold Bevel Edge Connector',
        confidence: 0.99,
        description: 'Hard gold immersion plating for high throughput PCIe signals.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 18, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Shear edge connector.',
        estimatedValueINR: 136.00
      }
    ],
    materials: {
      goldMg: 68,
      silverMg: 8,
      copperGrams: 3.5,
      tantalumMg: 45,
      palladiumMg: 12,
      aluminumGrams: 0.2,
      tinGrams: 0.8,
      leadRiskScore: 'RoHS Compliant (Lead-Free)',
      hazardousSubstances: ['None detected'],
      hazardousMaterialPercentage: 0.5,
      hazardousWeightGrams: 0.06,
      reusableComponentsCount: 7
    },
    economics: {
      grossValueINR: 782.00,
      refiningCostINR: 94.00,
      netSalvageINR: 689.00,
      secondHandMarketValueTotalINR: 3154.00,
      metricTonEquivalentINR: 65166610,
      urbanMiningEfficiencyRatio: 380
    },
    environmental: {
      co2OffsetKg: 3.8,
      rohsComplianceStatus: 'Compliant',
      weeeCategory: 'Category 3: Solid State Storage Media',
      ppeRequired: ['Anti-static ESD gloves', 'Safety goggles'],
      hazardousContentPercent: 0.5
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'NAND Flash Harvesting',
        instruction: 'Lift 3D NAND flash packages for re-use in USB drives or secondary SSD fabrication.',
        toolNeeded: 'Hot Air Pencil + Vacuum Pen',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Ultra-dense solid-state storage module. Boasts an astounding 5.6g Au per kilogram density (380x richer than gold ore) with negligible 0.5% hazardous content and ₹37+ in component resale value.'
  },

  // Board 8: Carrier Telecom Optical Routing Switch Backplane
  {
    id: 'telecom-switch-backplane',
    boardName: '8. Carrier Telecom Optical Switch Backplane',
    boardType: 'Carrier-Grade Telecommunications Routing Card',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 620,
    imageUrl: createBoardSvg('telecom', 'CISCO/JUNIPER ASIC + 30u AU', 'CARRIER TELECOM BACKPLANE', '#a855f7'),
    timestamp: '2026-10-18T09:05:00Z',
    components: [
      {
        id: 'comp-telecom-fpga',
        name: 'Xilinx Virtex UltraScale+ Telecom Processing FPGA',
        category: 'reusable_ic',
        box: [23, 30, 46, 50],
        package: 'FC-BGA 2104 Pin',
        confidence: 0.98,
        description: 'Enterprise FPGA with extreme silicon real estate and gold wirebonds.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 85, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'BGA rework station 245°C.',
        estimatedValueINR: 5525.00
      },
      {
        id: 'comp-backplane-gold-pins',
        name: 'Dense High-Speed Backplane Gold Header Matrix (30µ" Au)',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'Hard Metric 2mm Gold Header Assembly',
        confidence: 0.99,
        description: 'Military-spec immersion gold over beryllium copper for telecom reliability.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 180, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Wave pot desoldering.',
        estimatedValueINR: 1326.00
      },
      {
        id: 'comp-palladium-mlcc',
        name: 'High-Reliability Palladium-Bearing MLCC Array',
        category: 'precious_metal',
        box: [27, 8, 64, 22],
        package: '1206 / 0805 Surface Mount',
        confidence: 0.94,
        description: 'Precious Palladium-Silver inner electrodes.',
        estimatedMaterials: [
          { metal: 'Palladium', symbol: 'Pd', color: '#a78bfa', estimatedWeightMg: 95, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Hot air sweep at 300°C.',
        estimatedValueINR: 757.00
      }
    ],
    materials: {
      goldMg: 340,
      silverMg: 85,
      copperGrams: 82,
      tantalumMg: 650,
      palladiumMg: 110,
      aluminumGrams: 14,
      tinGrams: 18,
      leadRiskScore: 'Low Trace',
      hazardousSubstances: ['Trace lead in legacy solder joint pins'],
      hazardousMaterialPercentage: 3.2,
      hazardousWeightGrams: 19.8,
      reusableComponentsCount: 19
    },
    economics: {
      grossValueINR: 3927.00,
      refiningCostINR: 638.00,
      netSalvageINR: 3290.00,
      secondHandMarketValueTotalINR: 6673.00,
      metricTonEquivalentINR: 6333860,
      urbanMiningEfficiencyRatio: 65
    },
    environmental: {
      co2OffsetKg: 28.4,
      rohsComplianceStatus: 'Warning',
      weeeCategory: 'Category 3: Telecommunications Infrastructure',
      ppeRequired: ['HEPA respirator', 'Heat-resistant ESD gloves', 'Safety goggles'],
      hazardousContentPercent: 3.2
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Backplane Header Stripping',
        instruction: 'Desolder heavy 30µ" gold contact pin header matrix into dedicated precious metal refining batch.',
        toolNeeded: 'Wave Solder Bath / Heat Bar',
        dangerLevel: 'Medium'
      }
    ],
    aiSummary: 'Highest-grade telecommunications carrier backplane card. Exceptional gold (340mg) and palladium (110mg) yields with high-value Virtex FPGA core.'
  },

  // Board 9: High-Fidelity Audio Power Amplifier Board
  {
    id: 'audio-power-amplifier',
    boardName: '9. High-Fidelity Audio Power Amplifier Board',
    boardType: 'Consumer & Professional Audio Power Stage',
    overallGrade: 'Grade B (Medium Yield)',
    estimatedBoardWeightGrams: 550,
    imageUrl: createBoardSvg('audio', 'TDA7294 HIGH POWER AUDIO', 'DUAL FILTER CANS + COPPER TOROID', '#ec4899'),
    timestamp: '2026-10-18T09:10:00Z',
    components: [
      {
        id: 'comp-audio-amp-ic',
        name: 'Dual STMicroelectronics TDA7294 100W Audio Power ICs',
        category: 'reusable_ic',
        box: [23, 30, 46, 70],
        package: 'Multiwatt-15 with Metal Mounting Tab',
        confidence: 0.97,
        description: 'DMOS audio amplifier ICs with built-in thermal protection.',
        estimatedMaterials: [
          { metal: 'Copper', symbol: 'Cu', color: '#ea580c', estimatedWeightMg: 4200, recoveryGrade: 'High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Desolder & Test for Resale',
        temperatureGuide: 'Through-hole desoldering at 320°C.',
        estimatedValueINR: 459.00
      },
      {
        id: 'comp-audio-filter-caps',
        name: 'Dual 10,000µF 63V Audio-Grade Electrolytic Capacitors',
        category: 'hazardous',
        box: [27, 80, 64, 93],
        package: 'Snap-In Large Aluminum Can',
        confidence: 0.96,
        description: 'High capacitance filter capacitors with liquid electrolyte.',
        estimatedMaterials: [
          { metal: 'Aluminum', symbol: 'Al', color: '#94a3b8', estimatedWeightMg: 85000, recoveryGrade: 'High' }
        ],
        hazardousNotes: 'Charge retention and liquid electrolyte solvent hazard.',
        salvageAction: 'Hazardous Hazardous Treatment',
        temperatureGuide: 'Discharge before desoldering.',
        estimatedValueINR: 153.00
      }
    ],
    materials: {
      goldMg: 12,
      silverMg: 22,
      copperGrams: 88,
      tantalumMg: 0,
      palladiumMg: 4,
      aluminumGrams: 160,
      tinGrams: 16,
      leadRiskScore: 'Moderate',
      hazardousSubstances: ['Electrolytic solvent fluid', 'Lead solder in audio output terminals'],
      hazardousMaterialPercentage: 8.5,
      hazardousWeightGrams: 46.7,
      reusableComponentsCount: 11
    },
    economics: {
      grossValueINR: 553.00,
      refiningCostINR: 119.00,
      netSalvageINR: 433.00,
      secondHandMarketValueTotalINR: 833.00,
      metricTonEquivalentINR: 1004530,
      urbanMiningEfficiencyRatio: 6.4
    },
    environmental: {
      co2OffsetKg: 9.4,
      rohsComplianceStatus: 'Warning',
      weeeCategory: 'Category 4: Consumer Audio Visual Equipment',
      ppeRequired: ['Safety goggles', 'Heat gloves'],
      hazardousContentPercent: 8.5
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Filter Capacitor Discharge',
        instruction: 'Discharge 10,000µF capacitor banks before mechanical unscrewing.',
        toolNeeded: '100Ω Resistor Probe',
        dangerLevel: 'Medium'
      }
    ],
    aiSummary: 'Audio power PCB containing 88g copper and 160g aluminum heat sink material. 8.5% hazardous mass due to electrolyte cans and leaded solder joints.'
  },

  // Board 10: Vintage Legacy 486 Industrial Motherboard
  {
    id: 'vintage-486-motherboard',
    boardName: '10. Vintage Legacy 486 Industrial Motherboard',
    boardType: 'Vintage Computing (1990s Era Industrial AT Form Factor)',
    overallGrade: 'Grade A (High Au/Pd Yield)',
    estimatedBoardWeightGrams: 680,
    imageUrl: createBoardSvg('vintage', 'INTEL 486DX4 CERAMIC CPU', 'CERAMIC GOLD CAP + ISA SLOTS', '#ca8a04'),
    timestamp: '2026-10-18T09:15:00Z',
    components: [
      {
        id: 'comp-ceramic-cpu',
        name: 'Intel 486DX4 100MHz Gold-Capped Ceramic CPU',
        category: 'precious_metal',
        box: [23, 30, 46, 50],
        package: 'PGA-168 Gold Pin Ceramic Package',
        confidence: 0.99,
        description: 'Famous vintage ceramic package containing pure gold heat spreader lid and 168 solid gold plated pins.',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 210, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: null,
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'PGA socket extraction or retro computing collector resale.',
        estimatedValueINR: 2720.00
      },
      {
        id: 'comp-isa-gold-slots',
        name: '4x 16-Bit Legacy ISA Bus Slots with Thick Gold Contacts',
        category: 'connector',
        box: [86, 15, 93, 85],
        package: 'Through-Hole ISA 98-Pin Sockets',
        confidence: 0.98,
        description: '1990s vintage heavy gold immersion plating (approx. 50 micro-inches Au).',
        estimatedMaterials: [
          { metal: 'Gold', symbol: 'Au', color: '#fbbf24', estimatedWeightMg: 120, recoveryGrade: 'Ultra-High' }
        ],
        hazardousNotes: 'Wave soldered with heavy Sn-Pb 60/40 lead alloy.',
        salvageAction: 'Chemical Precious Metal Leaching',
        temperatureGuide: 'Solder bath desoldering at 250°C.',
        estimatedValueINR: 884.00
      },
      {
        id: 'comp-nicad-cmos-battery',
        name: 'Barrel Ni-Cad CMOS Real-Time Clock Battery',
        category: 'hazardous',
        box: [27, 80, 64, 93],
        package: '3.6V Ni-Cd Solder-in Barrel Cell',
        confidence: 0.97,
        description: 'EXTREME HAZARD: Highly toxic Cadmium (Cd) metal. Subject to acid leakage and caustic corrosion.',
        estimatedMaterials: [
          { metal: 'Cadmium', symbol: 'Cd', color: '#ef4444', estimatedWeightMg: 8500, recoveryGrade: 'Trace' }
        ],
        hazardousNotes: 'TOXIC CARCINOGEN: Cadmium compounds regulated under RoHS & Basel Convention. Severe environmental contaminant.',
        salvageAction: 'Hazardous Hazardous Treatment',
        temperatureGuide: 'Clip battery leads with flush diagonal cutters. Do NOT heat with soldering iron!',
        estimatedValueINR: 9.00
      }
    ],
    materials: {
      goldMg: 420,
      silverMg: 75,
      copperGrams: 64,
      tantalumMg: 850,
      palladiumMg: 45,
      aluminumGrams: 12,
      tinGrams: 35,
      leadRiskScore: 'High (Leaded Sn-Pb 60/40 Solder)',
      hazardousSubstances: [
        'Cadmium (Cd) in Ni-Cd barrel CMOS battery',
        'Lead (Pb) across 100% of wave solder joints (Sn-Pb 60/40)',
        'Polybrominated Biphenyls (PBB) in early FR-4 laminate'
      ],
      hazardousMaterialPercentage: 21.4, // Highest hazardous ratio in test suite
      hazardousWeightGrams: 145.5,
      reusableComponentsCount: 15
    },
    economics: {
      grossValueINR: 4131.00,
      refiningCostINR: 893.00,
      netSalvageINR: 3239.00,
      secondHandMarketValueTotalINR: 4420.00, // Retro computing collector premium!
      metricTonEquivalentINR: 6074950,
      urbanMiningEfficiencyRatio: 58
    },
    environmental: {
      co2OffsetKg: 31.5,
      rohsComplianceStatus: 'Non-Compliant (Hazardous)',
      weeeCategory: 'Category 3: Historical Electronic Equipment (RoHS Non-Compliant)',
      ppeRequired: [
        'P100 HEPA & Lead dust respirator',
        'Chemical resistant nitrile gloves for battery acid handling',
        'Direct exhaust fume hood'
      ],
      hazardousContentPercent: 21.4
    },
    dismantleSteps: [
      {
        stepNumber: 1,
        title: 'Emergency Ni-Cd Battery Neutralization',
        instruction: 'CRITICAL: Mechanically clip the barrel Ni-Cd battery leads with flush cutters. Place immediately in sealed hazardous chemical bag. Do not heat leads!',
        toolNeeded: 'Flush Diagonal Cutters + Sealed Chemical Container',
        dangerLevel: 'High'
      },
      {
        stepNumber: 2,
        title: 'Ceramic CPU Harvesting',
        instruction: 'Lift the PGA-168 gold-capped 486 processor. High value for both vintage collectors and gold recovery.',
        toolNeeded: 'PGA Lever / Zero-Insertion Force Lever',
        dangerLevel: 'Low'
      }
    ],
    aiSummary: 'Vintage computing goldmine. Gold-capped ceramic 486 CPU and thick 1990s ISA gold plating yield over 420mg Au. However, this board carries the highest hazardous ratio (21.4% toxic mass) due to a leaking Ni-Cd Cadmium battery and full Sn-Pb lead solder.'
  }
];

export const DEFAULT_SPOT_PRICES = {
  currency: "INR",
  currencySymbol: "₹",
  goldPerGram: 7650.00,       // ₹7,650 / gram (24K Gold)
  silverPerGram: 94.50,       // ₹94.50 / gram (~₹94,500 / kg)
  copperPerKg: 840.00,        // ₹840 / kg (MCX Copper)
  tantalumPerGram: 25.50,     // ₹25.50 / gram
  palladiumPerGram: 2950.00,  // ₹2,950 / gram
  aluminumPerKg: 235.00,      // ₹235 / kg
  tinPerKg: 2850.00,          // ₹2,850 / kg
  lastUpdated: "Live Benchmark (MCX / IBJA Indian Market Close)"
};
