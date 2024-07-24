import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Package, Truck, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStage, setSelectedStage] = useState(null);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      updateStages();
      filterTransactions();
    }
  }, [transactions, selectedStage, globalFilter]);

  const fetchTransactions = async () => {
    // Replace this with your actual API call
    const mockData = [
      {
        id: 1,
        trackingNo: '1',
        status: 'Delivered',
        stage: 'warehouse',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 2,
        trackingNo: '12',
        status: 'Delivered',
        stage: 'drying',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 3,
        trackingNo: '3412',
        status: 'Delivered',
        stage: 'milling',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 4,
        trackingNo: '4',
        status: 'Delivered',
        stage: 'dispatch',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
            {
        id: 5,
        trackingNo: '3453',
        status: 'Delivered',
        stage: 'milling',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
            {
        id: 6,
        trackingNo: '3487',
        status: 'Delivered',
        stage: 'milling',
        timeline: [
          { status: 'DELIVERED', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'OUT FOR DELIVERY', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DEPARTED FROM FACILITY', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'PICKED UP BY SHIPPING PARTNER', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      // ...other transactions
    ];
    setTransactions(mockData);
  };

  const updateStages = () => {
    const predefinedStages = ['warehouse', 'milling', 'drying', 'dispatch'];
    const dataStages = [...new Set(transactions.map(t => t.stage))];
    const allStages = [...new Set([...predefinedStages, ...dataStages])];
    setStages(allStages);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    if (selectedStage) {
      filtered = filtered.filter(transaction => transaction.stage === selectedStage);
    }
    if (globalFilter) {
      filtered = filtered.filter(transaction => 
        transaction.trackingNo.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.status.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.stage.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    setFilteredTransactions(filtered);
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

  const toggleRow = (rowData) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows && prevExpandedRows[rowData.id]) {
        return {};
      }
      return { [rowData.id]: true };
    });
  };

  const rowExpansionTemplate = (data) => {
    return expandedRows && expandedRows[data.id] ? expandedContent(data) : null;
  };

  const expansionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => toggleRow(rowData)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        {expandedRows && expandedRows[rowData.id] ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
    );
  };

  return (
    <div className="p-4 w-screen h-screen">
      <div className="mb-4">
        <span className="p-input-icon-left w-full">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </span>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <div 
              key={stage} 
              className={`flex flex-col items-center cursor-pointer ${selectedStage?.toLowerCase() === stage.toLowerCase() ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => setSelectedStage(selectedStage?.toLowerCase() === stage.toLowerCase() ? null : stage)}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                <Search className="text-green-500" />
              </div>
              <div className="text-sm text-white capitalize">{stage}</div>
              {index < stages.length - 1 && <div className="w-full h-1 bg-white opacity-50 mt-2" />}
            </div>
          ))}
        </div>
      </div>

      <DataTable
        value={filteredTransactions}
        expandedRows={expandedRows}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        className="p-datatable-sm border-none"
        emptyMessage="No transactions found."
      >
        <Column body={expansionBodyTemplate} style={{ width: '3em' }} />
        <Column field="trackingNo" header="Batch No." />
        <Column field="status" header="Status" body={statusBodyTemplate} />
        <Column field="stage" header="Stage" />
      </DataTable>
    </div>
  );
};

export default TransactionHistory;
