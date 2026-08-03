import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {createPortal} from "react-dom";
import {MoreHorizontal} from "lucide-react";

interface RowMenuProps {
    securityName: string;
    onBuy?: () => void;
    onSell?: () => void;
    onDetails?: () => void;
    onRemove: () => void;
}

interface MenuPosition {
    top: number;
    left: number;
    ready: boolean;
}

const MENU_WIDTH = 112;
const MENU_GAP = 6;
const VIEWPORT_GAP = 8;

const item =
    "block w-full cursor-pointer px-3 py-2.5 text-center text-sm transition-colors hover:bg-slate-50";

export function RowMenu({
                            securityName,
                            onBuy,
                            onSell,
                            onDetails,
                            onRemove,
                        }: RowMenuProps) {
    const [open, setOpen] = useState(false);

    const [position, setPosition] = useState<MenuPosition>({
        top: 0,
        left: 0,
        ready: false,
    });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const run = (action?: () => void) => () => {
        setOpen(false);
        action?.();
    };

    const updatePosition = useCallback(() => {
        const button = buttonRef.current;
        const menu = menuRef.current;

        if (!button || !menu) {
            return;
        }

        const buttonRect = button.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;

        let left = buttonRect.left;
        let top = buttonRect.bottom + MENU_GAP;

        left = Math.max(
            VIEWPORT_GAP,
            Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_GAP),
        );

        const fitsBelow =
            top + menuHeight <= window.innerHeight - VIEWPORT_GAP;

        if (!fitsBelow) {
            top = buttonRect.top - menuHeight - MENU_GAP;
        }

        top = Math.max(
            VIEWPORT_GAP,
            Math.min(top, window.innerHeight - menuHeight - VIEWPORT_GAP),
        );

        setPosition({
            top,
            left,
            ready: true,
        });
    }, []);

    useLayoutEffect(() => {
        if (!open) {
            return;
        }

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    const toggleMenu = () => {
        if (!open) {
            setPosition({
                top: 0,
                left: 0,
                ready: false,
            });
        }

        setOpen((current) => !current);
    };

    return (
        <div className="relative inline-flex">
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                aria-label={`פעולות עבור ${securityName}`}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border
                    border-slate-200  text-slate-500 transition-colors
                    hover:bg-slate-50 hover:text-slate-700 bg-gray-100"
            >
                <MoreHorizontal size={16}/>
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <>
                        <div
                            role="presentation"
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-20"
                        />

                        <div
                            ref={menuRef}
                            role="menu"
                            dir="rtl"
                            className="fixed z-30 w-28 overflow-hidden rounded-lg border border-slate-200
                                bg-white shadow-[0_8px_20px_rgba(15,23,42,0.14)]
                                divide-y divide-slate-100"
                            style={{
                                top: position.top,
                                left: position.left,
                                visibility: position.ready ? "visible" : "hidden",
                            }}
                        >
                            <button
                                type="button"
                                role="menuitem"
                                onClick={run(onBuy)}
                                className={`${item} text-green-600`}
                            >
                                קנייה
                            </button>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={run(onSell)}
                                className={`${item} text-red-600`}
                            >
                                מכירה
                            </button>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={run(onDetails)}
                                className={item}
                            >
                                פרטים נוספים
                            </button>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={run(onRemove)}
                                className={item}
                            >
                                הסרה
                            </button>
                        </div>
                    </>,
                    document.body,
                )}
        </div>
    );
}
