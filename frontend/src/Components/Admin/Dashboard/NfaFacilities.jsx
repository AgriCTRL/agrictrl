import React, { useState, useEffect } from "react";
import { Building } from "lucide-react";
import CardComponent from "../../CardComponent";
import { Chart } from "primereact/chart";

const NfaFacilities = ({ warehousesCount = 0, dryersCount = 0, millersCount = 0, setInterpretations}) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
    const data = {
      labels: ["Warehouses", "Dryers", "Millers"],
      datasets: [
        {
          type: "bar",
          backgroundColor: ["#005155", "#00C261", "#009E4F"],
          data: [warehousesCount, dryersCount, millersCount],
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);

    // Generate interpretation based on the data
    const generatedInterpretation = generateInterpretation(
      warehousesCount,
      dryersCount,
      millersCount
    );
    setInterpretation(generatedInterpretation);

    setInterpretations((prev) => ({ ...prev, 'nfa-facilities-chart': generatedInterpretation }));
  }, [warehousesCount, dryersCount, millersCount]);

  const generateInterpretation = (warehousesCount, dryersCount, millersCount) => {
    const totalFacilities = warehousesCount + dryersCount + millersCount;
    const maxFacilityCount = Math.max(warehousesCount, dryersCount, millersCount);
    const maxFacilityType =
      maxFacilityCount === warehousesCount
        ? "Warehouses"
        : maxFacilityCount === dryersCount
        ? "Dryers"
        : "Millers";

    return (
      `The NFA has a total of ${totalFacilities.toLocaleString()} facilities, including ` +
      `${warehousesCount.toLocaleString()} warehouses, ${dryersCount.toLocaleString()} dryers, ` +
      `and ${millersCount.toLocaleString()} millers. The facility type with the highest count is ` +
      `${maxFacilityType} with ${maxFacilityCount.toLocaleString()}.`
    );
  };

  return (
    <CardComponent className="bg-white w-full flex-col gap-8 col-span-3">
      <div className="w-full flex justify-between">
        <div className="title flex gap-4 text-black">
          <Building size={20} />
          <p className="font-bold">NFA Facilities</p>
        </div>
      </div>
      <div className="graph">
        <Chart
          id="nfa-facilities-chart"
          type="bar"
          data={chartData}
          options={chartOptions}
          className="graph"
        />
      </div>
      {interpretation && (
        <div id="nfa-facilities-chart" className="text-sm text-gray-600 mt-4">{interpretation}</div>
      )}
    </CardComponent>
  );
};

export default NfaFacilities;
