export function DiscountBadge({
	discount,
	oldPrice,
}: {
	discount?: number;
	oldPrice?: string;
}) {
	if (!discount || !oldPrice) return null;

	return (
		<div className="mx-2 mt-1 flex items-center gap-1.5">
			<div className="flex items-center text-[10px] max-[376px]:text-[8px] font-medium text-[#787471] line-through">
				<span>{oldPrice}</span>
				<span>تومان</span>
			</div>
			<span className="rounded-[20px] bg-[#C50F1F] px-1 py-0.5 text-[9px] max-[376px]:text-[8px] font-normal text-white">
				%{discount}
			</span>
		</div>
	);
}
