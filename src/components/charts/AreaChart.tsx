import { TChartSettings } from "../../types";
import {
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { formatTick, stringToColour } from "./utils";

type TAreaChartProps = {
  data: object[];
  settings: TChartSettings;
  aspect: number;
};

const AreaChart = ({ data, settings, aspect }: TAreaChartProps) => {
  return (
    <ResponsiveContainer width="99%" aspect={aspect}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 36, bottom: 5, left: 0 }}
      >
        {settings.plotKeys?.map((key) => (
          <Area
            type="monotone"
            dataKey={key}
            stroke={stringToColour(key)}
            fill={stringToColour(key) + "40"}
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
          contentStyle={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            borderRadius: "4px",
          }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export { AreaChart };
