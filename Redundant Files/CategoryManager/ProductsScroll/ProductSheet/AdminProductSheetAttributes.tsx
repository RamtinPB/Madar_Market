"use client";
import AdminProductSheetCard from "../ProductSheet/AdminProductSheetCard";
import { Button } from "@/src/components/ui/button";
import PlusIcon from "@/public/assets/shopping_cart_screen/plus.svg";
import { ProductAttribute } from "@/src/lib/api/products";

interface AdminProductSheetAttributesProps {
	attributes: ProductAttribute[];
	onAttributesChange: (attributes: ProductAttribute[]) => void;
}

export function AdminProductSheetAttributes({
	attributes,
	onAttributesChange,
}: AdminProductSheetAttributesProps) {
	const handleAddAttribute = () => {
		const newAttribute: ProductAttribute = {
			id: `temp-${Date.now()}`, // Temporary ID for new attributes
			title: "",
			description: "",
			order: attributes.length + 1,
		};
		onAttributesChange([...attributes, newAttribute]);
	};

	const handleDeleteAttribute = (index: number) => {
		const newAttributes = attributes.filter((_, i) => i !== index);
		onAttributesChange(newAttributes);
	};

	const handleUpdateAttribute = (
		index: number,
		field: "title" | "description",
		value: string
	) => {
		const newAttributes = [...attributes];
		newAttributes[index] = {
			...newAttributes[index],
			[field]: value,
		};
		onAttributesChange(newAttributes);
	};

	return (
		<div className="grid grid-cols-2 gap-3">
			{attributes.map((attribute, i) => (
				<AdminProductSheetCard
					key={attribute.id}
					title={attribute.title || ""}
					description={attribute.description || ""}
					onTitleChange={(value) => handleUpdateAttribute(i, "title", value)}
					onDescriptionChange={(value) =>
						handleUpdateAttribute(i, "description", value)
					}
					onDelete={() => handleDeleteAttribute(i)}
				/>
			))}
			<Button
				onClick={handleAddAttribute}
				className={`rounded-lg shadow-sm bg-[#F7F7F7] mt-2 px-3 py-2 text-center `}
			>
				<PlusIcon className="w-fit! h-fit!" />
			</Button>
		</div>
	);
}
