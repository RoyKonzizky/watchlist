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

type SortState = {
    key: string;
    direction: 'asc' | 'desc';
} | null;

const alignClass = (align: Column<unknown>['align']) => {
    if (align === 'center') {
        return 'text-center';
    }

    if (align === 'end') {
        return 'text-end';
    }

    return 'text-start';
};

export function DataTable<T>({
                                 columns,
                                 rows,
                                 rowKey,
                             }: DataTableProps<T>) {
    const [sort, setSort] = useState<SortState>(null);

    const sortedRows = useMemo(() => {
        if (!sort) {
            return rows;
        }

        const sorter = columns.find(
            (column) => column.key === sort.key,
        )?.sorter;

        if (!sorter) {
            return rows;
        }

        const sorted = [...rows].sort(sorter);

        return sort.direction === 'asc'
            ? sorted
            : sorted.reverse();
    }, [rows, columns, sort]);

    const toggleSort = (key: string) => {
        setSort((current) => {
            if (current?.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            if (current.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            return null;
        });
    };

    return (
        <table
            className="w-full min-w-[960px] table-fixed border-collapse text-sm"
        >
            <colgroup>
                {columns.map((column) => (
                    <col
                        key={column.key}
                        style={{
                            width: column.width ?? 120,
                        }}
                    />
                ))}
            </colgroup>

            <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={`select-none whitespace-nowrap border-b border-[#f0f0f0] bg-[#fafafa] px-4 py-1.5 text-[13px] font-semibold leading-[1.4] text-gray-900 ${
                            alignClass(column.align)
                        } ${column.sorter ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={
                            column.sorter
                                ? () => toggleSort(column.key)
                                : undefined
                        }
                    >
                        {column.title}

                        {column.sorter && (
                            <span
                                className="ms-1.5 text-[10px] text-gray-400"
                            >
                                    {sort?.key === column.key
                                        ? sort.direction === 'asc'
                                            ? '▲'
                                            : '▼'
                                        : '⇅'}
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
                            className={`overflow-hidden border-b border-[#f0f0f0] px-4 py-3 align-middle ${
                                alignClass(column.align)
                            }`}
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
