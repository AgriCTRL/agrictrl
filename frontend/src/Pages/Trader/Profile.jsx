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
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const authClient = await AuthClient.create();
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal().toText();
                const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels/principal/${principal}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                setId(data.id);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setPosition(data.position);
                setRegion(data.region);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUser();
    }, []);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const user = {
            id,
            firstName,
            lastName,
            position,
            region
        };

        try {
            const res = await fetch(`http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/nfapersonnels`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!res.ok) {
                throw new Error('Failed to update');
            }

            setEditing(false);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <UserLayout activePage="Profile">
            <form onSubmit={handleSave} className='bg-white p-6 rounded mb-5 min-h-[calc(100vh-160px)]'>
                <div className='bg-gradient-to-r from-[#00C261] to-[#005155] text-white p-4 py-10 mb-6 rounded'>
                    <h1 className='text-4xl font-bold break-words'>Welcome {firstName} {lastName}!</h1>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                    <div className='flex'>
                        {editing ? (
                            <div className='flex w-1/2 items-center gap-2'>
                                <InputText
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className='w-full p-2 rounded border'
                                    placeholder='First Name'
                                />
                                <InputText
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className='w-full p-2 rounded border'
                                    placeholder='Last Name'
                                />
                            </div>
                        ) : (
                            <div className='flex items-center gap-2 w-1/2'>
                                <div className='p-2 w-full bg-blue-100 rounded'>{firstName}</div>
                                <div className='p-2 w-full bg-blue-100 rounded'>{lastName}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Position</label>
                    <div className='flex items-center'>
                        {editing ? (
                            <InputText
                                required
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className='w-1/2 p-2 rounded border'
                            />
                        ) : (
                            <div className='w-1/2 p-2 bg-blue-100 rounded'>{position}</div>
                        )}
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Region</label>
                    <div className='flex items-center'>
                        {editing ? (
                            <InputText
                                required
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className='w-1/2 p-2 rounded border'
                            />
                        ) : (
                            <div className='w-1/2 p-2 bg-blue-100 rounded'>{region}</div>
                        )}
                    </div>
                </div>

                <div className='flex flex-row mt-4'>
                    <div className="flex flex-grow"></div>
                    {!editing && (
                        <Button
                            label="Edit"
                            type="button"
                            onClick={handleEdit}
                            className='p-button-success border h-14 w-24 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]'
                        />
                    )}
                    
                    {editing && (
                        <Button
                            label="Save"
                            type="submit"
                            className='p-button-success border h-14 w-24 text-white font-bold bg-gradient-to-r from-[#00C261] to-[#005155]'
                        />
                    )}
                </div>
            </form>
        </UserLayout>
    );
}

export default Profile;
