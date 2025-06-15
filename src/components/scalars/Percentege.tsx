import { useEffect, useState } from "react";
import { TSCalarWidgetSettings } from "../../types";

const cleanPercentage = (percentage: number) => {
  const isNaN = !Number.isFinite(+percentage);
  const isTooHigh = percentage > 100;
  return isNaN ? 0 : isTooHigh ? 100 : +percentage;
};
const Circle = ({
  color,
  percentage,
}: {
  color: string;
  percentage: number;
}) => {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100;

  // Start with a strokeDashoffset that represents 0%
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(percentage ? strokePct : 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [percentage, strokePct]);

  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={percentage > 0 ? color : ""}
      strokeWidth={"1.4rem"}
      strokeDasharray={circ}
      strokeDashoffset={offset}
      style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
    ></circle>
  );
};

const Text = ({ percentage }: { percentage: number }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.5em"}
      fontFamily="Roboto, monospace"
      fill="#b3b3b3"
    >
      {percentage.toFixed(2)}%
    </text>
  );
};

const Percentage = ({
  label,
  value,
  settings,
}: {
  value: number;
  label: string;
  settings: TSCalarWidgetSettings;
}) => {
  const absolutePercantage = cleanPercentage(Math.abs(value));
  const pct = cleanPercentage(value);
  const color = settings.showPositiveNegativeColor
    ? pct > 0
      ? "#4cff4c"
      : "#ff5252"
    : "#ff8c00";
  return (
    <svg className="w-full h-full" viewBox="0 0 200 200">
      <g
        className=" transition-all duration-500"
        transform={`rotate(-90 ${"100 100"})`}
      >
        <Circle percentage={absolutePercantage} color={color} />
        <Circle color={color} percentage={absolutePercantage} />
      </g>
      <Text percentage={pct} />
      <text
        x="50%"
        y="62%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={"0.8em"}
        fontFamily="Roboto, monospace"
        fill="#b3b3b3"
      >
        {label}
      </text>
    </svg>
  );
};

export { Percentage };
