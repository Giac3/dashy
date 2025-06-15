import { TSCalarWidgetSettings } from "../../types";
import { Percentage } from "../scalars";

type TScalarWidgetProps = {
  data: Record<string, string | number | null>[];
  settings: TSCalarWidgetSettings;
};

const ScalarWidget = ({ data, settings }: TScalarWidgetProps) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  if (Object.keys(data[0]).length > 1) {
    return (
      <div>
        Scalar widget expects a single value, but received multiple keys.
      </div>
    );
  }

  const scalarKey = Object.keys(data[0])[0];
  const scalarValue = data[0][scalarKey];

  switch (settings.scalarType) {
    case "percentage":
      return (
        <Percentage
          label={scalarKey}
          value={scalarValue as number}
          settings={settings}
        />
      );
    case "currency":
      return (
        <div>
          <h3>{scalarKey}</h3>
          <p>{scalarValue}</p>
        </div>
      );

    default:
      return <div>{scalarValue}</div>;
  }
};

export default ScalarWidget;
