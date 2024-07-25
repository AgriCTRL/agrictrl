import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function Miller({ visible, onHide, onMillerRegistered }) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [contactInfo, setContact] = useState('');
    const [status, setStatus] = useState('Active');

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        const newMiller = {
            name,
            capacity,
            location,
            contactInfo,
            status
        };

        try {
            const res = await fetch('http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/millers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newMiller)
            });
            if(!res.ok) {
                throw new Error('Error adding data')
            }
        }
        catch (error) {
            console.log(error.message);
        }
         
        onMillerRegistered(newMiller);

        setName('');
        setCapacity('');
        setLocation('');
        setContact('');
        setStatus(null);

        onHide();
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Register Miller" modal style={{ width: '40vw' }}>
            <div className="p-grid p-nogutter">
                <form onSubmit={handleRegister} className="p-col-12 p-2">
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Miller Name
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={name} onChange={(e) => setName(e.target.value)} />
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
                            Contact
                        </span>
                        <InputText required className="border ml-2 p-2 rounded-sm" value={contactInfo} onChange={(e) => setContact(e.target.value)} />
                    </div>

                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon rounded-sm text-white bg-[#005155]">
                            Status
                        </span>
                        <Dropdown className="border ml-2 rounded-sm" value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} placeholder="Select Status" />
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button label="Register" className="p-button-success border p-2 px-5 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]" />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

export default Miller;
