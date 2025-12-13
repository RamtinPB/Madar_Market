import { Input } from "@/src/components/ui/input";

interface Props {
	price: string;
	onPriceChange: (price: string) => void;
}

export function AdminProductSheetFooter({ price, onPriceChange }: Props) {
	return (
		<div className="flex flex-row justify-between">
			<div className="flex  text-left gap-4 pr-1">
				<span className="text-[14px] text-[#787471]">قیمت کالا</span>
				<div className="flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
					<Input
						value={price}
						onChange={(e) => onPriceChange(e.target.value)}
						className="rounded-lg text-center text-[12px] p-0"
					/>
					<span className="font-normal text-[10px]">تومان</span>
				</div>
			</div>
		</div>
	);
}
