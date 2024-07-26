import React, { useState, useEffect } from 'react';
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

function PalayUpdate({ visible, onHide, selectedPalay, onUpdatePalay }) {
    const [status, setStatus] = useState('');
    const [warehouse, setWarehouse] = useState('');

    useEffect(() => {
        if (selectedPalay) {
            setStatus(selectedPalay.status);
            setWarehouse(selectedPalay.warehouse);
        }
    }, [selectedPalay]);

    const handleUpdate = () => {
        const updatedPalay = {
            ...selectedPalay,
            status,
            warehouse
        };

        onUpdatePalay(updatedPalay);

        setStatus('');
        setWarehouse('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Palay" modal style={{ width: '60vw' }}>
            <section className='Palay Information flex flex-col gap-2'>
                <p className='text-xl text-black font-semibold'>Update Palay Information</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <Button label="Update" onClick={handleUpdate} className="p-button-success mt-4" />
            </section>
        </Dialog>
    );
}

export default PalayUpdate;
