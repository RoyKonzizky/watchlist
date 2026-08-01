import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatPercent} from "../../../utils/formatters.ts";

export function TrendBar({security}: {security: WatchlistSecurity}) {

    return (
        <div dir="ltr" style={{display: 'flex', alignItems: 'stretch', gap: 2, height: 20}}>
            {security.weeklyBars.map((bar) => (
                <span
                    key={bar.weekStart}
                    title={`${bar.weekStart}: ${formatPercent(bar.changePercent)}`}
                    style={{
                        width: 6,
                        borderRadius: 3,
                        background: bar.changePercent >= 0 ? '#17a34a' : '#dc2626',
                    }}
                />
            ))}
        </div>
    );
}