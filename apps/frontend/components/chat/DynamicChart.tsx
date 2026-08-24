import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DynamicChartProps {
  data: {
    title?: string;
    data: any[];
  };
}

export function DynamicChart({ data }: DynamicChartProps) {
  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    return <div className="text-red-500 text-sm">Invalid chart data</div>;
  }

  const chartData = data.data;
  
  // Extract all keys except 'date' or 'name' to create lines
  const firstItem = chartData[0];
  const keys = Object.keys(firstItem).filter(key => key !== 'date' && key !== 'name');

  const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-5 my-4 shadow-sm not-prose">
      {data.title && (
        <h3 className="text-sm font-bold text-gray-900 mb-6 text-center">{data.title}</h3>
      )}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', padding: '8px 12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {keys.map((key, i) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colors[i % colors.length]} 
                strokeWidth={2}
                dot={{ r: 3, fill: colors[i % colors.length], strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
