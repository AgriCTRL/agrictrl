import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertCircle, Search, Wheat, ThermometerSun, Factory, Warehouse,  MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import emptyIllustration from '@/images/illustrations/space.svg';
import CardComponent from '../../../Components/CardComponent';
import Loader from '../../../Components/Loader';

const Tracking = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [transactions, setTransactions] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('palay');
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows] = useState(10);

    const statuses = [
        { label: 'Palay', icon: <Wheat className="text-primary" /> },
        { label: 'Drying', icon: <ThermometerSun className="text-primary" /> },
        { label: 'Milling', icon: <Factory className="text-primary" /> },
        { label: 'Rice', icon: <Wheat className="text-primary" /> },
    ];

    useEffect(() => {
        fetchTransactions();
    }, [selectedStatus, first, rows, globalFilter]);

    const getStatusQuery = (status) => {
        switch (status) {
            case 'palay':
                return ['To be Mill', 'To be Dry'];
            case 'drying':
                return ['In Drying'];
            case 'milling':
                return ['In Milling'];
            case 'rice':
                return ['Milled'];
            default:
                return ['To be Mill', 'To be Dry'];
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const statuses = getStatusQuery(selectedStatus);
            const results = await Promise.all(
                statuses.map(async (status) => {
                    const queryParams = new URLSearchParams({
                        limit: rows.toString(),
                        offset: first.toString(),
                        palayBatchStatus: status
                    });

                    if (globalFilter) {
                        queryParams.append('search', globalFilter);
                    }

                    const response = await fetch(`${apiUrl}/inventory/enhanced?${queryParams}`);
                    const data = await response.json();
                    return data;
                })
            );

            // Combine results from multiple statuses
            const combinedItems = results.flatMap(result => result.items);
            const combinedTotal = results.reduce((acc, result) => acc + result.total, 0);

            // Remove the filter that was excluding rice transactions
            const transformedData = combinedItems.map(item => transformTransactionData(item));

            setTransactions(transformedData);
            setTotalRecords(combinedTotal);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformTransactionData = (item) => {
        // Determine the current status based on the last transaction's toLocation
        const lastTransaction = item.transactions?.[item.transactions.length - 1];
        let currentStatus = selectedStatus;
        
        if (lastTransaction) {
            switch (lastTransaction.toLocationType) {
                case 'Miller':
                    currentStatus = 'milling';
                    break;
                case 'Dryer':
                    currentStatus = 'drying';
                    break;
                case 'Warehouse':
                    // If it's coming from a Miller, it's rice
                    if (lastTransaction.item === 'Rice') {
                        currentStatus = 'rice';
                    } else if (lastTransaction.fromLocationType === 'Dryer') {
                        currentStatus = 'palay'; // Dried palay
                    } else {
                        currentStatus = 'palay';
                    }
                    break;
            }
        }

        return {
            id: item.palayBatch.id,
            tracking_id: `PB-${item.palayBatch.id}`,
            batchNo: item.palayBatch.id,
            farmers: {
                id: item.palayBatch.palaySupplierId,
                name: item.palayBatch.palaySupplier?.farmerName || 'Unknown Farmer'
            },
            status: currentStatus,
            timeline: generateTimelineEvents(item),
            // Use the last transaction's toLocation as current warehouse
            warehouse: lastTransaction ? 
                `${lastTransaction.toLocationType} ${lastTransaction.toLocationId}` : 
                item.palayBatch.currentlyAt,
            date_received: item.palayBatch.dateBought,
            quantity: item.palayBatch.quantityBags,
            origin: {
                region: item.palayBatch.farm?.region || 'Unknown Region',
                province: item.palayBatch.farm?.province || 'Unknown Province'
            },
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

    const generateTimelineEvents = (item) => {
        const events = [];

        // Add farm origin as first event
        events.push({
            status: 'ORIGIN',
            date: item.palayBatch.dateBought,
            location: `${item.palayBatch.farm?.region || 'Unknown Region'}, ${item.palayBatch.farm?.province || 'Unknown Province'}`,
            remarks: 'Farm Origin'
        });

        // Add procurement event
        events.push({
            status: 'PROCUREMENT',
            date: item.palayBatch.dateBought,
            location: `Warehouse ${item.palayBatch.initialWarehouseId}`,
            remarks: 'Initial Procurement'
        });

        // Add all transactions based on toLocation
        const transactionEvents = item.transactions?.map(transaction => {
            let status;
            let location;

            // Determine status and location based on toLocation
            switch (transaction.toLocationType) {
                case 'Warehouse':
                    status = 'TO WAREHOUSE';
                    location = `Warehouse ${transaction.toLocationId}`;
                    break;
                case 'Dryer':
                    status = 'TO DRYING';
                    location = `Dryer ${transaction.toLocationId}`;
                    break;
                case 'Miller':
                    status = 'TO MILLING';
                    location = `Miller ${transaction.toLocationId}`;
                    break;
                default:
                    status = `TO ${transaction.toLocationType.toUpperCase()}`;
                    location = `${transaction.toLocationType} ${transaction.toLocationId}`;
            }

            // If the item type has changed to Rice, update the status accordingly
            if (transaction.item === 'Rice') {
                status = 'TO WAREHOUSE (MILLED)';
            }

            return {
                status: status,
                date: transaction.receiveDateTime || transaction.sendDateTime,
                location: location,
                remarks: transaction.remarks
            };
        }) || [];

        events.push(...transactionEvents);

        return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getTimelineIcon = (status) => {
        const iconSize = 32;
        switch (status) {
            case 'ORIGIN':
                return <MapPin className="text-green-700" size={iconSize} />;
            case 'PROCUREMENT':
                return <Wheat className="text-green-500" size={iconSize} />;
            case 'TO WAREHOUSE':
            case 'TO WAREHOUSE (MILLED)':
                return <Warehouse  className="text-blue-500" size={iconSize} />;
            case 'TO DRYING':
                return <ThermometerSun className="text-yellow-500" size={iconSize} />;
            case 'TO MILLING':
                return <Factory className="text-orange-500" size={iconSize} />;
            default:
                return <AlertCircle className="text-red-500" size={iconSize} />;
        }
    };

    const renderTimelineEvent = (event, index, totalEvents) => (
        <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                    {getTimelineIcon(event.status)}
                </div>
                
                <div className="text-sm text-center mt-4 w-40">
                    <div className="font-bold text-base mb-1">{event.status}</div>
                    <div className="text-gray-700 mb-1">
                        {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">{event.location}</div>
                </div>
            </div>

            {index < totalEvents - 1 && (
                <div className="flex-1 flex items-center mx-4">
                    <div className="h-0.5 w-20 bg-gray-400"/>
                </div>
            )}
        </div>
    );

    const handleStatusChange = (newStatus) => {
        if (newStatus !== selectedStatus) {
            setSelectedStatus(newStatus.toLowerCase());
            setFirst(0); // Reset pagination when status changes
        }
    };

    const StatusSelector = () => (
        <div className="bg-gradient-to-r from-secondary to-primary rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center px-20">
                {statuses.map((status, index) => (
                    <React.Fragment key={index}>
                        <div 
                            className={`flex flex-col px-4 items-center cursor-pointer 
                                ${selectedStatus === status.label.toLowerCase() ? 'opacity-100' : 'opacity-70'}`}
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

    const emptyMessage = () => (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <img src={emptyIllustration} alt="empty" width="130" />
            <p className="text-primary text-2xl font-semibold">No Data Found</p>
        </div>
    );

    const itemTemplate = (item) => {
        const isExpanded = expandedItems[item.id];
        
        return (
            <div className="gap-3 rounded-lg">
                <div 
                    className="p-4 cursor-pointer hover:bg-gray-200 rounded-t-lg w-full"
                    onClick={() => toggleExpand(item.id)}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{item.tracking_id}</h3>
                                <p className="text-gray-600">{item.farmers.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.origin.region}, {item.origin.province}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-medium">{item.warehouse}</p>
                            </div>
                            {isExpanded ? (
                                <ChevronUp className="text-gray-400" />
                            ) : (
                                <ChevronDown className="text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="p-4 border-t bg-gray-200 rounded-b-lg">
                        <div className="overflow-x-auto">
                            <div className="flex items-center min-w-max py-8 px-4">
                                {item.timeline.map((event, index) => 
                                    renderTimelineEvent(event, index, item.timeline.length)
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const onPage = (event) => {
        setFirst(event.first);
    };

    return (
        <AdminLayout activePage="Tracking">
            <div className="flex flex-col gap-4 py-4 w-full h-full bg-[#F1F5F9]">
                <div>
                    <span className="p-input-icon-left w-full">
                        <Search className="ml-4 -translate-y-1 text-primary" />
                        <InputText
                            value={globalFilter || ''}
                            onChange={(e) => {
                                setGlobalFilter(e.target.value);
                                setFirst(0);
                            }}
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