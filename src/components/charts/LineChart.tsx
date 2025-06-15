import { TChartSettings } from "../../types";
import {
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import { formatTick, stringToColour } from "./utils";

type TLineChartProps = {
  data: object[];
  settings: TChartSettings;
  aspect: number;
};

const LineChart = ({ data, settings, aspect }: TLineChartProps) => {
  return (
    <ResponsiveContainer width="99%" aspect={aspect}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 36, bottom: 5, left: 0 }}
      >
        {settings.plotKeys?.map((key) => (
          <Line
            type="monotone"
            dataKey={key}
            stroke={stringToColour(key)}
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
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export { LineChart };
