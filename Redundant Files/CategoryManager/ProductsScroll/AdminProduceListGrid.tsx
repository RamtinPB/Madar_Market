"use client";
import AdminProduceListCard, {
	AdminProduceListCardProps,
} from "./AdminProduceListCard";
import CustomSpinner from "../../../ShoppingCartScreen_comp/CustomSpinner";

interface ProduceListGridProps {
	products: AdminProduceListCardProps[];
	onCardClick: (product: AdminProduceListCardProps) => void;
}

export function AdminProduceListGrid({
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
					<AdminProduceListCard
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
