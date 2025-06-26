import { useContext } from "react";
import { TWidgetWithMetadata } from "../../types";
import { WidgetSwitcher } from "../widget-switcher";
import { IconReload, IconSettings } from "@tabler/icons-react";
import { Button } from "../button";
import { useQuery } from "../../hooks";
import { Loading } from "../loading";
import { WidgetSettingsContext } from "../../context/WidgetSettingsProvider";

type TWidgetSwitcherProps = {
  widget: TWidgetWithMetadata;
  aspect: number;
};

const Widget = ({ widget, aspect }: TWidgetSwitcherProps) => {
  const { openWidgetSettings } = useContext(WidgetSettingsContext);
  const { data, error, loading, rerun } = useQuery(widget.query);

  return (
    <>
      <div className="w-full h-full flex group select-none">
        <div className="text-center text-xs p-2 left-2 top-2 overflow-y-scroll hidden z-20 absolute group-hover:block bg-secondary rounded-[4px] max-w-[400px] overflow-ellipsis whitespace-nowrap shadow-md border-border border-[1px]">
          {widget.title}
        </div>
        <div className="items-center p-2 h-full flex-col border-r-[1px] border-border mb-2 right-0 overflow-y-scroll hidden z-20 absolute group-hover:block">
          <div className="gap-2 flex flex-col">
            <Button onMouseDown={(e) => e.stopPropagation()} onClick={rerun}>
              <IconReload className="w-3 h-3 cursor-pointer text-white" />
            </Button>
            <Button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => openWidgetSettings(widget)}
            >
              <IconSettings className="w-3 h-3 cursor-pointer text-white" />
            </Button>
          </div>
        </div>
        {!widget.query ? (
          <div className="w-full h-full flex items-center justify-center aspect-[3]">
            <span className="text-text-secondary">No query to run</span>
          </div>
        ) : loading ? (
          <div className="w-full h-full flex items-center justify-center aspect-[3]">
            <Loading />
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center aspect-[3]">
            <p>{error}</p>
          </div>
        ) : (
          <WidgetSwitcher data={data} widget={widget} aspect={aspect} />
        )}
      </div>
    </>
  );
};

export { Widget };
