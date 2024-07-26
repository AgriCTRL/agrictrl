import React, { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Package, Truck, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Search, Wheat, ThermometerSun, Factory, WheatOff } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statuses, setStatuses] = useState(['Palay', 'Drying', 'Milling', 'Rice']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      updateStatuses();
    }
    filterTransactions();
  }, [transactions, selectedStatus, globalFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    const mockData = [
      {
        id: 1,
        batchNo: '12312312312',
        status: 'Palay',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 2,
        batchNo: '345345',
        status: 'Drying',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 3,
        batchNo: '6786712351',
        status: 'Milling',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 4,
        batchNo: '5567589',
        status: 'Rice',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      {
        id: 5,
        batchNo: '01458971',
        status: 'Milling',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
      
      // ...other transactions
    ];
    setTransactions(mockData);
    setLoading(false);
  };

  const updateStatuses = () => {
    const predefinedStatuses = ['Palay', 'Drying', 'Milling', 'Rice'];
    const dataStatuses = [...new Set(transactions.map(t => t.status))];
    const allStatuses = [...new Set([...predefinedStatuses, ...dataStatuses])];
    setStatuses(allStatuses);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    if (selectedStatus) {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }
    if (globalFilter) {
      filtered = filtered.filter(transaction => 
        transaction.batchNo.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.status.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    setFilteredTransactions(filtered);
  };

  const statusBodyTemplate = (rowData) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'palay': return 'success';
        case 'drying': return 'info';
        case 'milling': return 'warning';
        case 'rice': return 'danger';
        default: return 'secondary';
      }
    };

    return <Tag value={rowData.status} severity={getStatusColor(rowData.status)} className="w-24 text-center" />;
  };

  const expandedContent = (rowData) => {
    const customizedMarker = (item) => {
      switch (item.status) {
        case 'PALAY':
          return <Wheat className="text-green-500" />;
        case 'DRYING':
          return <ThermometerSun className="text-yellow-500" />;
        case 'MILLING':
          return <Factory className="text-blue-500" />;
        case 'RICE':
          return <WheatOff className="text-gray-500" />;
        default:
          return <AlertCircle className="text-red-500" />;
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
    <UserLayout activePage="Tracking">
            <div className="p-4 w-full h-full pt-10 bg-[#F1F5F9]">
      <div className="mb-4">
        {transactions.length === 0 && !globalFilter && !selectedStatus && (
          <div className="text-center text-4xl text-[#00C261] mb-4">
            Start by Searching Batch Number
          </div>
        )}
        <span className="p-input-icon-left w-full"> 
          <Search className="ml-3 -translate-y-1 text-[#00C261]" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-4 rounded-lg placeholder-[#00C261] text-[#00C261] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </span>
      </div>

      <div className="bg-gradient-to-r from-[#005155] to-[#00C261] rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center px-20">
          {statuses.map((status) => (
            <div 
              key={status} 
              className={`flex flex-col items-center cursor-pointer ${selectedStatus?.toLowerCase() === status.toLowerCase() ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => setSelectedStatus(selectedStatus?.toLowerCase() === status.toLowerCase() ? null : status)}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                <Search className="text-[#00C261]" />
              </div>
              <div className="text-sm text-white capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        value={filteredTransactions}
        expandedRows={expandedRows}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        scrollable ={true}
        loading={loading}
        className="p-datatable-sm border-none min-h-[300px] rounded-lg"
        rowClassName={() => 'h-16'}
        emptyMessage="No transactions found."
      >
        <Column body={expansionBodyTemplate} style={{ width: '3em' }}/>
        <Column field="batchNo" header="Batch No." className="pl-9"/>
        <Column field="status" header="Status" body={statusBodyTemplate} className="-translate-x-6"/>
      </DataTable>
    </div>
    </UserLayout>

  );
};

export default TransactionHistory;