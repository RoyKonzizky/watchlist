import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatPercent} from "../../../utils/formatters.ts";

export function TrendBar({security}: {security: WatchlistSecurity}) {
    return (
        <div
            dir="ltr"
            aria-label="מגמת 13 שבועות"
            style={{
                display: "flex",
                width: "fit-content",
                minWidth: 89,
                height: 22,
                marginInline: "auto",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
            }}
        >
            {security.weeklyBars.map((bar) => (
                <span
                    key={bar.weekStart}
                    title={`${bar.weekStart}: ${formatPercent(bar.changePercent)}`}
                    style={{
                        width: 5,
                        height: 22,
                        flex: "0 0 5px",
                        borderRadius: 3,
                        background: bar.changePercent >= 0 ? "#16a36a" : "#df3b50",
                    }}
                />
            ))}
        </div>
    );
}