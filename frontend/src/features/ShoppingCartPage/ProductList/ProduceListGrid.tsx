"use client";
import ProduceListCard, {
	ProduceListCardProps,
} from "./ProductListCard/ProduceListCard";
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
			{products.map((p, index) => (
				<div
					key={`${p.id}-${index}`}
					onClick={() => onCardClick(p)}
					className="cursor-pointer"
				>
					<ProduceListCard
						id={p.id}
						image={p.image}
						title={p.title}
						description={p.description}
						discountPercent={p.discountPercent}
						price={p.price}
						discountedPrice={p.discountedPrice}
						sponsorPrice={p.sponsorPrice}
						onCardClick={() => onCardClick(p)}
					/>
				</div>
			))}

			<CustomSpinner />
		</div>
	);
}
