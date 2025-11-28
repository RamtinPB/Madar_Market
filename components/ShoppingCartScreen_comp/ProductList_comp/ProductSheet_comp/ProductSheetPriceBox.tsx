interface Props {
	sponsorPrice?: string;
}

export function ProductSheetPriceBox({ sponsorPrice }: Props) {
	if (!sponsorPrice) return null;

	return (
		<div
			className="flex justify-between rounded-md px-3 py-2"
			style={{
				border: "2px solid transparent",
				background:
					"linear-gradient(white, white) padding-box, linear-gradient(90deg, #D2DD25, #43B999, #02A9EC, #364FC0, #65029B) border-box",
			}}
		>
			<span className="text-[#65029B] text-[14px] font-bold">
				قیمت با حامی کارد
			</span>
			<div className="flex items-center gap-1.5 text-[14px] font-bold text-[#0B8500]">
				<span>{sponsorPrice}</span>
				<span>تومان</span>
			</div>
		</div>
	);
}
