import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const ProcessDialog = ({ visible, viewMode, newDryingData, newMillingData, onProcessComplete, onCancel, isLoading, setNewDryingData, setNewMillingData, selectedItem }) => {
  	const toast = useRef(null);

	if (!selectedItem) {
		return null;
	}

  	const batchQuantityBags = selectedItem.batchQuantityBags;
  	const maxValue = batchQuantityBags !== null && batchQuantityBags !== undefined ? batchQuantityBags : selectedItem.palayQuantityBags;

  	const handleInputChange = (fieldName, value) => {
		// If the input is empty, clear the relevant state without setting it to 0
		if (value === '') {
			if (fieldName === 'driedQuantityBags') {
				setNewDryingData((prev) => ({
					...prev,
					driedQuantityBags: '',
					driedGrossWeight: '',
					driedNetWeight: '',
				}));
			} else if (fieldName === 'milledQuantityBags') {
				setNewMillingData((prev) => ({
					...prev,
					milledQuantityBags: '',
					milledGrossWeight: '',
					milledNetWeight: '',
					millingEfficiency: '',
				}));
			}
			return; // Exit early as the input is empty
		}

		// Parse the input value
		const parsedValue = parseInt(value);

		// Validate the parsed value
		if (isNaN(parsedValue)) {
			// If parsedValue is NaN, do nothing
			return; // Exit early, invalid input
		}

		const quantity = Math.min(parsedValue, maxValue);

		// Check if the value has been clamped
		if (quantity !== parsedValue) {
			toast.current.show({
				severity: 'warn',
				summary: 'Input Clamped',
				detail: `Value has been clamped to the maximum of ${maxValue} bags.`,
				life: 3000,
			});
		}

		const { grossWeight, netWeight } = calculateWeights(quantity);

		if (fieldName === 'driedQuantityBags') {
			setNewDryingData((prev) => ({
				...prev,
				driedQuantityBags: quantity,
				driedGrossWeight: grossWeight,
				driedNetWeight: netWeight,
			}));
		} else if (fieldName === 'milledQuantityBags') {
			setNewMillingData((prev) => {
				const newMillingData = {
					...prev,
					milledQuantityBags: quantity,
					milledGrossWeight: grossWeight,
					milledNetWeight: netWeight,
				};
				// Calculate and set milling efficiency
				return {
					...newMillingData,
					millingEfficiency: calculateMillingEfficiency(newMillingData.milledQuantityBags, selectedItem.palayQuantityBags),
				};
			});
		}
	};

	const calculateWeights = (quantity) => {
		const bagWeight = 50; // Assuming 50kg per bag
		return {
		grossWeight: quantity * bagWeight,
		netWeight: quantity * bagWeight - quantity, // Assuming 1kg per bag is tare weight
		};
	};

	const calculateMillingEfficiency = (milledBags, totalBags) => {
		if (totalBags === 0) return 0; // Avoid division by zero
		return ((milledBags / totalBags) * 100).toFixed(2); // Calculate percentage and format it to two decimal places
	};

	return (
		<Dialog header={`Complete ${viewMode} Process`} visible={visible} onHide={isLoading ? null : onCancel} className="w-1/3">
		<Toast ref={toast} />
		<div className="flex flex-col gap-4">
			{viewMode === 'drying' ? (
			<>
				<div className="w-full">
					<label className="block mb-2">Dried Quantity in Bags (50Kg per bag)</label>
					<InputText
						type="number"
						min={0}
						max={selectedItem.palayQuantityBags}
						value={newDryingData.driedQuantityBags}
						onChange={(e) => handleInputChange('driedQuantityBags', e.target.value)}
						className="w-full ring-0"
						keyfilter="num"
					/>
				</div>
				<div className="w-full">
					<label className="block mb-2">Dried Gross Weight (Kg)</label>
					<InputText 
						type="number" 
						value={newDryingData.driedGrossWeight} 
						onChange={(e) => setNewDryingData((prev) => ({ ...prev, driedGrossWeight: e.target.value }))} 
						className="w-full ring-0" 
						keyfilter="num"
					/>
				</div>
				<div className="w-full">
					<label className="block mb-2">Dried Net Weight (Kg)</label>
					<InputText 
						type="number" 
						value={newDryingData.driedNetWeight} 
						onChange={(e) => setNewDryingData((prev) => ({ ...prev, driedNetWeight: e.target.value }))} 
						className="w-full ring-0" 
						keyfilter="num"
					/>
				</div>
				<div className="w-full">
				<label className="block mb-2">Moisture Content (%)</label>
				<InputText 
					type="number" 
					value={newDryingData.moistureContent} 
					onChange={(e) => setNewDryingData((prev) => ({ ...prev, moistureContent: e.target.value }))} 
					className="w-full ring-0" 
					keyfilter="num"
				/>
				</div>
				<div className="w-full">
				<label className="block mb-2">Drying Method</label>
				<Dropdown
					value={newDryingData.dryingMethod}
					options={[
					{ label: 'Sun Dry', value: 'Sun Dry' },
					{ label: 'Machine Dry', value: 'Machine Dry' },
					]}
					onChange={(e) => setNewDryingData((prev) => ({ ...prev, dryingMethod: e.value }))}
					className="w-full"
					placeholder="Select Drying Method"
				/>
				</div>
			</>
			) : (
			<>
				<div className="w-full">
				<label className="block mb-2">Milled Quantity in Bags (50Kg per Bag)</label>
				<InputText
					type="number"
					value={newMillingData.milledQuantityBags}
					onChange={(e) => handleInputChange('milledQuantityBags', e.target.value)}
					className="w-full ring-0"
					keyfilter="num"
				/>
				</div>
				<div className="w-full">
				<label className="block mb-2">Milled Gross Weight (Kg)</label>
				<InputText 
					type="number" 
					value={newMillingData.milledGrossWeight} 
					onChange={(e) => setNewMillingData((prev) => ({ ...prev, milledGrossWeight: e.target.value }))} 
					className="w-full ring-0" 
					keyfilter="num"
				/>
				</div>
				<div className="w-full">
				<label className="block mb-2">Milled Net Weight (Kg)</label>
				<InputText 
					type="number" 
					value={newMillingData.milledNetWeight} 
					onChange={(e) => setNewMillingData((prev) => ({ ...prev, milledNetWeight: e.target.value }))} 
					className="w-full ring-0" 
					keyfilter="num"
				/>
				</div>
				<div className="w-full">
				<label className="block mb-2">Milling Efficiency (%)</label>
				<InputText 
					type="number" 
					value={newMillingData.millingEfficiency} 
					onChange={(e) => setNewMillingData((prev) => ({ ...prev, millingEfficiency: e.target.value }))} 
					className="w-full ring-0" 
					keyfilter="num"
				/>
				</div>
			</>
			)}

			<div className="flex justify-between gap-4 mt-4">
			<Button label="Cancel" className="w-1/2 bg-transparent text-primary border-primary" onClick={onCancel} disabled={isLoading} />
			<Button label="Complete Process" className="w-1/2 bg-primary hover:border-none" onClick={onProcessComplete} disabled={isLoading} loading={isLoading} />
			</div>
		</div>
		</Dialog>
	);
};

export default ProcessDialog;