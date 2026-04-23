"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 2351, prefix: "€", suffix: "", label: "Besparing per maand", sub: "aan gemiste opdrachten" },
  { value: 14, prefix: "", suffix: "u/week", label: "Tijdsbesparing", sub: "minder herhaalvragen" },
  { value: 1, prefix: "<", suffix: " week", label: "Live in", sub: "volledig ingericht" },
  { value: 24, prefix: "", suffix: "/7", label: "Beschikbaarheid", sub: "ook in het weekend" },
];

function Counter({ value, prefix, suffix, active }: { value: number; prefix: string; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, value]);

  return (
    <span>
      {prefix}{count.toLocaleString("nl-NL")}{suffix}
    </span>
  );
}

export default function RoiStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "var(--blue)",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}
        className="roi-grid"
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "32px 28px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} active={active} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.95)", marginBottom: 2 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .roi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .roi-grid > div:nth-child(2) { border-right: none !important; }
          .roi-grid > div:nth-child(1),
          .roi-grid > div:nth-child(2) {
            border-bottom: 1px solid rgba(255,255,255,0.12);
          }
        }
      `}</style>
    </section>
  );
}
