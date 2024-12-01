import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { VirtualScroller } from 'primereact/virtualscroller';
import { Divider } from 'primereact/divider';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertCircle, Search, Wheat, ThermometerSun, Factory, Warehouse,  MapPin, ChevronDown, ChevronUp, Truck } from 'lucide-react';
import emptyIllustration from '../../../../public/illustrations/space.svg';
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
        const lastTransaction = item.transactions?.[item.transactions.length - 1];
        let currentStatus = selectedStatus;
        let displayWarehouse = item.palayBatch.currentlyAt;
        let locationName = lastTransaction?.locationName || 'Unknown Location';
        
        if (lastTransaction) {
            switch (lastTransaction.toLocationType) {
                case 'Miller':
                    currentStatus = 'milling';
                    displayWarehouse = `Miller ${lastTransaction.toLocationId}`;
                    break;
                case 'Dryer':
                    currentStatus = 'drying';
                    displayWarehouse = `Dryer ${lastTransaction.toLocationId}`;
                    break;
                case 'Warehouse':
                    if (lastTransaction.item === 'Rice') {
                        currentStatus = 'rice';
                        displayWarehouse = `Warehouse ${lastTransaction.toLocationId}`;
                    } else if (lastTransaction.fromLocationType === 'Dryer') {
                        currentStatus = 'palay';
                        displayWarehouse = `Warehouse ${lastTransaction.toLocationId}`;
                    } else {
                        currentStatus = 'palay';
                        displayWarehouse = `Warehouse ${lastTransaction.toLocationId}`;
                    }
                    break;
            }

            // Check if there's a distribution transaction for this batch
            const distributionTransaction = item.transactions.find(
                t => t.toLocationType === 'Distribution' && t.itemId === item.palayBatch.id
            );

            if (distributionTransaction && currentStatus === 'rice') {
                displayWarehouse = `Distributed`;
                locationName = 'Distributed';
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
            warehouse: displayWarehouse,
            locationName: locationName,
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
        const palayBatch = item.palayBatch;
        const transactions = item.transactions || [];
    
        // 1. Origin event
        events.push({
            status: 'FARM ORIGIN',
            date: palayBatch.dateBought,
            location: `${palayBatch.farm?.region || 'Unknown Region'}, ${palayBatch.farm?.province || 'Unknown Province'}`,
            remarks: 'Farm Origin',
            sortOrder: 1
        });
    
        // 2. Procurement event
        events.push({
            status: 'BOUGHT AT',
            date: palayBatch.dateBought,
            location: `${palayBatch.buyingStationName || 'undefined'}`,
            remarks: 'Initial Procurement',
            sortOrder: 2
        });
    
        // 3. Add all transactions with detailed status logic
        const transactionEvents = transactions.map((transaction, index) => {
            let status;
            let location;
            let userName;
            let organization;
            
            const eventDate = transaction.sendDateTime;
    
            // Determine status based on transaction details and status
            switch (transaction.toLocationType) {
                case 'Warehouse':
                    if (transaction.item === 'Rice') {
                        status = transaction.status === 'Pending' 
                            ? 'TRANSPORTING' 
                            : 'STORED AT (MILLED)';
                    } else {
                        status = transaction.status === 'Pending' 
                            ? 'TRANSPORTING' 
                            : 'STORED AT (UNMILLED)';
                    }
                    location = transaction.locationName;
                    break;
                
                case 'Dryer':
                    status = transaction.status === 'Pending' 
                        ? 'TRANSPORTING' 
                        : 'DRIED AT';
                    location = transaction.locationName;
                    break;
                
                case 'Miller':
                    status = transaction.status === 'Pending' 
                        ? 'TRANSPORTING' 
                        : 'MILLED AT';
                    location = transaction.locationName;
                    break;
                
                case 'Distribution':
                    if (transaction.itemId === item.palayBatch.id) {
                        status = transaction.status === 'Pending' 
                            ? 'TRANSPORTING' 
                            : 'DISTRIBUTED';
                        location = transaction.userName;
                        organization = transaction.organization;
                    }
                    break;
            }
    
            if (status) {
                return {
                    status: status,
                    date: eventDate,
                    location: location,
                    remarks: transaction.remarks,
                    sortOrder: 3 + index,
                    organization: organization
                };
            }
            return null;
        }).filter(event => event !== null);
    
        events.push(...transactionEvents);
    
        // Sort events
        return events.sort((a, b) => {
            if (a.sortOrder !== b.sortOrder) {
                return a.sortOrder - b.sortOrder;
            }
            return new Date(a.date) - new Date(b.date);
        });
    };
    
    const renderTimelineEvent = (event) => (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                {getTimelineIcon(event.status)}
            </div>
            
            <div className="text-sm text-center mt-4 w-40">
                <div className="font-bold text-base mb-1">{event.status}</div>
                <div className="text-gray-700 mb-1">
                    {/* Ensure consistent timezone handling */}
                    {new Date(event.date).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'UTC'
                    })}
                </div>
                <div className="text-gray-600">{event.location}</div>
                {event.status === "DISTRIBUTED" && <div className="text-gray-600">{event.organization}</div>}
            </div>
        </div>
    );

    const getTimelineIcon = (status) => {
        const iconSize = 32;
        switch (status) {
            case 'FARM ORIGIN':
                return <MapPin className="text-green-700" size={iconSize} />;
            case 'BOUGHT AT':
                return <Wheat className="text-green-500" size={iconSize} />;
            case 'STORED AT (UNMILLED)':
            case 'STORED AT (MILLED)':
                return <Warehouse className="text-blue-500" size={iconSize} />;
            case 'TRANSPORTING':
                return <Truck className="text-yellow-500" size={iconSize} />;
            case 'DRIED AT':
                return <ThermometerSun className="text-orange-500" size={iconSize} />;
            case 'MILLED AT':
                return <Factory className="text-purple-500" size={iconSize} />;
            case 'DISTRIBUTED':
                return <Truck  className="text-green-500" size={iconSize} />;
            default:
                return <AlertCircle className="text-red-500" size={iconSize} />;
        }
    };

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

    const timelineTemplate = (items, props) => {
        return (
            <div className="flex items-center p-4">
                {renderTimelineEvent(items)}
                {props.index < props.count - 1 && (
                    <div className="flex-shrink-0 ml-6">
                        <div className="h-0.5 w-20 bg-gray-400" />
                    </div>
                )}
            </div>
        );
    };

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
                                <p className="font-medium">{item.locationName}</p>
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
                    <div className="border-t bg-gray-200 rounded-b-lg w-full">
                        <div className="relative w-full overflow-hidden">
                            <VirtualScroller
                                items={item.timeline}
                                itemSize={240}
                                orientation="horizontal"
                                className="overflow-x-auto"
                                contentClassName="flex items-center"
                                itemTemplate={timelineTemplate}
                                showLoader={false}
                                style={{ height: '250px' }}
                            />
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
                            placeholder="Search tracking ID or farmer name..."
                        />
                    </span>
                </div>

                <StatusSelector />

                {loading ? (
                    <Loader />
                ) : (
                    <div 
                        className="relative flex flex-col"
                        style={{ height: "calc(100vh - 360px)" }}
                    >
                        <DataView
                            value={transactions}
                            itemTemplate={itemTemplate}
                            lazy
                            paginator
                            rows={rows}
                            first={first}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            emptyMessage={emptyMessage}
                            className="overflow-y-auto pb-16"
                            paginatorClassName="absolute bottom-0 left-0 right-0 bg-white border-t"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Tracking;