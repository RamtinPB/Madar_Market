import { Input } from "@/components/ui/input";

interface Props {
	sponsorPrice: string;
	onSponsorPriceChange: (price: string) => void;
	price: string;
	onPriceChange: (price: string) => void;
	discountedPrice: string;
	onDiscountedPriceChange: (price: string) => void;
	discountPercent: string;
	onDiscountPercentChange: (price: string) => void;
}

export function AdminProductSheetPriceBox({
	sponsorPrice,
	onSponsorPriceChange,
	price,
	onPriceChange,
	discountedPrice,
	onDiscountedPriceChange,
	discountPercent,
	onDiscountPercentChange,
}: Props) {
	return (
		<>
			<div
				className="flex justify-between items-center rounded-md px-3 py-2"
				style={{
					border: "2px solid transparent",
					background:
						"linear-gradient(white, white) padding-box, linear-gradient(90deg, #D2DD25, #43B999, #02A9EC, #364FC0, #65029B) border-box",
				}}
			>
				<span className="text-[#65029B] text-[14px] font-bold">
					ویرایش قیمت با حامی کارد
				</span>
				<div className="flex items-center gap-1.5 text-[14px] font-bold text-[#0B8500]">
					<Input
						value={sponsorPrice}
						onChange={(e) => onSponsorPriceChange(e.target.value)}
						className="rounded-lg text-center text-[12px] p-0"
					/>
					<span>تومان</span>
				</div>
			</div>

			<div className="flex flex-col justify-between">
				<div className="flex  text-left items-center gap-4 pr-1">
					<span className="text-[14px] text-[#787471]">ویرایش قیمت کالا</span>
					<div className="flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
						<Input
							value={price}
							onChange={(e) => onPriceChange(e.target.value)}
							className="rounded-lg text-center text-[12px] p-0"
						/>
						<span className="font-normal text-[10px]">تومان</span>
					</div>
				</div>
				<div className="flex  text-left items-center gap-4 pr-1">
					<span className="text-[14px] text-[#787471]">
						ویرایش قیمت پس از تخفیف
					</span>
					<div className="flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
						<Input
							value={discountedPrice}
							onChange={(e) => onDiscountedPriceChange(e.target.value)}
							className="rounded-lg text-center text-[12px] p-0"
						/>
						<span className="font-normal text-[10px]">تومان</span>
					</div>
				</div>
				<div className="flex  text-left items-center gap-4 pr-1">
					<span className="text-[14px] text-[#787471]">ویرایش درصد تخفیف</span>
					<div className="flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
						<Input
							value={discountPercent}
							onChange={(e) => onDiscountPercentChange(e.target.value)}
							className="rounded-lg text-center text-[12px] p-0"
						/>
						<span className="font-normal text-[10px]">تومان</span>
					</div>
				</div>
			</div>
		</>
	);
}
