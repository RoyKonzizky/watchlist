import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatPercent} from "../../../utils/formatters.ts";

export function TrendBar({security}: {security: WatchlistSecurity}) {
    const peak = Math.max(...security.weeklyBars.map((bar) => Math.abs(bar.changePercent)), 1);

    return (
        <div dir="ltr" style={{display: 'flex', alignItems: 'stretch', gap: 2, height: 20}}>
            {security.weeklyBars.map((bar) => (
                <span
                    key={bar.weekStart}
                    title={`${bar.weekStart}: ${formatPercent(bar.changePercent)}`}
                    style={{
                        width: 5,
                        borderRadius: 1,
                        background: bar.changePercent >= 0 ? '#17a34a' : '#dc2626',
                        // Bigger weeks read brighter, quiet weeks stay muted.
                        opacity: 0.55 + (Math.abs(bar.changePercent) / peak) * 0.45,
                    }}
                />
            ))}
        </div>
    );
}