import {useMemo, useState} from "react";
import {createPortal} from "react-dom";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {Modal} from "../../Modal.tsx";
import {DragPreview} from "./DragPreview.tsx";
import {SortableSecurityRow} from "./SortableSecurityRow.tsx";

interface EditListDialogProps {
    securities: WatchlistSecurity[];
    onSave: (securityIds: string[]) => void;
    onClose: () => void;
}

export function EditListDialog({
                                   securities,
                                   onSave,
                                   onClose,
                               }: EditListDialogProps) {
    const originalIds = useMemo(
        () => securities.map((security) => security.id),
        [securities],
    );

    const securitiesById = useMemo(
        () => Object.fromEntries(securities.map((security) => [security.id, security])),
        [securities],
    );

    const [draftIds, setDraftIds] = useState<string[]>(() =>
        securities.map((security) => security.id),
    );

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 120,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const draftSecurities = draftIds
        .map((id) => securitiesById[id])
        .filter((security): security is WatchlistSecurity => Boolean(security));

    const activeSecurity = activeId ? securitiesById[activeId] : undefined;

    const hasChanges =
        draftIds.length !== originalIds.length ||
        draftIds.some((id, index) => id !== originalIds[index]);

    const handleDragStart = ({active}: DragStartEvent) => {
        setActiveId(String(active.id));
    };

    const handleDragEnd = ({active, over}: DragEndEvent) => {
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        setDraftIds((current) => {
            const oldIndex = current.indexOf(String(active.id));
            const newIndex = current.indexOf(String(over.id));

            if (oldIndex === -1 || newIndex === -1) {
                return current;
            }

            return arrayMove(current, oldIndex, newIndex);
        });
    };

    const handleRemove = (id: string) => {
        setDraftIds((current) => current.filter((securityId) => securityId !== id));

        if (activeId === id) {
            setActiveId(null);
        }
    };

    return (
        <Modal title="עריכת רשימה" onClose={onClose} width={420}>
            <div className="flex min-h-full flex-col">
                <div className="px-[18px] pb-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragStart={handleDragStart}
                        onDragCancel={() => setActiveId(null)}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={draftIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {draftSecurities.map((security) => (
                                <SortableSecurityRow
                                    key={security.id}
                                    security={security}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </SortableContext>

                        {typeof document !== "undefined" &&
                            createPortal(
                                <DragOverlay
                                    adjustScale={false}
                                    zIndex={80}
                                    dropAnimation={{
                                        duration: 180,
                                        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                                    }}
                                >
                                    {activeSecurity ? (
                                        <DragPreview security={activeSecurity}/>
                                    ) : null}
                                </DragOverlay>,
                                document.body,
                            )}
                    </DndContext>

                    {draftSecurities.length === 0 && (
                        <p className="py-8 text-center text-sm text-gray-400">
                            הרשימה ריקה
                        </p>
                    )}
                </div>

                <div className="sticky bottom-0 z-[5] mt-auto flex justify-end border-t border-[#eef0f3] bg-white px-[18px] py-3">
                    <button
                        type="button"
                        disabled={!hasChanges}
                        onClick={() => onSave(draftIds)}
                        className={`h-9 min-w-24 rounded-[7px] border-0 px-5 text-[13px] font-semibold text-white ${
                            hasChanges ? "cursor-pointer bg-[#1668dc] opacity-100" : "cursor-not-allowed bg-slate-300 opacity-80"
                        }`}
                    >
                        שמירה
                    </button>
                </div>
            </div>
        </Modal>
    );
}
