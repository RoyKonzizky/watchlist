import {useEffect, useState} from "react";
import {DailyRange} from "./charts/DailyRange.tsx";
import {MiniChart} from "./charts/Minichart.tsx";
import {TrendBar} from "./charts/Trendbar.tsx";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import {type Column, DataTable} from "./DataTable.tsx";
import {Amount} from "./cells/Amount.tsx";
import {
    formatPercent,
    formatTurnover,
    tone,
} from "../../utils/formatters.ts";
import {ReturnBadge} from "./cells/ReturnBadge.tsx";
import {RowMenu} from "./cells/RowMenu.tsx";
import {WatchlistToolbar} from "../watchlistToolbar/WatchlistToolbar.tsx";
import {AddSecurityDialog} from ".././dialog/AddSecurityDialog.tsx";
import {ListNameDialog} from ".././dialog/ListNameDialog.tsx";
import {EditListDialog} from ".././dialog/EditListDialog.tsx";
import {
    EmptyState,
    ErrorState,
    StaleFeedBanner,
    TableSkeleton,
} from "./../TableStates.tsx";
import {
    useAppDispatch,
    useAppSelector,
} from "../../store/store.ts";
import {fetchSecurities} from "../../store/securitiesSlice.ts";
import {
    feedStarted,
    feedStopped,
} from "../../store/feed/feedSlice.ts";
import {
    activeListChanged,
    defaultToggled,
    listCreated,
    listDeleted,
    listRenamed,
    securityIdsSaved,
    securityRemoved,
    securityToggled,
} from "../../store/listsSlice.ts";import {
    selectActiveList,
    selectActiveRows,
    selectAllSecurities,
    selectError,
    selectFeedIsStale,
    selectLists,
    selectStatus,
} from "../../store/selectors.ts";

export function Watchlist() {
    const dispatch = useAppDispatch();

    const lists = useAppSelector(selectLists);
    const activeList = useAppSelector(selectActiveList);
    const rows = useAppSelector(selectActiveRows);
    const allSecurities = useAppSelector(selectAllSecurities);
    const status = useAppSelector(selectStatus);
    const error = useAppSelector(selectError);
    const feedIsStale = useAppSelector(selectFeedIsStale);

    const [dialog, setDialog] = useState<
        'add' | 'edit' | 'create' | 'rename' | null
    >(null);

    useEffect(() => {
        dispatch(fetchSecurities());
    }, [dispatch]);

    useEffect(() => {
        if (status !== 'succeeded') {
            return;
        }

        dispatch(feedStarted());

        return () => {
            dispatch(feedStopped());
        };
    }, [status, dispatch]);

    const columns: Column<WatchlistSecurity>[] = [
        {
            key: 'name',
            title: 'שם וסמל',
            width: 200,
            sorter: (a, b) =>
                a.nameHe.localeCompare(b.nameHe, 'he'),
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
                        <div style={{fontWeight: 600}}>
                            {security.nameHe}
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color: '#6b7280',
                            }}
                        >
                            {security.nameEn}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'price',
            width: 100,
            title: 'שער אחרון',
            sorter: (a, b) =>
                a.lastPrice - b.lastPrice,
            render: (security) => (
                <Amount
                    security={security}
                    value={security.lastPrice}
                />
            ),
        },
        {
            key: 'changePercent',
            width: 90,
            title: '% שינוי',
            sorter: (a, b) =>
                a.changePercent - b.changePercent,
            render: (security) => (
                <span
                    dir="ltr"
                    style={tone(security.changePercent)}
                >
                    {formatPercent(security.changePercent)}
                </span>
            ),
        },
        {
            key: 'turnover',
            width: 100,
            title: 'מחזור',
            sorter: (a, b) =>
                a.turnover - b.turnover,
            render: (security) => (
                <span dir="ltr">
                    {formatTurnover(
                        security,
                        security.turnover,
                    )}
                </span>
            ),
        },
        {
            key: 'dailyRange',
            width: 120,
            title: 'נמוך/גבוה יומי',
            render: (security) => (
                <DailyRange security={security}/>
            ),
        },
        {
            key: 'minichart',
            width: 120,
            title: 'גרף יומי',
            render: (security) => (
                <MiniChart security={security}/>
            ),
        },
        {
            key: 'techRating',
            width: 120,
            title: 'טרנד בר',
            render: (security) => (
                <TrendBar security={security}/>
            ),
        },
        {
            key: 'return30d',
            width: 120,
            title: 'תשואה 30 ימים',
            sorter: (a, b) =>
                a.return30d - b.return30d,
            render: (security) => (
                <ReturnBadge value={security.return30d}/>
            ),
        },
        {
            key: 'actions',
            width: 64,
            title: '',
            align: 'center',
            render: (security) => (
                <RowMenu
                    securityName={security.nameHe}
                    onRemove={() =>
                        dispatch(
                            securityRemoved(security.id),
                        )
                    }
                />
            ),
        },
    ];

    const bodyByStateStatus = () => {
        if (
            status === 'loading' ||
            status === 'idle'
        ) {
            return <TableSkeleton/>;
        }

        if (status === 'failed') {
            return (
                <ErrorState
                    message={
                        error ??
                        'טעינת הנתונים נכשלה'
                    }
                    onRetry={() =>
                        dispatch(fetchSecurities())
                    }
                />
            );
        }

        if (lists.length === 0) {
            return (
                <EmptyState
                    title="אין רשימות"
                    description="צרו רשימה כדי להתחיל לעקוב אחרי ניירות"
                    actionLabel="רשימה חדשה"
                    onAction={() =>
                        setDialog('create')
                    }
                />
            );
        }

        if (rows.length === 0) {
            return (
                <EmptyState
                    title="הרשימה ריקה"
                    description="הוסיפו ניירות כדי לראות אותם כאן"
                    actionLabel="+ הוסף נייר"
                    onAction={() =>
                        setDialog('add')
                    }
                />
            );
        }

        return (
            <DataTable
                columns={columns}
                rows={rows}
                rowKey={(security) => security.id}
            />
        );
    };

    return (
        <div
            className="w-full max-w-full min-w-0"
            dir="rtl"
        >
            {activeList && (
                <WatchlistToolbar
                    lists={lists}
                    activeList={activeList}
                    onSelect={(id) =>
                        dispatch(activeListChanged(id))
                    }
                    // onCreate={() =>
                    //     setDialog('create')
                    // }
                    onAdd={() =>
                        setDialog('add')
                    }
                    onEdit={() =>
                        setDialog('edit')
                    }
                    onRename={() =>
                        setDialog('rename')
                    }
                    onDelete={() =>
                        dispatch(listDeleted())
                    }
                    onToggleDefault={() =>
                        dispatch(defaultToggled())
                    }
                />
            )}

            {feedIsStale && <StaleFeedBanner/>}

            <div
                className="watchlist-table-scroll w-full max-w-full min-w-0 overflow-auto"
                style={{
                    maxHeight: 'calc(100svh - 112px)',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x pan-y',
                }}
            >
                {bodyByStateStatus()}
            </div>

            {dialog === 'add' && activeList && (
                <AddSecurityDialog
                    securities={allSecurities}
                    selectedIds={
                        activeList.securityIds
                    }
                    onToggle={(id) =>
                        dispatch(securityToggled(id))
                    }
                    onClose={() =>
                        setDialog(null)
                    }
                />
            )}

            {dialog === 'create' && (
                <ListNameDialog
                    title="רשימה חדשה"
                    submitLabel="יצירה"
                    takenNames={lists.map(
                        (list) => list.name,
                    )}
                    onSubmit={(name) => {
                        dispatch(listCreated(name));
                        setDialog(null);
                    }}
                    onClose={() =>
                        setDialog(null)
                    }
                />
            )}

            {dialog === 'rename' && activeList && (
                <ListNameDialog
                    title="שינוי שם"
                    submitLabel="שמירה"
                    initialName={activeList.name}
                    takenNames={lists
                        .filter(
                            (list) =>
                                list.id !==
                                activeList.id,
                        )
                        .map((list) => list.name)}
                    onSubmit={(name) => {
                        dispatch(listRenamed(name));
                        setDialog(null);
                    }}
                    onClose={() =>
                        setDialog(null)
                    }
                />
            )}

            {dialog === 'edit' && (
                <EditListDialog
                    securities={rows}
                    onSave={(securityIds) => {
                        dispatch(securityIdsSaved(securityIds));
                        setDialog(null);
                    }}
                    onClose={() => setDialog(null)}
                />
            )}
        </div>
    );
}
