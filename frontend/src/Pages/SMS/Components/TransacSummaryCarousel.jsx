import { Carousel } from 'primereact/carousel'
import { Tag } from 'primereact/tag'
import React from 'react'

const TransacSummaryCarousel = ({
    details
}) => {
    return (
        <Carousel 
            value={details} 
            numVisible={3} 
            numScroll={1}
            className="custom-carousel staff-transactions-carousel relative"
            itemTemplate={(stat) => (
                <div className="flex overflow-hidden h-full">
                    <div className="flex flex-col h-full w-full p-4 gap-2 rounded-md bg-white">
                        <div className="w-fit p-4 rounded-lg bg-background text-primary">
                            {stat.icon}
                        </div>

                        <div className="flex flex-col text-black">
                            <h1 className="font-semibold">{stat.title}</h1>
                            <h1 className="text-sm font-light">
                                as of {stat.date}
                            </h1>
                        </div>

                        <Tag value={stat.value} className='bg-tag-grey text-black w-1/2'></Tag>
                    </div>
                </div>
            )}
            showIndicators={false}
            showNavigators={true}
        />
    )
}

export default TransacSummaryCarousel