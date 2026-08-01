import {
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import {
    GripVertical,
    Minus,
} from "lucide-react";
import type {
    WatchlistSecurity,
} from "../../types/watchlist.ts";
import {Modal} from "../Modal.tsx";

interface EditListDialogProps {
    securities: WatchlistSecurity[];
    onReorder: (
        from: number,
        to: number,
    ) => void;
    onRemove: (id: string) => void;
    onClose: () => void;
}

type GripPointerEvent =
    ReactPointerEvent<HTMLSpanElement>;

export function EditListDialog({
                                   securities,
                                   onReorder,
                                   onRemove,
                                   onClose,
                               }: EditListDialogProps) {
    const [draggedIndex, setDraggedIndex] =
        useState<number | null>(null);

    const [overIndex, setOverIndex] =
        useState<number | null>(null);

    const [dragOffsetY, setDragOffsetY] =
        useState(0);

    const draggedIndexRef =
        useRef<number | null>(null);

    const overIndexRef =
        useRef<number | null>(null);

    const activePointerIdRef =
        useRef<number | null>(null);

    const pointerStartYRef =
        useRef(0);

    const initialScrollTopRef =
        useRef(0);

    const scrollBodyRef =
        useRef<HTMLElement | null>(null);

    const rowRefs =
        useRef<Array<HTMLDivElement | null>>([]);

    const resetDrag = () => {
        draggedIndexRef.current = null;
        overIndexRef.current = null;
        activePointerIdRef.current = null;
        scrollBodyRef.current = null;

        setDraggedIndex(null);
        setOverIndex(null);
        setDragOffsetY(0);
    };

    const findTargetIndex = (
        pointerY: number,
    ): number | null => {
        const from = draggedIndexRef.current;

        if (from === null) {
            return null;
        }

        const rows = rowRefs.current
            .map((element, index) => {
                if (!element || index === from) {
                    return null;
                }

                const rect =
                    element.getBoundingClientRect();

                return {
                    index,
                    top: rect.top,
                    bottom: rect.bottom,
                    center:
                        rect.top +
                        rect.height / 2,
                };
            })
            .filter(
                (
                    row,
                ): row is {
                    index: number;
                    top: number;
                    bottom: number;
                    center: number;
                } => row !== null,
            );

        if (rows.length === 0) {
            return from;
        }

        const rowUnderPointer = rows.find(
            (row) =>
                pointerY >= row.top &&
                pointerY <= row.bottom,
        );

        if (rowUnderPointer) {
            return rowUnderPointer.index;
        }

        let closestRow = rows[0];
        let closestDistance = Math.abs(
            pointerY - closestRow.center,
        );

        for (
            let index = 1;
            index < rows.length;
            index += 1
        ) {
            const distance = Math.abs(
                pointerY - rows[index].center,
            );

            if (distance < closestDistance) {
                closestRow = rows[index];
                closestDistance = distance;
            }
        }

        return closestRow.index;
    };

    useEffect(() => {
        const handlePointerMove = (
            event: PointerEvent,
        ) => {
            if (
                activePointerIdRef.current === null ||
                event.pointerId !==
                activePointerIdRef.current
            ) {
                return;
            }

            if (event.cancelable) {
                event.preventDefault();
            }

            const scrollBody =
                scrollBodyRef.current;

            if (scrollBody) {
                const bounds =
                    scrollBody.getBoundingClientRect();

                const edgeDistance = 50;
                const scrollAmount = 14;

                if (
                    event.clientY <
                    bounds.top + edgeDistance
                ) {
                    scrollBody.scrollTop -=
                        scrollAmount;
                } else if (
                    event.clientY >
                    bounds.bottom - edgeDistance
                ) {
                    scrollBody.scrollTop +=
                        scrollAmount;
                }
            }

            const scrollDifference =
                (scrollBody?.scrollTop ?? 0) -
                initialScrollTopRef.current;

            const offset =
                event.clientY -
                pointerStartYRef.current +
                scrollDifference;

            setDragOffsetY(offset);

            /*
             * Do not switch rows from a tiny tap or
             * accidental finger movement.
             */
            if (Math.abs(offset) < 8) {
                return;
            }

            const nextTarget =
                findTargetIndex(event.clientY);

            if (
                nextTarget === null ||
                nextTarget ===
                overIndexRef.current
            ) {
                return;
            }

            overIndexRef.current =
                nextTarget;

            setOverIndex(nextTarget);
        };

        const handlePointerUp = (
            event: PointerEvent,
        ) => {
            if (
                activePointerIdRef.current === null ||
                event.pointerId !==
                activePointerIdRef.current
            ) {
                return;
            }

            const from =
                draggedIndexRef.current;

            const to =
                overIndexRef.current;

            resetDrag();

            if (
                from !== null &&
                to !== null &&
                from !== to
            ) {
                onReorder(from, to);
            }
        };

        const handlePointerCancel = (
            event: PointerEvent,
        ) => {
            if (
                activePointerIdRef.current === null ||
                event.pointerId !==
                activePointerIdRef.current
            ) {
                return;
            }

            resetDrag();
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove,
            {passive: false},
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp,
        );

        window.addEventListener(
            "pointercancel",
            handlePointerCancel,
        );

        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp,
            );

            window.removeEventListener(
                "pointercancel",
                handlePointerCancel,
            );
        };
    }, [onReorder]);

    const startDrag = (
        event: GripPointerEvent,
        index: number,
    ) => {
        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        activePointerIdRef.current =
            event.pointerId;

        draggedIndexRef.current = index;
        overIndexRef.current = index;

        pointerStartYRef.current =
            event.clientY;

        const scrollBody =
            event.currentTarget.closest<HTMLElement>(
                "[data-modal-scroll-body]",
            );

        scrollBodyRef.current =
            scrollBody;

        initialScrollTopRef.current =
            scrollBody?.scrollTop ?? 0;

        setDraggedIndex(index);
        setOverIndex(index);
        setDragOffsetY(0);
    };

    return (
        <Modal
            title="עריכת רשימה"
            onClose={onClose}
            width={420}
        >
            <div
                style={{
                    padding: "0 18px 18px",
                }}
            >
                {securities.map(
                    (security, index) => {
                        const isDragged =
                            draggedIndex === index;

                        const isDropTarget =
                            draggedIndex !== null &&
                            overIndex === index &&
                            draggedIndex !== index;

                        return (
                            <div
                                key={security.id}
                                ref={(element) => {
                                    rowRefs.current[
                                        index
                                        ] = element;
                                }}
                                className="wl-edit-row"
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 12,
                                    padding:
                                        "10px 12px",
                                    marginTop: 8,
                                    borderRadius: 10,
                                    border:
                                        "1px solid #f0f0f0",
                                    background:
                                        isDropTarget
                                            ? "#eaf2ff"
                                            : "#fff",
                                    opacity:
                                        isDragged
                                            ? 0.4
                                            : 1,
                                    position:
                                        isDragged
                                            ? "relative"
                                            : undefined,
                                    zIndex:
                                        isDragged
                                            ? 2
                                            : undefined,
                                    transform:
                                        isDragged
                                            ? `translateY(${dragOffsetY}px)`
                                            : undefined,
                                    pointerEvents:
                                        isDragged
                                            ? "none"
                                            : undefined,
                                    userSelect:
                                        "none",
                                    transition:
                                        isDragged
                                            ? "none"
                                            : "background 120ms ease",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            security.id,
                                        )
                                    }
                                    aria-label={`הסרת ${security.nameHe}`}
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        height: 24,
                                        width: 24,
                                        flexShrink: 0,
                                        borderRadius:
                                            "50%",
                                        border: "none",
                                        background:
                                            "#f87171",
                                        color: "#fff",
                                        fontSize: 15,
                                        lineHeight: 1,
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    <Minus size={15}/>
                                </button>

                                <div
                                    style={{
                                        flex: 1,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight:
                                                600,
                                            fontSize: 14,
                                        }}
                                    >
                                        {
                                            security.nameHe
                                        }
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 12,
                                            color:
                                                "#9ca3af",
                                        }}
                                    >
                                        {
                                            security.securityNumber
                                        }
                                    </div>
                                </div>

                                <span
                                    title="גרירה לשינוי סדר"
                                    className="cursor-grab text-slate-400"
                                    onPointerDown={(
                                        event,
                                    ) =>
                                        startDrag(
                                            event,
                                            index,
                                        )
                                    }
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        padding: 4,
                                        cursor:
                                            isDragged
                                                ? "grabbing"
                                                : "grab",
                                        touchAction:
                                            "none",
                                        userSelect:
                                            "none",
                                    }}
                                >
                                    <GripVertical
                                        size={16}
                                    />
                                </span>
                            </div>
                        );
                    },
                )}

                {securities.length === 0 && (
                    <p
                        style={{
                            padding:
                                "24px 0",
                            textAlign:
                                "center",
                            color:
                                "#9ca3af",
                            fontSize: 14,
                        }}
                    >
                        הרשימה ריקה
                    </p>
                )}
            </div>
        </Modal>
    );
}