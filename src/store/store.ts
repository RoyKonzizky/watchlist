import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {feedListener} from "./feed/feedMiddleware.ts";
import feedReducer from "./feed/feedSlice.ts";
import listsReducer from "./listsSlice.ts";
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();