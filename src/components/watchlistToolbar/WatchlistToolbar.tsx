import {useMemo, useState} from "react";
import {ChevronDown, Menu, Pencil, Plus, Star, Tag, Trash2} from "lucide-react";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import type {SecurityList} from "../../utils/watchlists.ts";
import {useAppSelector} from "../../store/store.ts";
import {selectAllSecurities} from "../../store/selectors.ts";

interface WatchlistToolbarProps {
    lists: SecurityList[];
    activeList: SecurityList;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onAdd: () => void;
    onEdit: () => void;
    onRename: () => void;
    onDelete: () => void;
    onToggleDefault: () => void;
}

const popover = "absolute top-[calc(100%+6px)] z-30 min-w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.16)]";

const menuItem = "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-right text-sm transition-colors hover:bg-slate-50";

export function WatchlistToolbar({
                                     lists,
                                     activeList,
                                     onSelect,
                                     onCreate,
                                     onAdd,
                                     onEdit,
                                     onRename,
                                     onDelete,
                                     onToggleDefault,
                                 }: WatchlistToolbarProps) {
    const [open, setOpen] = useState<"lists" | "menu" | null>(null);
    const securities = useAppSelector(selectAllSecurities);

    const securitiesById = useMemo(
        () => Object.fromEntries(securities.map((security) => [security.id, security])),
        [securities],
    );

    const run = (action: () => void) => () => {
        setOpen(null);
        action();
    };

    const getListSymbols = (list: SecurityList) => {
        return list.securityIds
            .map((id) => securitiesById[id])
            .filter((security): security is WatchlistSecurity => Boolean(security))
            .slice(0, 3);
    };

    return (
        <div className="relative flex items-center justify-between border-b border-slate-100 py-2.5">
            {open && (
                <div onClick={() => setOpen(null)} className="fixed inset-0 z-20"/>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(open === "lists" ? null : "lists")}
                    aria-expanded={open === "lists"}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300
                        bg-slate-200 px-3 py-1.5 text-slate-900 transition-colors hover:bg-slate-300"
                    style={{fontSize: 12}}
                >
                    <bdi>{activeList.name}</bdi>
                    <ChevronDown
                        size={12}
                        className={`text-slate-600 transition-transform ${
                            open === "lists" ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {open === "lists" && (
                    <div className={`${popover} right-0`}>
                        <div style={{display: "flex", flexDirection: "column", gap: 5}}>
                            {lists.map((list) => {
                                const symbols = getListSymbols(list);
                                const remainingCount = Math.max(0, list.securityIds.length - 3);
                                const isActive = list.id === activeList.id;

                                return (
                                    <button
                                        key={list.id}
                                        type="button"
                                        onClick={run(() => onSelect(list.id))}
                                        className={`transition-colors duration-150 ${
                                            isActive ? "bg-slate-200 hover:bg-slate-300" : "bg-white hover:bg-slate-100"
                                        }`}
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            minHeight: 38,
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                            padding: "6px 9px",
                                            border: `1px solid ${isActive ? "#cbd5e1" : "#e2e8f0"}`,
                                            borderRadius: 8,
                                            color: "#111827",
                                            fontSize: 12,
                                            fontWeight: isActive ? 600 : 400,
                                            textAlign: "right",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span
                                            style={{
                                                minWidth: 0,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            <bdi>{list.name}</bdi>
                                        </span>

                                        <span
                                            dir="ltr"
                                            style={{
                                                display: "flex",
                                                minWidth: 54,
                                                flexShrink: 0,
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {symbols.map((security, index) => (
                                                <span
                                                    key={security.id}
                                                    title={security.nameHe}
                                                    style={{
                                                        display: "flex",
                                                        width: 23,
                                                        height: 23,
                                                        marginLeft: index === 0 ? 0 : -6,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "2px solid #fff",
                                                        borderRadius: "50%",
                                                        background: security.logo.background,
                                                        color: security.logo.color,
                                                        fontSize: 8,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {security.logo.initials}
                                                </span>
                                            ))}

                                            {remainingCount > 0 && (
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        width: 23,
                                                        height: 23,
                                                        marginLeft: -6,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "2px solid #fff",
                                                        borderRadius: "50%",
                                                        background: "#f1f5f9",
                                                        color: "#475569",
                                                        fontSize: 8,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    +{remainingCount}
                                                </span>
                                            )}

                                            {symbols.length === 0 && (
                                                <span style={{fontSize: 10, color: "#94a3b8"}}>
                                                    ריקה
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative flex items-center gap-2">
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2
                        text-sm text-white transition-colors hover:bg-blue-900"
                >
                    הוסף נייר
                    <Plus size={15}/>
                </button>

                <button
                    type="button"
                    onClick={() => setOpen(open === "menu" ? null : "menu")}
                    aria-label="פעולות על הרשימה"
                    aria-expanded={open === "menu"}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border
                        border-slate-200 bg-white text-slate-500 transition-colors
                        hover:bg-slate-50 hover:text-slate-700"
                >
                    <Menu size={16}/>
                </button>

                {open === "menu" && (
                    <div className={`${popover} left-0`}>
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={run(onCreate)}*/}
                        {/*    className={`${menuItem} font-semibold text-blue-600 hover:bg-blue-50`}*/}
                        {/*>*/}
                        {/*    <Plus size={16}/>*/}
                        {/*    רשימה חדשה*/}
                        {/*</button>*/}

                        {/*<div className="my-1.5 border-t border-slate-100"/>*/}

                        <button type="button" onClick={run(onEdit)} className={menuItem}>
                            <Pencil size={16} className="text-slate-400"/>
                            עריכת רשימה
                        </button>

                        <button
                            type="button"
                            onClick={run(onToggleDefault)}
                            className={`${menuItem} items-start`}
                        >
                            <Star
                                size={16}
                                fill={activeList.isDefault ? "currentColor" : "none"}
                                className={activeList.isDefault ? "text-amber-400" : "text-slate-400"}
                            />

                            <span className="flex flex-col items-start">
                                רשימת ברירת מחדל

                                <span className="text-xs text-slate-400">
                                    {activeList.isDefault ? "הרשימה נפתחת כברירת מחדל" : "הרשימה תיפתח כברירת מחדל"}
                                </span>
                            </span>
                        </button>

                        <button type="button" onClick={run(onRename)} className={menuItem}>
                            <Tag size={16} className="text-slate-400"/>
                            שינוי שם
                        </button>

                        <button
                            type="button"
                            onClick={run(onDelete)}
                            className={`${menuItem} text-red-600 hover:bg-red-50`}
                        >
                            <Trash2 size={16}/>
                            מחיקת רשימה
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}