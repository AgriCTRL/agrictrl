import React, { useState, useEffect, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

import UserDetails from './UserDetails';
import EmptyRecord from '../../../../Components/EmptyRecord';

function Inactive() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);
    const [inactiveUsers, setInactiveUsers] = useState([]);

    const fetchInactiveUsers = async () => {
        try {
            const res = await fetch(`${apiUrl}/users?status=Inactive`);
            if(!res.ok) {
                throw new Error('Failed to fetch inactive users');
            }
            const users = await res.json();
            const formattedUsers = users.map(user => ({
                ...user,
                name: `${user.firstName} ${user.lastName}`,
            }));
            setInactiveUsers(formattedUsers);
        }
        catch(error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchInactiveUsers();
    }, []);

    const toastSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Updated user status successfully!',
            life: 3000
        });
    }

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

    const filterByGlobal = (value) => {
        setFilters({
            global: { value, matchMode: 'contains' }, // Keep 'contains' for flexible matching
        });
    };


    return (
        <div className="flex flex-col h-full gap-4">
            <Toast ref={toast} />
            <div className="flex items-center justify-between gap-4">
                <IconField iconPosition="left" className="w-1/2">
                    <InputIcon className="pi pi-search text-light-grey"></InputIcon>
                    <InputText 
                        placeholder="Tap to Search" 
                        type="search"
                        value={globalFilterValue} 
                        onChange={(e) => {
                            setGlobalFilterValue(e.target.value);
                            filterByGlobal(e.target.value); // Update filters on input change
                        }}
                        className='w-full ring-0 hover:border-primary focus:border-primary placeholder:text-light-grey' 
                    />
                </IconField>
                <div className="flex justify-end w-1/2">
                    {/* <Button 
                        type="button"
                        className="flex flex-center items-center gap-4 text-primary bg-white hover:bg-white/35 border border-lightest-grey ring-0"
                    >
                        <Filter size={20} />
                        <p className="font-semibold">Filters</p>
                    </Button> */}

                    {/* <Button 
                        type="button"
                        className="flex flex-center items-center gap-4 bg-primary hover:bg-primaryHover border ring-0"
                    >
                        <Download size={20} />
                        <p className="font-semibold">Export</p>
                    </Button> */}
                </div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden rounded-lg shadow">
                <div className="flex-grow overflow-auto bg-white">
                    <DataTable 
                        value={inactiveUsers}
                        scrollable
                        scrollHeight="flex"
                        className="p-datatable-sm px-5 pt-5"
                        globalFilterFields={['id', 'userType', 'name', 'status']}
                        emptyMessage={<EmptyRecord label="No inactive users found." />}
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
                userType="Inactive"
                visible={userDetailsVisible}
                onHide={() => setUserDetailsVisible(false)}
                selectedUser={selectedUser}
                onUserUpdated={fetchInactiveUsers}
                onStatusUpdated={toastSuccess}
            />
        </div>
    );
}

export default Inactive;