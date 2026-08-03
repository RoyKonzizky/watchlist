import {useMemo, useState} from "react";
import {Heart, Search} from "lucide-react";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import {Modal} from "../Modal.tsx";

interface AddSecurityDialogProps {
    securities: WatchlistSecurity[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onClose: () => void;
}

const ALL_TAB = "הכל";

export function AddSecurityDialog({
                                      securities,
                                      selectedIds,
                                      onToggle,
                                      onClose,
                                  }: AddSecurityDialogProps) {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState(ALL_TAB);

    const tabs = useMemo(
        () => [ALL_TAB, ...new Set(securities.map((security) => security.sector))],
        [securities],
    );

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return securities.filter((security) => {
            if (tab !== ALL_TAB && security.sector !== tab) {
                return false;
            }

            if (!needle) {
                return true;
            }

            return [
                security.nameHe,
                security.nameEn,
                security.symbol,
                security.securityNumber,
            ].some((field) => field.toLowerCase().includes(needle));
        });
    }, [securities, query, tab]);

    return (
        <Modal title="הוספת נייר" onClose={onClose} width={460}>
            <div className="px-5 pb-5 pt-4">
                <div className="relative">
                    <Search
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute end-4 top-1/2 z-[1] -translate-y-1/2 text-[#7890ad]"
                    />

                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="חיפוש לפי שם או מספר נייר"
                        className="h-11 w-full rounded-full border border-gray-200 bg-slate-50 px-4 pe-11 text-right text-sm text-gray-900 outline-none"
                    />
                </div>

                <div className="my-[14px] mb-[18px] flex flex-wrap items-center gap-x-3.5 gap-y-2">
                    {tabs.map((name) => {
                        const isActive = tab === name;

                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => setTab(name)}
                                className={`cursor-pointer whitespace-nowrap rounded-full border-0 px-[11px] py-[5px] text-[13px] ${
                                    isActive
                                        ? "bg-[#e8f1ff] font-semibold text-[#1668dc]"
                                        : "bg-transparent font-normal text-gray-500"
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                {results.length > 0 && (
                    <div className="mb-1 text-right text-sm font-semibold text-gray-700">
                        {query.trim() ? "תוצאות חיפוש" : "ניירות"}
                    </div>
                )}

                {results.length === 0 && (
                    <p className="py-7 text-center text-sm text-gray-400">
                        לא נמצאו ניירות
                    </p>
                )}

                {results.map((security) => {
                    const inList = selectedIds.includes(security.id);

                    return (
                        <div
                            key={security.id}
                            className="wl-list-row flex min-h-[62px] items-center justify-between gap-3.5 border-b border-[#f1f3f5] px-0.5 py-2"
                        >
                            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                <span
                                    className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px]"
                                    style={{
                                        background: security.logo.background,
                                        color: security.logo.color,
                                    }}
                                >
                                    {security.logo.initials}
                                </span>

                                <div className="min-w-0 text-right">
                                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-gray-700">
                                        {security.nameHe}
                                    </div>

                                    <div className="mt-px overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
                                        <bdi dir="ltr">
                                            {security.nameEn} · {security.securityNumber}
                                        </bdi>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggle(security.id)}
                                aria-label={inList ? "הסרה מהרשימה" : "הוספה לרשימה"}
                                aria-pressed={inList}
                                className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[9px] border leading-none ${
                                    inList
                                        ? "border-[#1677d2] bg-[#1677d2] text-white"
                                        : "border-slate-200 bg-white text-[#7890ad]"
                                }`}
                            >
                                <Heart size={16} fill={inList ? "currentColor" : "none"}/>
                            </button>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}
