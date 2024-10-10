import React, { useState, useEffect } from 'react';
import PrivateMillerLayout from '../../../Layouts/PrivateMillerLayout';
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Tag } from 'primereact/tag';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


function CustomDateRangeSelector({ selectedFilter, onChange, disabled }) {
  const [currentDate, setCurrentDate] = useState(getStartOfWeek(new Date()));

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  const formatDateRange = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (selectedFilter === 'weekly') {
      const start = new Date(currentDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    } else if (selectedFilter === 'monthly') {
      return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (selectedFilter === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (selectedFilter === 'monthly') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setFullYear(newDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
    onChange(newDate);
  };

  useEffect(() => {
    onChange(currentDate);
  }, [selectedFilter]);

  return (
    <div className="flex items-center space-x-2 bg-primary text-white rounded-full">
      <Button icon={<ChevronLeft size={20} />} onClick={() => navigate(-1)} className="p-button-text text-white ring-0" disabled={disabled} />
      <span className="text-lg font-semibold">{formatDateRange()}</span>
      <Button icon={<ChevronRight size={20} />} onClick={() => navigate(1)} className="p-button-text text-white ring-0" disabled={disabled} />
    </div>
  );
}

function History() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [selectedFilter, setSelectedFilter] = useState('weekly');
    const [currentDate, setCurrentDate] = useState(getStartOfWeek(new Date()));
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showAll, setShowAll] = useState(false);

    function getStartOfWeek(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      return new Date(d.setDate(diff));
    }

    const displayModeOptions = [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annually', value: 'annually' },
    ];

    // Mock data with varied dates
    const mockOrders = [
        { id: 1, status: 'COMPLETED', date: new Date(2024, 9, 1), description: 'Order 1' },
        { id: 2, status: 'DECLINED', date: new Date(2024, 9, 2), description: 'Order 2' },
        { id: 3, status: 'COMPLETED', date: new Date(2024, 9, 5), description: 'Order 3' },
        { id: 4, status: 'COMPLETED', date: new Date(2024, 9, 10), description: 'Order 4' },
        { id: 5, status: 'DECLINED', date: new Date(2024, 9, 15), description: 'Order 5' },
        { id: 6, status: 'COMPLETED', date: new Date(2024, 8, 25), description: 'Order 6' },
        { id: 7, status: 'COMPLETED', date: new Date(2024, 8, 28), description: 'Order 7' },
        { id: 8, status: 'DECLINED', date: new Date(2024, 7, 15), description: 'Order 8' },
        { id: 9, status: 'COMPLETED', date: new Date(2024, 7, 20), description: 'Order 9' },
        { id: 10, status: 'COMPLETED', date: new Date(2024, 6, 1), description: 'Order 10' },
        { id: 11, status: 'DECLINED', date: new Date(2024, 5, 15), description: 'Order 11' },
        { id: 12, status: 'COMPLETED', date: new Date(2024, 4, 1), description: 'Order 12' },
        { id: 13, status: 'COMPLETED', date: new Date(2023, 11, 25), description: 'Order 13' },
        { id: 14, status: 'DECLINED', date: new Date(2023, 10, 10), description: 'Order 14' },
        { id: 15, status: 'COMPLETED', date: new Date(2023, 9, 5), description: 'Order 15' },
    ];

    useEffect(() => {
        filterOrders();
    }, [selectedFilter, currentDate, globalFilterValue, showAll]);

    const filterOrders = () => {
        let filtered = [...mockOrders];

        if (!showAll) {
            // Apply date range filter
            filtered = filtered.filter(order => {
                if (selectedFilter === 'weekly') {
                    const weekStart = new Date(currentDate);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return order.date >= weekStart && order.date <= weekEnd;
                } else if (selectedFilter === 'monthly') {
                    return order.date.getMonth() === currentDate.getMonth() &&
                           order.date.getFullYear() === currentDate.getFullYear();
                } else {
                    return order.date.getFullYear() === currentDate.getFullYear();
                }
            });
        }

        // Apply global filter
        if (globalFilterValue) {
            filtered = filtered.filter(order =>
                order.description.toLowerCase().includes(globalFilterValue.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <PrivateMillerLayout activePage="History">
            <div className="flex flex-col px-10 py-2 h-full bg-[#F1F5F9]">
                <div className="flex flex-col justify-center items-center p-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary mb-2">
                    <h1 className="text-5xl h-full text-white font-bold mb-2">History</h1>
                    <span className="p-input-icon-left w-1/2 mr-4">
                        <Search className="text-primary ml-2 -translate-y-1"/>
                        <InputText 
                            type="search"
                            value={globalFilterValue} 
                            onChange={(e) => setGlobalFilterValue(e.target.value)} 
                            placeholder="Tap to Search" 
                            className="w-full pl-10 pr-4 py-2 rounded-full text-primary border border-gray-300 ring-0 placeholder:text-primary"
                        />
                    </span>
                </div>

                {/* Buttons & Filters */}
                <div className="flex items-center space-x-4 p-4 rounded-lg mb-4">
                    <Button 
                        label="All" 
                        className={`p-button-text bg-white rounded-md ring-0  ${showAll ? 'bg-gradient-to-r from-primary to-secondary border-none text-white' : ''}`}
                        onClick={toggleShowAll}
                    />
                    <Dropdown
                        value={selectedFilter}
                        options={displayModeOptions}
                        onChange={(e) => setSelectedFilter(e.value)}
                        className="w-40 rounded-full bg-primary ring-0 custom-dropdown"
                        style={{ color: 'white' }}
                        disabled={showAll}
                    />
                    <CustomDateRangeSelector 
                        selectedFilter={selectedFilter}
                        onChange={setCurrentDate}
                        disabled={showAll}
                    />
                </div>

                {/* Data */}
                <div className=" overflow-hidden">
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border-b bg-white rounded-xl mb-4">
                                <div className="flex items-center">
                                    <img src="/profileAvatar.png" alt="User" className="rounded-full mr-4 h-16 w-16" />
                                    <span>{order.description}</span>
                                    <Tag 
                                        value={order.status} 
                                        severity={order.status === 'COMPLETED' ? 'success' : 'danger'}
                                        className="ml-4"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4">{order.date.toLocaleDateString()}</span>
                                    <Button icon="pi pi-ellipsis-v" className="p-button-text" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PrivateMillerLayout>
    );
}

export default History;