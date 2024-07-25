import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function WarehouseUpdate({ visible, onHide, selectedWarehouse, onUpdateWarehouse }) {
    const [facilityName, setFacilityName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [status, setStatus] = useState(null);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    useEffect(() => {
        if (selectedWarehouse) {
            setFacilityName(selectedWarehouse.facilityName);
            setCapacity(selectedWarehouse.capacity);
            setLocation(selectedWarehouse.location);
            setContactInfo(selectedWarehouse.contactInfo);
            setStatus(selectedWarehouse.status);
        }
    }, [selectedWarehouse]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedWarehouse = {
            ...selectedWarehouse,
            facilityName,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/warehouses', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedWarehouse)
            });
            if(!res.ok) {
                throw new Error('Error adding data')
            }
        }
        catch (error) {
            console.log(error.message);
        }

        onUpdateWarehouse(updatedWarehouse);

        setFacilityName('');
        setCapacity('');
        setLocation('');
        setContactInfo('');
        setStatus(null);

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Warehouse" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleUpdate} className="p-col-12 p-2">
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Warehouse Name
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Capacity
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Location
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            ContactInfo
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Status
                        </span>
                        <Dropdown className="border ml-2 rounded-sm" value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} placeholder="Select Status" />
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button label="Update" className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155] " />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default WarehouseUpdate;
