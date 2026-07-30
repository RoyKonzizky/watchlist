import type {WatchlistSecurity} from "../types/watchlist.ts";
import {formatPercent, formatTurnover, tone} from "../utils/formatters.ts";
import {Amount} from "./table/cells/Amount.tsx";
import {ReturnBadge} from "./table/cells/ReturnBadge.tsx";
import {DailyRange} from "./table/charts/DailyRange.tsx";
import {MiniChart} from "./table/charts/Minichart.tsx";
import {TrendBar} from "./table/charts/Trendbar.tsx";
import mockWatchlist from "../data/mockWatchlist.ts";
import {type Column, DataTable} from "./table/DataTable.tsx";


export function Watchlist() {

    const columns: Column<WatchlistSecurity>[] = [
        {
            key: 'name',
            title: 'שם וסמל',
            render: (security) => (
                // In an RTL row the first child sits on the right – logo first.
                <div style={{display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content'}}>
                    <span
                        style={{
                            display: 'flex',
                            height: 32,
                            width: 32,
                            flexShrink: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            fontSize: 12,
                            background: security.logo.background,
                            color: security.logo.color,
                        }}
                    >
                        {security.logo.initials}
                    </span>
                    <div style={{textAlign: 'right'}}>
                        <div style={{fontWeight: 600}}>{security.nameHe}</div>
                        <div style={{fontSize: 12, color: '#6b7280'}}>{security.nameEn}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'price',
            title: 'שער אחרון',
            render: (security) => <Amount security={security} value={security.lastPrice}/>,
        },
        {
            key: 'changePercent',
            title: '% שינוי',
            sorter: (a, b) => a.changePercent - b.changePercent,
            render: (security) => (
                <span dir="ltr" style={tone(security.changePercent)}>
                    {formatPercent(security.changePercent)}
                </span>
            ),
        },
        {
            key: 'turnover',
            title: 'מחזור',
            sorter: (a, b) => a.turnover - b.turnover,
            render: (security) => (
                <span dir="ltr">{formatTurnover(security, security.turnover)}</span>
            ),
        },
        {
            key: 'dailyRange',
            title: 'נמוך/גבוה יומי',
            render: (security) => <DailyRange security={security}/>,
        },
        {
            key: 'minichart',
            title: 'גרף יומי',
            render: (security) => <MiniChart security={security}/>,
        },
        {
            key: 'techRating',
            title: 'דירוג טכני',
            render: (security) => <TrendBar security={security}/>,
        },
        {
            key: 'return3y',
            title: 'תשואה 3 שנים',
            sorter: (a, b) => a.return3y - b.return3y,
            render: (security) => <ReturnBadge value={security.return3y}/>,
        },
        {
            key: 'actions',
            title: '',
            width: 64,
            align: 'center',
            render: () => (
                <button
                    type="button"
                    aria-label="עוד פעולות"
                    style={{
                        height: 32,
                        width: 32,
                        borderRadius: '50%',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        cursor: 'pointer',
                        lineHeight: 1,
                    }}
                >
                    ···
                </button>
            ),
        },
    ];

    return (
        <div className="w-full" dir="rtl">
            <DataTable
                columns={columns}
                rows={mockWatchlist}
                rowKey={(security) => security.id}
            />
        </div>
    )
}