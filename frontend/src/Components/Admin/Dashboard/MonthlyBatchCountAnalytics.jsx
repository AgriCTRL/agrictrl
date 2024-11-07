import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Warehouse } from 'lucide-react';
import CardComponent from '@/Components/CardComponent';

const MonthlyBatchCountAnalytics = ({ apiUrl, setInterpretations }) => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [interpretation, setInterpretation] = useState('');

  // Fetch data for the selected month, split into 4 weekly segments
  useEffect(() => {
    if (!selectedMonth) return;

    const fetchMonthlyBatchData = async () => {
      try {
        const [year, month] = selectedMonth.split('-');
        const endpoint = `${apiUrl}/analytics/monthly-weekly-summary?year=${year}&month=${month}`;
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setAnalyticsData(data);

        // Generate interpretation based on the data
        const generatedInterpretation = generateInterpretation(data);
        setInterpretation(generatedInterpretation);

        // Save interpretation with chart ID (like "monthly-batch-count")
        setInterpretations((prev) => ({ ...prev, 'monthly-batch-count-chart': generatedInterpretation }));

      } catch (error) {
        console.error('Error fetching monthly batch data:', error);
      }
    };

    fetchMonthlyBatchData();
  }, [selectedMonth]);

  // Update chart data and options whenever analyticsData changes
  useEffect(() => {
    if (analyticsData && analyticsData.length > 0) {
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const batchCounts = analyticsData.map(item => item.palayBatches); // Assuming each item has a `palayBatches` field

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Batch Count',
            data: batchCounts,
            backgroundColor: '#00C261',
            borderColor: '#00A049',
            borderWidth: 1
          }
        ]
      });

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          tooltip: {
            mode: 'index'
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            },
            title: {
              display: true,
              text: 'Batch Count',
              color: textColor
            }
          }
        }
      });
    }

    
  }, [analyticsData]);

  // Function to generate the interpretation
  const generateInterpretation = (data) => {
    const totalBatchCount = data.reduce((sum, item) => sum + item.palayBatches, 0);
    const maxBatchCount = Math.max(...data.map(item => item.palayBatches));
    const maxBatchWeek = data.find(item => item.palayBatches === maxBatchCount);

    return `In total, ${totalBatchCount.toLocaleString()} palay batches have been processed this month. ` +
           `The highest number of batches processed in a single week was ${maxBatchCount.toLocaleString()} in week ${maxBatchWeek.week}.`;
  };

  return (
    <CardComponent className="bg-white w-full flex-col gap-4">
      <div className="w-full flex flex-col gap-4">
        <div className="title flex gap-4 text-black">
          <Warehouse size={20}/>
          <p className="font-bold">Monthly Batch Count</p>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <input 
            type="month"
            className="border p-2 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="graph h-64">
          <Chart id="monthly-batch-count-chart" type="bar" data={chartData} options={chartOptions} />
        </div>

        {interpretation && (
          <div className="text-sm text-gray-600 mt-4">
            {interpretation}
          </div>
        )}
      </div>
    </CardComponent>
  );
};

export default MonthlyBatchCountAnalytics;
