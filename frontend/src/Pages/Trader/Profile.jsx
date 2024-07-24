import React, { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AuthClient } from "@dfinity/auth-client";

function Profile() {
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [region, setRegion] = useState('');
    const [editingPosition, setEditingPosition] = useState(false);
    const [editingRegion, setEditingRegion] = useState(false);

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/principal/${principal}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await res.json();
                setId(data.id)
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setPosition(data.position);
                setRegion(data.region);
            }
            catch (error) {
                console.log(error.message)
            }
        };
        fetchUser();
    }, []);

    const handleEdit = (field) => {
        if (field === 'position') {
            setEditingPosition(!editingPosition);
        } else if (field === 'region') {
            setEditingRegion(!editingRegion);
        }
    };

    const handleSave = async(e) => {
        e.preventDefault();

        const user = {
            id,
            position,
            region
        };

        try {
            const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });
            if(!res.ok) {
                throw new Error('Failed to update')
            }
            const data = await res.json();
            console.log('User updated: ', data);
            setEditingPosition(false);
            setEditingRegion(false);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <UserLayout activePage="Profile">
            <div className='bg-white p-6 rounded mb-5 min-h-[calc(100vh-160px)]'>
                <div className='bg-gradient-to-r from-[#00C261] to-[#005155] text-white p-4 py-10 mb-6 rounded'>
                    <h1 className='text-4xl font-bold break-words'>Welcome {firstName} {lastName}!</h1>
                </div>
                
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Position</label>
                    <div className='flex items-center'>
                        {editingPosition ? (
                            <InputText value={position} onChange={(e) => setPosition(e.target.value)} className='w-1/2 mr-2 p-2 rounded border' />
                        ) : (
                            <div className='w-1/2 mr-2 p-2 bg-blue-100 rounded'>{position}</div>
                        )}
                        <Button icon={editingPosition ? "pi pi-check" : "pi pi-pencil"} onClick={() => handleEdit('position')} className='p-button-rounded p-button-text' />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Region</label>
                    <div className='flex items-center'>
                        {editingRegion ? (
                            <InputText value={region} onChange={(e) => setRegion(e.target.value)} className='w-1/2 mr-2 p-2 rounded border' />
                        ) : (
                            <div className='w-1/2 mr-2 p-2 bg-blue-100 rounded'>{region}</div>
                        )}
                        <Button icon={editingRegion ? "pi pi-check" : "pi pi-pencil"} onClick={() => handleEdit('region')} className='p-button-rounded p-button-text' />
                    </div>
                </div>

                <div className='absolute bottom-100 right-20 bg-[#00C261] p-2 px-4 rounded-lg'>
                    <Button label="Save" onClick={handleSave} className='p-button-success' />
                </div>
            </div>
        </UserLayout>
    );
}

export default Profile;