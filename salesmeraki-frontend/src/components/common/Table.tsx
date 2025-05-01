'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

const TableHeader = ({ children, className }: TableHeaderProps) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className }: TableBodyProps) => {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className }: TableRowProps) => {
  return (
    <tr className={cn('hover:bg-gray-50', className)}>
      {children}
    </tr>
  );
};

const TableHeaderCell = ({ children, className }: TableHeaderCellProps) => {
  return (
    <th
      scope="col"
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className }: TableCellProps) => {
  return (
    <td
      className={cn(
        'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
        className
      )}
    >
      {children}
    </td>
  );
};

const Table = ({ children, className }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;

export { Table };
