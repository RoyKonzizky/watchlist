import {
    useEffect,
    type ReactNode,
} from "react";
import {X} from "lucide-react";

interface ModalProps {
    title?: ReactNode;
    onClose: () => void;
    children: ReactNode;
    width?: number;
}

/**
 * Centred dialog on a dimmed backdrop.
 * Closes on Escape or a backdrop click.
 */
export function Modal({
                          title,
                          onClose,
                          children,
                          width = 420,
                      }: ModalProps) {
    useEffect(() => {
        const onKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener(
            'keydown',
            onKeyDown,
        );

        return () => {
            document.removeEventListener(
                'keydown',
                onKeyDown,
            );
        };
    }, [onClose]);

    useEffect(() => {
        const previousBodyOverflow =
            document.body.style.overflow;

        const previousHtmlOverflow =
            document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow =
            'hidden';

        return () => {
            document.body.style.overflow =
                previousBodyOverflow;

            document.documentElement.style.overflow =
                previousHtmlOverflow;
        };
    }, []);

    return (
        <div
            role="presentation"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background:
                    'rgba(15, 23, 42, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                zIndex: 50,
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                dir="rtl"
                onClick={(event) =>
                    event.stopPropagation()
                }
                style={{
                    width,
                    maxWidth: '100%',
                    height:
                        'min(640px, calc(100dvh - 32px))',
                    maxHeight:
                        'calc(100dvh - 32px)',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fff',
                    borderRadius: 14,
                    boxShadow:
                        '0 20px 45px rgba(15, 23, 42, 0.22)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',
                        flexShrink: 0,
                        padding: '14px 18px',
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                        }}
                    >
                        {title}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="סגירה"
                        className="
                            flex cursor-pointer
                            items-center justify-center
                            rounded-lg border-none
                            bg-transparent p-1
                            text-slate-500
                            transition-colors
                            hover:bg-slate-100
                        "
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div
                    data-modal-scroll-body
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        overscrollBehavior:
                            'contain',
                        WebkitOverflowScrolling:
                            'touch',
                        touchAction: 'pan-y',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}