import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const statusOptions = [
    { label: 'Palay', value: 'Palay' },
    { label: 'Drying', value: 'Drying' },
    { label: 'Milling', value: 'Milling' },
    { label: 'Rice', value: 'Rice' }
];

function PalayUpdate({ visible, onHide, selectedPalay, onUpdatePalay }) {
    const [variety, setVariety] = useState('');
    const [status, setStatus] = useState('');
    const [inventory, setInventory] = useState('');

    useEffect(() => {
        if (selectedPalay) {
            setVariety(selectedPalay.variety);
            setStatus(selectedPalay.status);
            setInventory(selectedPalay.inventory.toString());
        }
    }, [selectedPalay]);

    const handleUpdate = () => {
        const updatedPalay = {
            ...selectedPalay,
            variety,
            status,
            inventory: parseInt(inventory)
        };

        onUpdatePalay(updatedPalay);

        setVariety('');
        setStatus('');
        setInventory('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Palay" modal style={{ width: '30vw' }}>
            <div className="p-grid p-nogutter">
                <div className="p-col-12">
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Variety
                        </span>
                        <InputText value={variety} onChange={(e) => setVariety(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Status
                        </span>
                        <Dropdown 
                            value={status} 
                            options={statusOptions} 
                            onChange={(e) => setStatus(e.value)} 
                            placeholder="Select Status" 
                        />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Inventory
                        </span>
                        <InputText value={inventory} onChange={(e) => setInventory(e.target.value)} />
                    </div>

                    <Button label="Update" onClick={handleUpdate} className="p-button-success" />
                </div>
            </div>
        </Dialog>
    );
}

export default PalayUpdate;
