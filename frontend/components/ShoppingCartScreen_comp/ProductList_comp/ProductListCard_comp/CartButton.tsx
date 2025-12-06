"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import PlusIcon from "@/public/assets/shopping_cart_screen/plus.svg";
import TrashIcon from "@/public/assets/shopping_cart_screen/trash.svg";
import { useCartStore } from "@/data_store/useCartStore";

export function CartButton({ title }: { title: string }) {
	const setItemCount = useCartStore((s) => s.setItemCount);
	const count = useCartStore((s) => s.items[title] ?? 0);
	const inCart = count > 0;

	if (!inCart) {
		return (
			<Button
				onClick={(e) => {
					e.stopPropagation();
					setItemCount(title, 1);
				}}
				className="h-10 rounded-[20px] bg-[#F5F2EF] p-4 text-[16px] font-medium text-[#787471]"
			>
				افزودن به سبد
			</Button>
		);
	}

	return (
		<ButtonGroup
			onClick={(e) => e.stopPropagation()}
			orientation="horizontal"
			dir="ltr"
			className="h-10 max-[376px]:h-9 items-center bg-[#F7F7F7] border border[#F3F0EC] rounded-[20px] z-10"
		>
			<Button onClick={() => setItemCount(title, 0)} className="bg-transparent">
				<TrashIcon className="w-fit! h-fit!" />
			</Button>
			<span>{count}</span>
			<Button
				onClick={() => setItemCount(title, count + 1)}
				className="bg-transparent"
			>
				<PlusIcon className="w-fit! h-fit!" />
			</Button>
		</ButtonGroup>
	);
}
