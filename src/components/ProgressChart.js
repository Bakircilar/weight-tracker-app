// src/components/ProgressChart.js
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Label
} from 'recharts';
import { format, parseISO, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const ProgressChart = ({ 
  weightData, 
  targetWeight, 
  startDate, 
  targetDate, 
  startWeight,
  filterPeriod = 'all' // 'week', 'month', 'all'
}) => {
  // Hedef çizgisi için veri oluştur
  const createTargetLine = () => {
    if (!startDate || !targetDate || !startWeight || !targetWeight) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(targetDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (totalDays <= 0) return null;
    
    const dailyLoss = (startWeight - targetWeight) / totalDays;
    const targetLine = [];
    
    for (let i = 0; i <= totalDays; i++) {
      const currentDate = addDays(start, i);
      const projectedWeight = startWeight - (dailyLoss * i);
      
      targetLine.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        projected: projectedWeight
      });
    }
    
    return targetLine;
  };
  
  // Verileri filtrele
  const filterData = (data) => {
    if (!data || data.length === 0) return [];
    
    const today = new Date();
    
    switch (filterPeriod) {
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return data.filter(entry => new Date(entry.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return data.filter(entry => new Date(entry.date) >= monthAgo);
      case 'all':
      default:
        return data;
    }
  };
  
  // Verileri birleştir
  const mergeData = () => {
    const targetLine = createTargetLine();
    if (!targetLine || !weightData) return [];
    
    const result = [];
    const allDates = new Set([
      ...weightData.map(entry => entry.date),
      ...targetLine.map(entry => entry.date)
    ]);
    
    allDates.forEach(date => {
      const weightEntry = weightData.find(entry => entry.date === date);
      const targetEntry = targetLine.find(entry => entry.date === date);
      
      result.push({
        date,
        weight: weightEntry ? weightEntry.weight : null,
        projected: targetEntry ? targetEntry.projected : null
      });
    });
    
    // Tarihe göre sırala
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  const chartData = filterData(mergeData());

  return (
    <div className="progress-chart">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: tr })} 
          />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip 
            formatter={(value) => [`${value} kg`, 'Kilo']}
            labelFormatter={(date) => format(new Date(date), 'd MMMM yyyy', { locale: tr })}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#8884d8" 
            name="Gerçek Kilo" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="projected" 
            stroke="#82ca9d" 
            name="Hedef Kilo" 
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          {targetWeight && (
            <ReferenceLine y={targetWeight} stroke="red" strokeDasharray="3 3">
              <Label value="Hedef Kilo" position="insideBottomRight" />
            </ReferenceLine>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;