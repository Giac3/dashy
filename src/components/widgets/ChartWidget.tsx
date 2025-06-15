import { TChartSettings } from "../../types";
import { AreaChart, BarChart, LineChart, PieChart } from "../charts";

type TChartWidgetProps = {
  data: object[];
  settings: TChartSettings;
  aspect: number;
};

const ChartWidget = ({ data, settings, aspect }: TChartWidgetProps) => {
  switch (settings.chartType) {
    case "line":
      return <LineChart data={data} settings={settings} aspect={aspect} />;
    case "bar":
      return <BarChart data={data} settings={settings} aspect={aspect} />;
    case "pie":
      return <PieChart data={data} settings={settings} aspect={aspect} />;
    case "area":
      return <AreaChart data={data} settings={settings} aspect={aspect} />;
    default:
      return <div>Unsupported chart type</div>;
  }
};

export { ChartWidget };
