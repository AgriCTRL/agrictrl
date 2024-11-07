import React, { useState, useEffect, useRef  } from 'react';
import { Chart } from 'primereact/chart';
import { WheatOff } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const RiceOrderAnalytics = ({ apiUrl, setInterpretations }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Bags Sold',
        data: [],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4,
      },
    ],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [interpretation, setInterpretation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/analytics/rice-order-analytics`);
      const data = await response.json();

      // Set chart data with the total bags sold per day
      setChartData({
        labels: data.labels,
        datasets: [
          {
            label: 'Bags Sold',
            data: data.data,
            fill: true,
            borderColor: '#00C261',
            tension: 0.4,
          },
        ],
      });

      // Generate interpretation based on the data
      const generatedInterpretation = generateInterpretation(data);
      setInterpretation(generatedInterpretation);

      // Save interpretation with chart ID (like "rice-orders-analytics")
      setInterpretations((prev) => ({ ...prev, 'rice-orders-analytics': generatedInterpretation }));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
          },
        },
        y: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: documentStyle.getPropertyValue('--surface-border'),
          },
        },
      },
    });
  }, []);

  const generateInterpretation = (data) => {
    const totalBagsSold = data.data.reduce((sum, value) => sum + value, 0);
    const maxBagsSold = Math.max(...data.data);
    const maxBagsSoldDate = data.labels[data.data.indexOf(maxBagsSold)];

    return `In total, ${totalBagsSold.toLocaleString()} bags of rice have been sold. ` +
           `The highest number of bags sold in a single day was ${maxBagsSold.toLocaleString()} on ${maxBagsSoldDate}.`;
  };

  return (
    <CardComponent className="bg-white w-full flex-col gap-4">
      <div className="title flex gap-4 text-black">
        <WheatOff size={20} />
        <p className="font-bold">Rice Order Analytics</p>
      </div>

      <div className="card">
        <Chart id="rice-orders-analytics" type="line" data={chartData} options={chartOptions} />
      </div>

      {interpretation && (
        <div id='rice-order-analytics' className="text-sm text-gray-600 mt-4">{interpretation}</div>
      )}
    </CardComponent>
  );
};

export default RiceOrderAnalytics;
