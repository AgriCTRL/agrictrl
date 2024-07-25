import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function DryerUpdate({ visible, onHide, selectedDryer, onUpdateDryer }) {
    const [dryerName, setDryerName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState(null);

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    useEffect(() => {
        if (selectedDryer) {
            setDryerName(selectedDryer.dryerName);
            setCapacity(selectedDryer.capacity);
            setLocation(selectedDryer.location);
            setContact(selectedDryer.contact);
            setStatus(selectedDryer.status);
        }
    }, [selectedDryer]);

    const handleUpdate = () => {
        const updatedDryer = {
            ...selectedDryer,
            dryerName,
            capacity,
            location,
            contact,
            status
        };

        onUpdateDryer(updatedDryer);

        setDryerName('');
        setCapacity('');
        setLocation('');
        setContact('');
        setStatus(null);

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Update Dryer" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <div className="p-col-12">
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Dryer Name
                        </span>
                        <InputText className="border ml-2 p-2 rounded-sm" value={dryerName} onChange={(e) => setDryerName(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Capacity
                        </span>
                        <InputText className="border ml-2 p-2 rounded-sm" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Location
                        </span>
                        <InputText className="border ml-2 p-2 rounded-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Contact
                        </span>
                        <InputText className="border ml-2 p-2 rounded-sm" value={contact} onChange={(e) => setContact(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Status
                        </span>
                        <Dropdown className="border ml-2 rounded-sm" value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} placeholder="Select Status" />
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button label="Update" onClick={handleUpdate} className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]" />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default DryerUpdate;
