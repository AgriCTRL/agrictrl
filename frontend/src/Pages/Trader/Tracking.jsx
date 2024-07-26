import React, { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { AlertCircle, ChevronDown, ChevronUp, Search, Wheat, ThermometerSun, Factory, WheatOff } from 'lucide-react';

import emptyIllustration from '@/images/illustrations/space.svg';

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
    try {
      const [
        palayBatchesRes,
        warehousesRes,
        dryingProcessesRes,
        dryersRes,
        millingProcessesRes,
        millersRes,
        riceBatchesRes
      ] = await Promise.all([
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/palaybatches'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryingprocesses'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/dryers'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millingprocesses'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers'),
        fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/ricebatches'),
      ]);

      const [
        palayBatches,
        warehouses,
        dryingProcesses,
        dryers,
        millingProcesses,
        millers,
        riceBatches
      ] = await Promise.all([
        palayBatchesRes.json(),
        warehousesRes.json(),
        dryingProcessesRes.json(),
        dryersRes.json(),
        millingProcessesRes.json(),
        millersRes.json(),
        riceBatchesRes.json()
      ]);

      const processedTransactions = palayBatches.map(batch => {
        const timeline = [];

        // Palay status
        const palayWarehouse = warehouses.find(w => w.id === batch.warehouseId);
        timeline.push({
          status: 'PALAY',
          date: new Date(batch.dateReceived).toISOString(),
          location: palayWarehouse ? palayWarehouse.location : 'Unknown'
        });

        // Drying status
        const dryingProcess = dryingProcesses.find(dp => dp.palayBatchId === batch.id);
        if (dryingProcess) {
          const dryer = dryers.find(d => d.id === dryingProcess.dryerId);
          timeline.push({
            status: 'DRYING',
            date: dryingProcess.dateSent,
            location: dryer ? dryer.location : 'Unknown'
          });
        }

        // Milling status
        const millingProcess = millingProcesses.find(mp => mp.palayBatchId === batch.id);
        if (millingProcess) {
          const miller = millers.find(m => m.id === millingProcess.millerId);
          timeline.push({
            status: 'MILLING',
            date: millingProcess.dateSent,
            location: miller ? miller.location : 'Unknown'
          });
        }

        // Rice status
        const riceBatch = riceBatches.find(rb => rb.palayBatchId === batch.id);
        if (riceBatch) {
          const riceWarehouse = warehouses.find(w => w.id === riceBatch.warehouseId);
          timeline.push({
            status: 'RICE',
            date: riceBatch.dateReceived,
            location: riceWarehouse ? riceWarehouse.location : 'Unknown'
          });
        }

        return {
          id: batch.id,
          batchNo: batch.id.toString(),
          status: batch.status,
          timeline: timeline.sort((a, b) => new Date(b.date) - new Date(a.date))
        };
      });

      setTransactions(processedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
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
            <div>{new Date(item.date).toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true,
            timeZone: 'UTC'  // Specify UTC to avoid timezone issues
          })}</div>
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

  const batchIdHeader = () => (
    <div className="ml-4 flex items-center p-2 text-[#00C261]">
      <Wheat className="mr-2 h-5 w-5"/>
      <span className="text-md">Batch ID</span>
    </div>
  );

  const statusHeader = () => (
    <div className="flex items-center text-[#00C261]">
      <Factory className="mr-2 h-5 w-5"/>
      <span className="text-md">Status</span>
    </div>
  );

  return (
    <UserLayout activePage="Tracking">
      <div className="px-4 w-full h-full pt-10 bg-[#F1F5F9]">
        <div className="mb-4">
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
          scrollable={true}
          scrollHeight="50vh"
          loading={loading}
          className="p-datatable-sm border-none rounded-lg"
          rowClassName={() => 'h-16'}
          emptyMessage=" "
        >
          <Column body={expansionBodyTemplate} style={{ width: '3em' }}/>
          <Column field="batchNo" header={batchIdHeader} className="pl-9"/>
          <Column field="status" header={statusHeader} body={statusBodyTemplate} className="-translate-x-6"/>
        </DataTable>
        
        {filteredTransactions.length === 0 && (
          <div className='flex flex-col items-center justify-center mt-5 gap-4'>
              <img src={emptyIllustration} alt="empty" width="130" />
              <p className='text-primary text-2xl font-semibold'>No Transactions Found</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default TransactionHistory;