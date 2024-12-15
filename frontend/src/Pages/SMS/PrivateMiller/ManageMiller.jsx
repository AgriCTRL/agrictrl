import React, { useState, useEffect } from "react";
import PrivateMillerLayout from "../../../Layouts/Miller/PrivateMillerLayout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useAuth } from "../../Authentication/Login/AuthContext";
import Loader from "../../../Components/Loader";

function ManageMiller() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();

    const toast = React.useRef(null);

    const [millerData, setMillerData] = useState({
        millerName: "",
        userId: "",
        category: "",
        type: "Private",
        capacity: "",
        processing: "0",
        contactNumber: "",
        email: "",
        status: "inactive",
        location: "",
    });
    const [userData, setUserData] = useState(user);

    const [editing, setEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        fetchUserAndMillerData();
    }, []);

    useEffect(() => {
        if (userData) {
            setMillerData((prev) => ({
                ...prev,
                userId: user.id,
                contactNumber: userData.personalInfo.contactNumber,
                email: userData.passwordInfo.email,
            }));
        }
    }, [userData]);

    const fetchUserAndMillerData = async () => {
        setIsLoading(true);
        try {
            const userRes = await fetch(`${apiUrl}/users/${user.id}`);

            if (!userRes.ok) throw new Error("Failed to fetch user data");
            const userData = await userRes.json();

            const millersRes = await fetch(`${apiUrl}/millers`);

            if (!millersRes.ok) throw new Error("Failed to fetch millers data");
            const millersData = await millersRes.json();

            const userMiller = millersData.find(
                (miller) => miller.userId === user.id
            );

            setUserData({
                personalInfo: {
                    contactNumber: userData.contactNumber,
                },
                passwordInfo: {
                    email: userData.email,
                },
            });

            if (userMiller) {
                setMillerData(userMiller);
                setIsRegistered(true);
            } else {
                setShowRegistrationDialog(true);
            }
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const typeOptions = [
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
    ];

    const handleToggleEdit = () => {
        if (isRegistered) {
            setEditing((prev) => !prev);
        }
    };

    const validateForm = () => {
        const requiredFields = ["millerName", "type", "capacity", "location"];
        const missingFields = requiredFields.filter(
            (field) => !millerData[field]
        );

        if (missingFields.length > 0) {
            toast.current.show({
                severity: "error",
                summary: "Validation Error",
                detail: `Please fill in all required fields: ${missingFields.join(
                    ", "
                )}`,
                life: 3000,
            });
            return false;
        }
        return true;
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        console.log(millerData);
        try {
            const res = await fetch(`${apiUrl}/millers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(millerData),
            });

            if (!res.ok) throw new Error("Error registering miller");

            const registeredMiller = await res.json();
            setMillerData(registeredMiller);
            setIsRegistered(true);
            setShowRegistrationDialog(false);

            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Miller registered successfully",
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        console.log(millerData);
        try {
            const res = await fetch(`${apiUrl}/millers/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(millerData),
            });

            if (!res.ok) throw new Error("Error updating data");

            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Miller data updated successfully",
                life: 3000,
            });

            setEditing(false);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setMillerData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderMillerDetails = (isRegistrationForm = false) => (
        <div className="grid grid-cols-2 gap-2 md:gap-4 px-4">
            <div className="col-span-2">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Miller Name
                </label>
                <InputText
                    value={millerData.millerName}
                    onChange={(e) => handleChange("millerName", e.target.value)}
                    disabled={!editing && !isRegistrationForm}
                    className="w-full ring-0 text-sm md:text-base"
                    maxLength={50}
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Category
                </label>
                <Dropdown
                    value={millerData.category}
                    options={typeOptions}
                    onChange={(e) => handleChange("category", e.value)}
                    disabled={!editing && !isRegistrationForm}
                    className="ring-0 w-full placeholder:text-light-grey text-sm md:text-base"
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Type
                </label>
                <InputText
                    value={millerData.type}
                    disabled
                    className="ring-0 w-full placeholder:text-light-grey text-sm md:text-base"
                    maxLength={50}
                    keyfilter="alphanum"
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Location
                </label>
                <InputText
                    value={millerData.location}
                    onChange={(e) =>
                        handleChange("location", e.target.value)
                    }
                    disabled={!editing && !isRegistrationForm}
                    className="w-full ring-0 text-sm md:text-base"
                    maxLength={50}
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Capacity (Bags)
                </label>
                <InputText
                    value={millerData.capacity}
                    onChange={(e) =>
                        handleChange("capacity", e.target.value)
                    }
                    disabled={editing || !isRegistrationForm}
                    className="w-full ring-0 text-sm md:text-base"
                    keyfilter="int"
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Contact Number
                </label>
                <InputText
                    value={userData.personalInfo.contactNumber}
                    disabled
                    className="w-full ring-0 text-sm md:text-base"
                    maxLength={50}
                    keyfilter="alphanum"
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Email
                </label>
                <InputText
                    value={userData.passwordInfo.email}
                    disabled
                    className="w-full ring-0 text-sm md:text-base"
                    maxLength={50}
                    keyfilter="email"
                />
            </div>

            <div className="col-span-2">
                <label className="block mb-2 text-xs md:text-sm font-medium text-black">
                    Status
                </label>
                <InputText
                    value={millerData.status}
                    disabled
                    className={`text-sm md:text-base w-full text-white ring-0 bg-${
                        millerData.status === "active" ? "primary" : "red-500"
                    }`}
                    maxLength={50}
                    keyfilter="alphanum"
                />
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <PrivateMillerLayout activePage="Manage Miller" user={user}>
                <Loader />
            </PrivateMillerLayout>
        );
    }

    return (
        <PrivateMillerLayout
            activePage="Manage Miller"
            user={user}
            leftSidebar={<></>}
            isLeftSidebarOpen={false}
            isRightSidebarOpen={false}
            rightSidebar={<></>}
        >
            <Toast ref={toast} />
            <div className="flex flex-col h-full w-full p-2 md:p-4 gap-2 md:gap-4 bg-white rounded-xl">
                <div className="flex flex-col justify-center items-center py-10 h-1/4 rounded-lg bg-gradient-to-r from-primary to-secondary">
                    <h1 className="text-4xl md:text-6xl text-white font-semibold">
                        Manage Miller
                    </h1>
                </div>

                <div className="flex justify-between flex-col w-full h-full md:px-4">
                    <form
                        onSubmit={handleSave}
                        className="flex flex-col justify-between h-full"
                    >
                        <div>{renderMillerDetails()}</div>

                        <div className="flex justify-end">
                            {isRegistered && (
                                <Button
                                    label={editing ? "Cancel" : "Edit"}
                                    type="button"
                                    onClick={handleToggleEdit}
                                    disabled={isLoading}
                                    className={`text-sm md:text-base border text-white font-semibold ${
                                        editing
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                />
                            )}
                            {editing && (
                                <Button
                                    label="Save Changes"
                                    disabled={isLoading}
                                    type="submit"
                                    className="p-button-success border text-white font-semibold bg-primary hover:bg-primaryHover text-sm md:text-base"
                                />
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <Dialog
                header="Miller Registration"
                visible={showRegistrationDialog}
                style={{ width: "50vw" }}
                closable={isRegistered}
                onHide={
                    isLoading
                        ? null
                        : () => {
                              if (!isRegistered) {
                                  return;
                              }
                              setShowRegistrationDialog(false);
                          }
                }
                footer={
                    <div>
                        <Button
                            label="Register"
                            icon="pi pi-check"
                            onClick={handleRegistration}
                            disabled={isLoading}
                            className="p-button-success text-sm md:text-base"
                        />
                    </div>
                }
            >
                <form onSubmit={handleRegistration}>
                    {renderMillerDetails(true)}
                </form>
            </Dialog>
        </PrivateMillerLayout>
    );
}

export default ManageMiller;
