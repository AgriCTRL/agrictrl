import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { AlertCircle, Search, Wheat, ThermometerSun, Factory, WheatOff, ArrowLeftToLine } from 'lucide-react';
import emptyIllustration from '../../../public/illustrations/space.svg';

const TracknTrace = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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
        fetch(`${apiUrl}/palaybatches`),
        fetch(`${apiUrl}/warehouses`),
        fetch(`${apiUrl}/dryingprocesses`),
        fetch(`${apiUrl}/dryers`),
        fetch(`${apiUrl}/millingprocesses`),
        fetch(`${apiUrl}/millers`),
        fetch(`${apiUrl}/ricebatches`),
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
        transaction.riceID.toLowerCase().includes(globalFilter.toLowerCase())
      );
      setFilteredTransactions(filtered);

      if (filtered.length > 0) {
        setSelectedTransaction(filtered[0]);
      } else {
        setSelectedTransaction(null);
      }
    } else {
      setFilteredTransactions([]);
      setSelectedTransaction(null);
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

  const timelineContent = (timeline) => {
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
        value={timeline}
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
              // hour: '2-digit', 
              // minute: '2-digit', 
              // second: '2-digit',
              // hour12: true,
              // timeZone: 'UTC'
            })}</div>
            <div>{item.location}</div>
          </div>
        )}
      />
    );
  };

  const Header = () => {
    const navigate = useNavigate();

    return(
      <div className='flex flex-row p-6 rounded-lg mb-5 bg-gradient-to-r from-secondary to-primary'>
        <button onClick={() => navigate(-1)} className="flex items-center text-white">
          <ArrowLeftToLine className="w-6 h-6 mr-2 text-white"/>
          Go back
        </button>
        <div className="flex flex-grow"></div>
        <h1 className="text-white text-4xl mr-7 font-poppins font-bold">RICE EXPLORER!</h1>
        <div className="flex flex-grow"></div>
      </div>
    );
  };

  const riceIDHeader = () => (
    <div className="ml-4 flex items-center p-2 text-primary">
      <Wheat className="mr-2 h-5 w-5"/>
      <span className="text-md">Rice ID</span>
    </div>
  );

  const statusHeader = () => (
    <div className="flex items-center text-primary">
      <Factory className="mr-2 h-5 w-5"/>
      <span className="text-md">Status</span>
    </div>
  );

  const handleRowClick = (rowData) => {
    setSelectedTransaction(rowData);
  };

  return (
    <div className="p-4 w-screen h-screen pt-5 bg-[#F1F5F9]">
      <Header />
      <div className="mb-4">
        <span className="p-input-icon-left w-full"> 
          <Search className="ml-3 -translate-y-1 text-primary" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by Rice ID"
            className="pl-10 pr-4 py-4 rounded-lg placeholder-primary text-primary w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </span>
      </div>

      <DataTable
        value={filteredTransactions}
        className="p-datatable-sm border-none rounded-lg"
        rowClassName={() => 'h-16'}
        emptyMessage=" "
        onRowClick={(e) => handleRowClick(e.data)}
      >
        <Column field="riceID" header={riceIDHeader} className="pl-9"/>
        <Column field="status" header={statusHeader} body={statusBodyTemplate} className="-translate-x-6"/>
      </DataTable>

      {selectedTransaction && (
        <div className="mt-4">
          {timelineContent(selectedTransaction.timeline)}
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div className='flex flex-col items-center justify-center mt-8'>
          <img src={emptyIllustration} alt="empty" width="130" />
          <p className='text-primary text-2xl font-semibold'>Start by searching Rice ID</p>
        </div>
      )}
    </div>
  );
};

export default TracknTrace;
