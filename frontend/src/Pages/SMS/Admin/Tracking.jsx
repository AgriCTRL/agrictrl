import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';

import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Search,
    Wheat,
    ThermometerSun,
    Factory,
    MapPin,
    Shovel,
} from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import emptyIllustration from '@/images/illustrations/space.svg';
import CardComponent from '@/Components/CardComponent';
import Loader from '@/Components/Loader';

const Tracking = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [transactions, setTransactions] = useState([

    ]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('palay');
    const [loading, setLoading] = useState(true);
    const [statuses, setStatuses] = useState([
        {
            label: 'Palay',
            icon: <Wheat className='text-primary' />
        },
        {
            label: 'Drying',
            icon: <ThermometerSun className='text-primary' />
        },
        {
            label: 'Milling',
            icon: <Factory className='text-primary' />
        },
        {
            label: 'Rice',
            icon: <Wheat className='text-primary' />
        },
    ]);

    useEffect(() => {
        fetchTransactions();
    }, [selectedStatus]);

    useEffect(() => {
        filterTransactions();
    }, [transactions, selectedStatus, globalFilter]);

    const getStatusFromPalayBatch = (palayBatch, processingBatch, riceDetails) => {
        // Check for rice status (has rice batch or status is Milled)
        if (riceDetails?.riceBatch || palayBatch.status === 'Milled') {
            return 'rice';
        }
    
        // Check for milling status
        if (processingBatch?.millingBatch || palayBatch.status === 'In Milling') {
            return 'milling';
        }
    
        // Check for drying status
        if (processingBatch?.dryingBatch || palayBatch.status === 'In Drying') {
            return 'drying';
        }
    
        // Default to palay status
        return 'palay';
    };  

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/inventory/enhanced`);
            const data = await response.json();
            
            // Transform and filter the data based on current status and item type
            const transformedData = data
                .filter(item => {
                    // First filter for Palay transactions
                    const hasOnlyPalayTransactions = item.transactions?.every(t => t.item === "Palay") ?? true;
                    return hasOnlyPalayTransactions;
                })
                .map(item => transformTransactionData(item))
                .filter(item => item.status === selectedStatus);

            setTransactions(transformedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformTransactionData = (item) => {
        const status = getStatusFromPalayBatch(
            item.palayBatch,
            item.processingBatch,
            item.riceDetails
        );

        const timelineEvents = generateTimelineEvents(item);
        
        return {
            id: item.palayBatch.id,
            tracking_id: `PB-${item.palayBatch.id}`,
            batchNo: item.palayBatch.id,
            farmers: {
                id: item.palayBatch.palaySupplierId,
                name: item.palayBatch.palaySupplier?.farmerName || 'Unknown Farmer'
            },
            status: status,
            timeline: timelineEvents,
            warehouse: item.palayBatch.currentlyAt,
            date_received: item.palayBatch.dateBought,
            quantity: item.palayBatch.quantityBags,
            drying: item.processingBatch?.dryingBatch ? {
                date_received: item.processingBatch.dryingBatch.startDateTime,
                warehouse: `Dryer ${item.processingBatch.dryingBatch.dryerId}`
            } : null,
            milling: item.processingBatch?.millingBatch ? {
                date_received: item.processingBatch.millingBatch.startDateTime,
                warehouse: `Miller ${item.processingBatch.millingBatch.millerId}`
            } : null
        };
    };

    const transformTransactionToEvent = (transaction) => {
        // Determine the event type based on the transaction details
        let type = transaction.item.toUpperCase();
        let location = '';
    
        // Set location based on the toLocationType and toLocationId
        switch (transaction.toLocationType) {
            case 'Warehouse':
                location = `Warehouse ${transaction.toLocationId}`;
                break;
            case 'Dryer':
                type = 'TO DRYING';
                location = `Dryer ${transaction.toLocationId}`;
                break;
            case 'Miller':
                type = 'TO MILLING';
                location = `Miller ${transaction.toLocationId}`;
                break;
            default:
                location = `${transaction.toLocationType} ${transaction.toLocationId}`;
        }
    
        // Special cases for transitions
        if (transaction.fromLocationType === 'Dryer' && transaction.toLocationType === 'Warehouse') {
            type = 'FROM DRYING';
        } else if (transaction.fromLocationType === 'Miller' && transaction.toLocationType === 'Warehouse') {
            type = 'FROM MILLING';
        }
    
        return {
            type,
            receiveDateTime: transaction.receiveDateTime,
            sendDateTime: transaction.sendDateTime,
            location,
            remarks: transaction.remarks
        };
    };
    
    const generateTimelineEvents = (item) => {
        // Transform transactions into events
        const events = item.transactions?.map(transformTransactionToEvent) || [];
        
        // Use the provided generateTimeline function
        return generateTimeline(
            events,
            item.processingBatch,
            item.riceDetails
        );
    };
    
    const generateTimeline = (events, processingBatch, riceDetails) => {
        const timeline = [];
    
        // Add events based on the current status and available data
        if (events.length > 0) {
            timeline.push(...events.map(event => ({
                status: event.type,
                date: event.receiveDateTime || event.sendDateTime,
                location: event.location,
                remarks: event.remarks
            })));
        }
    
        // Sort timeline by date
        return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const handleStatusChange = (newStatus) => {
        // Can't unselect status, can only change to a different one
        if (newStatus !== selectedStatus) {
            setSelectedStatus(newStatus.toLowerCase());
        }
    };

    const StatusSelector = () => (
        <div className="bg-gradient-to-r from-secondary to-primary rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center px-20">
                {statuses.map((status, index) => (
                    <React.Fragment key={index}>
                        <div 
                            className={`flex flex-col px-4 items-center cursor-pointer 
                                ${selectedStatus.toLowerCase() === status.label.toLowerCase() ? 'opacity-100' : 'opacity-70'}`}
                            onClick={() => handleStatusChange(status.label)}
                        >
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                                {status.icon}
                            </div>
                            <div className="text-sm text-white capitalize">{status.label}</div>
                        </div>
                        {index < statuses.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const filterTransactions = () => {
        let filtered = [...transactions];
        
        if (globalFilter) {
            filtered = filtered.filter(transaction => 
                transaction.batchNo.toString().toLowerCase().includes(globalFilter.toLowerCase()) ||
                transaction.farmers.name.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }
        
        setFilteredTransactions(filtered);
    };

    const expandedContent = (rowData) => {
        const customizedMarker = (item) => {
            switch (item.status) {
                case 'PALAY':
                    return <Wheat className="text-green-500" />;
                case 'TO DRYING':
                case 'FROM DRYING':
                    return <ThermometerSun className="text-yellow-500" />;
                case 'TO MILLING':
                case 'FROM MILLING':
                    return <Factory className="text-blue-500" />;
                case 'RICE':
                    return <Wheat className="text-gray-500" />;
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
                            day: 'numeric'
                        })}</div>
                        <div>{item.location}</div>
                        {item.remarks && <div className="text-gray-500">{item.remarks}</div>}
                    </div>
                )}
            />
        );
    };

    const rowExpansionTemplate = (data) => {
        return expandedRows && expandedRows[data.id] ? expandedContent(data) : null;
    };

    const headerTemplate = (icon, text) => {
        return (
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-semibold">{text}</span>
            </div>
        );
    };

    const emptyData = () => (
        <div className='flex flex-col items-center justify-center py-12 gap-4'>
            <img src={emptyIllustration} alt="empty" width="130" />
            <p className='text-primary text-2xl font-semibold'>No Data Found</p>
        </div>
    );

    return (
        <AdminLayout activePage="Tracking">
            <div className="flex flex-col gap-4 py-4 w-full h-full bg-[#F1F5F9]">
                <div>
                    <span className="p-input-icon-left w-full"> 
                        <Search className="ml-4 -translate-y-1 text-primary" />
                        <InputText
                            type="search"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-lg placeholder-primary text-primary border-transparent focus:border-primary hover:border-primary ring-0"
                            placeholder="Search by Batch ID"
                        />
                    </span>
                </div>

                <StatusSelector />
                
                {loading ? (
                    <Loader />
                ) : filteredTransactions.length === 0 ? (
                    emptyData()
                ) : (
                    <CardComponent className="bg-white">
                        <DataTable 
                            value={filteredTransactions} 
                            expandedRows={expandedRows} 
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={rowExpansionTemplate}
                            dataKey="id" 
                            className='w-full tracking'
                        >
                            <Column expander={true} style={{ width: '5rem' }} />
                            <Column field="tracking_id" header={headerTemplate(<MapPin />, 'Tracking ID')} />
                            {/* <Column field="farmers.name" header={headerTemplate(<Shovel />, 'Farmer Name')} /> */}
                        </DataTable>
                    </CardComponent>
                )}
            </div>
        </AdminLayout>
    );
};

export default Tracking;