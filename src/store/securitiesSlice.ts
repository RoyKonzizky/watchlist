import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {fetchSecurities as fetchFromApi} from "../api/securitiesApi.tsx";
import type {WatchlistSecurity} from "../types/watchlist.ts";

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SecuritiesState {
    byId: Record<string, WatchlistSecurity>;
    allIds: string[];
    status: LoadStatus;
    error: string | null;
    lastUpdated: number | null;
}

const initialState: SecuritiesState = {
    byId: {},
    allIds: [],
    status: 'idle',
    error: null,
    lastUpdated: null,
};

export const fetchSecurities =
    createAsyncThunk('securities/fetch', fetchFromApi);

const securitiesSlice = createSlice({
    name: 'securities',
    initialState,
    reducers: {
        quotesReceived(state, action: PayloadAction<WatchlistSecurity[]>) {
            action.payload.forEach((security) => {
                state.byId[security.id] = security;
            });
            state.lastUpdated = Date.now();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSecurities.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSecurities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.byId = Object.fromEntries(action.payload.map((s) => [s.id, s]));
                state.allIds = action.payload.map((security) => security.id);
                state.lastUpdated = Date.now();
            })
            .addCase(fetchSecurities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'טעינת הנתונים נכשלה';
            });
    },
});

export const {quotesReceived} = securitiesSlice.actions;
export default securitiesSlice.reducer;