import {useState} from "react";
import {ChevronDown, Menu, Pencil, Plus, Star, Tag, Trash2} from "lucide-react";
import type {SecurityList} from "../../utils/watchlists.ts";

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

const popover = "absolute top-[calc(100%+6px)] z-30 min-w-56 rounded-xl border border-slate-100 " +
    "bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.16)]";

const menuItem = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-right text-sm " +
    "cursor-pointer transition-colors hover:bg-slate-50";

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
    const [open, setOpen] = useState<'lists' | 'menu' | null>(null);

    const run = (action: () => void) => () => {
        setOpen(null);
        action();
    };

    return (
        <div className="relative flex items-center justify-between border-b border-slate-100 py-2.5">
            {open && (
                <div onClick={() => setOpen(null)} className="fixed inset-0 z-20"/>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(open === 'lists' ? null : 'lists')}
                    aria-expanded={open === 'lists'}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200
                        bg-white px-3 py-1.5 text-sm transition-colors hover:bg-slate-50"
                >
                    <ChevronDown size={14} className="text-slate-400"/>
                    <bdi>{activeList.name}</bdi>
                </button>

                {open === 'lists' && (
                    <div className={`${popover} right-0`}>
                        {lists.map((list) => (
                            <button
                                key={list.id}
                                type="button"
                                onClick={run(() => onSelect(list.id))}
                                className={`${menuItem} justify-between ${
                                    list.id === activeList.id ? 'bg-slate-50 font-semibold' : ''
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <bdi>{list.name}</bdi>
                                </span>
                                <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5
                                    text-xs font-normal text-slate-500">
                                    <bdi>{list.securityIds.length}</bdi>
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative flex items-center gap-2">
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2
                        text-sm text-white transition-colors hover:bg-blue-900"
                >
                    הוסף נייר
                    <Plus size={15}/>
                </button>

                <button
                    type="button"
                    onClick={() => setOpen(open === 'menu' ? null : 'menu')}
                    aria-label="פעולות על הרשימה"
                    aria-expanded={open === 'menu'}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border
                        border-slate-200 bg-white text-slate-500 transition-colors
                        hover:bg-slate-50 hover:text-slate-700"
                >
                    <Menu size={16}/>
                </button>

                {open === 'menu' && (
                    <div className={`${popover} left-0`}>
                        <button
                            type="button"
                            onClick={run(onCreate)}
                            className={`${menuItem} font-semibold text-blue-600 hover:bg-blue-50`}
                        >
                            <Plus size={16}/>
                            רשימה חדשה
                        </button>

                        <div className="my-1.5 border-t border-slate-100"/>

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
                                fill={activeList.isDefault ? 'currentColor' : 'none'}
                                className={activeList.isDefault ? 'text-amber-400' : 'text-slate-400'}
                            />
                            <span className="flex flex-col items-start">
                                רשימת ברירת מחדל
                                <span className="text-xs text-slate-400">
                                    {activeList.isDefault
                                        ? 'הרשימה נפתחת כברירת מחדל'
                                        : 'הרשימה תיפתח כברירת מחדל'}
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