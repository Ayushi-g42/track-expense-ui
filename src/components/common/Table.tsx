'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  createButtonText?: string;
  createButtonLink?: string;
}

export default function Table<T extends Record<string, any>>({ 
  columns, 
  data, 
  title, 
  createButtonText, 
  createButtonLink 
}: TableProps<T>) {
  const [filterText, setFilterText] = useState('');

  // Very basic search filtering
  const filteredData = data.filter((row) => {
    return Object.values(row).some(
      (value) => String(value).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="table-container glass-panel">
      <div className="table-header">
        <h3>{title}</h3>
        <div className="table-actions">
          <input 
            type="text" 
            placeholder="Search..." 
            className="table-search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {createButtonText && createButtonLink && (
            <Link href={createButtonLink} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              {createButtonText}
            </Link>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '24px' }}>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .table-header h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        .table-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .table-search {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
          color: var(--text-primary);
          outline: none;
        }
        .table-search:focus {
          border-color: var(--accent-primary);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .custom-table th {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          font-weight: 600;
        }
        .custom-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        .custom-table tr:last-child td {
          border-bottom: none;
        }
        .custom-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}
