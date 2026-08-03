import type {WatchlistSecurity} from "../../../types/watchlist.ts";
import {formatBound} from "../../../utils/formatters.ts";

export function DailyRange({security}: {security: WatchlistSecurity}) {
    const {dailyRange, lastPrice} = security;
    const span = dailyRange.high - dailyRange.low || 1;
    const position = Math.min(100, Math.max(0, ((lastPrice - dailyRange.low) / span) * 100));

    const low = formatBound(security, dailyRange.low);
    const high = formatBound(security, dailyRange.high);

    return (
        <div dir="ltr" className="w-32 select-none" title={`${low} - ${high}`}>
            <div className="relative h-3">
                <span
                    className="absolute bottom-px translate-x-[-50%] text-[9px] leading-none"
                    style={{
                        left: `${position}%`,
                    }}
                >
                    ▼
                </span>
            </div>

            <div className="relative h-[13px] overflow-hidden rounded bg-gray-200">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-700 to-slate-500"
                    style={{
                        width: `${position}%`,
                    }}
                />
            </div>

            <div className="mt-1 flex justify-between text-[10px] opacity-70">
                <span>{low}</span>
                <span>{high}</span>
            </div>
        </div>
    );
}
