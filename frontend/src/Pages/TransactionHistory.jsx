import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { AlertCircle, ChevronDown, ChevronUp, Search, Wheat, ThermometerSun, Factory, WheatOff, ArrowLeftToLine } from 'lucide-react';

import emptyIllustration from '@/images/illustrations/space.svg';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, globalFilter]);

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
          riceID: batch.id.toString(),
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

  const filterTransactions = () => {
    if (globalFilter) {
      const filtered = transactions.filter(transaction => 
        transaction.riceID.toLowerCase().includes(globalFilter.toLowerCase()) ||
        transaction.status.toLowerCase().includes(globalFilter.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
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
              timeZone: 'UTC'
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

  const Header = () => {
    const navigate = useNavigate();

    return(
      <div className='flex flex-row p-6 rounded-lg mb-5 bg-gradient-to-r from-[#005155] to-[#00C261]'>
        <button onClick={() => navigate(-1)} className="flex items-center text-white">
          <ArrowLeftToLine className="w-6 h-6 mr-2 text-white"/>
          Go back
        </button>
        <div className="flex flex-grow"></div>
        <h1 className="text-white text-4xl font-poppins font-bold">TRACE YOUR RICE!</h1>
        <div className="flex flex-grow"></div>
      </div>
    );
  };

  const riceIDHeader = () => (
    <div className="ml-4 flex items-center p-2 text-[#00C261]">
      <Wheat className="mr-2 h-5 w-5"/>
      <span className="text-md">Rice ID</span>
    </div>
  );

  const statusHeader = () => (
    <div className="flex items-center text-[#00C261]">
      <Factory className="mr-2 h-5 w-5"/>
      <span className="text-md">Status</span>
    </div>
  );

  return (
    <div className="p-4 w-screen h-screen pt-5 bg-[#F1F5F9]">
      <Header />
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

      <DataTable
        value={filteredTransactions}
        expandedRows={expandedRows}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        className="p-datatable-sm border-none rounded-lg"
        rowClassName={() => 'h-16'}
        emptyMessage=" "
      >
        <Column body={expansionBodyTemplate} style={{ width: '3em' }}/>
        <Column field="riceID" header={riceIDHeader} className="pl-9"/>
        <Column field="status" header={statusHeader} body={statusBodyTemplate} className="-translate-x-6"/>
      </DataTable>
      
      {filteredTransactions.length === 0 && (
        <div className='flex flex-col items-center justify-center mt-8'>
            <img src={emptyIllustration} alt="empty" width="130" />
            <p className='text-primary text-2xl font-semibold'>Start by searching Rice ID</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;