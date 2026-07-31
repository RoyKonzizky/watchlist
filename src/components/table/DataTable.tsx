import {useMemo, useState, type ReactNode} from "react";

export interface Column<T> {
    key: string;
    title: ReactNode;
    render: (row: T) => ReactNode;
    sorter?: (a: T, b: T) => number;
    width?: number;
    align?: 'start' | 'center' | 'end';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string;
}

type SortState = {key: string; direction: 'asc' | 'desc'} | null;

export function DataTable<T>({columns, rows, rowKey}: DataTableProps<T>) {
    const [sort, setSort] = useState<SortState>(null);

    const sortedRows = useMemo(() => {
        if (!sort) return rows;
        const sorter = columns.find((column) => column.key === sort.key)?.sorter;
        if (!sorter) return rows;

        const sorted = [...rows].sort(sorter);
        return sort.direction === 'asc' ? sorted : sorted.reverse();
    }, [rows, columns, sort]);

    const toggleSort = (key: string) => {
        setSort((current) => {
            if (current?.key !== key) return {key, direction: 'asc'};
            if (current.direction === 'asc') return {key, direction: 'desc'};
            return null;
        });
    };

    return (
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 14}}>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={column.key}
                        onClick={column.sorter ? () => toggleSort(column.key) : undefined}
                        style={{
                            width: column.width,
                            padding: '6px 16px',
                            lineHeight: 1.4,
                            textAlign: column.align ?? 'start',
                            borderBottom: '1px solid #f0f0f0',
                            background: '#fafafa',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#111827',
                            whiteSpace: 'nowrap',
                            cursor: column.sorter ? 'pointer' : 'default',
                            userSelect: 'none',
                        }}
                    >
                        {column.title}
                        {column.sorter && (
                            <span style={{marginInlineStart: 6, color: '#9ca3af', fontSize: 10}}>
                                {sort?.key === column.key ? (sort.direction === 'asc' ? '▲' : '▼') : '⇅'}
                            </span>
                        )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {sortedRows.map((row) => (
                <tr key={rowKey(row)}>
                    {columns.map((column) => (
                        <td
                            key={column.key}
                            style={{
                                padding: '12px 16px',
                                textAlign: column.align ?? 'start',
                                borderBottom: '1px solid #f0f0f0',
                                verticalAlign: 'middle',
                            }}
                        >
                            {column.render(row)}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}