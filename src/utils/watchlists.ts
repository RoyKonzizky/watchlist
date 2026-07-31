import mockWatchlist from "../data/mockWatchlist.ts";

/** A named list of securities the user follows. */
export interface SecurityList {
    id: string;
    name: string;
    /** Ids of the securities shown in this list. */
    securityIds: string[];
    /** רשימת ברירת מחדל – the list opened when the screen loads. Only one at a time. */
    isDefault?: boolean;
}

const idsOf = (securities: typeof mockWatchlist) => securities.map((security) => security.id);

export const watchlists: SecurityList[] = [
    {
        id: 'wl-1',
        name: 'הרשימה שלי 1',
        securityIds: idsOf(mockWatchlist.slice(0, 6)),
        isDefault: true,
    },
    {
        id: 'wl-2',
        name: 'הרשימה שלי 2',
        securityIds: idsOf(mockWatchlist),
        isDefault: false,
    },
    {
        id: 'wl-3',
        name: 'בנקים',
        securityIds: idsOf(mockWatchlist.filter((security) => security.sector === 'בנקים')),
        isDefault: false,
    },
];

export default watchlists;