import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
        
import { 
    AlertCircle, 
    ChevronDown, 
    ChevronUp, 
    Search, 
    Wheat, 
    ThermometerSun, 
    Factory, 
    WheatOff, 
    RefreshCcw, 
    PackageCheck, 
    MapPin, 
    Shovel, 
    FactoryIcon 
} from 'lucide-react';

import emptyIllustration from '@/images/illustrations/space.svg';
import CardComponent from '../../../Components/CardComponent';

//TODO: rice recipients tracking

const Tracking = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [statuses, setStatuses] = useState([
        {
            label: 'Palay', 
            icon: <Wheat className='text-primary' />
        },
        {
            label: 'Processing', 
            icon: <RefreshCcw className='text-primary' />
        },
        {
            label: 'Rice', 
            icon: <Wheat className='text-primary' />
        },
        {
            label: 'Delivered', 
            icon: <PackageCheck className='text-primary' />
        },
    ]);
    const searchPlaceholders = [
        "batch ID",
        "ID",
        "Tracking ID",
        "status"
    ];
    const [searchPlaceholder, setSearchPlaceholder] = useState(searchPlaceholders[0]);

    // test data use states
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            batchNo: 1,
            tracking_id: 12345,
            warehouse: "Main Warehouse",
            date_received: '2023-08-16',
            quantity: 10,
            farmers: {
                id: 1,
                name: "Batitang Rice Farmers Organization"
            },
            status: "Delivered",
            drying: {
                "date_received": "2023-08-18",
                "warehouse": "Drying Facility A"
            },
            milling: {
                "date_received": "2023-09-18",
                "warehouse": "Milling Facility A"
            },
            delivery: {
                "date": "2023-10-18",
                "warehouse": "Delivery Facility A"
            }
        },
        {
            id: 2,
            batchNo: 2,
            tracking_id: 67890,
            warehouse: "Main Warehouse",
            date_received: '2023-08-16',
            quantity: 10,
            farmers: {
                id: 2,
                name: "Mang Juan Dela Cruz"
            },
            status: 'Rice',
            drying: {
                "date_received": "2023-08-18",
                "warehouse": "Drying Facility B"
            },
            milling: {
                "date_received": "2023-09-18",
                "warehouse": "Milling Facility B"
            },
            delivery: null
        },
        {
            id: 3,
            batchNo: 3,
            tracking_id: 24680,
            warehouse: "Main Warehouse",
            date_received: '2023-08-16',
            quantity: 10,
            farmers: {
                id: 3,
                name: "Rapido Romualdo"
            },
            status: 'Milling',
            drying: {
                "date_received": "2023-08-18",
                "warehouse": "Drying Facility C"
            },
            milling: {
                "date_received": "2023-09-18",
                "warehouse": "Milling Facility C"
            },
            delivery: null
        },
        {
            id: 4,
            tracking_id: 54321,
            batchNo: 4,
            warehouse: "Main Warehouse",
            date_received: '2023-08-16',
            quantity: 10,
            farmers: {
                id: 4,
                name: "Mang Juan Dela Cruz Farming Red"
            },
            status: 'Drying',
            drying: {
                "date_received": "2023-08-18",
                "warehouse": "Drying Facility D"
            },
            milling: null,
            delivery: null
        }
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        filterTransactions();
    }, [transactions, selectedStatus, globalFilter]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSearchPlaceholder(prev => 
                searchPlaceholders[(searchPlaceholders.indexOf(prev) + 1) % searchPlaceholders.length]
            );
        }, 2000);

        return () => clearInterval(intervalId); 
    }, [])

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
            batchNo: batch.id.toString(),
            status: batch.status,
            timeline: timeline.sort((a, b) => new Date(b.date) - new Date(a.date))
            };
        });

        // setTransactions(processedTransactions);
        } catch (error) {
        console.error('Error fetching transactions:', error);
        // setTransactions([]);
        }
        setLoading(false);
    };

    const filterTransactions = () => {
        const processingStatuses = new Set(["milling", "drying", "harvested", "planted palay"]);
        
        let filtered = [];
        
        if (selectedStatus) {
            filtered = transactions.filter((transaction) => {
                let transaction_status = transaction.status.toLowerCase();
                if (processingStatuses.has(transaction_status)) {
                    transaction_status = "processing";
                }

                return transaction_status === selectedStatus
            });
        }

        if (globalFilter) {
            filtered = transactions.filter((transaction) => 
                transaction.id.toString().includes(globalFilter) ||
                transaction.batchNo.toString().includes(globalFilter) ||
                transaction.tracking_id.toString().includes(globalFilter) ||
                transaction.status.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        setFilteredTransactions(filtered);
    };

    const toggleRow = (rowData) => {
        setExpandedRows((prevExpandedRows) => {
            if (prevExpandedRows && prevExpandedRows[rowData.id]) {
                return {};
            }
            return { [rowData.id]: true };
        });
    };

    // test row expansion template
    const rowExpansionTemplate = (data) => {
        const timeline = [
            {
                status: 'palay',
                icon: <Wheat className='text-primary' size={16} />,
                date: data.date_received,
                location: data.warehouse
            },
            {
                status: 'drying',
                icon: <ThermometerSun className='text-primary' size={16} />,
                date: data.drying?.date_received,
                location: data.drying?.warehouse
            },
            {
                status: 'milling',
                icon: <Factory className='text-primary' size={16} />,
                date: data.milling?.date_received,
                location: data.milling?.warehouse
            },
            {
                status: 'rice',
                icon: <Wheat className='text-primary' size={16} />,
                date: data.palay?.date_received,
                location: data.palay?.warehouse
            },
            {
                status: 'delivered',
                icon: <PackageCheck className='text-primary' size={16} />,
                date: data.delivery?.date,
                location: data.delivery?.warehouse
            }
        ];

        const statusIndexMap = {
            'palay': 0,
            'drying': 1,
            'milling': 2,
            'rice': 3,
            'delivered': 4
        };

        const currentStatusIndex = statusIndexMap[data.status.toLowerCase()] ?? 0;

        const filteredTimeline = timeline.slice(0, currentStatusIndex + 1);

        return (
            <div className="flex items-center justify-center">
                <Timeline 
                    value={filteredTimeline} 
                    opposite={(item) =>
                        <div className='flex flex-col items-end'>
                            <p className='text-primary font-semibold'>{item.status}</p>
                            <small className='flex gap-2 items-center'><MapPin size={16}/> {item.location}</small>
                        </div>
                    } 
                    content={(item) => 
                        <small className="text-color-secondary">
                            {item.date}
                        </small>
                    } 
                    marker={(item) => 
                        <div className='rounded-full border border-primary p-2 mb-4'>
                            {item.icon}
                        </div>
                    }
                    className="tracking py-4"
                />
            </div>
        );
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

    const emptyData = () => (
        <div className='flex flex-col items-center justify-center py-12 gap-4'>
            <img src={emptyIllustration} alt="empty" width="130" />
            <p className='text-primary text-2xl font-semibold'>No Data Found</p>
        </div>
    );

    const headerTemplate = (icon, label) => {
        return (
            <span className="flex items-center gap-2 text-primary">
                {icon} <p className="font-semibold text-primary">{label}</p>
            </span>
        )
    }

    return (
        <AdminLayout activePage="Tracking">
            <div className="flex flex-col gap-4 py-4 w-full h-full bg-[#F1F5F9]">
                <div>
                    <span className="p-input-icon-left w-full"> 
                        <Search className="ml-4 -translate-y-1 text-primary" />
                        <InputText
                            type="search"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={`Search by ${searchPlaceholder}`}
                            className="w-full pl-12 pr-4 py-4 rounded-lg placeholder-primary text-primary border-transparent focus:border-primary hover:border-primary ring-0"
                        />
                    </span>
                </div>

                <div className="bg-gradient-to-r from-secondary to-primary rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center px-20">
                        {statuses.map((status, index) => (
                            <>
                                <div 
                                    key={index} 
                                    className={`flex flex-col px-4 items-center cursor-pointer ${selectedStatus?.toLowerCase() === status.label.toLowerCase() ? 'opacity-100' : 'opacity-70'}`}
                                    onClick={() => setSelectedStatus(selectedStatus?.toLowerCase() === status.label.toLowerCase() ? null : status.label.toLowerCase())}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                                        {status.icon}
                                    </div>
                                    <div className="text-sm text-white capitalize">{status.label}</div>
                                </div>
                                <Divider className={`${index === statuses.length - 1 ? 'hidden' : 'block'}`} />
                            </>
                        ))}
                    </div>
                </div>
                
                {filteredTransactions.length === 0 ? (
                    emptyData()
                ) : (
                    <CardComponent>
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
                            <Column field="farmers.name" header={headerTemplate(<Shovel />, 'Farmer Name')} />
                        </DataTable>
                    </CardComponent>
                )}
            </div>
        </AdminLayout>
    );
};

export default Tracking;