import {useState} from "react";
import {DailyRange} from "./charts/DailyRange.tsx";
import {MiniChart} from "./charts/Minichart.tsx";
import {TrendBar} from "./charts/Trendbar.tsx";
import type { WatchlistSecurity } from "../../types/watchlist.ts";
import mockWatchlist from "../../data/mockWatchlist.ts";
import watchlists from "../../utils/watchlists.ts";
import {type Column, DataTable} from "./DataTable.tsx";
import {Amount} from "./cells/Amount.tsx";
import {formatPercent, formatTurnover, tone} from "../../utils/formatters.ts";
import {ReturnBadge} from "./cells/ReturnBadge.tsx";
import {WatchlistToolbar} from "../watchlistToolbar/WatchlistToolbar.tsx";
import {AddSecurityDialog} from "../AddSecurityDialog.tsx";
import {ListNameDialog} from "../ListNameDialog.tsx";
import {EditListDialog} from "../EditListDialog.tsx";
import {RowMenu} from "./cells/RowMenu.tsx";

const byId = new Map(mockWatchlist.map((security) => [security.id, security]));

export function Watchlist() {

    const [lists, setLists] = useState(watchlists);
    const [activeId, setActiveId] =
        useState((watchlists.find((list) => list.isDefault) ?? watchlists[0]).id,);
    const [dialog, setDialog] = useState<'add' | 'edit' | 'create' | 'rename' | null>(null);

    const activeList = lists.find((list) => list.id === activeId) ?? lists[0];

    const rows = activeList.securityIds
        .map((id) => byId.get(id))
        .filter((security): security is WatchlistSecurity => security !== undefined);

    const updateActive = (change: (ids: string[]) => string[]) => {
        setLists((current) => current.map((list) => (
            list.id === activeList.id ? {...list, securityIds: change(list.securityIds)} : list
        )));
    };

    const toggleSecurity = (securityId: string) => updateActive((ids) => (
        ids.includes(securityId) ? ids.filter((id) => id !== securityId) : [...ids, securityId]
    ));

    const removeSecurity = (securityId: string) => updateActive(
        (ids) => ids.filter((id) => id !== securityId),
    );

    const reorderSecurity = (from: number, to: number) => updateActive((ids) => {
        const next = [...ids];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
    });

    const createList = (name: string) => {
        const list = {id: `wl-${Date.now()}`, name, securityIds: []};
        setLists((current) => [...current, list]);
        setActiveId(list.id);
        setDialog(null);
    };

    const renameList = (name: string) => {
        setLists((current) => current.map((list) => (
            list.id === activeList.id ? {...list, name} : list
        )));
        setDialog(null);
    };

    const deleteList = () => {
        if (lists.length === 1) return;
        const remaining = lists.filter((list) => list.id !== activeList.id);
        setLists(remaining);
        setActiveId(remaining[0].id);
    };

    const toggleDefault = () => {
        const makeDefault = !activeList.isDefault;
        setLists((current) => current.map((list) => ({
            ...list,
            isDefault: makeDefault && list.id === activeList.id,
        })));
    };

    const columns: Column<WatchlistSecurity>[] = [
        {
            key: 'name',
            title: 'שם וסמל',
            sorter: (a, b) => a.nameHe.localeCompare(b.nameHe, 'he'),
            render: (security) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: 'fit-content',
                        whiteSpace: 'nowrap',
                    }}
                >
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
            sorter: (a, b) => a.lastPrice - b.lastPrice,
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
            title: 'טרנד בר',
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
            align: 'center',
            render: (security) => (
                <RowMenu
                    securityName={security.nameHe}
                    onRemove={() => removeSecurity(security.id)}
                />
            ),
        },
    ];

    return (
        <div className="w-full" dir="rtl">
            <WatchlistToolbar
                lists={lists}
                activeList={activeList}
                onSelect={setActiveId}
                onCreate={() => setDialog('create')}
                onAdd={() => setDialog('add')}
                onEdit={() => setDialog('edit')}
                onRename={() => setDialog('rename')}
                onDelete={deleteList}
                onToggleDefault={toggleDefault}
            />

            <DataTable columns={columns} rows={rows} rowKey={(security) => security.id}/>

            {dialog === 'add' && (
                <AddSecurityDialog
                    securities={mockWatchlist}
                    selectedIds={activeList.securityIds}
                    onToggle={toggleSecurity}
                    onClose={() => setDialog(null)}
                />
            )}

            {dialog === 'create' && (
                <ListNameDialog
                    title="רשימה חדשה"
                    submitLabel="יצירה"
                    takenNames={lists.map((list) => list.name)}
                    onSubmit={createList}
                    onClose={() => setDialog(null)}
                />
            )}

            {dialog === 'rename' && (
                <ListNameDialog
                    title="שינוי שם"
                    submitLabel="שמירה"
                    initialName={activeList.name}
                    takenNames={lists
                        .filter((list) => list.id !== activeList.id)
                        .map((list) => list.name)}
                    onSubmit={renameList}
                    onClose={() => setDialog(null)}
                />
            )}

            {dialog === 'edit' && (
                <EditListDialog
                    securities={rows}
                    onReorder={reorderSecurity}
                    onRemove={removeSecurity}
                    onClose={() => setDialog(null)}
                />
            )}
        </div>
    )
}