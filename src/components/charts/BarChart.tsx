import { TChartSettings } from "../../types";
import {
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { formatTick, stringToColour } from "./utils";

type TBarChartProps = {
  data: object[];
  settings: TChartSettings;
  aspect: number;
};

const BarChart = ({ data, settings, aspect }: TBarChartProps) => {
  return (
    <ResponsiveContainer width="99%" aspect={aspect}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 36, bottom: 5 }}>
        {settings.plotKeys?.map((key) => (
          <Bar
            type="monotone"
            dataKey={key}
            stroke={stringToColour(key)}
            fill={stringToColour(key)}
            key={key}
          />
        ))}

        {(settings.verticalGridLines || settings.horizontalGridLines) && (
          <CartesianGrid
            stroke="#b3b3b3"
            vertical={settings.verticalGridLines}
            horizontal={settings.horizontalGridLines}
            strokeDasharray={"3 3"}
          />
        )}
        <XAxis stroke="#b3b3b3" dataKey={settings.xAxisKey} fontSize={"12px"} />
        <YAxis stroke="#b3b3b3" tickFormatter={formatTick} fontSize={"12px"} />
        <Tooltip
          cursor={{ fill: "#42424270" }}
          contentStyle={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            borderRadius: "4px",
          }}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export { BarChart };
