import type {WatchlistSecurity} from "../../types/watchlist.ts";

const WIDTH = 120;
const HEIGHT = 34;
const PADDING = 3;

export function MiniChart({security}: {security: WatchlistSecurity}) {
    const {intraday, dailyRange, previousClose, changePercent} = security;
    const up = changePercent >= 0;
    const stroke = up ? '#12864b' : '#c0292f';
    const gradientId = `spark-${security.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    const low = Math.min(dailyRange.low, previousClose);
    const high = Math.max(dailyRange.high, previousClose);
    const span = high - low || 1;
    const yOf = (price: number) =>
        HEIGHT - PADDING - ((price - low) / span) * (HEIGHT - PADDING * 2);
    const xOf = (index: number) => (index / (intraday.length - 1)) * WIDTH;

    const line = intraday.map((point, i) => `${xOf(i)},${yOf(point.price)}`).join(' ');
    const area = `${line} ${WIDTH},${HEIGHT} 0,${HEIGHT}`;
    const baseline = yOf(previousClose);

    return (
        <svg dur="ltr" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.28}/>
                    <stop offset="100%" stopColor={stroke} stopOpacity={0}/>
                </linearGradient>
            </defs>

            <polygon points={area} fill={`url(#${gradientId})`}/>
            <line
                x1={0}
                x2={WIDTH}
                y1={baseline}
                y2={baseline}
                stroke="#c7cbd1"
                strokeWidth={1}
                strokeDasharray="3 3"
            />
            <polyline points={line} fill="none" stroke={stroke} strokeWidth={1.4}/>
        </svg>
    );
}