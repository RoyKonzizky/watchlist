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
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {GripVertical, Minus} from "lucide-react";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import {Modal} from "../Modal.tsx";

interface EditListDialogProps {
    securities: WatchlistSecurity[];
    onSave: (securityIds: string[]) => void;
    onClose: () => void;
}

interface SortableSecurityRowProps {
    security: WatchlistSecurity;
    onRemove: (id: string) => void;
}

function SortableSecurityRow({security, onRemove}: SortableSecurityRowProps) {
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
            className="wl-edit-row"
            style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                marginTop: 8,
                boxSizing: "border-box",
                position: "relative",
                zIndex: isDragging ? 2 : 1,
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                background: "#fff",
                opacity: isDragging ? 0.25 : 1,
                transform: CSS.Transform.toString(transform),
                transition,
                userSelect: "none",
            }}
        >
            <button
                type="button"
                onClick={() => onRemove(security.id)}
                aria-label={`הסרת ${security.nameHe}`}
                style={{
                    display: "flex",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    border: "none",
                    borderRadius: "50%",
                    background: "#f87171",
                    color: "#fff",
                    lineHeight: 1,
                    cursor: "pointer",
                }}
            >
                <Minus size={15}/>
            </button>

            <div style={{flex: 1, minWidth: 0, textAlign: "center"}}>
                <div
                    style={{
                        overflow: "hidden",
                        color: "#374151",
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {security.nameHe}
                </div>

                <div
                    style={{
                        overflow: "hidden",
                        color: "#9ca3af",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {security.securityNumber}
                </div>
            </div>

            <button
                ref={setActivatorNodeRef}
                type="button"
                {...attributes}
                {...listeners}
                title="גרירה לשינוי סדר"
                aria-label={`שינוי מיקום ${security.nameHe}`}
                style={{
                    display: "flex",
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    border: "none",
                    borderRadius: 7,
                    background: "transparent",
                    color: "#94a3b8",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                    userSelect: "none",
                }}
            >
                <GripVertical size={16}/>
            </button>
        </div>
    );
}

function DragPreview({security}: {security: WatchlistSecurity}) {
    return (
        <div
            dir="rtl"
            style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                boxSizing: "border-box",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                background: "#f8fafc",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.2)",
                transform: "scale(1.015)",
                userSelect: "none",
            }}
        >
            <span
                style={{
                    display: "flex",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "#f87171",
                    color: "#fff",
                }}
            >
                <Minus size={15}/>
            </span>

            <div style={{flex: 1, minWidth: 0, textAlign: "center"}}>
                <div
                    style={{
                        overflow: "hidden",
                        color: "#374151",
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {security.nameHe}
                </div>

                <div
                    style={{
                        overflow: "hidden",
                        color: "#9ca3af",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {security.securityNumber}
                </div>
            </div>

            <span
                style={{
                    display: "flex",
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                }}
            >
                <GripVertical size={16}/>
            </span>
        </div>
    );
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
            <div
                style={{
                    display: "flex",
                    minHeight: "100%",
                    flexDirection: "column",
                }}
            >
                <div style={{padding: "0 18px 16px"}}>
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
                        <p
                            style={{
                                padding: "32px 0",
                                textAlign: "center",
                                color: "#9ca3af",
                                fontSize: 14,
                            }}
                        >
                            הרשימה ריקה
                        </p>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        position: "sticky",
                        bottom: 0,
                        zIndex: 5,
                        marginTop: "auto",
                        justifyContent: "flex-end",
                        padding: "12px 18px",
                        borderTop: "1px solid #eef0f3",
                        background: "#fff",
                    }}
                >
                    <button
                        type="button"
                        disabled={!hasChanges}
                        onClick={() => onSave(draftIds)}
                        style={{
                            minWidth: 96,
                            height: 36,
                            padding: "0 20px",
                            border: "none",
                            borderRadius: 7,
                            background: hasChanges ? "#1668dc" : "#cbd5e1",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: hasChanges ? "pointer" : "not-allowed",
                            opacity: hasChanges ? 1 : 0.8,
                        }}
                    >
                        שמירה
                    </button>
                </div>
            </div>
        </Modal>
    );
}
