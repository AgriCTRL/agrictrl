import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Search, Download } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import UserDetails from './UserDetails';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

function Active() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);

    const fetchActiveUsers = async () => {
        try {
            const res = await fetch(`${apiUrl}/users?status=Active`);
            if (!res.ok) {
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
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchActiveUsers();
    }, []);

    const toastSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Updated user status successfully!',
            life: 3000,
        });
    };

    const actionBodyTemplate = (rowData) => (
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

    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.status} 
            severity="success" 
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
                        value={activeUsers}
                        scrollable
                        scrollHeight="flex"
                        className="p-datatable-sm px-5 pt-5"
                        globalFilterFields={['id', 'userType', 'name', 'status']} // Ensure 'status' is included
                        emptyMessage="No active users found."
                        paginator
                        paginatorClassName="border-t-2 border-gray-300"
                        rows={10}
                        filters={filters} // Set filters on DataTable
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
                onStatusUpdated={toastSuccess}
            />
        </div>
    );
}

export default Active;
