import {useEffect, type ReactNode} from "react";
import {X} from "lucide-react";

interface ModalProps {
    title?: ReactNode;
    onClose: () => void;
    children: ReactNode;
    width?: number;
}

export function Modal({
                          title,
                          onClose,
                          children,
                          width = 420,
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
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                background: "rgba(15, 23, 42, 0.38)",
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                dir="rtl"
                onClick={(event) => event.stopPropagation()}
                style={{
                    display: "flex",
                    width,
                    maxWidth: "calc(100vw - 32px)",
                    height: "min(640px, calc(100dvh - 32px))",
                    maxHeight: "calc(100dvh - 32px)",
                    minHeight: 0,
                    flexDirection: "column",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    background: "#fff",
                    color: "#111827",
                    boxShadow: "0 22px 55px rgba(15, 23, 42, 0.24)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        minHeight: 56,
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 20px",
                        borderBottom: "1px solid #eef0f3",
                    }}
                >
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#6b7280",
                        }}
                    >
                        {title}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="סגירה"
                        style={{
                            display: "flex",
                            width: 30,
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            padding: 0,
                            border: "none",
                            borderRadius: 8,
                            background: "transparent",
                            color: "#64748b",
                            cursor: "pointer",
                        }}
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div
                    data-modal-scroll-body
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowX: "hidden",
                        overflowY: "auto",
                        overscrollBehavior: "contain",
                        WebkitOverflowScrolling: "touch",
                        touchAction: "pan-y",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}