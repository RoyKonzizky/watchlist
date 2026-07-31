import {useCallback, useEffect, useRef, useState} from "react";
import {fetchSecurities} from "../api/securitiesApi.tsx";
import {tickWatchlist} from "../data/liveWatchlist.ts";
import type {WatchlistSecurity} from "../types/watchlist.ts";

export type LoadStatus = 'loading' | 'succeeded' | 'failed';

interface LiveSecuritiesOptions {
    intervalMs?: number;
    pauseWhenHidden?: boolean;
}

interface LiveSecuritiesResult {
    securities: WatchlistSecurity[];
    status: LoadStatus;
    error: string | null;
    lastTickAt: number | null;
    reload: () => void;
}

export function useLiveSecurities({
                                      intervalMs = 3_000,
                                      pauseWhenHidden = true,
                                  }: LiveSecuritiesOptions = {}): LiveSecuritiesResult {
    const [securities, setSecurities] = useState<WatchlistSecurity[]>([]);
    const [status, setStatus] = useState<LoadStatus>('loading');
    const [error, setError] = useState<string | null>(null);
    const [lastTickAt, setLastTickAt] = useState<number | null>(null);

    const requestId = useRef(0);

    const request = useCallback(() => {
        const id = ++requestId.current;

        fetchSecurities()
            .then((rows) => {
                if (id !== requestId.current) return;
                setSecurities(rows);
                setStatus('succeeded');
            })
            .catch((cause: unknown) => {
                if (id !== requestId.current) return;
                setError(cause instanceof Error ? cause.message : 'טעינת הנתונים נכשלה');
                setStatus('failed');
            });
    }, []);

    useEffect(() => {
        request();
    }, [request]);

    const reload = useCallback(() => {
        setStatus('loading');
        setError(null);
        request();
    }, [request]);

    useEffect(() => {
        if (status !== 'succeeded') return;

        const timer = setInterval(() => {
            if (pauseWhenHidden && document.hidden) return;
            setSecurities(tickWatchlist);
            setLastTickAt(Date.now());
        }, intervalMs);

        return () => clearInterval(timer);
    }, [status, intervalMs, pauseWhenHidden]);

    return {securities, status, error, lastTickAt, reload};
}