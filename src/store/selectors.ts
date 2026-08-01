import {createSelector} from "@reduxjs/toolkit";
import type {WatchlistSecurity} from "../types/watchlist.ts";
import type {RootState} from "./store.ts";

export const selectLists = (state: RootState) => state.lists.items;
export const selectStatus = (state: RootState) => state.securities.status;
export const selectError = (state: RootState) => state.securities.error;
export const selectLastTickAt = (state: RootState) => state.feed.lastTickAt;
export const selectIntervalMs = (state: RootState) => state.feed.intervalMs;

export const selectActiveList = (state: RootState) =>
    state.lists.items.find((list) => list.id === state.lists.activeId) ?? state.lists.items[0];

export const selectActiveRows = createSelector(
    [selectActiveList, (state: RootState) => state.securities.byId],
    (activeList, byId): WatchlistSecurity[] => (
        activeList
            ? activeList.securityIds
                .map((id) => byId[id])
                .filter((security): security is WatchlistSecurity => security !== undefined)
            : []
    ),
);

export const selectAllSecurities = createSelector(
    [(state: RootState) => state.securities.allIds, (state: RootState) => state.securities.byId],
    (allIds, byId) => allIds.map((id) => byId[id]),
);

export const selectFeedIsStale = createSelector(
    [selectLastTickAt, selectIntervalMs, (state: RootState) => state.feed.running],
    (lastTickAt, intervalMs, running) => (
        running && lastTickAt !== null && Date.now() - lastTickAt > intervalMs * 3
    ),
);