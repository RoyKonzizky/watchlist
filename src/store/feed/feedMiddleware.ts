import {createListenerMiddleware} from "@reduxjs/toolkit";
import {tickWatchlist} from "../../data/liveWatchlist.ts";
import {feedStarted, feedStopped, feedTicked} from "./feedSlice.ts";
import {quotesReceived} from "../securitiesSlice.ts";
import type {AppDispatch, RootState} from "./../store.ts";

export const feedListener = createListenerMiddleware();

const startListening = feedListener.startListening.withTypes<RootState, AppDispatch>();

startListening({
    actionCreator: feedStarted,
    effect: async (_action, api) => {
        api.cancelActiveListeners();

        const ticking = api.fork(async (forkApi) => {
            while (true) {
                await forkApi.delay(api.getState().feed.intervalMs);

                if (typeof document !== 'undefined' && document.hidden) continue;

                const {byId, allIds} = api.getState().securities;
                api.dispatch(quotesReceived(tickWatchlist(allIds.map((id) => byId[id]))));
                api.dispatch(feedTicked(Date.now()));
            }
        });

        await api.condition(feedStopped.match);
        ticking.cancel();
    },
});