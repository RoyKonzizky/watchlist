import {useEffect, type ReactNode} from "react";
import {X} from "lucide-react";

interface ModalProps {
    title?: ReactNode;
    onClose: () => void;
    children: ReactNode;
    width?: number;
    height?: number | string;
}

export function Modal({
                          title,
                          onClose,
                          children,
                          width = 420,
                          height = "min(640px, calc(100dvh - 32px))",
                      }: ModalProps) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    return (
        <div
            role="presentation"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
        >
            <div
                role="dialog"
                aria-modal="true"
                dir="rtl"
                onClick={(event) => event.stopPropagation()}
                className="flex min-h-0 max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-[0_22px_55px_rgba(15,23,42,0.24)]"
                style={{
                    width,
                    height,
                }}
            >
                <div className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#eef0f3] px-5">
                    <span className="text-base font-semibold text-gray-500">
                        {title}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="סגירה"
                        className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500"
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div
                    data-modal-scroll-body
                    className={`${height === "auto" ? "flex-[0_1_auto]" : "flex-1"} min-h-0 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
