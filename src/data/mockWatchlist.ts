import type {Currency, IntradayPoint, Market, SecurityLogo, WatchlistSecurity, WeeklyBar,} from '../types/watchlist.ts';

interface SecuritySeed {
    symbol: string;
    securityNumber: string;
    nameHe: string;
    nameEn: string;
    market: Market;
    sector: string;
    currency: Currency;
    logo: SecurityLogo;
    lastPrice: number;
    changePercent: number;
    turnover: number;
    dailyLow: number;
    dailyHigh: number;
    week52Low: number;
    week52High: number;
    return30d: number;
    return3y: number;
}

const SECURITY_SEEDS: SecuritySeed[] = [
    {
        symbol: 'MSFT',
        securityNumber: 'MSFT',
        nameHe: 'מיקרוסופט',
        nameEn: 'MICROSOFT CORP',
        market: 'NASDAQ',
        sector: 'טכנולוגיה',
        currency: 'USD',
        logo: {initials: 'MS', background: '#e8f1fd', color: '#0f6cbd'},
        lastPrice: 389.1,
        changePercent: 1.94,
        turnover: 27_860_000,
        dailyLow: 381.99,
        dailyHigh: 394.2,
        week52Low: 309.45,
        week52High: 468.35,
        return30d: -4.32,
        return3y: 4.32,
    },
    {
        symbol: 'LUMI',
        securityNumber: '604611',
        nameHe: 'לאומי',
        nameEn: 'BANK LEUMI',
        market: 'TASE',
        sector: 'בנקים',
        currency: 'ILA',
        logo: {initials: 'לא', background: '#eaf2ff', color: '#1f4ed8'},
        lastPrice: 43_460,
        changePercent: -0.64,
        turnover: 287_840_000,
        dailyLow: 43_450,
        dailyHigh: 44_460,
        week52Low: 28_900,
        week52High: 45_120,
        return30d: -2.93,
        return3y: 6.18,
    },
    {
        symbol: 'DELT',
        securityNumber: '627034',
        nameHe: "דלתא בגדי",
        nameEn: 'DELTA GALIL',
        market: 'TASE',
        sector: 'מסחר ושירותים',
        currency: 'ILA',
        logo: {initials: 'דל', background: '#eafaf0', color: '#12864b'},
        lastPrice: 12_170,
        changePercent: 0.35,
        turnover: 106_930_000,
        dailyLow: 12_090,
        dailyHigh: 12_250,
        week52Low: 9_640,
        week52High: 13_180,
        return30d: 7.07,
        return3y: -2.1,
    },
    {
        symbol: 'D',
        securityNumber: 'D',
        nameHe: 'דומיניון אנרג׳י',
        nameEn: 'DOMINION ENERGY INC',
        market: 'NYSE',
        sector: 'אנרגיה',
        currency: 'USD',
        logo: {initials: 'D', background: '#eef2f8', color: '#20438f'},
        lastPrice: 79.27,
        changePercent: -1.17,
        turnover: 2_900_000,
        dailyLow: 78.09,
        dailyHigh: 79.41,
        week52Low: 61.4,
        week52High: 84.72,
        return30d: 1.27,
        return3y: 1.27,
    },
    {
        symbol: 'POLI',
        securityNumber: '662577',
        nameHe: 'פועלים',
        nameEn: 'BANK HAPOALIM',
        market: 'TASE',
        sector: 'בנקים',
        currency: 'ILA',
        logo: {initials: 'פו', background: '#fdecec', color: '#c0292f'},
        lastPrice: 7_338,
        changePercent: -0.05,
        turnover: 231_630_000,
        dailyLow: 7_296,
        dailyHigh: 7_387,
        week52Low: 4_910,
        week52High: 7_602,
        return30d: 2.81,
        return3y: 7.61,
    },
    {
        symbol: 'TSEM',
        securityNumber: '749054',
        nameHe: 'טאואר',
        nameEn: 'TOWER SEMICONDUCTOR',
        market: 'TASE',
        sector: 'טכנולוגיה',
        currency: 'ILA',
        logo: {initials: 'טא', background: '#fff1e8', color: '#d1580d'},
        lastPrice: 25_160,
        changePercent: 0.84,
        turnover: 215_860_000,
        dailyLow: 24_890,
        dailyHigh: 25_570,
        week52Low: 12_740,
        week52High: 26_310,
        return30d: 0.05,
        return3y: 3.0,
    },
    {
        symbol: 'TEVA',
        securityNumber: '629014',
        nameHe: 'טבע',
        nameEn: 'TEVA PHARMACEUTICAL',
        market: 'TASE',
        sector: 'ביומד',
        currency: 'ILA',
        logo: {initials: 'טב', background: '#eef0fb', color: '#3b46b6'},
        lastPrice: 6_052,
        changePercent: 2.41,
        turnover: 98_420_000,
        dailyLow: 5_918,
        dailyHigh: 6_090,
        week52Low: 4_231,
        week52High: 7_015,
        return30d: -6.18,
        return3y: 4.96,
    },
    {
        symbol: 'ESLT',
        securityNumber: '1081124',
        nameHe: 'אלביט מערכות',
        nameEn: 'ELBIT SYSTEMS',
        market: 'TASE',
        sector: 'ביטחוניות',
        currency: 'ILA',
        logo: {initials: 'אל', background: '#eef5ee', color: '#2f6b34'},
        lastPrice: 128_900,
        changePercent: 1.12,
        turnover: 142_310_000,
        dailyLow: 127_400,
        dailyHigh: 129_800,
        week52Low: 78_050,
        week52High: 134_600,
        return30d: 11.46,
        return3y: 19.22,
    },
    {
        symbol: 'NICE',
        securityNumber: '273011',
        nameHe: 'נייס',
        nameEn: 'NICE LTD',
        market: 'TASE',
        sector: 'טכנולוגיה',
        currency: 'ILA',
        logo: {initials: 'נ', background: '#f3ecfd', color: '#7a2fd0'},
        lastPrice: 55_320,
        changePercent: -1.83,
        turnover: 64_780_000,
        dailyLow: 55_010,
        dailyHigh: 56_490,
        week52Low: 48_220,
        week52High: 78_900,
        return30d: -9.24,
        return3y: -5.88,
    },
    {
        symbol: 'MZTF',
        securityNumber: '695437',
        nameHe: 'מזרחי טפחות',
        nameEn: 'MIZRAHI TEFAHOT BANK',
        market: 'TASE',
        sector: 'בנקים',
        currency: 'ILA',
        logo: {initials: 'מז', background: '#fdf0f5', color: '#b02a63'},
        lastPrice: 18_320,
        changePercent: 0.47,
        turnover: 89_150_000,
        dailyLow: 18_170,
        dailyHigh: 18_460,
        week52Low: 11_880,
        week52High: 18_990,
        return30d: 3.62,
        return3y: 8.44,
    },
    {
        symbol: 'ICL',
        securityNumber: '281014',
        nameHe: 'כיל',
        nameEn: 'ICL GROUP',
        market: 'TASE',
        sector: 'כימיה',
        currency: 'ILA',
        logo: {initials: 'כי', background: '#e9f6f8', color: '#0d6f80'},
        lastPrice: 2_184,
        changePercent: -0.73,
        turnover: 41_260_000,
        dailyLow: 2_171,
        dailyHigh: 2_209,
        week52Low: 1_702,
        week52High: 2_468,
        return30d: -1.05,
        return3y: -3.71,
    },
    {
        symbol: 'BEZQ',
        securityNumber: '230011',
        nameHe: 'בזק',
        nameEn: 'BEZEQ',
        market: 'TASE',
        sector: 'תקשורת',
        currency: 'ILA',
        logo: {initials: 'בז', background: '#eaf4fd', color: '#1668a6'},
        lastPrice: 641,
        changePercent: 1.58,
        turnover: 53_940_000,
        dailyLow: 630,
        dailyHigh: 645,
        week52Low: 458,
        week52High: 662,
        return30d: 4.89,
        return3y: 2.44,
    },
    {
        symbol: 'AAPL',
        securityNumber: 'AAPL',
        nameHe: 'אפל',
        nameEn: 'APPLE INC',
        market: 'NASDAQ',
        sector: 'טכנולוגיה',
        currency: 'USD',
        logo: {initials: 'AP', background: '#f2f2f4', color: '#3b3b40'},
        lastPrice: 226.4,
        changePercent: -0.42,
        turnover: 41_120_000,
        dailyLow: 225.1,
        dailyHigh: 229.35,
        week52Low: 164.08,
        week52High: 237.49,
        return30d: 2.34,
        return3y: 5.4,
    },
    {
        symbol: 'NVDA',
        securityNumber: 'NVDA',
        nameHe: 'אנבידיה',
        nameEn: 'NVIDIA CORP',
        market: 'NASDAQ',
        sector: 'שבבים',
        currency: 'USD',
        logo: {initials: 'NV', background: '#eef8e9', color: '#4a8c1c'},
        lastPrice: 131.8,
        changePercent: 3.06,
        turnover: 118_450_000,
        dailyLow: 127.42,
        dailyHigh: 132.65,
        week52Low: 66.25,
        week52High: 140.76,
        return30d: 14.72,
        return3y: 12.63,
    },
];

const SESSION_TIMES = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

//Sunday opening the most recent of the 13 weeks.
const LAST_WEEK_START = new Date('2026-07-26T00:00:00Z');

/** mulberry32 – tiny deterministic PRNG, so the mock series never re-shuffle. */
function createRandom(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

//Stable seed per row, so adding a security does not disturb its neighbours.
function hashSeed(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function roundToPrecision(value: number, currency: Currency): number {
    // Agorot are quoted whole, dollars to two decimals.
    return currency === 'ILA' ? Math.round(value) : Math.round(value * 100) / 100;
}

function buildIntraday(
    seed: SecuritySeed,
    previousClose: number,
    random: () => number,
): IntradayPoint[] {
    const {dailyLow, dailyHigh, lastPrice, currency} = seed;
    const steps = SESSION_TIMES.length;
    const open = Math.min(dailyHigh, Math.max(dailyLow, previousClose));

    // Wander between the open and the close: a random walk tilted back to zero
    // at both ends, so the session starts on the open and lands on the close.
    const walk: number[] = [0];
    for (let i = 1; i < steps; i++) {
        walk.push(walk[i - 1] + (random() - 0.5));
    }
    const wander = walk.map((value, i) => value - walk[steps - 1] * (i / (steps - 1)));
    const trend = SESSION_TIMES.map((_, i) => open + (lastPrice - open) * (i / (steps - 1)));

    // Widest wander that still fits between the day's low and high, so the
    // sparkline fills the range bar and touches one of its ends, never past it.
    let amplitude = Infinity;
    wander.forEach((offset, i) => {
        if (offset > 0) amplitude = Math.min(amplitude, (dailyHigh - trend[i]) / offset);
        if (offset < 0) amplitude = Math.min(amplitude, (trend[i] - dailyLow) / -offset);
    });
    if (!Number.isFinite(amplitude)) amplitude = 0;

    const prices = trend.map((value, i) => value + amplitude * wander[i]);

    return prices.map((value, i) => ({
        time: SESSION_TIMES[i],
        price: roundToPrecision(value, currency),
    }));
}

const WEEKS = 13;
const RECENT_WEEKS = 4;

function buildWeeklyBars(seed: SecuritySeed, random: () => number): WeeklyBar[] {
    const changes: number[] = [];
    for (let i = 0; i < WEEKS; i++) {
        const weeksAgo = WEEKS - 1 - i;
        const base =
            weeksAgo < RECENT_WEEKS ? seed.return30d / RECENT_WEEKS : seed.return30d / 10;
        changes.push(base + (random() - 0.5) * 4.5);
    }

    // Spread whatever the noise added or removed over the recent weeks, so the
    // last four bars sum to the 30-day return sitting next to them.
    const recentSum = changes
        .slice(-RECENT_WEEKS)
        .reduce((sum, change) => sum + change, 0);
    const correction = (seed.return30d - recentSum) / RECENT_WEEKS;
    for (let i = WEEKS - RECENT_WEEKS; i < WEEKS; i++) {
        changes[i] += correction;
    }

    return changes.map((change, i) => {
        const weekStart = new Date(LAST_WEEK_START);
        weekStart.setUTCDate(weekStart.getUTCDate() - (WEEKS - 1 - i) * 7);
        return {
            weekStart: weekStart.toISOString().slice(0, 10),
            changePercent: Math.round(change * 100) / 100,
        };
    });
}

function toSecurity(seed: SecuritySeed): WatchlistSecurity {
    const random = createRandom(hashSeed(seed.securityNumber + seed.symbol));
    const previousClose = roundToPrecision(
        seed.lastPrice / (1 + seed.changePercent / 100),
        seed.currency,
    );
    const changeAbsolute = roundToPrecision(seed.lastPrice - previousClose, seed.currency);

    return {
        id: `${seed.market}:${seed.securityNumber}`,
        symbol: seed.symbol,
        securityNumber: seed.securityNumber,
        nameHe: seed.nameHe,
        nameEn: seed.nameEn,
        market: seed.market,
        sector: seed.sector,
        currency: seed.currency,
        logo: seed.logo,
        lastPrice: seed.lastPrice,
        previousClose,
        changePercent: seed.changePercent,
        changeAbsolute,
        turnover: seed.turnover,
        volume: Math.round(seed.turnover / seed.lastPrice),
        dailyRange: {low: seed.dailyLow, high: seed.dailyHigh},
        week52Range: {low: seed.week52Low, high: seed.week52High},
        intraday: buildIntraday(seed, previousClose, random),
        weeklyBars: buildWeeklyBars(seed, random),
        return30d: seed.return30d,
        // return3y: seed.return3y,
    };
}

export const mockWatchlist: WatchlistSecurity[] = SECURITY_SEEDS.map(toSecurity);

export function getMockSecurity(id: string): WatchlistSecurity | undefined {
    return mockWatchlist.find((security) => security.id === id);
}

export default mockWatchlist;
