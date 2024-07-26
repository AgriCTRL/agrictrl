import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import InputComponent from '@/Components/Form/InputComponent';
import { Wheat } from 'lucide-react';

const statusOptions = [
    { label: 'Palay', value: 'Palay' },
    { label: 'Drying', value: 'Drying' },
    { label: 'Milling', value: 'Milling' },
    { label: 'Rice', value: 'Rice' }
];

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const [dateReceived, setDateReceived] = useState('');
    const [quantity, setQuantity] = useState('');
    const [qualityType, setQualityType] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [moistureContent, setMoistureContent] = useState('');
    const [purity, setPurity] = useState('');
    const [damaged, setDamaged] = useState('');
    const [driverName, setDriverName] = useState('');
    const [typeOfTransport, setTypeOfTransport] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [nfaPersonnel, setNfaPersonnel] = useState('');
    const [warehouseId, setWarehouseId] = useState('');

    const handleRegister = () => {
        const trackingId = Date.now().toString();

        const newPalay = {
            id: trackingId,
            dateReceived,
            quantity: parseInt(quantity),
            qualityType,
            price,
            status,
            moistureContent,
            purity,
            damaged,
            driverName,
            typeOfTransport,
            plateNumber,
            supplierId,
            nfaPersonnel,
            warehouseId,
        };

        onPalayRegistered(newPalay);

        // Reset all fields
        setDateReceived('');
        setQuantity('');
        setQualityType('');
        setPrice('');
        setStatus('');
        setMoistureContent('');
        setPurity('');
        setDamaged('');
        setDriverName('');
        setTypeOfTransport('');
        setPlateNumber('');
        setSupplierId('');
        setNfaPersonnel('');
        setWarehouseId('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Palay" modal style={{ width: '60vw' }}>
            <section className='Palay Information flex flex-col gap-2'>
                <p className='text-xl text-black font-semibold'>Palay Information</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                        <label htmlFor="date_received" className="block text-sm font-medium leading-6 text-gray-900">Date Received</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setDateReceived(e.target.value)}
                                value={dateReceived}
                                placeholder="Date Received"
                                aria-label="date_received"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Quantity (KG)</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setQuantity(e.target.value)}
                                value={quantity}
                                placeholder="Quantity (KG)"
                                aria-label="quantity"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="quality_type" className="block text-sm font-medium leading-6 text-gray-900">Quality Type</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setQualityType(e.target.value)}
                                value={qualityType}
                                placeholder="Quality Type"
                                aria-label="quality_type"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                placeholder="Price"
                                aria-label="price"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                        <div className="mt-2">
                            <Dropdown
                                value={status}
                                options={statusOptions}
                                onChange={(e) => setStatus(e.value)}
                                placeholder="Select Status"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Quality Specifications */}
                    <div className="sm:col-span-3">
                        <p className="block text-sm font-medium leading-6 text-gray-900">Quality Specifications</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="moisture_content" className="block text-sm font-medium leading-6 text-gray-900">Moisture Content</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setMoistureContent(e.target.value)}
                                        value={moistureContent}
                                        placeholder="Moisture Content"
                                        aria-label="moisture_content"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="purity" className="block text-sm font-medium leading-6 text-gray-900">Purity</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setPurity(e.target.value)}
                                        value={purity}
                                        placeholder="Purity"
                                        aria-label="purity"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="damaged" className="block text-sm font-medium leading-6 text-gray-900">Damaged</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setDamaged(e.target.value)}
                                        value={damaged}
                                        placeholder="Damaged"
                                        aria-label="damaged"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="sm:col-span-3">
                        <p className="block text-sm font-medium leading-6 text-gray-900">Delivery Details</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="driver_name" className="block text-sm font-medium leading-6 text-gray-900">Driver Name</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setDriverName(e.target.value)}
                                        value={driverName}
                                        placeholder="Driver Name"
                                        aria-label="driver_name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="type_of_transport" className="block text-sm font-medium leading-6 text-gray-900">Type of Transport</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setTypeOfTransport(e.target.value)}
                                        value={typeOfTransport}
                                        placeholder="Type of Transport"
                                        aria-label="type_of_transport"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="plate_number" className="block text-sm font-medium leading-6 text-gray-900">Plate Number</label>
                                <div className="mt-2">
                                    <InputComponent
                                        inputIcon={<Wheat size={20} />}
                                        onChange={(e) => setPlateNumber(e.target.value)}
                                        value={plateNumber}
                                        placeholder="Plate Number"
                                        aria-label="plate_number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="supplier_id" className="block text-sm font-medium leading-6 text-gray-900">Supplier</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setSupplierId(e.target.value)}
                                value={supplierId}
                                placeholder="Supplier"
                                aria-label="supplier_id"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="nfa_personnel" className="block text-sm font-medium leading-6 text-gray-900">NFA Personnel</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setNfaPersonnel(e.target.value)}
                                value={nfaPersonnel}
                                placeholder="NFA Personnel"
                                aria-label="nfa_personnel"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="warehouse_id" className="block text-sm font-medium leading-6 text-gray-900">Warehouse</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setWarehouseId(e.target.value)}
                                value={warehouseId}
                                placeholder="Warehouse"
                                aria-label="warehouse_id"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Register" icon="pi pi-check" onClick={handleRegister} autoFocus />
                </div>
            </section>
        </Dialog>
    );
}

export default PalayRegister;
