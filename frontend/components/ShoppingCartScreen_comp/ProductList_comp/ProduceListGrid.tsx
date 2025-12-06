"use client";
import ProduceListCard, {
	ProduceListCardProps,
} from "./ProductListCard_comp/ProduceListCard";
import ShoppingCart from "@/public/assets/home_screen/special_products/Cart.png";
import CustomSpinner from "../CustomSpinner";

interface ProduceListGridProps {
	products: ProduceListCardProps[];
	onCardClick: (product: ProduceListCardProps) => void;
}

export function ProduceListGrid({
	products,
	onCardClick,
}: ProduceListGridProps) {
	return (
		<div className="flex flex-col items-center gap-3">
			{products.map((p) => (
				<div
					key={p.title}
					onClick={() => onCardClick(p)}
					className="cursor-pointer"
				>
					<ProduceListCard
						image={p.image ?? ShoppingCart}
						title={p.title}
						discount={p.discount}
						oldPrice={p.oldPrice}
						newPrice={p.newPrice}
						sponsorPrice={p.sponsorPrice}
						onCardClick={() => onCardClick(p)}
					/>
				</div>
			))}

			<CustomSpinner />
		</div>
	);
}
