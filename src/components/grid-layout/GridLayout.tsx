import { Responsive, WidthProvider } from "@incmix/react-grid-layout";
import { useContext } from "react";
import { GridLayoutsContext } from "../../context";
import { Widget } from "../widgets";
const ResponsiveGridLayout = WidthProvider(Responsive);

const GridLayout = () => {
  const { gridLayouts, setGridLayouts } = useContext(GridLayoutsContext);
  return (
    <ResponsiveGridLayout
      layouts={{ lg: gridLayouts }}
      rowHeight={30}
      resizeHandles={["se"]}
      isDraggable={true}
      isResizable={true}
      margin={[20, 20]}
      onLayoutChange={(layout) => {
        setGridLayouts(
          gridLayouts.map((item, i) => {
            return { ...item, ...layout[i] };
          })
        );
      }}
    >
      {gridLayouts.map((item) => (
        <div key={item.i}>
          <Widget
            key={item.i}
            widget={item.widget}
            aspect={(() => {
              return item.w - item.h;
            })()}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export { GridLayout };
