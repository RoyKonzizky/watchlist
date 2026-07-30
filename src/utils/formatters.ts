import type {WatchlistSecurity} from "../types/watchlist.ts";

/** The unit a security is quoted in, as shown next to every amount. */
export const unitOf = (s: WatchlistSecurity) => (s.currency === 'ILA' ? 'אג׳' : 'דול׳');

/** Bare number, no unit: agorot whole, dollars to two decimals. */
export const formatAmount = (s: WatchlistSecurity, value: number) =>
    s.currency === 'ILA'
        ? Math.round(value).toLocaleString('he-IL')
        : value.toFixed(2);

/** Same, with an explicit sign – for the change column. */
export const formatSignedAmount = (s: WatchlistSecurity, value: number) =>
    `${value > 0 ? '+' : value < 0 ? '-' : ''}${formatAmount(s, Math.abs(value))}`;

/** Range-bar bounds are bare numbers – the bar is too small for a unit. */
export const formatBound = formatAmount;

export const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

/**
 * מחזור – compact turnover, e.g. `₪73.34M` / `2.9M`.
 */
export const formatTurnover = (s: WatchlistSecurity, value: number) => {
    const amount = s.currency === 'ILA' ? value / 100 : value;
    const compact =
        amount >= 1e9 ? `${(amount / 1e9).toFixed(2)}B`
            : amount >= 1e6 ? `${(amount / 1e6).toFixed(2)}M`
                : amount >= 1e3 ? `${(amount / 1e3).toFixed(2)}K`
                    : amount.toFixed(0);

    return compact;
};

export const tone = (value: number) => ({color: value >= 0 ? '#12864b' : '#c0292f'});

/** Text + tinted background for the return badge. */
export const badgeTone = (value: number) =>
    value >= 0
        ? {color: '#0f7c46', background: '#e7f6ee'}
        : {color: '#c0292f', background: '#fdecec'};