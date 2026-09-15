function buildPath(closes: number[], width: number, height: number): string {
  if (closes.length < 2) return "";
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;
  const stepX = width / (closes.length - 1);

  return closes
    .map((close, i) => {
      const x = i * stepX;
      const y = height - ((close - min) / span) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function Sparkline({
  closes,
  positive,
}: {
  closes: number[];
  positive: boolean;
}) {
  if (closes.length < 2) {
    return <div className="h-12 w-full rounded bg-surface-2" />;
  }

  const path = buildPath(closes, 240, 48);
  const color = positive ? "#34d399" : "#f87171";

  return (
    <svg
      viewBox="0 0 240 48"
      className="h-12 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
