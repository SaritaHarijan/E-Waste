import React, { useState } from 'react';
import { Search, DollarSign, Filter, ArrowUpDown, ShieldAlert, Cpu, Sparkles, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { DetectedComponent, ComponentCategory } from '../types/pcb';

interface ComponentInventoryTableProps {
  components: DetectedComponent[];
  selectedComponent: DetectedComponent | null;
  onSelectComponent: (component: DetectedComponent | null) => void;
  hazardousPercentage: number;
  secondHandTotalINR: number;
}

export const ComponentInventoryTable: React.FC<ComponentInventoryTableProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  hazardousPercentage,
  secondHandTotalINR,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value' | 'confidence' | 'name'>('value');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredComponents = components
    .filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.salvageAction.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || comp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'value') {
        return sortAsc
          ? a.estimatedValueINR - b.estimatedValueINR
          : b.estimatedValueINR - a.estimatedValueINR;
      }
      if (sortBy === 'confidence') {
        return sortAsc ? a.confidence - b.confidence : b.confidence - a.confidence;
      }
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

  const getCategoryBadge = (category: ComponentCategory) => {
    switch (category) {
      case 'reusable_ic':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'precious_metal':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'hazardous':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'connector':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'passive_bulk':
      default:
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    }
  };

  const handleExportCsv = () => {
    const headers = ['Component Name', 'Package', 'Category', 'Confidence %', 'Second-Hand Value INR (₹)', 'Salvage Action', 'Hazardous Notes'];
    const rows = components.map((c) => [
      `"${c.name}"`,
      `"${c.package}"`,
      c.category,
      Math.round(c.confidence * 100),
      c.estimatedValueINR.toFixed(2),
      `"${c.salvageAction}"`,
      `"${c.hazardousNotes || 'None'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PCB-Component-Inventory-INR-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Table Header and Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Component Inventory & Valuation Roster</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {components.length} DETECTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Granular package identification, second-hand reuse valuation, and hazardous classification
          </p>
        </div>

        {/* Deliverable Metrics Callout Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Second-Hand Value</span>
            <span className="text-sm font-black text-amber-400">
              ₹{secondHandTotalINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Hazardous Content</span>
            <span
              className={`text-sm font-black ${
                hazardousPercentage > 10
                  ? 'text-red-400'
                  : hazardousPercentage > 3
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {hazardousPercentage.toFixed(1)}%
            </span>
          </div>

          <button
            onClick={handleExportCsv}
            title="Download full inventory as CSV"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ICs, microcontrollers, capacitors, package..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            <option value="reusable_ic">Reusable ICs & MCUs</option>
            <option value="precious_metal">Precious Metal Bearers</option>
            <option value="hazardous">Hazardous / Toxic</option>
            <option value="connector">Connectors & Pins</option>
            <option value="passive_bulk">Passive & Bulk</option>
          </select>

          {/* Sort By Toggle */}
          <button
            onClick={() => {
              if (sortBy === 'value') {
                setSortAsc(!sortAsc);
              } else {
                setSortBy('value');
                setSortAsc(false);
              }
            }}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl border transition-colors ${
              sortBy === 'value'
                ? 'bg-slate-800 border-slate-700 text-white font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <span>Value {sortBy === 'value' ? (sortAsc ? '↑' : '↓') : ''}</span>
          </button>
        </div>
      </div>

      {/* Inventory Roster Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
        <div className="overflow-x-auto max-h-[380px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Component Designation</th>
                <th className="py-2.5 px-3">Package Form</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Second-Hand Value</th>
                <th className="py-2.5 px-3">Recommended Salvage Route</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No components match your search filters.
                  </td>
                </tr>
              ) : (
                filteredComponents.map((comp) => {
                  const isSelected = selectedComponent?.id === comp.id;
                  return (
                    <tr
                      key={comp.id}
                      onClick={() => onSelectComponent(isSelected ? null : comp)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/50 text-cyan-200'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      {/* Name */}
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-100 flex items-center gap-2">
                        {comp.category === 'hazardous' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        ) : comp.category === 'reusable_ic' ? (
                          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate max-w-[200px]" title={comp.name}>
                          {comp.name}
                        </span>
                      </td>

                      {/* Package */}
                      <td className="py-2.5 px-3 text-slate-400">{comp.package}</td>

                      {/* Category Badge */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryBadge(comp.category)}`}>
                          {comp.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-2.5 px-3 text-slate-400">
                        {Math.round(comp.confidence * 100)}%
                      </td>

                      {/* Second-Hand Value */}
                      <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                        ₹{comp.estimatedValueINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Salvage Action */}
                      <td className="py-2.5 px-3 text-slate-300 text-[11px] truncate max-w-[180px]">
                        {comp.salvageAction}
                      </td>

                      {/* Inspect link */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectComponent(comp);
                          }}
                          className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
