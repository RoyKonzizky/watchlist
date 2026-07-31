import {useState} from "react";
import {MoreHorizontal} from "lucide-react";

interface RowMenuProps {
    securityName: string;
    onBuy?: () => void;
    onSell?: () => void;
    onDetails?: () => void;
    onRemove: () => void;
}

const item = "block w-full cursor-pointer px-3 py-2.5 text-center text-sm transition-colors hover:bg-slate-50";

export function RowMenu({securityName, onBuy, onSell, onDetails, onRemove}: RowMenuProps) {
    const [open, setOpen] = useState(false);

    const run = (action?: () => void) => () => {
        setOpen(false);
        action?.();
    };

    return (
        <div className="relative inline-flex">
            {open && (
                <div role="presentation" onClick={() => setOpen(false)} className="fixed inset-0 z-20"/>
            )}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={`פעולות עבור ${securityName}`}
                aria-expanded={open}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border
                    border-slate-200 bg-white text-slate-500 transition-colors
                    hover:bg-slate-50 hover:text-slate-700"
            >
                <MoreHorizontal size={16}/>
            </button>

            {open && (
                <div
                    className="absolute top-5 left-0 z-30 w-28 overflow-hidden rounded-lg border
                        border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.14)]
                        divide-y divide-slate-100"
                >
                    <button type="button" onClick={run(onBuy)} className={`${item} text-green-600`}>
                        קנייה
                    </button>

                    <button type="button" onClick={run(onSell)} className={`${item} text-red-600`}>
                        מכירה
                    </button>

                    <button type="button" onClick={run(onDetails)} className={item}>
                        פרטים נוספים
                    </button>

                    <button type="button" onClick={run(onRemove)} className={item}>
                        הסרה
                    </button>
                </div>
            )}
        </div>
    );
}