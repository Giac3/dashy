import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community"; // or themeBalham, themeAlpine

const tableTheme = themeQuartz.withParams({
  spacing: 4,
  foregroundColor: "var(--dark-text-primary)",
  backgroundColor: "var(--dark-card)",
  headerBackgroundColor: "var(--dark-bg-secondary)",
  rowHoverColor: "var(--dark-hover)",
  borderColor: "var(--dark-border)",
  selectedRowBackgroundColor: "rgba(0, 229, 199, 0.2)",

  inputBackgroundColor: "var(--dark-bg-tertiary)",
  tabSelectedBorderColor: "var(--dark-border)",
});

type TTableWidget = {
  data: Record<string, string | number | null>[];
};

const TableWidget = ({ data }: TTableWidget) => {
  const columnDefs =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          headerName: key,
          field: key,
          sortable: true,
          filter: true,
        }))
      : [];

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={tableTheme}
      />
    </div>
  );
};

export { TableWidget };
