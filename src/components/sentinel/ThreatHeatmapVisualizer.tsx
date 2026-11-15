import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useEngine } from '../../context/EngineContext';
import { GeoThreatHotspot, ThreatSeverity } from '../../types';
import { WORLD_GEOJSON } from '../../data/worldGeoData';
import { 
  Globe, 
  ShieldAlert, 
  Zap, 
  Filter, 
  Play, 
  Pause, 
  Radio, 
  MapPin, 
  Activity, 
  X, 
  Server,
  Layers,
  ArrowUpRight,
  Eye
} from 'lucide-react';

interface Gateway {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
}

interface ThreatMeta {
  label: string;
  category: string;
  description: string;
  severityColor: string;
}

const THREAT_META: Record<string, ThreatMeta> = {
  SQL_PAYLOAD: {
    label: 'SQL Injection & AST Bypass',
    category: 'Application Security / WAF',
    description: 'Hostile SQL syntax, union extractions, or destructive query sequences targeting Xero journal tables',
    severityColor: 'text-purple-400'
  },
  IBAN_DRIFT_FRAUD: {
    label: 'IBAN Routing Drift (BEC Fraud)',
    category: 'Financial Ledger Fraud',
    description: 'Vendor banking destination deviated from established ledger chart to offshore shell account',
    severityColor: 'text-amber-400'
  },
  SANCTION_MATCH: {
    label: 'OFAC / Sanctions Screening Alert',
    category: 'Regulatory AML Compliance',
    description: 'High-confidence fuzzy match against Specially Designated Nationals List / Grey-list entities',
    severityColor: 'text-rose-400'
  },
  SCHEMA_CORRUPTION: {
    label: 'Schema Invariant Violation',
    category: 'Data Integrity & Parser Fuzzing',
    description: 'Malformed XML/JSON payloads with type coercion or boundary buffer fuzzing',
    severityColor: 'text-cyan-400'
  },
  ANOMALOUS_VELOCITY: {
    label: 'Anomalous Velocity Burst',
    category: 'Botnet Rate Limiting',
    description: 'High-frequency webhook replay or automated crawler storm hitting public API endpoints',
    severityColor: 'text-blue-400'
  },
  DUPLICATE_PAYMENT: {
    label: 'Duplicate Voucher Collision',
    category: 'Financial Accounting Guard',
    description: 'Identical voucher hash or invoice collision across short interval',
    severityColor: 'text-emerald-400'
  }
};

const GATEWAYS: Gateway[] = [
  { id: 'gw-use1', name: 'US East Gateway', region: 'us-east-1', lat: 39.04, lng: -77.48 },
  { id: 'gw-euw1', name: 'EU West Gateway', region: 'eu-west-1', lat: 53.34, lng: -6.26 },
  { id: 'gw-apse1', name: 'APAC Gateway', region: 'ap-southeast-1', lat: 1.35, lng: 103.82 }
];

export const ThreatHeatmapVisualizer: React.FC = () => {
  const { 
    geoHotspots, 
    isLiveAttackFeedActive, 
    toggleLiveAttackFeed, 
    triggerGlobalThreatWave 
  } = useEngine();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedHotspot, setSelectedHotspot] = useState<GeoThreatHotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<GeoThreatHotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; alignLeft?: boolean; showBelow?: boolean } | null>(null);

  // Filters
  const [vectorFilter, setVectorFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showArcs, setShowArcs] = useState<boolean>(true);

  // Filtered hotspots
  const filteredHotspots = useMemo(() => {
    return geoHotspots.filter(h => {
      const matchVector = vectorFilter === 'all' || h.primaryVector === vectorFilter || h.threatTypes.includes(vectorFilter);
      const matchSeverity = severityFilter === 'all' || h.severity === severityFilter;
      return matchVector && matchSeverity;
    });
  }, [geoHotspots, vectorFilter, severityFilter]);

  // Total attacks in view
  const totalAttacksInView = useMemo(() => {
    return filteredHotspots.reduce((acc, h) => acc + h.threatCount, 0);
  }, [filteredHotspots]);

  // Find nearest gateway to an origin
  const getNearestGateway = (lat: number, lng: number): Gateway => {
    let nearest = GATEWAYS[0];
    let minDistance = Infinity;
    GATEWAYS.forEach(gw => {
      const d = Math.hypot(gw.lat - lat, gw.lng - lng);
      if (d < minDistance) {
        minDistance = d;
        nearest = gw;
      }
    });
    return nearest;
  };

  // Render D3 Map
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 960;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set viewBox for responsive scaling
    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    // Defs for gradients, filters, and patterns
    const defs = svg.append('defs');

    // Blur filter for thermal heat diffusion
    const blurFilter = defs.append('filter')
      .attr('id', 'heat-blur')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    blurFilter.append('feGaussianBlur')
      .attr('stdDeviation', 6)
      .attr('result', 'blur');

    // Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'neon-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Radial Gradients for Heatmap Plumes
    const createRadialGradient = (id: string, color: string) => {
      const grad = defs.append('radialGradient')
        .attr('id', id)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.9);
      grad.append('stop').attr('offset', '35%').attr('stop-color', color).attr('stop-opacity', 0.55);
      grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.2);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
    };

    createRadialGradient('heat-critical', '#f43f5e'); // Rose 500
    createRadialGradient('heat-high', '#f59e0b');     // Amber 500
    createRadialGradient('heat-medium', '#06b6d4');   // Cyan 500
    createRadialGradient('heat-gateway', '#10b981');  // Emerald 500

    // Arc gradient
    const arcGrad = defs.append('linearGradient')
      .attr('id', 'arc-grad')
      .attr('gradientUnits', 'userSpaceOnUse');
    arcGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.8);
    arcGrad.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.2);

    // Setup Projection (Natural Earth projection)
    const projection = d3.geoNaturalEarth1()
      .scale(155)
      .translate([width / 2, height / 2 + 10]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Map background container
    const gMap = svg.append('g').attr('class', 'map-background');

    // Graticules (Subtle longitudinal/latitudinal grid)
    const graticule = d3.geoGraticule().step([20, 20]);
    gMap.append('path')
      .datum(graticule)
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(51, 65, 85, 0.25)')
      .attr('stroke-width', 0.6)
      .attr('stroke-dasharray', '2 4');

    // Landmass Polygons
    gMap.append('g')
      .attr('class', 'landmasses')
      .selectAll('path')
      .data(WORLD_GEOJSON.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', '#1e293b')
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.8)
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.95);

    // Attack Arcs Layer
    const gArcs = svg.append('g').attr('class', 'attack-arcs');

    if (showArcs) {
      filteredHotspots.forEach(hotspot => {
        const source = projection([hotspot.longitude, hotspot.latitude]);
        const nearestGw = getNearestGateway(hotspot.latitude, hotspot.longitude);
        const target = projection([nearestGw.lng, nearestGw.lat]);

        if (source && target) {
          const [sx, sy] = source;
          const [tx, ty] = target;

          // Midpoint with curve offset for arc curvature
          const mx = (sx + tx) / 2;
          const my = Math.min(sy, ty) - Math.abs(sx - tx) * 0.22 - 20;

          const arcPath = `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`;

          // Ambient arc line
          gArcs.append('path')
            .attr('d', arcPath)
            .attr('fill', 'none')
            .attr('stroke', hotspot.severity === 'critical' ? 'rgba(244, 63, 94, 0.35)' : hotspot.severity === 'high' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(6, 182, 212, 0.25)')
            .attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '4 4');

          // Flowing particle dot moving along path
          const pingDot = gArcs.append('circle')
            .attr('r', 2)
            .attr('fill', hotspot.severity === 'critical' ? '#f43f5e' : '#f59e0b')
            .attr('filter', 'url(#neon-glow)');

          // Animate particle along arc
          const animateParticle = () => {
            pingDot
              .attr('opacity', 1)
              .transition()
              .duration(1800 + Math.random() * 1200)
              .ease(d3.easeLinear)
              .attrTween('transform', () => {
                const pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathNode.setAttribute('d', arcPath);
                const l = pathNode.getTotalLength();
                return (t: number) => {
                  const p = pathNode.getPointAtLength(t * l);
                  return `translate(${p.x}, ${p.y})`;
                };
              })
              .on('end', animateParticle);
          };

          animateParticle();
        }
      });
    }

    // Heatmap Layer (Thermal diffusion halos)
    const gHeat = svg.append('g').attr('class', 'heat-layer');

    filteredHotspots.forEach(hotspot => {
      const coords = projection([hotspot.longitude, hotspot.latitude]);
      if (!coords) return;
      const [x, y] = coords;

      // Scale radius by threat count
      const radius = Math.min(48, Math.max(18, Math.sqrt(hotspot.threatCount) * 4.5));
      const gradId = hotspot.severity === 'critical' 
        ? 'heat-critical' 
        : hotspot.severity === 'high' 
          ? 'heat-high' 
          : 'heat-medium';

      // Outer thermal plume
      gHeat.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .attr('fill', `url(#${gradId})`)
        .attr('filter', 'url(#heat-blur)')
        .attr('opacity', 0.85);
    });

    // Hotspot Nodes & Pulse Waves Layer
    const gNodes = svg.append('g').attr('class', 'hotspot-nodes');

    filteredHotspots.forEach(hotspot => {
      const coords = projection([hotspot.longitude, hotspot.latitude]);
      if (!coords) return;
      const [x, y] = coords;

      const nodeGroup = gNodes.append('g')
        .attr('class', 'hotspot-group')
        .attr('cursor', 'pointer')
        .on('mouseenter', function(event) {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const posX = event.clientX - rect.left;
            const posY = event.clientY - rect.top;
            setTooltipPos({
              x: posX,
              y: posY,
              alignLeft: posX > rect.width - 280,
              showBelow: posY < 170
            });
          }
          setHoveredHotspot(hotspot);

          // Raise hovered point
          d3.select(this).raise();

          // Expand inner circle
          d3.select(this).select('.inner-circle')
            .transition()
            .duration(160)
            .attr('r', 7.5)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2);

          // Dim other nodes
          gNodes.selectAll('.hotspot-group')
            .filter((_, idx, groups) => groups[idx] !== this)
            .transition()
            .duration(160)
            .attr('opacity', 0.4);
        })
        .on('mousemove', function(event) {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const posX = event.clientX - rect.left;
            const posY = event.clientY - rect.top;
            setTooltipPos({
              x: posX,
              y: posY,
              alignLeft: posX > rect.width - 280,
              showBelow: posY < 170
            });
          }
        })
        .on('mouseleave', function() {
          setHoveredHotspot(null);

          // Restore inner circle
          d3.select(this).select('.inner-circle')
            .transition()
            .duration(160)
            .attr('r', 5)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.2);

          // Restore other nodes
          gNodes.selectAll('.hotspot-group')
            .transition()
            .duration(160)
            .attr('opacity', 1);
        })
        .on('click', () => {
          setSelectedHotspot(hotspot);
        });

      const color = hotspot.severity === 'critical' 
        ? '#f43f5e' 
        : hotspot.severity === 'high' 
          ? '#f59e0b' 
          : '#06b6d4';

      // Transparent expanded hitbox for effortless cursor targeting
      nodeGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 16)
        .attr('fill', 'transparent')
        .attr('pointer-events', 'all');

      // Radiating radar pulse wave
      const pulseRing = nodeGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 6)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
        .attr('pointer-events', 'none');

      const repeatPulse = () => {
        pulseRing
          .attr('r', 6)
          .attr('opacity', 0.9)
          .transition()
          .duration(2000 + Math.random() * 800)
          .ease(d3.easeCubicOut)
          .attr('r', 24)
          .attr('opacity', 0)
          .on('end', repeatPulse);
      };
      repeatPulse();

      // Inner intense circle with marker class
      nodeGroup.append('circle')
        .attr('class', 'inner-circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.2)
        .attr('filter', 'url(#neon-glow)')
        .attr('pointer-events', 'none');

      // Micro Label (City name)
      nodeGroup.append('text')
        .attr('x', x)
        .attr('y', y - 9)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e2e8f0')
        .attr('font-size', '9px')
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .attr('font-weight', '600')
        .attr('pointer-events', 'none')
        .text(hotspot.city);
    });

    // ZeroLabz Cloud Gateways Layer
    const gGateways = svg.append('g').attr('class', 'cloud-gateways');

    GATEWAYS.forEach(gw => {
      const coords = projection([gw.lng, gw.lat]);
      if (!coords) return;
      const [x, y] = coords;

      const gwGroup = gGateways.append('g')
        .attr('class', 'gateway-node')
        .attr('cursor', 'help');

      // Gateway outer beacon
      gwGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 16)
        .attr('fill', 'url(#heat-gateway)')
        .attr('opacity', 0.4);

      // Gateway Diamond / Square indicator
      gwGroup.append('rect')
        .attr('x', x - 4)
        .attr('y', y - 4)
        .attr('width', 8)
        .attr('height', 8)
        .attr('fill', '#10b981')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.2)
        .attr('transform', `rotate(45, ${x}, ${y})`)
        .attr('filter', 'url(#neon-glow)');

      // Gateway Label
      gwGroup.append('text')
        .attr('x', x)
        .attr('y', y + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#34d399')
        .attr('font-size', '8.5px')
        .attr('font-family', 'JetBrains Mono, monospace')
        .attr('font-weight', '500')
        .text(`[${gw.region}]`);
    });

  }, [filteredHotspots, showArcs]);

  return (
    <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4 relative">
      {/* Visualizer Top Bar & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Global Threat Detection Heatmap & Geolocation Mesh
            </h2>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time D3 spatial telemetry projecting inbound hostile payloads, BEC routing deviations, and OFAC screening alerts
          </p>
        </div>

        {/* Action Controls & Stream Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Stream Toggle */}
          <button
            onClick={toggleLiveAttackFeed}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
              isLiveAttackFeedActive
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/40'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isLiveAttackFeedActive ? (
              <>
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Live Stream: Active</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-400" />
                <span>Live Stream: Paused</span>
              </>
            )}
          </button>

          {/* Botnet Surge Simulator Button */}
          <button
            onClick={triggerGlobalThreatWave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Global Botnet Surge</span>
          </button>

          {/* Toggle Trajectory Arcs */}
          <button
            onClick={() => setShowArcs(!showArcs)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
              showArcs 
                ? 'bg-cyan-950/50 border-cyan-800/70 text-cyan-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            Arcs: {showArcs ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Vector Filter:</span>
          </span>
          <select
            value={vectorFilter}
            onChange={(e) => setVectorFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Threat Vectors</option>
            <option value="SQL_PAYLOAD">SQL Injection (AST Invariant)</option>
            <option value="IBAN_DRIFT_FRAUD">IBAN Routing Drift (BEC)</option>
            <option value="SANCTION_MATCH">OFAC / Sanctions Screening</option>
            <option value="ANOMALOUS_VELOCITY">Velocity & Rate Burst</option>
            <option value="SCHEMA_CORRUPTION">Schema Corruption / Fuzzing</option>
            <option value="DUPLICATE_PAYMENT">Duplicate Voucher Collision</option>
          </select>

          <span className="text-slate-400 ml-2">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High & Critical</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Active Nodes: <strong className="text-white tabular-nums">{filteredHotspots.length}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Interceptions: <strong className="text-rose-400 tabular-nums">{totalAttacksInView}</strong></span>
        </div>
      </div>

      {/* D3 Map Container */}
      <div 
        ref={containerRef}
        className="w-full bg-slate-950/90 border border-slate-800/80 rounded-xl relative overflow-hidden shadow-inner"
        style={{ minHeight: '380px' }}
      >
        <svg 
          ref={svgRef} 
          className="w-full h-auto block select-none"
        />

        {/* Heatmap Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-[11px] space-y-1.5 shadow-lg">
          <div className="text-slate-300 font-semibold flex items-center justify-between gap-3">
            <span>Thermal Threat Density</span>
            <span className="text-[10px] text-slate-400 font-mono">D3 Projection</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500" />
            <span className="text-[10px] text-slate-400 font-mono">Low → Critical</span>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rotate-45 bg-emerald-400" />
              <span>ZeroLabz Edge</span>
            </div>
          </div>
        </div>

        {/* Interactive Floating Tooltip */}
        {hoveredHotspot && tooltipPos && (() => {
          const nearestGw = getNearestGateway(hoveredHotspot.latitude, hoveredHotspot.longitude);
          const meta = THREAT_META[hoveredHotspot.primaryVector] || {
            label: hoveredHotspot.primaryVector.replace(/_/g, ' '),
            category: 'Security Vector',
            description: 'Deterministic security anomaly detected by Sentinel invariant engine.',
            severityColor: 'text-amber-400'
          };
          const streamShare = totalAttacksInView > 0 
            ? ((hoveredHotspot.threatCount / totalAttacksInView) * 100).toFixed(1) 
            : '0.0';

          return (
            <div 
              className={`absolute z-30 pointer-events-none transition-all duration-75 ${
                tooltipPos.alignLeft 
                  ? '-translate-x-full -ml-3' 
                  : tooltipPos.x < 170 
                    ? 'translate-x-0 ml-3' 
                    : '-translate-x-1/2'
              } ${
                tooltipPos.showBelow 
                  ? 'translate-y-4' 
                  : '-translate-y-full -mt-3'
              }`}
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-xl p-3.5 shadow-2xl text-xs space-y-2.5 w-72 sm:w-80">
                {/* Header: City & Geographic Identification */}
                <div className="pb-2 border-b border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-bold text-white text-xs truncate">
                        {hoveredHotspot.city}, {hoveredHotspot.country}
                      </span>
                      <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700 shrink-0">
                        {hoveredHotspot.countryCode}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      hoveredHotspot.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : hoveredHotspot.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {hoveredHotspot.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      {Math.abs(hoveredHotspot.latitude).toFixed(2)}°{hoveredHotspot.latitude >= 0 ? 'N' : 'S'}, {Math.abs(hoveredHotspot.longitude).toFixed(2)}°{hoveredHotspot.longitude >= 0 ? 'E' : 'W'}
                    </span>
                    <span className="text-emerald-400">
                      Edge: {nearestGw.region}
                    </span>
                  </div>
                </div>

                {/* Primary Threat-Type Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-200">{meta.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{meta.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {meta.description}
                  </p>
                </div>

                {/* Active Threat Types from this City */}
                <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Observed Threat Vectors in this City:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hoveredHotspot.threatTypes.map((t, idx) => (
                      <span 
                        key={idx}
                        className="px-1.5 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded text-[10px] font-mono"
                      >
                        {t.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attack Telemetry & Mitigation */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px]">Intercepted:</span>
                    <div className="font-mono text-white font-bold tabular-nums">
                      {hoveredHotspot.threatCount} <span className="text-[10px] font-normal text-slate-400">({streamShare}%)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Sentinel Invariant:</span>
                    <div className="font-semibold text-rose-400 text-[10px] truncate">
                      {hoveredHotspot.severity === 'critical' ? 'BLOCKED AT WAF' : 'QUARANTINED'}
                    </div>
                  </div>
                </div>

                {/* Latest Captured Payload Signature */}
                {hoveredHotspot.recentEvents[0] && (
                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Latest Intercepted Event:</span>
                      <span className="font-mono text-cyan-400">{hoveredHotspot.sourceIp}</span>
                    </div>
                    <div className="text-slate-200 italic line-clamp-1">
                      "{hoveredHotspot.recentEvents[0].description}"
                    </div>
                  </div>
                )}

                {/* Interactive Click Action Hint */}
                <div className="text-[10px] text-cyan-400 text-center font-medium pt-1 border-t border-slate-800/80">
                  Click point to lock & inspect raw packet tokens →
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Selected Hotspot Deep-Dive Drawer */}
      {selectedHotspot && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 transition-all animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold text-white">
                Origin Drilldown: {selectedHotspot.city}, {selectedHotspot.country} [{selectedHotspot.countryCode}]
              </h3>
              <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                selectedHotspot.severity === 'critical' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {selectedHotspot.severity}
              </span>
            </div>

            <button 
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
              <span className="text-[11px] text-slate-400">Total Hostile Packets</span>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {selectedHotspot.threatCount}
              </div>
              <span className="text-[10px] text-rose-400 font-mono">100% Intercepted</span>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
              <span className="text-[11px] text-slate-400">Coordinates & Origin</span>
              <div className="text-xs font-mono text-cyan-300 mt-1">
                Lat: {selectedHotspot.latitude.toFixed(2)}, Lng: {selectedHotspot.longitude.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">IP: {selectedHotspot.sourceIp}</span>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
              <span className="text-[11px] text-slate-400">Enforced Sentinel Action</span>
              <div className="text-xs font-semibold text-emerald-400 mt-1">
                Auto-Quarantine & WAF Block
              </div>
              <span className="text-[10px] text-slate-400">Zero Ledger Contamination</span>
            </div>
          </div>

          {/* Recent Intercepted Events Table */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Recent Hostile Packets from this Origin:
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-1.5 px-2">Event ID</th>
                    <th className="py-1.5 px-2">Threat Vector</th>
                    <th className="py-1.5 px-2">Source IP</th>
                    <th className="py-1.5 px-2">Description</th>
                    <th className="py-1.5 px-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {selectedHotspot.recentEvents.map(evt => (
                    <tr key={evt.id} className="hover:bg-slate-900/60">
                      <td className="py-1.5 px-2 font-mono text-cyan-400 text-[11px]">
                        {evt.id}
                      </td>
                      <td className="py-1.5 px-2 font-mono text-[11px] text-amber-300">
                        {evt.type}
                      </td>
                      <td className="py-1.5 px-2 font-mono text-[11px] text-slate-300">
                        {evt.ip}
                      </td>
                      <td className="py-1.5 px-2 text-slate-300 text-[11px] max-w-sm truncate">
                        {evt.description}
                      </td>
                      <td className="py-1.5 px-2 font-mono text-slate-400 text-[10px] text-right whitespace-nowrap">
                        {evt.timestamp.slice(11, 19)} UTC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Top Attack Origins Leaderboard */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-300 mb-2.5">
          Top Geographic Threat Sources Intercepted by Sentinel
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {geoHotspots
            .slice()
            .sort((a, b) => b.threatCount - a.threatCount)
            .slice(0, 5)
            .map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedHotspot(item)}
                className="p-2.5 text-left bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white truncate">{item.city}</span>
                  <span className="font-mono text-rose-400 font-bold tabular-nums text-[11px]">
                    {item.threatCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{item.countryCode}</span>
                  <span className="text-cyan-300 truncate max-w-[80px]">{item.primaryVector}</span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
