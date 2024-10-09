import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Settings2, FileX } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

import UserDetails from './UserDetails';

function Inactive() {
    const [inactiveUsers, setInactiveUsers] = useState([
        { userId: 'NFAI3NE001', name: 'Jose Pablito', organization: 'NFA Nueva Ecija', position: 'Procurement II', userType: 'NFA Staff', status: 'Inactive' },
        { userId: 'PMINE001', name: 'Miguel Salazar', organization: 'Millingan Inc.', position: 'Milling Manager', userType: 'Private Miller', status: 'Inactive' },
        { userId: 'NFAI3NE002', name: 'Juan Cruz', organization: 'NFA Nueva Ecija', position: 'Warehouse Operator', userType: 'NFA Staff', status: 'Inactive' },
        { userId: 'RRI3NE001', name: 'Fathima Garcia', organization: 'DSWD', position: 'Asst. Manager', userType: 'Rice Recipient', status: 'Inactive' },
        { userId: 'RRI3NE002', name: 'Paula Bautista', organization: 'Zaragoza LGU', position: 'Procurement I', userType: 'Rice Recipient', status: 'Inactive' },
    ]);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-refresh" 
                rounded 
                text 
                severity="warning" 
                className="text-green-500 -translate-x-10"
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
            severity="danger" 
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
                        value={inactiveUsers}
                        scrollable
                        scrollHeight="flex"
                        className="p-datatable-sm px-5 pt-5"
                        emptyMessage="No inactive users found."
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={10}
                    >
                        <Column field="userId" header="User ID" className="text-center" headerClassName="text-center"/>
                        <Column field="name" header="Name" className="text-center" headerClassName="text-center"/>
                        <Column field="organization" header="Organization" className="text-center" headerClassName="text-center"/>
                        <Column field="position" header="Position" className="text-center" headerClassName="text-center"/>
                        <Column field="userType" header="User Type" className="text-center" headerClassName="text-center"/>
                        <Column field="status" header="Status" body={statusBodyTemplate} className="text-center" headerClassName="text-center"/>
                        <Column header="" body={actionBodyTemplate} className="text-center" headerClassName="text-center"/>
                    </DataTable>
                </div>
            </div>

            <UserDetails
                userType="inactive"
                visible={userDetailsVisible}
                onHide={() => setUserDetailsVisible(false)}
            />
        </div>
    );
}

export default Inactive;