import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const FarmerInfoForm = ({ palayData, handlePalayInputChange, errors }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <Dropdown
          id="category"
          name="category"
          value={palayData.category}
          options={[{ label: 'Individual Farmer', value: 'individual' }, { label: 'Cooperative', value: 'coop' }]}
          onChange={handlePalayInputChange}  
          placeholder="Select category"
          className="w-full ring-0"
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div className="flex flex-row w-full gap-4">
        <div className="w-1/2">
          <label htmlFor="farmerName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <InputText
            id="farmerName" 
            name="farmerName"
            value={palayData.farmerName}
            onChange={handlePalayInputChange} 
            placeholder="Enter your name" 
            className="w-full ring-0"
          />
          {errors.farmerName && <p className="text-red-500 text-xs mt-1">{errors.farmerName}</p>}
        </div>

        {palayData.category === 'individual' ? (
          <div className="flex flex-row w-1/2 gap-4">
            <div className="w-3/5">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
              <Calendar
                id="birthDate"
                name="birthDate"
                value={palayData.birthDate}
                onChange={handlePalayInputChange} 
                placeholder="Select birthdate"
                showIcon
                className="ring-0 w-full placeholder:text-gray-400 focus:shadow-none custom-calendar"
              />
              {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
            </div>

            <div className="w-2/5">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Dropdown
                id="gender"
                name="gender"
                value={palayData.gender}
                options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }]}
                onChange={handlePalayInputChange}  
                placeholder="gender"
                className="w-full ring-0"
              />
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        ) : (
          <div className="w-1/2">
            <label htmlFor="numOfFarmer" className="block text-sm font-medium text-gray-700 mb-1">Number of Farmers</label>
            <InputText
              id="numOfFarmer"
              name="numOfFarmer"
              value={palayData.numOfFarmer}
              onChange={handlePalayInputChange} 
              placeholder="Enter number of farmers"
              className="w-full ring-0"
            />
            {errors.numOfFarmer && <p className="text-red-500 text-xs mt-1">{errors.numOfFarmer}</p>}
          </div>
        )}
      </div>
      
      <div className="flex flex-row w-full gap-4">
        <div className="w-1/2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <InputText
            id="email"
            name="email"
            value={palayData.email}
            onChange={handlePalayInputChange}  
            placeholder="Enter your email"
            className="w-full ring-0"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-1/2">
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <InputText
            id="contactNumber"
            name="contactNumber"
            value={palayData.contactNumber}
            onChange={handlePalayInputChange} 
            placeholder="Enter your phone number"
            className="w-full ring-0"
          />
          {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {palayData.category === 'individual' ? 'Home Address' : 'Office Address'}
        </label>
        <div className="flex gap-4">
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierRegion"
              name="palaySupplierRegion"
              value={palayData.palaySupplierRegion}
              onChange={handlePalayInputChange}  
              placeholder="Region"
              className="w-full ring-0"
            />
            {errors.palaySupplierRegion && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierRegion}</p>}
          </div>
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierProvince"
              name="palaySupplierProvince"
              value={palayData.palaySupplierProvince}
              onChange={handlePalayInputChange}  
              placeholder="Province"
              className="w-full ring-0"
            />
            {errors.palaySupplierProvince && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierProvince}</p>}
          </div>
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierCityTown"
              name="palaySupplierCityTown"
              value={palayData.palaySupplierCityTown}
              onChange={handlePalayInputChange}  
              placeholder="City/Town"
              className="w-full ring-0"
            />
            {errors.palaySupplierCityTown && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierCityTown}</p>}
          </div>
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierBarangay"
              name="palaySupplierBarangay"
              value={palayData.palaySupplierBarangay}
              onChange={handlePalayInputChange}  
              placeholder="Barangay"
              className="w-full ring-0"
            />
            {errors.palaySupplierBarangay && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierBarangay}</p>}
          </div>
          <div className="flex flex-col w-full">
            <InputText
              id="palaySupplierStreet"
              name="palaySupplierStreet"
              value={palayData.palaySupplierStreet}
              onChange={handlePalayInputChange}  
              placeholder="Street"
              className="w-full ring-0"
            />
            {errors.palaySupplierStreet && <p className="text-red-500 text-xs mt-1">{errors.palaySupplierStreet}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export { FarmerInfoForm };