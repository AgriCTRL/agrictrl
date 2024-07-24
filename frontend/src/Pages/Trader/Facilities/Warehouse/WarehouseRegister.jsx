import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function WarehouseRegister({ visible, onHide, onWarehouseRegistered }) {
    const [warehouseName, setWarehouseName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');

    const handleRegister = () => {
        const trackingId = Date.now().toString();

        const newWarehouse = {
            id: trackingId,
            warehouseName,
            capacity,
            location
        }; 

        onWarehouseRegistered(newWarehouse);

        setWarehouseName('');
        setCapacity('');
        setLocation('');

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Warehouse" modal style={{ width: '30vw' }}>
            <div className="p-grid p-nogutter">
                <div className="p-col-12">
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Warehouse Name
                        </span>
                        <InputText value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Capacity
                        </span>
                        <InputText value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            Location
                        </span>
                        <InputText value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <Button label="Register" onClick={handleRegister} className="p-button-success" />
                </div>
            </div>
        </Dialog>
    );
}

export default WarehouseRegister;
