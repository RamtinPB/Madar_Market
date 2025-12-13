"use client";
import AdminProductSheetCard from "../ProductSheet/AdminProductSheetCard";
import { sheetData } from "../../../../ShoppingCartScreen_comp/ProductList_comp/ProductSheet_comp/sheetData";

export function AdminProductSheetAttributes() {
	return (
		<div className="grid grid-cols-2 gap-3">
			{sheetData.map((item, i) => (
				<AdminProductSheetCard key={i} title={item.title} data={item.data} />
			))}
		</div>
	);
}
