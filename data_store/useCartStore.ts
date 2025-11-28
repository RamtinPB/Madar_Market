import { create } from "zustand";

interface CartStore {
	items: Record<string, number>;
	setItemCount: (key: string, count: number) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: {},

	setItemCount: (key, count) => {
		set((state) => {
			const newItems = { ...state.items, [key]: count };

			// remove empty entries (count=0)
			if (count === 0) {
				delete newItems[key];
			}

			return { items: newItems };
		});
	},
}));
