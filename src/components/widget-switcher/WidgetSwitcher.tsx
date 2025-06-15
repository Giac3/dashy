import { TWidget } from "../../types";

import { FallbackWidget } from "../widgets";
import { ChartWidget, TableWidget } from "../widgets";
import ScalarWidget from "../widgets/ScalarWidget";

type TWidgetSwitcherProps = {
  widget: TWidget;
  data: Record<string, string | number | null>[];
  aspect: number;
};

const WidgetSwitcher = ({ widget, data, aspect }: TWidgetSwitcherProps) => {
  switch (widget?.type) {
    case "chart":
      return (
        <ChartWidget data={data} settings={widget.settings} aspect={aspect} />
      );
    case "scalar":
      return (
        <div
          className={`w-full h-full flex items-center justify-center aspect-[${aspect}]`}
        >
          <ScalarWidget data={data} settings={widget.settings} />
        </div>
      );
    case "table":
      return <TableWidget data={data} />;
    default:
      return <FallbackWidget />;
  }
};

export { WidgetSwitcher };
