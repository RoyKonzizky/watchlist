import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import watchlists, {type SecurityList} from "../utils/watchlists.ts";

interface ListsState {
    items: SecurityList[];
    activeId: string;
}

const initialState: ListsState = {
    items: watchlists,
    activeId: (watchlists.find((list) => list.isDefault) ?? watchlists[0]).id,
};

function updateActive(state: ListsState, change: (list: SecurityList) => void) {
    const active = state.items.find((list) => list.id === state.activeId);
    if (active) change(active);
}

const listsSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        activeListChanged(state, action: PayloadAction<string>) {
            state.activeId = action.payload;
        },

        listCreated(state, action: PayloadAction<string>) {
            const list: SecurityList = {
                id: `wl-${Date.now()}`,
                name: action.payload,
                securityIds: [],
            };
            state.items.push(list);
            state.activeId = list.id;
        },

        listRenamed(state, action: PayloadAction<string>) {
            updateActive(state, (list) => {
                list.name = action.payload;
            });
        },

        listDeleted(state) {
            if (state.items.length === 1) return;
            state.items = state.items.filter((list) => list.id !== state.activeId);
            state.activeId = state.items[0].id;
        },

        defaultToggled(state) {
            const makeDefault = !state.items.find((list) => list.id === state.activeId)?.isDefault;
            state.items.forEach((list) => {
                list.isDefault = makeDefault && list.id === state.activeId;
            });
        },

        securityToggled(state, action: PayloadAction<string>) {
            updateActive(state, (list) => {
                list.securityIds = list.securityIds.includes(action.payload)
                    ? list.securityIds.filter((id) => id !== action.payload)
                    : [...list.securityIds, action.payload];
            });
        },

        securityRemoved(state, action: PayloadAction<string>) {
            updateActive(state, (list) => {
                list.securityIds = list.securityIds.filter((id) => id !== action.payload);
            });
        },

        securityReordered(state, action: PayloadAction<{from: number; to: number}>) {
            updateActive(state, (list) => {
                const [moved] = list.securityIds.splice(action.payload.from, 1);
                list.securityIds.splice(action.payload.to, 0, moved);
            });
        },
    },
});

export const {
    activeListChanged,
    listCreated,
    listRenamed,
    listDeleted,
    defaultToggled,
    securityToggled,
    securityRemoved,
    securityReordered,
} = listsSlice.actions;

export default listsSlice.reducer;