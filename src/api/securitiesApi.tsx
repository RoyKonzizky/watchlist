import mockWatchlist from "../data/mockWatchlist.ts";
import type {WatchlistSecurity} from "../types/watchlist.ts";

type ForcedState = 'loading' | 'error' | 'empty' | 'slow' | null;

function forcedState(): ForcedState {
    if (typeof window === 'undefined') return null;
    const value = new URLSearchParams(window.location.search).get('state');
    return value === 'loading' || value === 'error' || value === 'empty' || value === 'slow'
        ? value
        : null;
}

const LATENCY_MS = 700;
const SLOW_LATENCY_MS = 6_000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchSecurities(): Promise<WatchlistSecurity[]> {
    const forced = forcedState();

    if (forced === 'loading') return new Promise(() => {});

    await wait(forced === 'slow' ? SLOW_LATENCY_MS : LATENCY_MS);

    if (forced === 'error') throw new Error('שירות הנתונים אינו זמין כרגע');
    if (forced === 'empty') return [];

    return mockWatchlist;
}