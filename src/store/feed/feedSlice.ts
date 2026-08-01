import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface FeedState {
    running: boolean;
    intervalMs: number;
    lastTickAt: number | null;
}

const initialState: FeedState = {
    running: false,
    intervalMs: 3_000,
    lastTickAt: null,
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        feedStarted(state) {
            state.running = true;
        },
        feedStopped(state) {
            state.running = false;
        },
        feedTicked(state, action: PayloadAction<number>) {
            state.lastTickAt = action.payload;
        },
        intervalChanged(state, action: PayloadAction<number>) {
            state.intervalMs = action.payload;
        },
    },
});

export const {feedStarted, feedStopped, feedTicked, intervalChanged} = feedSlice.actions;
export default feedSlice.reducer;