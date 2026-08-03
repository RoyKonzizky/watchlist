import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {GripVertical, Minus} from "lucide-react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS as DndCSS} from "@dnd-kit/utilities";

interface SortableSecurityRowProps {
    security: WatchlistSecurity;
    onRemove: (id: string) => void;
}

export function SortableSecurityRow({security, onRemove}: SortableSecurityRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: security.id,
        transition: {
            duration: 180,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`wl-edit-row relative mt-2 flex w-full select-none items-center justify-start gap-3 rounded-[10px] border border-[#f0f0f0] bg-white px-3 py-2.5 ${
                isDragging ? "z-[2] opacity-25" : "z-[1] opacity-100"
            }`}
            style={{
                transform: DndCSS.Transform.toString(transform),
                transition,
            }}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => onRemove(security.id)}
                    aria-label={`הסרת ${security.nameHe}`}
                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-red-400 p-0 leading-none text-white"
                >
                    <Minus size={15}/>
                </button>

                <div className="min-w-0 text-right">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-gray-700">
                        {security.nameHe}
                    </div>

                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
                        {security.securityNumber}
                    </div>
                </div>
            </div>

            <button
                ref={setActivatorNodeRef}
                type="button"
                {...attributes}
                {...listeners}
                title="גרירה לשינוי סדר"
                aria-label={`שינוי מיקום ${security.nameHe}`}
                className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] border-0 bg-transparent p-0 text-slate-400 touch-none select-none ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
            >
                <GripVertical size={16}/>
            </button>
        </div>
    );
}
