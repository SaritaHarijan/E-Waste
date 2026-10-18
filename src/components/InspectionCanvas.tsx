import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Eye, ShieldAlert, Sparkles, Cpu, Layers, Crosshair, HelpCircle } from 'lucide-react';
import { DetectedComponent, ComponentCategory } from '../types/pcb';

interface InspectionCanvasProps {
  imageUrl: string;
  components: DetectedComponent[];
  selectedComponent: DetectedComponent | null;
  onSelectComponent: (component: DetectedComponent | null) => void;
  boardName: string;
}

type ViewFilter = 'all' | ComponentCategory;
type RenderMode = 'normal' | 'xray' | 'uv';

export const InspectionCanvas: React.FC<InspectionCanvasProps> = ({
  imageUrl,
  components,
  selectedComponent,
  onSelectComponent,
  boardName,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [renderMode, setRenderMode] = useState<RenderMode>('normal');
  const [hoveredComponent, setHoveredComponent] = useState<DetectedComponent | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.3, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.3, 0.6));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click drag
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((s) => Math.min(Math.max(s * zoomFactor, 0.5), 4));
  };

  const filteredComponents = components.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.category === activeFilter;
  });

  const getCategoryTheme = (category: ComponentCategory) => {
    switch (category) {
      case 'precious_metal':
        return {
          border: 'border-amber-400',
          bg: 'bg-amber-400/20',
          text: 'text-amber-300',
          badge: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400',
          label: 'Precious Metal (Au/Ta/Pd)',
        };
      case 'hazardous':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500/25',
          text: 'text-red-400',
          badge: 'bg-red-500/20 border-red-500/50 text-red-300',
          dot: 'bg-red-500',
          label: 'Hazardous (Pb / High Voltage)',
        };
      case 'reusable_ic':
        return {
          border: 'border-emerald-400',
          bg: 'bg-emerald-400/20',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
          dot: 'bg-emerald-400',
          label: 'Reusable IC / Die',
        };
      case 'connector':
        return {
          border: 'border-purple-400',
          bg: 'bg-purple-400/20',
          text: 'text-purple-300',
          badge: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
          dot: 'bg-purple-400',
          label: 'Connector / Gold Pins',
        };
      case 'passive_bulk':
      default:
        return {
          border: 'border-blue-400',
          bg: 'bg-blue-400/20',
          text: 'text-blue-300',
          badge: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
          dot: 'bg-blue-400',
          label: 'Bulk Cu / Aluminum',
        };
    }
  };

  const getRenderFilterClass = () => {
    if (renderMode === 'xray') {
      return 'brightness-125 contrast-175 saturate-200 hue-rotate-180 invert';
    }
    if (renderMode === 'uv') {
      return 'contrast-200 brightness-90 saturate-150 hue-rotate-270';
    }
    return '';
  };

  return (
    <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 z-20">
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Layers:
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All ({components.length})
          </button>
          <button
            onClick={() => setActiveFilter('precious_metal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'precious_metal'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Precious Metals</span>
          </button>
          <button
            onClick={() => setActiveFilter('hazardous')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'hazardous'
                ? 'bg-red-500/20 border border-red-500/40 text-red-300 font-semibold'
                : 'text-slate-400 hover:text-red-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Hazardous</span>
          </button>
          <button
            onClick={() => setActiveFilter('reusable_ic')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'reusable_ic'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Reusable ICs</span>
          </button>
          <button
            onClick={() => setActiveFilter('passive_bulk')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'passive_bulk'
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold'
                : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Bulk Metals</span>
          </button>
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Diagnostic Shader Mode */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setRenderMode('normal')}
              title="Standard RGB Optical View"
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                renderMode === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => setRenderMode('xray')}
              title="X-Ray Metal Density Diagnostic Shader"
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                renderMode === 'xray' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              X-Ray Cu
            </button>
            <button
              onClick={() => setRenderMode('uv')}
              title="Fluorescent Toxic Contaminant Shader"
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                renderMode === 'uv' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              UV Hazard
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 px-1.5 min-w-[3rem] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors border-l border-slate-800"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Board Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative w-full h-[520px] bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-${
          isDragging ? 'grabbing' : 'grab'
        }`}
      >
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        {/* Scaled & Panned Canvas Area */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          {/* Main PCB Image */}
          <img
            src={imageUrl}
            alt={boardName}
            draggable={false}
            className={`max-w-[850px] max-h-[480px] w-auto h-auto rounded-lg shadow-2xl transition-all duration-300 pointer-events-none select-none object-contain ${getRenderFilterClass()}`}
          />

          {/* Interactive Bounding Box Overlays */}
          <div className="absolute inset-0 pointer-events-auto">
            {filteredComponents.map((comp) => {
              const [ymin, xmin, ymax, xmax] = comp.box;
              const top = `${ymin}%`;
              const left = `${xmin}%`;
              const width = `${xmax - xmin}%`;
              const height = `${ymax - ymin}%`;

              const isSelected = selectedComponent?.id === comp.id;
              const isHovered = hoveredComponent?.id === comp.id;
              const theme = getCategoryTheme(comp.category);

              return (
                <div
                  key={comp.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(isSelected ? null : comp);
                  }}
                  onMouseEnter={() => setHoveredComponent(comp)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  style={{ top, left, width, height }}
                  className={`absolute cursor-pointer transition-all duration-150 rounded border-2 ${
                    theme.border
                  } ${
                    isSelected
                      ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 bg-cyan-500/20 z-30 scale-[1.02]'
                      : isHovered
                      ? `${theme.bg} z-20 shadow-lg scale-[1.01]`
                      : 'bg-transparent hover:bg-slate-500/10 z-10'
                  } ${comp.category === 'precious_metal' ? 'glow-precious' : ''}`}
                >
                  {/* Pin tag anchor */}
                  <div
                    className={`absolute -top-3.5 -left-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-tight shadow-md ${
                      theme.badge
                    } ${isSelected ? 'scale-110 ring-1 ring-cyan-400' : ''}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
                    <span className="truncate max-w-[120px]">{comp.name.split(' ')[0]}</span>
                  </div>

                  {/* Corner Crosshairs */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white pointer-events-none"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white pointer-events-none"></span>
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white pointer-events-none"></span>
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white pointer-events-none"></span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover Floating HUD Card */}
        {hoveredComponent && !selectedComponent && (
          <div className="absolute bottom-4 left-4 z-30 pointer-events-none max-w-sm bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md transition-all">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  getCategoryTheme(hoveredComponent.category).badge
                }`}
              >
                {getCategoryTheme(hoveredComponent.category).label}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {Math.round(hoveredComponent.confidence * 100)}% Confidence
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-0.5">{hoveredComponent.name}</h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mb-2">{hoveredComponent.description}</p>
            <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800 pt-1.5 text-slate-300">
              <span>Value: <strong className="text-amber-400">₹{hoveredComponent.estimatedValueINR.toLocaleString()}</strong></span>
              <span className="text-slate-400">Click to inspect</span>
            </div>
          </div>
        )}

        {/* Viewport Guidance Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none text-[11px] font-mono text-slate-400 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Click component to open deep metallurgical profile</span>
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-300 font-medium">Board: {boardName}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Visible Components: <strong className="text-slate-200">{filteredComponents.length}</strong></span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Gold / Ta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Hazardous
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ICs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Bulk Cu/Al
          </span>
        </div>
      </div>
    </div>
  );
};
