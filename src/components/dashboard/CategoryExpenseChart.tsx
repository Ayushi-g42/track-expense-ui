import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryData {
  category: string;
  month?: number;
  year?: number;
  total: number;
}

interface CategoryExpenseChartProps {
  data?: CategoryData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CategoryExpenseChart({ data = [] }: CategoryExpenseChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  // Extract available months from data
  const availableMonths = useMemo(() => {
    if (!data) return [];
    const monthsSet = new Set<string>();
    data.forEach(item => {
      if (item.month && item.year) {
        monthsSet.add(`${item.month}-${item.year}`);
      }
    });
    return Array.from(monthsSet).sort((a, b) => {
      const [m1, y1] = a.split('-').map(Number);
      const [m2, y2] = b.split('-').map(Number);
      return y1 !== y2 ? y2 - y1 : m2 - m1; // sort descending
    });
  }, [data]);

  // Filter data based on selected month, and aggregate identical categories
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    const aggregated = data.reduce((acc, curr) => {
      if (selectedMonth !== 'All') {
        const [m, y] = selectedMonth.split('-').map(Number);
        if (curr.month !== m || curr.year !== y) return acc;
      }
      
      const existing = acc.find(item => item.category === curr.category);
      if (existing) {
        existing.total += curr.total;
      } else {
        acc.push({ category: curr.category, total: curr.total });
      }
      return acc;
    }, [] as { category: string, total: number }[]);

    return aggregated.sort((a, b) => b.total - a.total);
  }, [data, selectedMonth]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No expense data available for categories.</p>
      </div>
    );
  }

  // Format currency in INR for the tooltip
  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
          Category Wise Expense
        </h3>
        
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="All">All Time</option>
          {availableMonths.map(my => {
            const [m, y] = my.split('-');
            return (
              <option key={my} value={my}>
                {MONTHS[Number(m) - 1]} {y}
              </option>
            );
          })}
        </select>
      </div>
      
      <div style={{ flex: 1, minHeight: '300px' }}>
        {filteredData.length === 0 ? (
           <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
             No expenses for selected month.
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="total"
                nameKey="category"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatTooltip(value)}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
