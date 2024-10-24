import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Settings2, FileX } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

import UserDetails from './UserDetails';

function Active() {
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);

    const fetchActiveUsers = async () => {
        try {
            const res = await fetch(`${apiUrl}/users?status=Active`, {
                headers: { 'API-Key': `${apiKey}` }
            });
            if(!res.ok) {
                throw new Error('Failed to fetch active users');
            }
            const users = await res.json();
            const formattedUsers = users
            .filter(user => user.userType !== 'Admin')
            .map(user => ({
                ...user,
                name: `${user.firstName} ${user.lastName}`,
            }));
            setActiveUsers(formattedUsers);
        }
        catch(error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchActiveUsers();
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-pencil" 
                rounded 
                text 
                severity="info" 
                className="text-green-500"
                onClick={() => {
                  setSelectedUser(rowData);
                  setUserDetailsVisible(true);
              }}
            />
        );
    };

    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity="success" 
            className="text-sm px-3 py-1 rounded-md"
        />
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
                <span className="p-input-icon-left w-1/2">
                    <Search className="ml-3 -translate-y-1 text-primary"/>
                    <InputText 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => setGlobalFilterValue(e.target.value)} 
                        placeholder="Search" 
                        className="w-full pl-10 pr-4 py-2 ring-0 rounded-lg placeholder-primary text-primary border border-gray-300"
                    />
                </span>

                <div className="flex justify-between w-1/2 ml-2">
                    <Button 
                        icon={<Settings2 className="mr-2 text-primary" />}
                        label="Filters" 
                        className="p-button-success ring-0 text-primary border border-gray-300 rounded-md bg-white p-2 mr-2" 
                    />
                    <Button 
                        icon={<FileX className="mr-2" />} 
                        label="Export" 
                        className="p-button-success ring-0 text-primary border border-primary rounded-md bg-transparent p-2" 
                    />
                </div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                <div className="flex-grow overflow-auto bg-white">
                    <DataTable 
                        value={activeUsers}
                        scrollable
                        scrollHeight="flex"
                        className="p-datatable-sm px-5 pt-5"
                        emptyMessage="No active users found."
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={10}
                    >
                        <Column field="id" header="User ID" className="text-center" headerClassName="text-center"/>
                        <Column field="name" header="Name" className="text-center" headerClassName="text-center"/>
                        <Column field="organizationName" header="Organization" className="text-center" headerClassName="text-center"/>
                        <Column field="jobTitlePosition" header="Position" className="text-center" headerClassName="text-center"/>
                        <Column field="userType" header="User Type" className="text-center" headerClassName="text-center"/>
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column header="" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                </div>
            </div>

            <UserDetails
                userType="Active"
                visible={userDetailsVisible}
                onHide={() => setUserDetailsVisible(false)}
                selectedUser={selectedUser}
                onUserUpdated={fetchActiveUsers}
            />
        </div>
    );
}

export default Active;