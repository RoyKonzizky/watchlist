import {useState} from "react";
import {GripVertical, Minus} from "lucide-react";
import type {WatchlistSecurity} from "../types/watchlist.ts";
import {Modal} from "./Modal.tsx";

interface EditListDialogProps {
    securities: WatchlistSecurity[];
    onReorder: (from: number, to: number) => void;
    onRemove: (id: string) => void;
    onClose: () => void;
}

export function EditListDialog({securities, onReorder, onRemove, onClose}: EditListDialogProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const finishDrag = () => {
        if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
            onReorder(draggedIndex, overIndex);
        }
        setDraggedIndex(null);
        setOverIndex(null);
    };

    return (
        <Modal title="עריכת רשימה" onClose={onClose} width={420}>
            <div style={{padding: '0 18px 18px'}}>
                {securities.map((security, index) => (
                    <div
                        key={security.id}
                        className="wl-edit-row"
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        // Without preventDefault the drop event never fires.
                        onDragOver={(event) => {
                            event.preventDefault();
                            setOverIndex(index);
                        }}
                        onDrop={finishDrag}
                        onDragEnd={finishDrag}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: '10px 12px',
                            marginTop: 8,
                            borderRadius: 10,
                            border: '1px solid #f0f0f0',
                            background: overIndex === index && draggedIndex !== index ? '#eaf2ff' : '#fff',
                            opacity: draggedIndex === index ? 0.4 : 1,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => onRemove(security.id)}
                            aria-label={`הסרת ${security.nameHe}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 24,
                                width: 24,
                                flexShrink: 0,
                                borderRadius: '50%',
                                border: 'none',
                                background: '#f87171',
                                color: '#fff',
                                fontSize: 15,
                                lineHeight: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <Minus size={15}/>
                        </button>

                        <div style={{flex: 1, textAlign: 'center'}}>
                            <div style={{fontWeight: 600, fontSize: 14}}>{security.nameHe}</div>
                            <div style={{fontSize: 12, color: '#9ca3af'}}>{security.securityNumber}</div>
                        </div>

                        <span title="גרירה לשינוי סדר" className="cursor-grab text-slate-400">
                            <GripVertical size={16}/>
                        </span>
                    </div>
                ))}

                {securities.length === 0 && (
                    <p style={{padding: '24px 0', textAlign: 'center', color: '#9ca3af', fontSize: 14}}>
                        הרשימה ריקה
                    </p>
                )}
            </div>
        </Modal>
    );
}