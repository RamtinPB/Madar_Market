"use client";
import ProductSheetCard from "./ProductSheetCard";
import { sheetData } from "./sheetData";

export function ProductSheetAttributes() {
	return (
		<div className="grid grid-cols-2 gap-3">
			{sheetData.map((item, i) => (
				<ProductSheetCard key={i} title={item.title} data={item.data} />
			))}
		</div>
	);
}
