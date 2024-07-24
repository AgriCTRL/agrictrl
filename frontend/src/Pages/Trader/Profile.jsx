import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Profile() {
    const [name, setName] = useState('John Doe'); // Replace with actual user name
    const [position, setPosition] = useState('Trader');
    const [region, setRegion] = useState('North America');
    const [editingPosition, setEditingPosition] = useState(false);
    const [editingRegion, setEditingRegion] = useState(false);

    const handleEdit = (field) => {
        if (field === 'position') {
            setEditingPosition(!editingPosition);
        } else if (field === 'region') {
            setEditingRegion(!editingRegion);
        }
    };

    const handleSave = () => {
        // Implement save functionality here
        console.log('Saving profile...');
        // Reset editing states
        setEditingPosition(false);
        setEditingRegion(false);
    };

    return (
        <UserLayout activePage="Profile">
            <div className='bg-white p-6 rounded mb-5 min-h-[calc(100vh-160px)]'>
                <div className='bg-gradient-to-r from-[#00C261] to-[#005155] text-white p-4 py-10 mb-6 rounded'>
                    <h1 className='text-4xl font-bold break-words'>Welcome {name}!</h1>
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