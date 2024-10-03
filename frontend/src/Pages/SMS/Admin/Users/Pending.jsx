import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Settings2, FileX } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

import UserDetails from './UserDetails';

function Pending() {
    const [pendingUsers, setPendingUsers] = useState([
        { id: 1, name: 'Jose Pablito', organization: 'NFA Nueva Ecija', position: 'Procurement II', userType: 'NFA Staff', status: 'Pending', dateRegistered: '07-11-2024' },
        { id: 2, name: 'Miguel Salazar', organization: 'Millingan Inc.', position: 'Milling Manager', userType: 'Private Miller', status: 'Pending', dateRegistered: '07-11-2024' },
        { id: 3, name: 'Juan Cruz', organization: 'NFA Nueva Ecija', position: 'Warehouse Operator', userType: 'NFA Staff', status: 'Pending', dateRegistered: '07-11-2024' },
        { id: 4, name: 'Fathima Garcia', organization: 'DSWD', position: 'Asst. Manager', userType: 'Rice Recipient', status: 'Pending', dateRegistered: '07-11-2024' },
        { id: 5, name: 'Paula Bautista', organization: 'Zaragoza LGU', position: 'Procurement I', userType: 'Rice Recipient', status: 'Pending', dateRegistered: '07-11-2024' },
    ]);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-check"
                rounded 
                text 
                severity="success" 
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
            severity="warning" 
            className="text-sm px-3 py-1 rounded-md"
        />
    );

    const statusAndActionTemplate = (rowData) => (
        <div className="flex items-center justify-between">
            {statusBodyTemplate(rowData)}
            {actionBodyTemplate(rowData)}
        </div>
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

                <div className="flex justify-end w-1/2 ml-2">
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
                        value={pendingUsers}
                        scrollable
                        scrollHeight="flex"
                        className="p-datatable-sm px-3 pt-3"
                        emptyMessage="No pending users found."
                        paginator
                        rows={10}
                    >
                        <Column field="dateRegistered" header="Date Registered"/>
                        <Column field="name" header="Name"/>
                        <Column field="organization" header="Organization"/>
                        <Column field="position" header="Position"/>
                        <Column field="userType" header="User Type"/>
                        <Column header="Approve" body={statusAndActionTemplate} />
                    </DataTable>
                </div>
            </div>

            <UserDetails
                userType="pending"
                visible={userDetailsVisible}
                onHide={() => setUserDetailsVisible(false)}
                userData={selectedUser}
            />
        </div>
    );
}

export default Pending;