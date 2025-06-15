"use client";
import {
  ChartType,
  ScalarType,
  type TWidgetWithMetadata,
  WidgetType,
  widgetTypeDisplayMap,
} from "../../types";
import { Button } from "../button";
import {
  IconChartArea,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconCurrencyDollar,
  IconGraph,
  IconPercentage,
  IconTable,
  IconVariable,
  IconX,
  IconSettings,
  IconDatabase,
  IconFileText,
} from "@tabler/icons-react";
import { Select } from "../select";
import { type ReactNode, useState } from "react";
import { WidgetSwitcher } from "../widget-switcher";
import { useQuery } from "../../hooks";
import { MultiSelect } from "../multi-select";
import { Toggle } from "../toggle";
import { Editor } from "../Editor";
import { Loading } from "../loading";

type TAddWidgetModalProps = {
  open: boolean;
  onSave: (widget: TWidgetWithMetadata) => void;
  onClose: () => void;
};

const widgetTypeIconMap: Record<WidgetType, ReactNode> = {
  table: <IconTable className="w-4 h-4 text-orange" />,
  chart: <IconGraph className="w-4 h-4 text-orange" />,
  scalar: <IconVariable className="w-4 h-4 text-orange" />,
};

const chartTypeIconMap: Record<ChartType, ReactNode> = {
  line: <IconChartLine className="w-4 h-4 text-orange" />,
  bar: <IconChartBar className="w-4 h-4 text-orange" />,
  area: <IconChartArea className="w-4 h-4 text-orange" />,
  pie: <IconChartPie className="w-4 h-4 text-orange" />,
};

const scalarTypeIconMap: Record<ScalarType, ReactNode> = {
  percentage: <IconPercentage className="w-4 h-4 text-orange" />,
  currency: <IconCurrencyDollar className="w-4 h-4 text-orange" />,
};

const getWidgetFromConfig = (
  title: string,
  description: string,
  query: string,
  chartType: ChartType,
  xAxisKey: string | undefined,
  plotKeys: string[],
  widgetType: WidgetType | undefined,
  showVerticalGridLines: boolean,
  showHorizontalGridLines: boolean,
  showPositiveNegativeColor: boolean,
  scalarType?: ScalarType
): TWidgetWithMetadata => {
  switch (widgetType) {
    case WidgetType.TABLE:
      return {
        type: WidgetType.TABLE,
        query,
        title,
        description,
        id: crypto.randomUUID(),
        primaryKey: [],
      };
    case WidgetType.CHART:
      return {
        type: WidgetType.CHART,
        query,
        settings: {
          chartType,
          xAxisKey,
          plotKeys,
          verticalGridLines: showVerticalGridLines,
          horizontalGridLines: showHorizontalGridLines,
        },
        title,
        description,
        id: crypto.randomUUID(),
      };
    case WidgetType.SCALAR:
      return {
        type: WidgetType.SCALAR,
        query,
        settings: {
          scalarType,
          showPositiveNegativeColor,
        },
        title,
        description,
        id: crypto.randomUUID(),
      };
    default:
      throw new Error("Invalid widget type");
  }
};

const AddWidgetModal = ({ open, onSave, onClose }: TAddWidgetModalProps) => {
  const [title, setTitle] = useState<string>("Default title");
  const [description, setDescription] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [xAxisKey, setxAxisKey] = useState<string>();
  const [plotKeys, setPlotKeys] = useState<string[]>([]);
  const [savedQuery, setSavedQuery] = useState<string>("");
  const [widgetType, setWidgetType] = useState<WidgetType>();
  const [chartType, setChartType] = useState<ChartType>(ChartType.LINE);
  const [showVerticalGridLines, setShowVerticalGridLines] =
    useState<boolean>(false);
  const [showHorizontalGridLines, setShowHorizontalGridLines] =
    useState<boolean>(false);
  const [scalarType, setScalarType] = useState<ScalarType>();
  const [showPositiveNegativeColor, setShowPositiveNegativeColor] =
    useState<boolean>(true);
  const { data, error, loading } = useQuery(savedQuery);

  const handleSave = () => {
    onSave(
      getWidgetFromConfig(
        title,
        description,
        savedQuery,
        chartType,
        xAxisKey,
        plotKeys,
        widgetType,
        showVerticalGridLines,
        showHorizontalGridLines,
        showPositiveNegativeColor,
        scalarType
      )
    );
  };

  const showDataConfiguration =
    widgetType === WidgetType.CHART || widgetType === WidgetType.TABLE;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-secondary border border-border w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <IconGraph className="w-4 h-4 text-orange" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-text-primary font-medium text-sm outline-none border-none"
              placeholder="Widget title"
            />
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-8">
          {/* Top Panel - Preview */}
          <div className="w-full h-full aspect-[3] p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconGraph className="w-4 h-4 text-text-secondary" />
              <h3 className="text-text-primary font-medium text-sm">Preview</h3>
            </div>
            <div className="h-full bg-surface rounded-md border border-border">
              {widgetType ? (
                <WidgetSwitcher
                  widget={getWidgetFromConfig(
                    title,
                    description,
                    savedQuery,
                    chartType,
                    xAxisKey,
                    plotKeys,
                    widgetType,
                    showVerticalGridLines,
                    showHorizontalGridLines,
                    showPositiveNegativeColor,
                    scalarType
                  )}
                  data={data}
                  aspect={3}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <IconGraph className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">
                      Select a widget type to see preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Bottom Panel - Configuration */}
          <div className="w-full p-4 space-y-6">
            {/* Widget Type Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconSettings className="w-4 h-4 text-text-secondary" />
                <h3 className="text-text-primary font-medium text-sm">
                  Widget Type
                </h3>
              </div>
              <Select
                label=""
                selectedOption={widgetType}
                options={[
                  WidgetType.CHART,
                  WidgetType.TABLE,
                  WidgetType.SCALAR,
                ]}
                onSelect={(option) => setWidgetType(option)}
                renderOption={(option) => (
                  <div className="flex items-center gap-2">
                    {widgetTypeIconMap[option]}
                    <span>{widgetTypeDisplayMap[option]}</span>
                  </div>
                )}
                placeHolder="Select widget type"
              />
            </div>

            {/* Chart Settings */}
            {widgetType === WidgetType.CHART && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconChartLine className="w-4 h-4 text-text-secondary" />
                  <h3 className="text-text-primary font-medium text-sm">
                    Chart Settings
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-text-secondary text-xs font-medium mb-1">
                      Chart Type
                    </p>
                    <Select
                      selectedOption={chartType}
                      options={Object.values(ChartType)}
                      label=""
                      placeHolder="Select Chart Type"
                      onSelect={(option) => setChartType(option)}
                      renderOption={(option) => (
                        <div className="flex items-center gap-2">
                          {chartTypeIconMap[option]}
                          <span>{option}</span>
                        </div>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Toggle
                      label="Show Vertical Grid Lines"
                      checked={showVerticalGridLines}
                      onChange={(value) => setShowVerticalGridLines(value)}
                    />
                    <Toggle
                      label="Show Horizontal Grid Lines"
                      checked={showHorizontalGridLines}
                      onChange={(value) => setShowHorizontalGridLines(value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Data Configuration */}
            {showDataConfiguration && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconDatabase className="w-4 h-4 text-text-secondary" />
                  <h3 className="text-text-primary font-medium text-sm">
                    Data Configuration
                  </h3>
                </div>

                {data && Array.isArray(data) && data.length > 0 ? (
                  <div className="space-y-3">
                    {widgetType === WidgetType.CHART && (
                      <>
                        <div>
                          <p className="text-text-secondary text-xs font-medium mb-1">
                            X-Axis Key
                          </p>
                          <Select
                            selectedOption={xAxisKey}
                            options={Object.keys(data[0])}
                            label=""
                            placeHolder="Select X-Axis Key"
                            onSelect={(option) => setxAxisKey(option)}
                          />
                        </div>
                        <div>
                          <p className="text-text-secondary text-xs font-medium mb-1">
                            Plot Keys
                          </p>
                          <MultiSelect
                            selectedOptions={plotKeys}
                            label=""
                            options={Object.keys(data[0])}
                            placeHolder="Select Plot Keys"
                            onDeselect={(option) => {
                              setPlotKeys(
                                plotKeys.filter((key) => key !== option)
                              );
                            }}
                            onSelect={(option) => {
                              setPlotKeys([...plotKeys, option]);
                            }}
                          />
                        </div>
                      </>
                    )}
                    {widgetType === WidgetType.TABLE && (
                      <>
                        <div>
                          <p className="text-text-secondary text-xs font-medium mb-1">
                            Primary Key
                          </p>
                          <MultiSelect
                            selectedOptions={plotKeys}
                            label=""
                            options={Object.keys(data[0])}
                            placeHolder="Select Primary Key"
                            onDeselect={(option) => {
                              setPlotKeys(
                                plotKeys.filter((key) => key !== option)
                              );
                            }}
                            onSelect={(option) => {
                              setPlotKeys([...plotKeys, option]);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-surface rounded-md border border-border">
                    <p className="text-text-secondary text-xs">
                      {error
                        ? `Error fetching data: ${error}`
                        : `No data available. Please run a query to configure your ${
                            widgetType || ""
                          } widget.`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Scalar Settings */}
            {widgetType === WidgetType.SCALAR && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconVariable className="w-4 h-4 text-text-secondary" />
                  <h3 className="text-text-primary font-medium text-sm">
                    Scalar Settings
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-text-secondary text-xs font-medium mb-1">
                      Scalar Type
                    </p>
                    <Select
                      selectedOption={scalarType}
                      options={Object.values(ScalarType)}
                      label=""
                      placeHolder="Select Scalar Type"
                      onSelect={(option) => setScalarType(option)}
                      renderOption={(option) => (
                        <div className="flex items-center gap-2">
                          {scalarTypeIconMap[option]}
                          <span>{option}</span>
                        </div>
                      )}
                    />
                  </div>
                  <Toggle
                    label="Show Positive/Negative Color"
                    checked={showPositiveNegativeColor}
                    onChange={(value) => setShowPositiveNegativeColor(value)}
                  />
                </div>
              </div>
            )}

            {/* Query Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconDatabase className="w-4 h-4 text-text-secondary" />
                <h3 className="text-text-primary font-medium text-sm">Query</h3>
              </div>
              <div className="space-y-3">
                <Editor
                  value={query}
                  onChange={(code) => setQuery(code)}
                  placeholder="SELECT COUNT(DISTINCT user_id) FROM user_sessions GROUP BY date;"
                />
                <div className="flex items-center justify-end w-full">
                  <div className="w-32">
                    <Button
                      disabled={!savedQuery ? false : loading}
                      onClick={() => {
                        setxAxisKey(undefined);
                        setPlotKeys([]);
                        setSavedQuery(query.replace(";", ""));
                      }}
                    >
                      {loading && savedQuery ? <Loading /> : "Run Query"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconFileText className="w-4 h-4 text-text-secondary" />
                <h3 className="text-text-primary font-medium text-sm">
                  Description
                </h3>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Number of unique user sessions per day"
                className="p-2 bg-surface text-text-primary text-sm w-full rounded-md outline-none border-border border-[1px] resize-none min-h-20"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button onClick={onClose}>
            <p className="text-sm">Cancel</p>
          </Button>
          <Button disabled={!widgetType} onClick={handleSave}>
            <p className="text-sm">Save Widget</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AddWidgetModal };
