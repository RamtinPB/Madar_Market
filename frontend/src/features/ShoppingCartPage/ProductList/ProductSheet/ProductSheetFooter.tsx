import { Button } from "@/components/ui/button";

interface Props {
	price: string;
}

export function ProductSheetFooter({ price }: Props) {
	return (
		<div className="flex flex-row justify-between">
			<Button className="rounded-md w-2/3 h-full text-white bg-[#FF6A29]">
				افزودن به سبد خرید
			</Button>

			<div className="flex flex-col text-left gap-1 pl-1">
				<span className="text-[14px] text-[#787471]">قیمت کالا</span>
				<div className="flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
					<span>{price}</span>
					<span className="font-normal text-[10px]">تومان</span>
				</div>
			</div>
		</div>
	);
}
