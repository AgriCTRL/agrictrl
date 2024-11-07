import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Warehouse } from "lucide-react";
import CardComponent from "@/Components/CardComponent";

const generateInterpretation = (data) => {
  // Calculate the total stock and total capacity across all warehouses
  const totalCurrentStock = data.reduce((sum, d) => sum + d.currentStock, 0);
  const totalCapacity = data.reduce((sum, d) => sum + d.totalCapacity, 0);
  const utilizationPercentage = ((totalCurrentStock / totalCapacity) * 100).toFixed(1);
  const remainingCapacityPercentage = (100 - utilizationPercentage).toFixed(1);

  // Build the interpretation text based on utilization levels
  let interpretationText = `Total warehouse utilization is at ${utilizationPercentage}% with ${remainingCapacityPercentage}% capacity still available. `;
  
  if (utilizationPercentage > 85) {
      interpretationText += "Warning: Warehouses are nearing maximum capacity. Consider additional storage or redistribution.";
  } else if (utilizationPercentage < 50) {
      interpretationText += "Utilization is below 50%, suggesting significant available space for new stock.";
  } else {
      interpretationText += "Warehouse utilization is balanced; monitor closely for space optimization.";
  }

  return interpretationText;
};

// Main component function
const WarehouseInventoryTrend = ({ apiUrl, setInterpretations }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`${apiUrl}/analytics/warehouse-inventory-stock`);
              const data = await response.json();

              // Prepare chart data
              const labels = data.map((d) => d.warehouseName);
              const totalCapacity = data.map((d) => d.totalCapacity);
              const currentStock = data.map((d) => d.currentStock);

              setChartData({
                  labels,
                  datasets: [
                      {
                          label: "Current Stock",
                          data: currentStock,
                          backgroundColor: "#00C261",
                      },
                      {
                          label: "Remaining Capacity",
                          data: totalCapacity,
                          backgroundColor: "#005155",
                      },
                  ],
              });

              // Generate and set interpretation text based on fetched data
              const interpretationText = generateInterpretation(data);
              setInterpretation(interpretationText);

              // Save interpretation with chart ID (like "rice-orders-analytics")
              setInterpretations((prev) => ({ ...prev, 'warehouse-inventory-trend': interpretationText }));

          } catch (error) {
              console.error("Error fetching warehouse data:", error);
              setInterpretation("Unable to fetch warehouse data for interpretation.");
          }
      };

      fetchData();
  }, [apiUrl]);

  useEffect(() => {
      setChartOptions({
          plugins: {
              legend: {
                  labels: {
                      color: "#495057",
                  },
              },
          },
          scales: {
              x: {
                  stacked: true,
                  ticks: {
                      color: "#495057",
                  },
                  grid: {
                      color: "#ebedef",
                  },
              },
              y: {
                  stacked: true,
                  ticks: {
                      color: "#495057",
                  },
                  grid: {
                      color: "#ebedef",
                  },
              },
          },
      });
  }, []);

  return (
      <CardComponent className="bg-white w-full flex-col gap-4">
          <div className="title flex gap-4 text-black">
              <Warehouse size={20} />
              <p className="font-bold">Warehouse Inventory</p>
          </div>

          <div className="graph h-64">
              <Chart id="warehouse-inventory-trend" type="bar" data={chartData} options={chartOptions} />
          </div>

          {interpretation && (
              <div id='warehouse-inventory-trend' className="text-sm text-gray-600 mt-4">{interpretation}</div>
          )}
      </CardComponent>
  );
};

export default WarehouseInventoryTrend;
