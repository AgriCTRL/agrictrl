import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Warehouse } from "lucide-react";
import { format } from "date-fns";
import CardComponent from "@/Components/CardComponent";

const WarehouseInventoryTrend = ({ apiUrl, warehouseId }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const response = await fetch(
        `${apiUrl}/analytics/warehouse-inventory-trend?` +
          `warehouseId=${warehouseId}&` +
          `startDate=${startDate.toISOString()}&` +
          `endDate=${endDate.toISOString()}`
      );
      const data = await response.json();

      // Prepare chart data
      const labels = data.map((d) => format(new Date(d.date), "MMM dd"));

      setChartData({
        labels,
        datasets: [
          {
            label: "Current Stock",
            data: data.map((d) => d.currentStock),
            borderColor: "#00C261",
            tension: 0.4,
          },
          {
            label: "Maximum Capacity",
            data: data.map((d) => d.maxCapacity),
            borderColor: "#FF0000",
            borderDash: [5, 5],
            tension: 0,
          },
        ],
      });

      // Generate interpretation
      const lastTwoPoints = data.slice(-2);
      if (lastTwoPoints.length === 2) {
        const interpretationText = generateInterpretation(
          lastTwoPoints[1].currentStock,
          lastTwoPoints[0].currentStock,
          "inventory",
          "bags",
          "warehouse stock"
        );
        setInterpretation(interpretationText);
      }
    };

    fetchData();
  }, [warehouseId]);

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
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
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
        <p className="font-bold">Warehouse Inventory Trend</p>
      </div>

      <div className="graph h-64">
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>

      {interpretation && (
        <div className="text-sm text-gray-600 mt-4">{interpretation}</div>
      )}
    </CardComponent>
  );
};

export default WarehouseInventoryTrend;
