import React, { useState, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
        
import { 
    X,
    Check,
    Plus,
    Wheat
} from "lucide-react";

import UserLayout from '@/Layouts/UserLayout';
import CardComponent from '@/Components/CardComponent';
import InputComponent from '@/Components/Form/InputComponent';

function Inventory() {
    const toast = useRef(null);
    const [isRiceRegFormVisible, setIsRiceRegFormVisible] = useState(false);
    const [newData, setNewData] = useState({
        status: "warehouse",
        price: null,
        quantity_kg: null,
        quality_specification_id: null,
        supplier_id: null,
        personnel_id: null,
        delivery_id: null,
        warehouse_id: null,
        date_received: null,
    });
    const [riceData, setRiceData] = useState(
        [
            {
                id: 1,
                status: "warehouse",
                price: 100,
                quantity_kg: 10,
                quality_specification_id: 1,
                supplier_id: 1,
                personnel_id: 1,
                delivery_id: 1,
                warehouse_id: 1,
                date_received: 1,
            },
            {
                id: 2,
                status: "warehouse",
                price: 100,
                quantity_kg: 10,
                quality_specification_id: 1,
                supplier_id: 1,
                personnel_id: 1,
                delivery_id: 1,
                warehouse_id: 1,
                date_received: 1,
            },
            {
                id: 3,
                status: "warehouse",
                price: 100,
                quantity_kg: 10,
                quality_specification_id: 1,
                supplier_id: 1,
                personnel_id: 1,
                delivery_id: 1,
                warehouse_id: 1,
                date_received: 1,
            },
            {
                id: 4,
                status: "warehouse",
                price: 100,
                quantity_kg: 10,
                quality_specification_id: 1,
                supplier_id: 1,
                personnel_id: 1,
                delivery_id: 1,
                warehouse_id: 1,
                date_received: 1,
            },
            {
                id: 5,
                status: "warehouse",
                price: 100,
                quantity_kg: 10,
                quality_specification_id: 1,
                supplier_id: 1,
                personnel_id: 1,
                delivery_id: 1,
                warehouse_id: 1,
                date_received: 1,
            }
        ]
    );

    const [statuses] = useState(['warehouse', 'milling', 'drying', 'dispatch']);

    const getSeverity = (value) => {
        switch (value) {
            case 'warehouse':
                return 'success';

            case 'milling':
                return 'warning';

            case 'drying':
                return 'danger';

            case 'dispatch':
                    return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let _products = [...riceData];
        let { newData, index } = e;

        _products[index] = newData;

        setRiceData(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="PHP" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)}></Tag>;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(rowData.price);
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    const handleNewDataOnChange = (key) => (e) => {
        setNewData({
            ...newData,
            [key]: e.target.value
        })
    }

    const handleRegisterData = () => {
        const newID = riceData[riceData.length - 1].id + 1;
        riceData.push({ id: newID, ...newData });
        setIsRiceRegFormVisible(false)
        resetNewData();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Palay Registered Successfully!' });
    }

    const resetNewData = () => {
        setNewData({
            status: "warehouse",
            price: null,
            quantity_kg: null,
            quality_specification_id: null,
            supplier_id: null,
            personnel_id: null,
            delivery_id: null,
            warehouse_id: null,
            date_received: null,
        });
    }

    const riceRegFormFooterContent = (
        <div className='flex justify-content-end gap-4'>
            <Button 
                onClick={() => setIsRiceRegFormVisible(false)} 
                className="flex items-center justify-center gap-4 w-3/6 rounded-md text-primary ring-1 ring-primary p-4 hover:bg-primary hover:text-white" 
            >
                <X size={20} />
                <p>Cancel</p>
            </Button>
            <Button 
                onClick={handleRegisterData} 
                autoFocus 
                className="flex items-center justify-center gap-4 w-3/6 rounded-md bg-primary text-white p-4 hover:bg-secondary" 
            >
                <Check size={20} />
                <p>Confirm</p>
            </Button>
        </div>
    );

    return (
        <UserLayout activePage="Inventory">
            <div className="flex flex-col items-center gap-4">
                <CardComponent className="w-full">
                    <Toast ref={toast} />
                    <Button 
                        onClick={() => setIsRiceRegFormVisible(true)} 
                        autoFocus 
                        className="flex items-center justify-center gap-4 rounded-md bg-primary text-white py-3 px-8 hover:bg-secondary" 
                    >
                        <Plus size={20} />
                        <p>Add New</p>
                    </Button>
                    <Dialog header="Header" visible={isRiceRegFormVisible} style={{ width: '50vw' }} onHide={() => {if (!isRiceRegFormVisible) return; setIsRiceRegFormVisible(false); }} footer={riceRegFormFooterContent}>
                        <section className='Palay Information flex flex-col gap-2'>
                            <p className='text-xl text-black font-semibold'>Palay Information</p>
                            {/* // TODO: Make this into a component */}
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-9">
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("price")}
                                            value={newData.price}
                                            placeholder="Price"
                                            aria-label="price"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Quantity (KG)</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("quantity_kg")}
                                            value={newData.quantity_kg}
                                            placeholder="Quantity (KG)"
                                            aria-label="quantity_kg"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Date Received</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("date_received")}
                                            value={newData.date_received}
                                            placeholder="Date Received"
                                            aria-label="date_received"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-9">
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Quality Specification</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("quality_specification_id")}
                                            value={newData.quality_specification_id}
                                            placeholder="Quality Specification"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Supplier</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("supplier_id")}
                                            value={newData.supplier_id}
                                            placeholder="Supplier"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Personnel</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("personnel_id")}
                                            value={newData.personnel_id}
                                            placeholder="Perssonnel"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-9">
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Delivery</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("delivery_id")}
                                            value={newData.delivery_id}
                                            placeholder="Delivery"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("status")}
                                            value={newData.status}
                                            placeholder="Status"
                                        />
                                    </div>
                                </div>
                                <div class="sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Warehouse</label>
                                    <div class="mt-2">
                                        <InputComponent 
                                            inputIcon={<Wheat size={20} />}
                                            onChange={handleNewDataOnChange("warehouse_id")}
                                            value={newData.warehouse_id}
                                            placeholder="Warehouse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Dialog>
                </CardComponent>

                <CardComponent className="w-full">
                    <div className='flex flex-col gap-10 p-6 w-full'>
                        <div className='flex gap-4 text-black'>
                            <Wheat />
                            <p className='font-bold'>Rice Tracked</p>
                        </div>
                        <DataTable 
                            scrollable
                            value={riceData} 
                            editMode="row" 
                            dataKey="id" 
                            onRowEditComplete={onRowEditComplete} 
                            className='w-full'
                            pt={{
                                headerRow: {
                                    th: {
                                        className: 'bg-primary'
                                    }
                                }
                            }}
                            paginator
                            rows={5}
                        >
                            <Column 
                                field="id" 
                                header="ID" 
                                editor={(options) => textEditor(options)} 
                                style={{ width: '10%' }}
                            ></Column>
                            <Column 
                                field="price" 
                                header="Price" 
                                body={priceBodyTemplate} 
                                editor={(options) => priceEditor(options)} 
                                style={{ width: '20%' }}
                            ></Column>
                            <Column 
                                field="quantity_kg" 
                                header="Quantity" 
                                editor={(options) => textEditor(options)} 
                                style={{ width: '10%' }}
                            ></Column>
                            <Column 
                                field="quality_specification_id" 
                                header="Quality" 
                                editor={(options) => textEditor(options)} 
                                style={{ width: '20%' }}
                            ></Column>
                            <Column 
                                field="status" 
                                header="Status" 
                                body={statusBodyTemplate} 
                                editor={(options) => statusEditor(options)} 
                                style={{ width: '20%' }}
                            ></Column>
                            <Column 
                                rowEditor={allowEdit} 
                                headerStyle={{ width: '10%', minWidth: '8rem' }} 
                                bodyStyle={{ textAlign: 'center' }}
                            ></Column>
                        </DataTable>
                    </div>
                </CardComponent>
            </div>
        </UserLayout>
    );
}

export default Inventory;
