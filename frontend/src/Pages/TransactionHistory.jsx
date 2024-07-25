import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { InputText } from 'primereact/inputtext';
import { AlertCircle, ChevronDown, ChevronUp, Search, Wheat, ThermometerSun, Factory, WheatOff, ArrowLeftToLine } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [globalFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    const mockData = [
      {
        id: 1,
        riceID: '1',
        type: 'asd',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
            {
        id: 1,
        riceID: '2',
        type: 'asd',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
            {
        id: 1,
        riceID: '3',
        type: 'asd',
        timeline: [
          { status: 'PALAY', date: '2022-02-07T12:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'DRYING', date: '2022-02-07T10:55:00', location: 'PASIR GUDANG, MY' },
          { status: 'MILLING', date: '2022-02-05T06:44:00', location: 'MUAR, MY' },
          { status: 'RICE', date: '2022-02-05T05:54:00', location: 'MUAR, MY' },
        ]
      },
            {
        id: 1,
        riceID: '4',
        type: 'asd',
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

  const filterTransactions = () => {
    if (globalFilter) {
      const filtered = transactions.filter(transaction => 
        transaction.riceID.toLowerCase().includes(globalFilter.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
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
    <div className=" ml-4 flex items-center p-2 text-[#00C261]">
      <Wheat className="mr-2"/>
      <span className="text-lg">Rice ID</span>
    </div>
  );

  const typeHeader = () => (
    <div className="flex items-center text-[#00C261]">
      <Factory className="mr-2"/>
      <span className="text-lg">Type</span>
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
        dataKey="id"
        loading={loading}
        className="p-datatable-sm border-none mb-10 rounded-lg"
        rowClassName={() => 'h-16'}
        emptyMessage="No transactions found."
      >
        <Column field="riceID" header={riceIDHeader} className="pl-20"/>
        <Column field="type" header={typeHeader} className="pl-"/>
      </DataTable>
      {filteredTransactions.length === 0 && (
        <div className="text-center text-4xl text-[#00C261] mb-4">
          Start by Searching RICE ID
        </div>
      )}

      {filteredTransactions.map((transaction) => (
        <div key={transaction.id} className="">
          {expandedContent(transaction)}
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
