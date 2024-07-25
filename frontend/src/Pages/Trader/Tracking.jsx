import React, { useState, useRef, useEffect } from 'react';
        
import { Search } from "lucide-react";
import { Image } from 'primereact/image';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Divider } from 'primereact/divider';

import CardComponent from '@/Components/CardComponent';
import UserLayout from '@/Layouts/UserLayout';
import InputComponent from '@/Components/Form/InputComponent';
import emptyIllustration from '@/images/illustrations/space.svg';
        

function Tracking() {
    const stepsMap = ["warehouse", "milling", "drying", "dispatch"];
    const stepperRef = useRef(null);
    const [palayData, setPalayData] = useState([
        {
            id: '1',
            variety: 'rained', 
            status: 'warehouse', 
            inventory: 8,
            date: '2022-10-10',
        },
        {
            id: '2', 
            variety: 'rained', 
            status: 'milling', 
            inventory: 8,
            milling: {
                date: '2022-10-10',
                miller: 'miller',
                milling_type: 'milling_type',
            },
        },
        {
            id: '3', 
            variety: 'rained', 
            status: 'drying', 
            inventory: 8,
            milling: {
                date: '2022-10-10',
                miller: 'miller',
                milling_type: 'milling type',
            },
            drying: {
                date: '2022-10-10',
                dryer: 'dhyer',
                dryer_type: 'dhyer type',
            },
        },
        {
            id: '4', 
            variety: 'rained', 
            status: 'dispatch', 
            inventory: 8,
            milling: {
                date: '2022-10-10',
                miller: 'miller',
                milling_type: 'milling type',
            },
            drying: {
                date: '2022-10-10',
                dryer: 'dhyer',
                dryer_type: 'dhyer type',
            },
            dispatch: {
                date: '2022-10-10',
                dispatcher: 'dispatcher',
                dispatcher_type: 'dispatcher type',
            }
        }
    ]);
    const [selectedPalay, setSelectedPalay] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatus, setActiveStatus] = useState(null);

    const resetData = () => {
        setSelectedPalay(null)
        setActiveStatus(null)
    }

    const handleSearchChange = (event) => {
        resetData()
        setSearchTerm(event.target.value)
        getSelectedPalay(event.target.value)
    };

    const getSelectedPalay = (palayId) => {
        setSelectedPalay(palayData.find(palay => palay.id === palayId) || null)
    };

    const getSelectedStatus = () => {
        if (selectedPalay) {
            setActiveStatus(stepsMap.findIndex(step => step === selectedPalay.status))
        }
    }

    const handleOnStepChange = (e) => {
        setActiveStatus(e.index)
    }

    useEffect(() => {
        getSelectedStatus()
    }, [selectedPalay])

    return (
        <UserLayout activePage="Tracking">
            <div className="flex flex-col items-center gap-4">
                {!selectedPalay && (
                    <h1 className="text-primary text-heading">Start by searching palay batch</h1>
                )}
                <InputComponent 
                    inputIcon={<Search size={20} />}
                    onChange={handleSearchChange}
                    value={searchTerm}
                    placeholder="Search..."
                    styles={`w-full ${
                        !selectedPalay ? "shadow-default" : ""
                    }`}
                />
                {!selectedPalay && (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <Image src={emptyIllustration} alt="empty" width="200" />
                        <p className='text-primary font-semibold'>No palay found</p>
                    </div>
                )}
                {(selectedPalay && activeStatus !== null) && (
                    <CardComponent className='bg-gradient-to-r from-secondary to-primary text-white w-full'>
                        <Stepper 
                            ref={stepperRef} 
                            className='w-full'
                            activeStep={activeStatus}
                            onChangeStep={handleOnStepChange}
                            pt={{
                                panelContainer: { 
                                    className: 'bg-red-500 hidden' 
                                }
                            }}
                        >
                            {stepsMap.map((step, index) => (
                                <StepperPanel
                                    header={step}
                                    key={index}
                                    className='bg-red-500 hidden'
                                />
                            ))}
                        </Stepper>
                    </CardComponent>
                )}
                {(selectedPalay && activeStatus === 0) &&  (
                    <CardComponent className='flex-col bg-white w-full rounded-md p-4'>
                        <h1 className="text-center text-2xl font-bold text-black">Warehouse</h1>
                        <Divider pt={{ 
                            root: { 
                                className: 'bg-lightest-grey h-px',
                            } 
                        }} />
                        <p>
                            <span className='text-black font-bold mr-4'>Batch:</span>
                            <span className='text-primary'>{selectedPalay.id}</span>
                        </p>
                        <p>
                            <span className='text-black font-bold mr-4'>Variety:</span>
                            <span className='text-primary'>{selectedPalay.variety}</span>
                        </p>
                        <p>
                            <span className='text-black font-bold mr-4'>Status:</span>
                            <span className='text-primary'>{selectedPalay.status}</span>
                        </p>
                        <p>
                            <span className='text-black font-bold mr-4'>Inventory:</span>
                            <span className='text-primary'>{selectedPalay.inventory}</span>
                        </p>
                    </CardComponent>
                )}
                {(selectedPalay && activeStatus === 1) &&  (
                    <CardComponent className='flex-col bg-white w-full rounded-md p-4'>
                        <h1 className="text-center text-2xl font-bold text-black">Milling</h1>
                        <Divider pt={{ 
                            root: { 
                                className: 'bg-lightest-grey h-px',
                            } 
                        }} />
                        {selectedPalay.milling ? (
                            <>
                                <p>
                                    <span className='text-black font-bold mr-4'>Date:</span>
                                    <span className='text-primary'>{selectedPalay.milling.date}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Miller:</span>
                                    <span className='text-primary'>{selectedPalay.milling.miller}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Milling Type:</span>
                                    <span className='text-primary'>{selectedPalay.milling.milling_type}</span>
                                </p>
                            </>
                        ) : (
                            <p className='text-center'>No Milling</p>
                        )}
                    </CardComponent>
                )}
                {(selectedPalay && activeStatus === 2) &&  (
                    <CardComponent className='flex-col bg-white w-full rounded-md p-4'>
                        <h1 className="text-center text-2xl font-bold text-black">Drying</h1>
                        <Divider pt={{ 
                            root: { 
                                className: 'bg-lightest-grey h-px',
                            } 
                        }} />
                        {selectedPalay.drying ? (
                            <>
                                <p>
                                    <span className='text-black font-bold mr-4'>Date:</span>
                                    <span className='text-primary'>{selectedPalay.drying.date}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Dryer:</span>
                                    <span className='text-primary'>{selectedPalay.drying.dryer}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Dryer Type:</span>
                                    <span className='text-primary'>{selectedPalay.drying.drying_type}</span>
                                </p>
                            </>
                        ) : (
                            <p className='text-center'>No Drying</p>
                        )}
                    </CardComponent>
                )}
                {(selectedPalay && activeStatus === 3) &&  (
                    <CardComponent className='flex-col bg-white w-full rounded-md p-4'>
                        <h1 className="text-center text-2xl font-bold text-black">Dispatch</h1>
                        <Divider pt={{ 
                            root: { 
                                className: 'bg-lightest-grey h-px',
                            } 
                        }} />
                        {selectedPalay.dispatch ? (
                            <>
                                <p>
                                    <span className='text-black font-bold mr-4'>Date:</span>
                                    <span className='text-primary'>{selectedPalay.dispatch.date}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Dispatcher:</span>
                                    <span className='text-primary'>{selectedPalay.dispatch.dispather}</span>
                                </p>
                                <p>
                                    <span className='text-black font-bold mr-4'>Dispatcher Type:</span>
                                    <span className='text-primary'>{selectedPalay.dispatch.dispatcher_type}</span>
                                </p>
                            </>
                        ) : (
                            <p className='text-center'>No Dispatch</p>
                        )}
                    </CardComponent>
                )}
            </div>
        </UserLayout>
    );
}

export default Tracking;