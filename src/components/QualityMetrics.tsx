"use client";

import { useEffect, useRef } from "react";

const metrics = [
  { label: "スタッフ専門性", width: 90, value: "9.0" },
  { label: "施設設備", width: 85, value: "8.5" },
  { label: "母乳サポート", width: 95, value: "9.5" },
  { label: "メンタルケア", width: 80, value: "8.0" },
  { label: "アクセス・利便性", width: 75, value: "7.5" },
];

export default function QualityMetrics() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const fills = root.querySelectorAll<HTMLElement>(".metric-fill");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const targetWidth = el.dataset.width || "0%";
          el.style.width = "0%";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.width = targetWidth;
              el.classList.add("animated");
            });
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    fills.forEach((el) => {
      el.style.width = "0%";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about__metrics" ref={rootRef}>
      <h3 className="about__metrics-title">ケアの質 評価指標</h3>
      {metrics.map((metric) => (
        <div className="metric-item" key={metric.label}>
          <span className="metric-label">{metric.label}</span>
          <div className="metric-bar">
            <div className="metric-fill" data-width={`${metric.width}%`} />
          </div>
          <span className="metric-val">{metric.value}</span>
        </div>
      ))}
    </div>
  );
}
