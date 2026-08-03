import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatPercent} from "../../../utils/formatters.ts";

export function TrendBar({security}: {security: WatchlistSecurity}) {
    return (
        <div
            dir="ltr"
            aria-label="מגמת 13 שבועות"
            className="ms-auto me-0 flex h-5.5 min-w-[89px] w-fit items-center justify-center gap-0.5"
        >
            {security.weeklyBars.map((bar) => (
                <span
                    key={bar.weekStart}
                    title={`${bar.weekStart}: ${formatPercent(bar.changePercent)}`}
                    className={`h-5.5 w-[5px] flex-[0_0_5px] rounded-[3px] ${
                        bar.changePercent >= 0 ? "bg-[#16a36a]" : "bg-[#df3b50]"
                    }`}
                />
            ))}
        </div>
    );
}
