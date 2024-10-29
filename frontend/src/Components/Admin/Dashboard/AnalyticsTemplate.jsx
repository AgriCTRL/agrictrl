import React from 'react'
import CardComponent from '../../CardComponent'
import { Chart } from 'primereact/chart';

const AnalyticsTemplate = ({
    headerIcon, 
    headerText, 
    headerAddon = null,
    graphContainerClassName, 
    graphClassName,
    graphType, 
    graphData, 
    graphOptions
}) => {
    return (
        <CardComponent className="bg-white w-full flex-col gap-8 col-start-1 col-end-3 row-start-1 row-end-2">
            <div className='w-full flex justify-between'>
                <div className="title flex gap-4 text-black">
                    {headerIcon}
                    <p className='font-bold'>{headerText}</p>
                </div>
                {headerAddon}
            </div>
            <div className={`graph ${graphContainerClassName}`}>
                <Chart type={graphType} data={graphData} options={graphOptions} className={`graph ${graphClassName}`}/>
            </div>
        </CardComponent>
    )
}

export default AnalyticsTemplate