import { TChartSettings } from "../../types";
import {
  PieChart as RechartsPieChart,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
} from "recharts";
import { stringToColour } from "./utils";

type TPieChartProps = {
  data: object[];
  settings: TChartSettings;
  aspect: number;
};

const PieChart = ({ data, settings, aspect }: TPieChartProps) => {
  return (
    <ResponsiveContainer width="99%" aspect={aspect}>
      <RechartsPieChart margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
        {settings.plotKeys?.map((key, index) => (
          <Pie
            data={data}
            type="monotone"
            nameKey={settings.xAxisKey}
            dataKey={key}
            fill={stringToColour(key)}
            cx="50%"
            cy="50%"
            innerRadius={100 + index * 25}
            outerRadius={140 + index * 25}
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

        <Tooltip
          contentStyle={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #424242",
            borderRadius: "4px",
          }}
          itemStyle={{
            color: "#b3b3b3",
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export { PieChart };
