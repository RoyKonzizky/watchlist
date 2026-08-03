import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {GripVertical, Minus} from "lucide-react";

export function DragPreview({security}: {security: WatchlistSecurity}) {
    return (
        <div
            dir="rtl"
            className="flex w-full scale-[1.015] select-none items-center justify-start gap-3 rounded-[10px] border border-slate-300 bg-slate-50 px-3 py-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.2)]"
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-400 text-white">
                    <Minus size={15}/>
                </span>

                <div className="min-w-0 text-right">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-gray-700">
                        {security.nameHe}
                    </div>

                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
                        {security.securityNumber}
                    </div>
                </div>
            </div>

            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-slate-500">
                <GripVertical size={16}/>
            </span>
        </div>
    );
}
