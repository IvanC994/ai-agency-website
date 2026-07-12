import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

/* ── Slider sub-component ────────────────────────────────────────────── */

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (v: number) => void;
}

const Slider = ({ label, value, min, max, step, prefix = '', onChange }: SliderProps) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700 leading-tight">{label}</span>
        <span className="text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
          {prefix}{value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`
        }}
      />
      <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
        <span>{prefix}{min.toLocaleString()}</span>
        <span>{prefix}{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

/* ── Result card sub-component ───────────────────────────────────────── */

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const ResultCard = ({ label, value, highlight = false }: ResultCardProps) => (
  <div
    className={`flex-1 rounded-2xl px-6 py-5 flex flex-col justify-center border transition-colors ${
      highlight
        ? 'bg-sky-50 border-sky-100'
        : 'bg-slate-50 border-slate-100'
    }`}
  >
    <p
      className={`text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${
        highlight ? 'text-sky-600' : 'text-slate-400'
      }`}
    >
      {label}
    </p>
    <p
      className={`text-2xl font-bold tabular-nums leading-none ${
        highlight ? 'text-sky-700' : 'text-slate-900'
      }`}
    >
      {value}
    </p>
  </div>
);

/* ── Main component ──────────────────────────────────────────────────── */

export const ROICalculator = () => {
  const { dict } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const roi = dict.roi;

  const [inquiries, setInquiries] = useState(300);
  const [avgValue, setAvgValue]   = useState(150);
  const [adminHours, setAdminHours] = useState(10);

  /* Calculations */
  const recoveredLeads = Math.round(inquiries * 0.25);
  const addedRevenue   = recoveredLeads * avgValue * 0.2;
  const hoursSaved     = (adminHours * 0.7).toFixed(1);

  const fmtCurrency = (n: number) =>
    `${roi.currency}${Math.round(n).toLocaleString()}`;

  return (
    <section
      id="roi"
      className="py-24 bg-slate-50 scroll-mt-20"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          style={revealStyle(visible, 0)}
        >
          {/* ── Header ── */}
          <div className="px-8 sm:px-10 pt-10 pb-8 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">
              {roi.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-snug">
              {roi.heading}
            </h2>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              {roi.description}
            </p>
          </div>

          {/* ── Two-column body ── */}
          <div className="px-8 sm:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left: sliders */}
            <div className="space-y-8">
              <Slider
                label={roi.sliders.inquiries}
                value={inquiries}
                min={50}
                max={1000}
                step={10}
                onChange={setInquiries}
              />
              <Slider
                label={roi.sliders.value}
                value={avgValue}
                min={20}
                max={1000}
                step={10}
                prefix={roi.currency}
                onChange={setAvgValue}
              />
              <Slider
                label={roi.sliders.hours}
                value={adminHours}
                min={1}
                max={40}
                step={1}
                onChange={setAdminHours}
              />
            </div>

            {/* Right: result cards */}
            <div className="flex flex-col gap-4">
              <ResultCard
                label={roi.results.leads}
                value={recoveredLeads.toLocaleString()}
              />
              <ResultCard
                label={roi.results.revenue}
                value={fmtCurrency(addedRevenue)}
                highlight
              />
              <ResultCard
                label={roi.results.hours}
                value={`${hoursSaved} hrs`}
              />
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div className="px-8 sm:px-10 pb-8 -mt-2">
            <p className="text-xs text-slate-400 leading-relaxed">{roi.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
