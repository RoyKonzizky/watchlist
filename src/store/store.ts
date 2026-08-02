import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {feedListener} from "./feed/feedMiddleware.ts";
import feedReducer from "./feed/feedSlice.ts";
import listsReducer, {
    DEFAULT_LIST_STORAGE_KEY,
    NO_DEFAULT_LIST_VALUE,
} from "./listsSlice.ts";
import securitiesReducer from "./securitiesSlice.ts";

export const store = configureStore({
    reducer: {
        securities: securitiesReducer,
        lists: listsReducer,
        feed: feedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(feedListener.middleware),
});

let previousDefaultValue =
    store.getState().lists.items.find((list) => list.isDefault)?.id ??
    NO_DEFAULT_LIST_VALUE;

store.subscribe(() => {
    const defaultId = store
        .getState()
        .lists.items.find((list) => list.isDefault)?.id;

    const nextDefaultValue = defaultId ?? NO_DEFAULT_LIST_VALUE;

    if (nextDefaultValue === previousDefaultValue) {
        return;
    }

    previousDefaultValue = nextDefaultValue;

    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(DEFAULT_LIST_STORAGE_KEY, nextDefaultValue);
    } catch {
        // The application still works when local storage is blocked.
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();