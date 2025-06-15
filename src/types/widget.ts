
export enum WidgetType {
    TABLE = "table",
    CHART = "chart",
    SCALAR = "scalar",
}

export const widgetTypeDisplayMap: Record<WidgetType, string> = {
    "table": "Table",
    "chart": "Chart",
    "scalar": "Scalar",
}


export type TWidgetMetadata = {
    id: string;
    title: string;
    description: string;
}

export type TBaseWidget = {
    query: string;
}

export enum ChartType {
    LINE = "line",
    BAR = "bar",
    AREA = "area",
    PIE = "pie",
}

export type TChartSettings = {
    chartType: ChartType;
    xAxisKey?: string;
    plotKeys?: string[];
    verticalGridLines?: boolean;
    horizontalGridLines?: boolean;
    
  };

export type TChartWidget = TBaseWidget & {
    type: WidgetType.CHART;
    settings: TChartSettings;
}

export type TTableWidget = TBaseWidget & {
    type: WidgetType.TABLE;
    primaryKey: string[];
}

export enum ScalarType {
    PERCENTAAGE = "percentage",
    CURRENCY = "currency",
}

export type TSCalarWidgetSettings = {
    scalarType?: ScalarType;
    showPositiveNegativeColor: boolean;
}

export type TScalarWidget = TBaseWidget & {
    type: WidgetType.SCALAR;
    settings: TSCalarWidgetSettings
}

export type TWidget = TChartWidget | TTableWidget | TScalarWidget;
export type TWidgetWithMetadata = TWidget & TWidgetMetadata;