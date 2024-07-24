import React from 'react';
import { Card } from 'primereact/card';
import {
    Building2,
    Warehouse,
    Factory,
} from "lucide-react";
import UserLayout from '../../../Layouts/UserLayout';

const [selectedCard, setSelectedCard] = useState(null);

const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
};

function Category() {
    return (
        <UserLayout activePage="Facilities">
            <div className='bg-white p-4 rounded'>
                <section className='flex flex-col gap-4'>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'warehouse' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('warehouse')}
                        >
                            <div className="flex flex-col items-center ">
                                <Warehouse size={40} />
                                <span className='font-bold'>Warehouses</span>
                            </div>
                        </Card>
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'dryer' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('dryer')}
                        >
                            <div className="flex flex-col items-center">
                                <Factory size={40} />
                                <span className='font-bold'>Dryers</span>
                            </div>
                        </Card>
                        <Card
                            className={`shadow-none rounded-md text-primary cursor-pointer 
                                ${selectedCard === 'miller' ? 'bg-gradient-to-r from-secondary to-primary text-white' : 'hover:bg-primary hover:text-white text-primary'}`}
                            onClick={() => handleCardClick('miller')}
                        >
                            <div className="flex flex-col items-center">
                                <Building2 size={40} />
                                <span className='font-bold'>Millers</span>
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </UserLayout>
    );

}

export default Category;