import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatBound} from "../../../utils/formatters.ts";

export function DailyRange({security}: {security: WatchlistSecurity}) {
    const {dailyRange, lastPrice} = security;
    const span = dailyRange.high - dailyRange.low || 1;
    const position = Math.min(100, Math.max(0, ((lastPrice - dailyRange.low) / span) * 100));

    const low = formatBound(security, dailyRange.low);
    const high = formatBound(security, dailyRange.high);

    return (
        <div dir="ltr" style={{width: 128, userSelect: "none"}} title={`${low} – ${high}`}>
            <div style={{position: "relative", height: 12}}>
                <span
                    style={{
                        position: "absolute",
                        left: `${position}%`,
                        bottom: 1,
                        transform: "translateX(-50%)",
                        fontSize: 9,
                        lineHeight: 1,
                    }}
                >
                    ▼
                </span>
            </div>

            <div
                style={{
                    position: "relative",
                    height: 13,
                    overflow: "hidden",
                    borderRadius: 4,
                    background: "#e5e7eb",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        insetBlock: 0,
                        left: 0,
                        width: `${position}%`,
                        background: "linear-gradient(90deg, #334155 0%, #64748b 100%)",
                    }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    fontSize: 10,
                    opacity: 0.7,
                }}
            >
                <span>{low}</span>
                <span>{high}</span>
            </div>
        </div>
    );
}