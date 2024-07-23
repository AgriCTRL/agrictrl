import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { Package, Truck, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    // Replace this with your actual API call
    const mockData = [
      {
        id: 1,
        carrier: 'DHL Express',
        trackingNo: '2548576265',
        orderNo: '#NEP10299',
        status: 'Delivered',
        statusDetails: 'Delivered. Thank yo...',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 2,
        carrier: 'DHL Express',
        trackingNo: '2548576265',
        orderNo: '#NEP10299',
        status: 'Delivered',
        statusDetails: 'Delivered. Thank yo...',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 3,
        carrier: 'DHL Express',
        trackingNo: '2548576265',
        orderNo: '#NEP10299',
        status: 'Delivered',
        statusDetails: 'Delivered. Thank yo...',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 4,
        carrier: 'DHL Express',
        trackingNo: '2548576265',
        orderNo: '#NEP10299',
        status: 'Delivered',
        statusDetails: 'Delivered. Thank yo...',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 5,
        carrier: 'DHL Express',
        trackingNo: '2548576265',
        orderNo: '#NEP10299',
        status: 'Delivered',
        statusDetails: 'Delivered. Thank yo...',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
    ];
    setTransactions(mockData);
  };

  const statusBodyTemplate = (rowData) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'delivered': return 'success';
        case 'in transit': return 'info';
        case 'out for delivery': return 'warning';
        case 'failed attempt': return 'danger';
        case 'exception': return 'danger';
        default: return 'secondary';
      }
    };

    return <Tag value={rowData.status} severity={getStatusColor(rowData.status)} />;
  };

  const expandedContent = (rowData) => {
    const customizedMarker = (item) => {
      switch (item.status) {
        case 'DELIVERED':
          return <CheckCircle className="text-green-500" />;
        case 'OUT FOR DELIVERY':
          return <Truck className="text-blue-500" />;
        case 'DEPARTED FROM FACILITY':
        case 'PICKED UP BY SHIPPING PARTNER':
          return <Package className="text-gray-500" />;
        default:
          return <AlertCircle className="text-yellow-500" />;
      }
    };

    return (
      <Timeline
        value={rowData.timeline}
        align="alternate"
        className="p-4"
        marker={customizedMarker}
        content={(item) => (
          <div className="text-sm">
            <div className="font-bold">{item.status}</div>
            <div>{new Date(item.date).toLocaleString()}</div>
            <div>{item.location}</div>
          </div>
        )}
      />
    );
  };

  const toggleRow = (e) => {
    const rowData = e.data;
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [rowData.id]: !prevExpandedRows[rowData.id]
    }));
  };

  const rowExpansionTemplate = (data) => {
    return expandedRows[data.id] ? expandedContent(data) : null;
  };

  const expansionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => toggleRow({ data: rowData })}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        {expandedRows[rowData.id] ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
    );
  };

  return (
    <div className="p-4 w-screen h-screen">
      <DataTable
        value={transactions}
        expandedRows={expandedRows}
        rowExpansionTemplate={rowExpansionTemplate}
        onRowToggle={toggleRow}
        dataKey="id"
        className="p-datatable-sm"
      >
        <Column body={expansionBodyTemplate} style={{ width: '3em' }} />
        <Column field="carrier" header="Carrier" />
        <Column field="trackingNo" header="Batch No." />
        <Column field="orderNo" header="Transaction ID" />
        <Column field="status" header="Status" body={statusBodyTemplate} />
        <Column field="statusDetails" header="Latest Details" />
      </DataTable>
    </div>
  );
};

export default TransactionHistory;