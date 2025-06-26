import React, { ReactNode, useContext, useState } from "react";

import { TWidgetWithMetadata } from "../types";
import { WidgetSettingsModal } from "../components";
import { GridLayoutsContext } from "./GridLayoutsProvider";

type TWidgetSettingsContext = {
  openWidgetSettings: (widget: TWidgetWithMetadata) => void;
};

export const WidgetSettingsContext =
  React.createContext<TWidgetSettingsContext>({
    openWidgetSettings: () => null,
  });

type TWidgetSettingsProviderProps = {
  children: ReactNode;
};

const WidgetSettingsProvider = ({ children }: TWidgetSettingsProviderProps) => {
  const { setGridLayouts } = useContext(GridLayoutsContext);
  const [widget, setWidget] = useState<TWidgetWithMetadata | null>(null);

  const openWidgetSettings = (widget: TWidgetWithMetadata) => {
    setWidget(widget);
  };

  const handleSave = (widget: TWidgetWithMetadata) => {
    setGridLayouts((prev) => {
      if (prev) {
        return prev.map((item) =>
          item.widget.id === widget.id
            ? { ...item, widget: { ...widget, id: crypto.randomUUID() } }
            : item
        );
      }
      return prev;
    });
    setWidget(null);
  };

  return (
    <WidgetSettingsContext.Provider
      value={{
        openWidgetSettings,
      }}
    >
      {children}
      {widget && (
        <WidgetSettingsModal
          widget={widget}
          onClose={() => setWidget(null)}
          onSave={handleSave}
        />
      )}
    </WidgetSettingsContext.Provider>
  );
};

export { WidgetSettingsProvider };
