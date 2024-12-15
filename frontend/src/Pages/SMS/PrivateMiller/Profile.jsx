import React, { useState, useEffect, useRef } from "react";

import { Toast } from "primereact/toast";
import CryptoJS from "crypto-js";

import PrivateMillerLayout from "@/Layouts/Miller/PrivateMillerLayout";
import Loader from "@/Components/Loader";
import { useAuth } from "../../Authentication/Login/AuthContext";
import ProfileLayout from "../../../Layouts/ProfileLayout";

function Profile() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const secretKey = import.meta.env.VITE_HASH_KEY;
    const { user, logout } = useAuth();

    const toast = useRef(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState({
        personalInfo: {
            firstName: "John",
            lastName: "Doe",
            gender: "",
            birthDate: null,
            contactNumber: "",
            validId: "",
        },
        accountDetails: {
            userType: "miller",
            organizationName: "",
            jobTitlePosition: "",
        },
        officeAddress: {
            region: "",
            province: "",
            cityTown: "",
            barangay: "",
            street: "",
        },
        passwordInfo: {
            email: "",
            password: null,
            confirmPassword: null,
        },
    });
    const [userFullName] = useState(
        `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`
    );

    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [regionOptions, setRegionOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityTownOptions, setCityTownOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);

    useEffect(() => {
        fetchData();
        fetchRegions();
    }, []);

    useEffect(() => {
        if (userData && userData.officeAddress.region) {
            const selectedRegion = regionOptions.find(
                (r) => r.value === userData.officeAddress.region
            );
            if (selectedRegion && selectedRegion.code === "130000000") {
                fetchCities(selectedRegion.code);
            } else if (selectedRegion) {
                fetchProvinces(selectedRegion.code);
            }
        }
    }, [userData?.officeAddress.region, regionOptions]);

    useEffect(() => {
        if (userData && userData.officeAddress.province) {
            const selectedProvince = provinceOptions.find(
                (p) => p.value === userData.officeAddress.province
            );
            if (selectedProvince) {
                fetchCities(selectedProvince.code);
            }
        }
    }, [userData?.officeAddress.province, provinceOptions]);

    useEffect(() => {
        if (userData && userData.officeAddress.cityTown) {
            const selectedCity = cityTownOptions.find(
                (c) => c.value === userData.officeAddress.cityTown
            );
            if (selectedCity) {
                fetchBarangays(selectedCity.code);
            }
        }
    }, [userData?.officeAddress.cityTown, cityTownOptions]);

    const fetchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/users/${user.id}`);
            const data = await res.json();
            setUserData({
                personalInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    birthDate: data.birthDate ? new Date(data.birthDate) : null,
                    contactNumber: data.contactNumber,
                    validId: data.validId,
                },
                accountDetails: {
                    userType: data.userType,
                    organizationName: data.organizationName,
                    jobTitlePosition: data.jobTitlePosition,
                },
                officeAddress: {
                    region: data.officeAddress.region,
                    province: data.officeAddress.province,
                    cityTown: data.officeAddress.cityTown,
                    barangay: data.officeAddress.barangay,
                    street: data.officeAddress.street,
                },
                passwordInfo: {
                    email: data.email,
                    password: null,
                    confirmPassword: null,
                },
            });
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRegions = async () => {
        try {
            const res = await fetch("https://psgc.gitlab.io/api/regions/");
            const data = await res.json();
            const regions = data.map((region) => ({
                label: region.regionName,
                value: region.regionName,
                code: region.code,
            }));
            setRegionOptions(regions);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    const fetchProvinces = async (regionCode) => {
        try {
            const res = await fetch(
                `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`
            );
            const data = await res.json();
            const provinces = data.map((province) => ({
                label: province.name,
                value: province.name,
                code: province.code,
            }));
            setProvinceOptions(provinces);
            setCityTownOptions([]);
            setBarangayOptions([]);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchCities = async (code) => {
        try {
            const endpoint = `https://psgc.gitlab.io/api/${
                code === "130000000" ? "regions" : "provinces"
            }/${code}/cities-municipalities/`;
            const res = await fetch(endpoint);
            const data = await res.json();
            const cities = data.map((city) => ({
                label: city.name,
                value: city.name,
                code: city.code,
            }));
            setCityTownOptions(cities);
            setBarangayOptions([]);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchBarangays = async (cityOrMunicipalityCode) => {
        try {
            const res = await fetch(
                `https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays/`
            );
            const data = await res.json();
            const barangays = data.map((barangay) => ({
                label: barangay.name,
                value: barangay.name,
                code: barangay.code,
            }));
            setBarangayOptions(barangays);
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    const handleInputChange = (section, field, value) => {
        if (section === "personalInfo" && field === "contactNumber") {
            // Only allow numbers and limit to 11 digits
            const numbersOnly = value.replace(/[^\d]/g, "").slice(0, 11);
            setUserData((prev) => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    contactNumber: numbersOnly,
                },
            }));
            return;
        }
        if (section === "officeAddress") {
            if (field === "region") {
                const selectedRegion = regionOptions.find(
                    (r) => r.value === value
                );
                setUserData((prev) => ({
                    ...prev,
                    officeAddress: {
                        ...prev.officeAddress,
                        region: value,
                        province: "",
                        cityTown: "",
                        barangay: "",
                    },
                }));
                if (selectedRegion) {
                    if (selectedRegion.code === "130000000") {
                        setProvinceOptions([]);
                        fetchCities(selectedRegion.code);
                    } else {
                        fetchProvinces(selectedRegion.code);
                    }
                }
                setCityTownOptions([]);
                setBarangayOptions([]);
            } else if (field === "province") {
                const selectedProvince = provinceOptions.find(
                    (p) => p.value === value
                );
                setUserData((prev) => ({
                    ...prev,
                    officeAddress: {
                        ...prev.officeAddress,
                        province: value,
                        cityTown: "",
                        barangay: "",
                    },
                }));
                if (selectedProvince) {
                    fetchCities(selectedProvince.code);
                }
                setCityTownOptions([]);
                setBarangayOptions([]);
            } else if (field === "cityTown") {
                const selectedCity = cityTownOptions.find(
                    (c) => c.value === value
                );
                setUserData((prev) => ({
                    ...prev,
                    officeAddress: {
                        ...prev.officeAddress,
                        cityTown: value,
                        barangay: "",
                    },
                }));
                if (selectedCity) {
                    fetchBarangays(selectedCity.code);
                }
                setBarangayOptions([]);
            } else {
                setUserData((prev) => ({
                    ...prev,
                    officeAddress: {
                        ...prev.officeAddress,
                        [field]: value,
                    },
                }));
            }
        } else if (section === "personalInfo" && field === "birthDate") {
            const handleDateChange = (value) => {
                if (value) {
                    const offset = value.getTimezoneOffset();
                    const adjustedDate = new Date(
                        value.getTime() - offset * 60 * 1000
                    );
                    const formattedDate = adjustedDate
                        .toISOString()
                        .split("T")[0];
                    return formattedDate;
                }
                return null;
            };

            setUserData((prev) => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    birthDate: handleDateChange(value),
                },
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        }
    };

    const handleToggleEdit = () => {
        fetchData();
        setEditing((prevState) => !prevState);
        setErrors({}); // Reset the errors
        setUserData((prev) => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                firstName: prev.personalInfo.firstName,
                lastName: prev.personalInfo.lastName,
                gender: prev.personalInfo.gender,
                birthDate: prev.personalInfo.birthDate,
                contactNumber: prev.personalInfo.contactNumber,
            },
            accountDetails: {
                ...prev.accountDetails,
                organizationName: prev.accountDetails.organizationName,
                jobTitlePosition: prev.accountDetails.jobTitlePosition,
            },
            officeAddress: {
                ...prev.officeAddress,
                region: prev.officeAddress.region,
                province: prev.officeAddress.province,
                cityTown: prev.officeAddress.cityTown,
                barangay: prev.officeAddress.barangay,
                street: prev.officeAddress.street,
            },
            passwordInfo: {
                ...prev.passwordInfo,
                email: prev.passwordInfo.email,
                password: null,
                confirmPassword: null,
            },
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});

        let validationErrors = validateFormWithToast();
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare user data
            const userUpdateData = {
                id: user.id,
                firstName: userData.personalInfo.firstName,
                lastName: userData.personalInfo.lastName,
                gender: userData.personalInfo.gender,
                birthDate: userData.personalInfo.birthDate,
                contactNumber: userData.personalInfo.contactNumber,
                organizationName: userData.accountDetails.organizationName,
                jobTitlePosition: userData.accountDetails.jobTitlePosition,
                email: userData.passwordInfo.email,
            };

            // Include password only if it's been changed
            if (userData.passwordInfo.password) {
                userData.password = userData.passwordInfo.password;
            }

            const encryptedPayload = CryptoJS.AES.encrypt(
                JSON.stringify(userUpdateData),
                secretKey
            ).toString();

            // Update user data
            const userResponse = await fetch(`${apiUrl}/users/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ encryptedPayload }),
            });

            if (!userResponse.ok) {
                throw new Error("Failed to update user data");
            }

            // Prepare office address data
            const officeAddressData = {
                id: user.officeAddressId, // Assuming this is available in the user object
                region: userData.officeAddress.region,
                province: userData.officeAddress.province,
                cityTown: userData.officeAddress.cityTown,
                barangay: userData.officeAddress.barangay,
                street: userData.officeAddress.street,
            };

            // Update office address
            const addressResponse = await fetch(
                `${apiUrl}/officeaddresses/update`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(officeAddressData),
                }
            );

            if (!addressResponse.ok) {
                throw new Error("Failed to update office address");
            }

            // Update localStorage with new user data
            const updatedUserData = {
                ...user,
                firstName: userData.personalInfo.firstName,
                lastName: userData.personalInfo.lastName,
                gender: userData.personalInfo.gender,
                birthDate: userData.personalInfo.birthDate,
                contactNumber: userData.personalInfo.contactNumber,
                organizationName: userData.accountDetails.organizationName,
                jobTitlePosition: userData.accountDetails.jobTitlePosition,
                branchRegion: userData.accountDetails.branchRegion,
                branchOffice: userData.accountDetails.branchOffice,
                email: userData.passwordInfo.email,
                officeAddress: {
                    id: user.officeAddressId,
                    region: userData.officeAddress.region,
                    province: userData.officeAddress.province,
                    cityTown: userData.officeAddress.cityTown,
                    barangay: userData.officeAddress.barangay,
                    street: userData.officeAddress.street,
                },
            };
            localStorage.setItem("user", JSON.stringify(updatedUserData));
            window.location.reload();
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update profile. Please try again.",
                life: 5000,
            });
        } finally {
            setIsSubmitting(false);
            setEditing(false);
        }
    };

    const validateFormWithToast = () => {
        let newErrors = {};

        // Personal Information
        if (!userData.personalInfo.firstName.trim()) {
            newErrors.firstName = "First name is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "First name is required",
                life: 5000,
            });
        }
        if (!userData.personalInfo.lastName.trim()) {
            newErrors.lastName = "Last name is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Last name is required",
                life: 5000,
            });
        }
        if (!userData.personalInfo.gender) {
            newErrors.gender = "Gender is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Gender is required",
                life: 5000,
            });
        }
        if (!userData.personalInfo.birthDate) {
            newErrors.birthDate = "Birth date is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Birth date is required",
                life: 5000,
            });
        }
        if (!userData.personalInfo.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Contact number is required",
                life: 5000,
            });
        } else if (!/^\d{11,}$/.test(userData.personalInfo.contactNumber)) {
            newErrors.contactNumber = "Invalid contact number format";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid contact number format",
                life: 5000,
            });
        }

        // Account Details
        if (!userData.accountDetails.organizationName.trim()) {
            newErrors.organizationName = "Organization name is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Organization is required",
                life: 5000,
            });
        }
        if (!userData.accountDetails.jobTitlePosition.trim()) {
            newErrors.jobTitlePosition = "Job title/position is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Job title/position is required",
                life: 5000,
            });
        }

        // Office Address
        if (!userData.officeAddress.region) {
            newErrors.region = "Region is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Region is required",
                life: 5000,
            });
        }
        if (
            userData.officeAddress.region !== "National Capital Region" &&
            !userData.officeAddress.province
        ) {
            newErrors.province = "Province is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Province is required",
                life: 5000,
            });
        }
        if (!userData.officeAddress.cityTown) {
            newErrors.cityTown = "City/Town is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "City/Town is required",
                life: 5000,
            });
        }
        if (!userData.officeAddress.barangay) {
            newErrors.barangay = "Barangay is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Barangay is required",
                life: 5000,
            });
        }
        if (!userData.officeAddress.street.trim()) {
            newErrors.street = "Street is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Street is required",
                life: 5000,
            });
        }

        // Password
        if (!userData.passwordInfo.email.trim()) {
            newErrors.email = "Email is required";
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Email is required",
                life: 5000,
            });
        }
        if (
            userData.passwordInfo.password ||
            userData.passwordInfo.confirmPassword
        ) {
            if (
                userData.passwordInfo.password !==
                userData.passwordInfo.confirmPassword
            ) {
                newErrors.password = "Passwords do not match";
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Passwords do not match",
                    life: 5000,
                });
            } else if (userData.passwordInfo.password.length < 8) {
                newErrors.password =
                    "Password must be at least 8 characters long";
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Password must be at least 8 characters long",
                    life: 5000,
                });
            }
        }

        setErrors(newErrors);
        return newErrors;
    };

    const logoutButton = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <PrivateMillerLayout activePage="Profile" user={user}>
            <Toast ref={toast} />
            {isLoading ? (
                <Loader />
            ) : (
                <ProfileLayout
                    user={user}
                    userData={userData}
                    userFullName={userFullName}
                    editing={editing}
                    handleToggleEdit={handleToggleEdit}
                    handleSave={handleSave}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    logoutButton={logoutButton}
                    isSubmitting={isSubmitting}
                    errors={errors} 
                    handleInputChange={handleInputChange}
                    regionOptions={regionOptions}
                    provinceOptions={provinceOptions}
                    cityTownOptions={cityTownOptions}
                    barangayOptions={barangayOptions}
                />
            )}
        </PrivateMillerLayout>
    );
}

export default Profile;