/**
 * Data model for the watchlist table, modeled on the columns shown in the
 * TradeTwo (טרייד2) securities screen, right-to-left:
 *
 *   שם נייר (מספר נייר) | שער אחרון | % שינוי | מחזור |
 *   טווח יומי (נמוך/גבוה) | גרף יומי | 13 שבועות | תשואה 30 ימים
 */

export type Market = 'TASE' | 'NASDAQ' | 'NYSE';

/**
 * `ILA` = agorot (אג'), the unit TASE quotes local shares in.
 * `USD` = dollars (דול'), used for the foreign listings.
 */
export type Currency = 'ILA' | 'USD';

export interface SecurityLogo {
    /** Short label rendered inside the badge when no image is available. */
    initials: string;
    /** Badge background, CSS color. */
    background: string;
    /** Badge foreground, CSS color. */
    color: string;
}

export interface PriceRange {
    low: number;
    high: number;
}

/** A single point of the intraday sparkline (גרף יומי). */
export interface IntradayPoint {
    /** Trading time, `HH:mm`. */
    time: string;
    price: number;
}

/** One bar of the 13-week performance column (13 שבועות). */
export interface WeeklyBar {
    /** ISO date (yyyy-mm-dd) of the Sunday that opens the trading week. */
    weekStart: string;
    /** Weekly return in percent; negative renders red, positive green. */
    changePercent: number;
}

export interface WatchlistSecurity {
    id: string;
    /** מספר נייר – TASE security number, or the ticker for foreign listings. */
    securityNumber: string;
    /** שם נייר – Hebrew display name. */
    nameHe: string;
    /** Secondary latin name shown under the Hebrew one. */
    nameEn: string;
    market: Market;
    sector: string;
    currency: Currency;
    logo: SecurityLogo;

    /** שער אחרון – last traded price, in `currency` units. */
    lastPrice: number;
    /** Previous session close, in `currency` units. */
    previousClose: number;
    /** % שינוי – change against the previous close. */
    changePercent: number;
    /** Absolute change against the previous close, in `currency` units. */
    changeAbsolute: number;

    /** מחזור – turnover for the session, in `currency` units. */
    turnover: number;
    /** Number of units traded during the session. */
    volume: number;

    /** טווח יומי – session low/high, the bar the last price marker sits on. */
    dailyRange: PriceRange;
    /** 52-week low/high. */
    week52Range: PriceRange;

    /** גרף יומי – intraday sparkline, half-hourly from 09:30 to 17:00. */
    intraday: IntradayPoint[];
    /** 13 שבועות – last 13 weekly returns, oldest first. */
    weeklyBars: WeeklyBar[];

    /** תשואה 30 ימים – trailing 30-day return in percent. */
    return30d: number;
    /** תשואה 3 שנים – trailing 3-year return in percent. */
    return3y: number;
}