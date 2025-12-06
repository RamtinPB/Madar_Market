export function SponsorPrice({ sponsorPrice }: { sponsorPrice?: string }) {
	if (!sponsorPrice) return null;

	return (
		<div className="flex flex-row justify-between items-center text-center rounded-b-2xl bg-[#FFEDE5] px-6 pb-2 pt-1.5">
			<span className="text-[14px] font-bold text-[#BA400B]">
				قیمت با حامی کارت
			</span>
			<div className="flex items-center gap-1.5 text-[14px] font-bold text-[#BA400B]">
				<span>{sponsorPrice}</span>
				<span>تومان</span>
			</div>
		</div>
	);
}
