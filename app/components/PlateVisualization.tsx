import type { PlateAllocation } from "../lib/calculate-plates";

const MAX_DIAMETER = 450;
const MAX_HEIGHT = 108;
const SCALE = MAX_HEIGHT / MAX_DIAMETER;
const INNER_GAP = 28;
const OUTER_GAP = 10;
const PLATE_GAP = 2;

const PLATE_DIAMETER: Record<number, number> = {
  25: 450,
  20: 450,
  15: 400,
  10: 325,
  5: 230,
  2.5: 190,
  2: 160,
  1.25: 130,
  1: 110,
  0.5: 90,
};

const PLATE_STYLE: Record<
  number,
  { fill: string; text: string; stroke?: string }
> = {
  25: { fill: "#dc2626", text: "#ffffff" },
  20: { fill: "#2563eb", text: "#ffffff" },
  15: { fill: "#facc15", text: "#1f2937" },
  10: { fill: "#16a34a", text: "#ffffff" },
  5: { fill: "#f9fafb", text: "#374151", stroke: "#d1d5db" },
  2.5: { fill: "#ef4444", text: "#ffffff" },
  2: { fill: "#6b7280", text: "#ffffff" },
  1.25: { fill: "#6b7280", text: "#ffffff" },
  1: { fill: "#6b7280", text: "#ffffff" },
  0.5: { fill: "#6b7280", text: "#ffffff" },
};

const FALLBACK_STYLE = { fill: "#6b7280", text: "#ffffff" };

function plateHeight(weight: number) {
  return (PLATE_DIAMETER[weight] ?? 90) * SCALE;
}

function plateWidth(weight: number) {
  return 10 + (weight / 25) * 14;
}

interface Props {
  allocations: PlateAllocation[];
}

export function PlateVisualization({ allocations }: Props) {
  const sequence: number[] = [];
  for (const { weight, countPerSide } of allocations) {
    for (let i = 0; i < countPerSide; i++) sequence.push(weight);
  }

  if (sequence.length === 0) return null;

  const perSideWidth = sequence.reduce(
    (sum, weight) => sum + plateWidth(weight) + PLATE_GAP,
    -PLATE_GAP
  );

  const width = INNER_GAP + perSideWidth + OUTER_GAP;
  const height = MAX_HEIGHT + 20;
  const centerY = height / 2;

  const renderPlate = (weight: number, x: number, key: string) => {
    const w = plateWidth(weight);
    const h = plateHeight(weight);
    const y = centerY - h / 2;
    const style = PLATE_STYLE[weight] ?? FALLBACK_STYLE;
    const fontSize = Math.min(11, h * 0.42, w * 1.2);

    return (
      <g key={key}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={3}
          fill={style.fill}
          stroke={style.stroke ?? "rgba(0,0,0,0.08)"}
          strokeWidth={1}
        />
        <text
          x={x + w / 2}
          y={centerY}
          fill={style.text}
          fontSize={fontSize}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90 ${x + w / 2} ${centerY})`}
        >
          {weight}
        </text>
      </g>
    );
  };

  const plates: React.ReactNode[] = [];
  let plateX = INNER_GAP;
  for (let i = 0; i < sequence.length; i++) {
    plates.push(renderPlate(sequence[i], plateX, `p-${i}`));
    plateX += plateWidth(sequence[i]) + PLATE_GAP;
  }

  const sleeveEnd = INNER_GAP + perSideWidth;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-28 w-auto max-w-full"
      role="img"
      aria-label="Plates loaded on one side of the barbell"
    >
      <rect
        x={sleeveEnd}
        y={centerY - 4}
        width={OUTER_GAP + 2}
        height={8}
        rx={4}
        fill="#d1d5db"
      />
      <rect
        x={0}
        y={centerY - 7}
        width={INNER_GAP}
        height={14}
        rx={4}
        fill="#9ca3af"
      />
      {plates}
    </svg>
  );
}
