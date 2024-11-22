import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

const PalayBatches = ({ 
  visible, 
  onHide, 
  palayBatches = [], 
  selectedPile,
  onPaginationChange,
  totalRecords,
  loading
}) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  
  // State to hold running balances
  const [runningBags, setRunningBags] = useState(0);
  const [runningGross, setRunningGross] = useState(0);
  const [runningNet, setRunningNet] = useState(0);

  useEffect(() => {
    // Reset pagination and running totals when dialog opens
    if (visible) {
      setFirst(0);
      setRunningBags(0);
      setRunningGross(0);
      setRunningNet(0);
    }
  }, [visible]);

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    onPaginationChange({
      offset: event.first,
      limit: event.rows
    });

    // Adjust running totals when navigating between pages
    if (event.first === 0) {
      setRunningBags(0);
      setRunningGross(0);
      setRunningNet(0);
    } else {
      // For subsequent pages, calculate totals based on the current page
      let currentBags = 0;
      let currentGross = 0;
      let currentNet = 0;
      for (let i = 0; i < event.first; i++) {
        currentBags += Number(palayBatches[i]?.quantityBags || 0);
        currentGross += Number(palayBatches[i]?.grossWeight || 0);
        currentNet += Number(palayBatches[i]?.netWeight || 0);
      }
      setRunningBags(currentBags);
      setRunningGross(currentGross);
      setRunningNet(currentNet);
    }
  };

  const processedData = React.useMemo(() => {
    let currentBags = runningBags;
    let currentGross = runningGross;
    let currentNet = runningNet;

    const grouped = palayBatches.reduce((acc, batch) => {
      const date = new Date(batch.dateBought).toLocaleDateString();

      // Add current batch values to running totals
      currentBags += Number(batch.quantityBags);
      currentGross += Number(batch.grossWeight);
      currentNet += Number(batch.netWeight);

      const processedBatch = {
        ...batch,
        balanceBags: currentBags,
        balanceGross: currentGross,
        netKg: currentNet,
        displayDate: false,
      };

      if (!acc[date]) {
        acc[date] = [];
        processedBatch.displayDate = true;
      }

      acc[date].push(processedBatch);
      return acc;
    }, {});

    return Object.values(grouped).flat();
  }, [palayBatches, runningBags, runningGross, runningNet]);

  const dateTemplate = (rowData) => {
    if (rowData.displayDate) {
      return new Date(rowData.dateBought).toLocaleDateString();
    }
    return "";
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatBags = (num) => {
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="DATE" rowSpan={2} className="text-center" headerClassName="text-center"/>
        <Column header="NOT" rowSpan={2} className="text-center" headerClassName="text-center"/>
        <Column header="RECEIPTS" colSpan={2} className="text-center bg-gray-100" headerClassName="text-center"/>
        <Column header="NET KG" rowSpan={2} className="text-center" headerClassName="text-center"/>
        <Column header="WSR/WSI NO." rowSpan={2} className="text-center" headerClassName="text-center"/>
        <Column header="MC" rowSpan={2} className="text-center" headerClassName="text-center"/>
        <Column header="BALANCE" colSpan={2} className="text-center bg-gray-100" headerClassName="text-center"/>
        <Column header="NET KG" rowSpan={2} className="text-center" headerClassName="text-center"/>
      </Row>
      <Row>
        <Column header="BAGS" className="text-center bg-gray-100" headerClassName="text-center"/>
        <Column header="GROSS" className="text-center bg-gray-100" headerClassName="text-center"/>
        <Column header="BAGS" className="text-center bg-gray-100" headerClassName="text-center"/>
        <Column header="GROSS" className="text-center bg-gray-100" headerClassName="text-center"/>
      </Row>
    </ColumnGroup>
  );

  return (
    <Dialog
      header={`Pile #${selectedPile?.pileNumber}`}
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw" }}
      modal
      className="p-fluid h-[76%]"
    >
      <DataTable
        value={processedData}
        paginator
        scrollable
        scrollHeight="flex"
        rows={rows}
        first={first}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        showGridlines
        dataKey="id"
        headerColumnGroup={headerGroup}
        emptyMessage="No palay batches found."
        className="p-datatable-sm"
        lazy
      >
        <Column
          field="dateBought"
          body={dateTemplate}
          className="text-center"
          headerClassName="text-center"
        />
        <Column 
          field="note" 
          body={() => 'PROCUREMENT'}
          className="text-center"
        />
        <Column
          field="quantityBags"
          className="text-center"
          body={rowData => formatBags(rowData.quantityBags)}
        />
        <Column
          field="grossWeight"
          className="text-center"
          body={(rowData) => formatNumber(rowData.grossWeight)}
        />
        <Column
          field="netWeight"
          className="text-center"
          body={(rowData) => formatNumber(rowData.netWeight)}
        />
        <Column
          field="wsr"
          className="text-center"
        />
        <Column
          field="qualitySpec.moistureContent"
          className="text-center"
          body={(rowData) => formatNumber(rowData.qualitySpec?.moistureContent)}
        />
        <Column
          field="balanceBags"
          className="text-center"
          body={rowData => formatBags(rowData.balanceBags)}
        />
        <Column
          field="balanceGross"
          className="text-center"
          body={(rowData) => formatNumber(rowData.balanceGross)}
        />
        <Column
          field="netKg"
          className="text-center"
          body={(rowData) => formatNumber(rowData.netKg)}
        />
      </DataTable>
    </Dialog>
  );
};

export default PalayBatches;
