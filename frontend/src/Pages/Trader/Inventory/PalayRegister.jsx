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
    const [variety, setVariety] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [quantityKg, setQuantityKg] = useState('');
    const [dateReceived, setDateReceived] = useState('');
    const [qualitySpecification, setQualitySpecification] = useState('');
    const [supplier, setSupplier] = useState('');
    const [personnel, setPersonnel] = useState('');
    const [delivery, setDelivery] = useState('');
    const [warehouse, setWarehouse] = useState('');

    const handleRegister = () => {
        const trackingId = Date.now().toString();

        const newPalay = {
            id: trackingId,
            variety,
            status,
            price,
            quantityKg: parseInt(quantityKg),
            dateReceived,
            qualitySpecification,
            supplier,
            personnel,
            delivery,
            warehouse
        };

        onPalayRegistered(newPalay);

        setVariety('');
        setStatus('');
        setInventory('');
        setPrice('');
        setQuantityKg('');
        setDateReceived('');
        setQualitySpecification('');
        setSupplier('');
        setPersonnel('');
        setDelivery('');
        setWarehouse('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Palay" modal style={{ width: '60vw' }}>
            <section className='Palay Information flex flex-col gap-2'>
                <p className='text-xl text-black font-semibold'>Palay Information</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                        <label htmlFor="variety" className="block text-sm font-medium leading-6 text-gray-900">Variety</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setVariety(e.target.value)}
                                value={variety}
                                placeholder="Variety"
                                aria-label="variety"
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
                        <label htmlFor="quantity_kg" className="block text-sm font-medium leading-6 text-gray-900">Quantity (KG)</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setQuantityKg(e.target.value)}
                                value={quantityKg}
                                placeholder="Quantity (KG)"
                                aria-label="quantity_kg"
                            />
                        </div>
                    </div>
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
                        <label htmlFor="quality_specification" className="block text-sm font-medium leading-6 text-gray-900">Quality Specification</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setQualitySpecification(e.target.value)}
                                value={qualitySpecification}
                                placeholder="Quality Specification"
                                aria-label="quality_specification"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="supplier" className="block text-sm font-medium leading-6 text-gray-900">Supplier</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setSupplier(e.target.value)}
                                value={supplier}
                                placeholder="Supplier"
                                aria-label="supplier"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="personnel" className="block text-sm font-medium leading-6 text-gray-900">Personnel</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setPersonnel(e.target.value)}
                                value={personnel}
                                placeholder="Personnel"
                                aria-label="personnel"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="delivery" className="block text-sm font-medium leading-6 text-gray-900">Delivery</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setDelivery(e.target.value)}
                                value={delivery}
                                placeholder="Delivery"
                                aria-label="delivery"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="warehouse" className="block text-sm font-medium leading-6 text-gray-900">Warehouse</label>
                        <div className="mt-2">
                            <InputComponent
                                inputIcon={<Wheat size={20} />}
                                onChange={(e) => setWarehouse(e.target.value)}
                                value={warehouse}
                                placeholder="Warehouse"
                                aria-label="warehouse"
                            />
                        </div>
                    </div>
                </div>
                <Button label="Register" onClick={handleRegister} className="p-button-success mt-4" />
            </section>
        </Dialog>
    );
}

export default PalayRegister;
