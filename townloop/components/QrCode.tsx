"use client";

import { useMemo } from "react";
import QRCode from "qrcode";

/**
 * Renders a real, scannable QR code as SVG (no canvas, no images) with the
 * TownLoop rings in the middle. High error correction keeps it readable
 * with the logo on top.
 */
export function QrCode({ value, size = 220, label }: { value: string; size?: number; label: string }) {
  const { path, n } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: "H" });
    const count = qr.modules.size;
    const data = qr.modules.data;
    let d = "";
    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        if (data[y * count + x]) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { path: d, n: count };
  }, [value]);

  const box = n * 0.26;
  const c = n / 2;

  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label={label}>
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#FFFFFF" />
      <path d={path} fill="#1A1A1A" shapeRendering="crispEdges" />
      <rect x={c - box / 2} y={c - box / 2} width={box} height={box} rx={box * 0.2} fill="#FFFFFF" />
      <g fill="none" strokeWidth={box * 0.09}>
        <circle cx={c - box * 0.13} cy={c} r={box * 0.24} stroke="#1A1A1A" />
        <circle cx={c + box * 0.13} cy={c} r={box * 0.24} stroke="#F26B2E" />
      </g>
    </svg>
  );
}
