'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  month: string;
  year: number;
  total: number;
}

interface ExpenseTrendGraphProps {
  data?: TrendData[];
}

export default function ExpenseTrendGraph({ data }: ExpenseTrendGraphProps) {
  // If no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '32px', marginTop: '32px', textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Expense Trend (Last 6 Months)</h4>
        <p style={{ color: 'var(--text-secondary)' }}>No expense data available for the last 6 months.</p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => ({
    name: `${item.month} ${item.year}`,
    Expense: item.total
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px',
          borderRadius: '8px',
          color: 'var(--text-primary)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
          <p style={{ color: 'var(--danger)' }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', marginTop: '32px' }}>
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>Expense Trend (Last 6 Months)</h4>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="Expense" 
              stroke="var(--danger)" 
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--danger)', strokeWidth: 2, stroke: 'var(--bg-primary)' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
