import {useMemo, useState} from "react";
import {Heart, Search} from "lucide-react";
import type {WatchlistSecurity} from "../../types/watchlist.ts";
import {Modal} from "../Modal.tsx";

interface AddSecurityDialogProps {
    securities: WatchlistSecurity[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onClose: () => void;
}

const ALL_TAB = "הכל";

export function AddSecurityDialog({
                                      securities,
                                      selectedIds,
                                      onToggle,
                                      onClose,
                                  }: AddSecurityDialogProps) {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState(ALL_TAB);

    const tabs = useMemo(
        () => [ALL_TAB, ...new Set(securities.map((security) => security.sector))],
        [securities],
    );

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return securities.filter((security) => {
            if (tab !== ALL_TAB && security.sector !== tab) {
                return false;
            }

            if (!needle) {
                return true;
            }

            return [
                security.nameHe,
                security.nameEn,
                security.symbol,
                security.securityNumber,
            ].some((field) => field.toLowerCase().includes(needle));
        });
    }, [securities, query, tab]);

    return (
        <Modal title="הוספת נייר" onClose={onClose} width={460}>
            <div style={{padding: "16px 20px 20px"}}>
                <div style={{position: "relative"}}>
                    <Search
                        size={18}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            insetInlineEnd: 16,
                            top: "50%",
                            zIndex: 1,
                            color: "#7890ad",
                            pointerEvents: "none",
                            transform: "translateY(-50%)",
                        }}
                    />

                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="חיפוש לפי שם או מספר נייר"
                        style={{
                            width: "100%",
                            height: 44,
                            padding: "0 16px",
                            paddingInlineEnd: 44,
                            boxSizing: "border-box",
                            border: "1px solid #e5e7eb",
                            borderRadius: 999,
                            outline: "none",
                            background: "#f8fafc",
                            color: "#111827",
                            fontSize: 14,
                            textAlign: "right",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "8px 14px",
                        margin: "14px 0 18px",
                    }}
                >
                    {tabs.map((name) => {
                        const isActive = tab === name;

                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => setTab(name)}
                                style={{
                                    padding: "5px 11px",
                                    border: "none",
                                    borderRadius: 999,
                                    background: isActive ? "#e8f1ff" : "transparent",
                                    color: isActive ? "#1668dc" : "#6b7280",
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 400,
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                }}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                {results.length > 0 && (
                    <div
                        style={{
                            marginBottom: 4,
                            textAlign: "right",
                            color: "#374151",
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {query.trim() ? "תוצאות חיפוש" : "ניירות"}
                    </div>
                )}

                {results.length === 0 && (
                    <p
                        style={{
                            padding: "28px 0",
                            textAlign: "center",
                            color: "#9ca3af",
                            fontSize: 14,
                        }}
                    >
                        לא נמצאו ניירות
                    </p>
                )}

                {results.map((security) => {
                    const inList = selectedIds.includes(security.id);

                    return (
                        <div
                            key={security.id}
                            className="wl-list-row"
                            style={{
                                display: "flex",
                                minHeight: 62,
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 14,
                                padding: "8px 2px",
                                borderBottom: "1px solid #f1f3f5",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flex: 1,
                                    minWidth: 0,
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        width: 30,
                                        height: 30,
                                        flexShrink: 0,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        background: security.logo.background,
                                        color: security.logo.color,
                                        fontSize: 11,
                                    }}
                                >
                                    {security.logo.initials}
                                </span>

                                <div
                                    style={{
                                        minWidth: 0,
                                        textAlign: "right",
                                    }}
                                >
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
                                            marginTop: 1,
                                            color: "#9ca3af",
                                            fontSize: 12,
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <bdi dir="ltr">
                                            {security.nameEn} · {security.securityNumber}
                                        </bdi>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggle(security.id)}
                                aria-label={inList ? "הסרה מהרשימה" : "הוספה לרשימה"}
                                aria-pressed={inList}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 32,
                                    width: 32,
                                    flexShrink: 0,
                                    borderRadius: 9,
                                    border: `1px solid ${inList ? "#1677d2" : "#e2e8f0"}`,
                                    background: inList ? "#1677d2" : "#fff",
                                    color: inList ? "#fff" : "#7890ad",
                                    lineHeight: 1,
                                    cursor: "pointer",
                                }}
                            >
                                <Heart size={16} fill={inList ? "currentColor" : "none"}/>
                            </button>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}