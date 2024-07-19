import React, { useState } from 'react';
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

function PalayRegister({ visible, onHide, onPalayRegistered }) {
    const [variety, setVariety] = useState('');
    const [status, setStatus] = useState('');
    const [inventory, setInventory] = useState('');

    const handleRegister = () => {
        const trackingId = Date.now().toString();

        const newPalay = {
            id: trackingId,
            variety,
            status,
            inventory: parseInt(inventory)
        };

        onPalayRegistered(newPalay);

        setVariety('');
        setStatus('');
        setInventory('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Palay" modal style={{ width: '30vw' }}>
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

                    <Button label="Register" onClick={handleRegister} className="p-button-success" />
                </div>
            </div>
        </Dialog>
    );
}

export default PalayRegister;
