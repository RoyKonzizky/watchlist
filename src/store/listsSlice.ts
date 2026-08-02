import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import watchlists, {type SecurityList} from "../utils/watchlists.ts";

export const DEFAULT_LIST_STORAGE_KEY = "watchlist-default-list-id";
export const NO_DEFAULT_LIST_VALUE = "__none__";

interface ListsState {
    items: SecurityList[];
    activeId: string;
}

interface StoredDefault {
    exists: boolean;
    id: string | null;
}

function readStoredDefault(): StoredDefault {
    if (typeof window === "undefined") {
        return {exists: false, id: null};
    }

    try {
        const value = window.localStorage.getItem(DEFAULT_LIST_STORAGE_KEY);

        if (value === null) {
            return {exists: false, id: null};
        }

        if (value === NO_DEFAULT_LIST_VALUE) {
            return {exists: true, id: null};
        }

        return {exists: true, id: value};
    } catch {
        return {exists: false, id: null};
    }
}

const storedDefault = readStoredDefault();
const builtInDefaultId = (watchlists.find((list) => list.isDefault) ?? watchlists[0]).id;

const storedDefaultIsValid =
    storedDefault.id !== null &&
    watchlists.some((list) => list.id === storedDefault.id);

const initialDefaultId = !storedDefault.exists
    ? builtInDefaultId
    : storedDefault.id === null
        ? null
        : storedDefaultIsValid
            ? storedDefault.id
            : builtInDefaultId;

const initialState: ListsState = {
    items: watchlists.map((list) => ({
        ...list,
        securityIds: [...list.securityIds],
        isDefault: list.id === initialDefaultId,
    })),
    activeId: initialDefaultId ?? watchlists[0].id,
};

function updateActive(state: ListsState, change: (list: SecurityList) => void) {
    const active = state.items.find((list) => list.id === state.activeId);

    if (active) {
        change(active);
    }
}

const listsSlice = createSlice({
    name: "lists",
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
            if (state.items.length === 1) {
                return;
            }

            const deletedList = state.items.find((list) => list.id === state.activeId);
            state.items = state.items.filter((list) => list.id !== state.activeId);

            if (deletedList?.isDefault) {
                state.items[0].isDefault = true;
            }

            state.activeId = state.items[0].id;
        },

        defaultToggled(state) {
            const activeList = state.items.find((list) => list.id === state.activeId);
            const makeDefault = !activeList?.isDefault;

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
                const {from, to} = action.payload;

                if (
                    from < 0 ||
                    to < 0 ||
                    from >= list.securityIds.length ||
                    to >= list.securityIds.length ||
                    from === to
                ) {
                    return;
                }

                const [moved] = list.securityIds.splice(from, 1);
                list.securityIds.splice(to, 0, moved);
            });
        },

        securityIdsSaved(state, action: PayloadAction<string[]>) {
            updateActive(state, (list) => {
                list.securityIds = [...new Set(action.payload)];
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
    securityIdsSaved,
} = listsSlice.actions;

export default listsSlice.reducer;