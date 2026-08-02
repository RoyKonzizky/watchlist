import type {Currency, WatchlistSecurity} from '../types/watchlist.ts';

/** Points kept in the sparkline – the oldest drops off as new ones arrive. */
const INTRADAY_WINDOW = 16;
/** Share of the day's range a single tick can move the price. */
const TICK_VOLATILITY = 0.15;
/** How strongly the price is pulled back to the middle of the day's range. */
const MEAN_REVERSION = 0.05;
/** Odds that a given security trades at all during a tick. */
const TRADE_CHANCE = 0.65;

function round(value: number, currency: Currency): number {
    return currency === 'ILA' ? Math.round(value) : Math.round(value * 100) / 100;
}

function clockLabel(now: Date): string {
    return `${now.getHours()}`.padStart(2, '0') + ':' + `${now.getMinutes()}`.padStart(2, '0');
}


export function tickSecurity(security: WatchlistSecurity, now = new Date()): WatchlistSecurity {
    if (Math.random() > TRADE_CHANCE) return security;

    const {currency, previousClose, dailyRange, week52Range} = security;

    const span = dailyRange.high - dailyRange.low || security.lastPrice * 0.01;
    const middle = (dailyRange.high + dailyRange.low) / 2;
    const shock = (Math.random() - 0.5) * span * TICK_VOLATILITY;
    const pull = (middle - security.lastPrice) * MEAN_REVERSION;
    const lastPrice = round(security.lastPrice + shock + pull, currency);

    if (lastPrice === security.lastPrice) return security;

    const changeAbsolute = round(lastPrice - previousClose, currency);
    const changePercent = Math.round(((lastPrice - previousClose) / previousClose) * 10000) / 100;

    const percentDelta = changePercent - security.changePercent;

    const tradedUnits = Math.max(1, Math.round(security.volume * 0.002 * Math.random()));
    const weeklyBars = security.weeklyBars.map((bar, i) =>
        i === security.weeklyBars.length - 1
            ? {...bar, changePercent: Math.round((bar.changePercent + percentDelta) * 100) / 100}
            : bar,
    );

    return {
        ...security,
        lastPrice,
        changeAbsolute,
        changePercent,
        volume: security.volume + tradedUnits,
        turnover: Math.round(security.turnover + tradedUnits * lastPrice),
        dailyRange: {
            low: Math.min(dailyRange.low, lastPrice),
            high: Math.max(dailyRange.high, lastPrice),
        },
        week52Range: {
            low: Math.min(week52Range.low, lastPrice),
            high: Math.max(week52Range.high, lastPrice),
        },
        intraday: [...security.intraday, {time: clockLabel(now), price: lastPrice}]
            .slice(-INTRADAY_WINDOW),
        weeklyBars,
        return30d: Math.round((security.return30d + percentDelta) * 100) / 100,
        return3y: Math.round((security.return3y + percentDelta) * 100) / 100,
    };
}

export function tickWatchlist(securities: WatchlistSecurity[]): WatchlistSecurity[] {
    const now = new Date();
    return securities.map((security) => tickSecurity(security, now));
}