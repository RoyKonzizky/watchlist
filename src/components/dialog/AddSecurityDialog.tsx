import {useMemo, useState} from "react";
import {Heart, Search} from "lucide-react";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import { Modal } from "../Modal.tsx";

interface AddSecurityDialogProps {
    securities: WatchlistSecurity[];
    /** Ids already in the list being edited. */
    selectedIds: string[];
    onToggle: (id: string) => void;
    onClose: () => void;
}

const ALL_TAB = 'הכל';

/** Search dialog for putting securities into the active list. */
export function AddSecurityDialog({
                                      securities,
                                      selectedIds,
                                      onToggle,
                                      onClose,
                                  }: AddSecurityDialogProps) {
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState(ALL_TAB);

    // Tabs come from the sectors present in the data, so every one of them has
    // something behind it.
    const tabs = useMemo(
        () => [ALL_TAB, ...new Set(securities.map((security) => security.sector))],
        [securities],
    );

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return securities.filter((security) => {
            if (tab !== ALL_TAB && security.sector !== tab) return false;
            if (!needle) return true;

            return [security.nameHe, security.nameEn, security.symbol, security.securityNumber]
                .some((field) => field.toLowerCase().includes(needle));
        });
    }, [securities, query, tab]);

    return (
        <Modal title="הוספת נייר" onClose={onClose} width={460}>
            <div style={{padding: '0 18px 18px'}}>
                <div className="relative">
                    <Search
                        size={16}
                        className="pointer-events-none absolute inset-y-0 my-auto inset-e-4 text-slate-400"
                    />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="חיפוש לפי שם או מספר נייר"
                        // Room for the icon sitting at the end of the field.
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            paddingInlineEnd: 38,
                            borderRadius: 999,
                            border: '1px solid #e5e7eb',
                            background: '#f7f8fa',
                            fontSize: 14,
                            outline: 'none',
                        }}
                    />
                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, margin: '14px 0 4px'}}>
                    {tabs.map((name) => (
                        <button
                            key={name}
                            type="button"
                            className="wl-chip"
                            onClick={() => setTab(name)}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 999,
                                border: 'none',
                                background: tab === name ? '#eaf2ff' : 'transparent',
                                color: tab === name ? '#1668dc' : '#6b7280',
                                fontSize: 13,
                                fontWeight: tab === name ? 600 : 400,
                                cursor: 'pointer',
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                {results.length === 0 && (
                    <p style={{padding: '24px 0', textAlign: 'center', color: '#9ca3af', fontSize: 14}}>
                        לא נמצאו ניירות
                    </p>
                )}

                {results.map((security) => {
                    const inList = selectedIds.includes(security.id);

                    return (
                        <div
                            key={security.id}
                            className="wl-list-row"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 12,
                                padding: '10px 0',
                                borderBottom: '1px solid #f3f4f6',
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                <span
                                    style={{
                                        display: 'flex',
                                        height: 28,
                                        width: 28,
                                        flexShrink: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        fontSize: 11,
                                        background: security.logo.background,
                                        color: security.logo.color,
                                    }}
                                >
                                    {security.logo.initials}
                                </span>
                                <div>
                                    <div style={{fontWeight: 600, fontSize: 14}}>{security.nameHe}</div>
                                    <div style={{fontSize: 12, color: '#9ca3af'}}>
                                        {security.nameEn} · {security.securityNumber}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggle(security.id)}
                                aria-label={inList ? 'הסרה מהרשימה' : 'הוספה לרשימה'}
                                aria-pressed={inList}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 30,
                                    width: 30,
                                    borderRadius: 8,
                                    border: `1px solid ${inList ? '#1668dc' : '#e5e7eb'}`,
                                    background: inList ? '#1668dc' : '#fff',
                                    color: inList ? '#fff' : '#9ca3af',
                                    fontSize: 14,
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                }}
                            >
                                <Heart size={15} fill={inList ? 'currentColor' : 'none'}/>
                            </button>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}