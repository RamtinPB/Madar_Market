"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/src/components/ui/sheet";

// Subcomponents you created
import { AdminProductSheetHeader } from "../ProductSheet/AdminProductSheetHeader";
import { AdminProductSheetAttributes } from "../ProductSheet/AdminProductSheetAttributes";
import { AdminProductSheetPriceBox } from "../ProductSheet/AdminProductSheetPriceBox";
import { AdminProductSheetFooter } from "../ProductSheet/AdminProductSheetFooter";

// Types
import { AdminProduceListCardProps } from "../AdminProduceListCard";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { Button } from "@/src/components/ui/button";
import { ProductsAPI, Product } from "@/src/lib/api/products";
import { SheetIcon } from "lucide-react";

interface AdminProductSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: AdminProduceListCardProps | null;
	onProductUpdate?: (updatedProduct: Product) => void;
	onProductDelete?: (productId: string) => void;
}

export default function AdminProductSheet({
	open,
	onOpenChange,
	product,
	onProductUpdate,
	onProductDelete,
}: AdminProductSheetProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fullProduct, setFullProduct] = useState<Product | null>(null);

	// Form state
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [sponsorPrice, setSponsorPrice] = useState("");
	const [images, setImages] = useState<File[]>([]);

	useEffect(() => {
		if (product && open) {
			loadFullProduct();
		}
	}, [product, open]);

	const loadFullProduct = async () => {
		if (!product) return;

		try {
			setIsLoading(true);
			setError(null);
			const fullProductData = await ProductsAPI.getById(product.id);
			setFullProduct(fullProductData);

			// Initialize form state
			setTitle(fullProductData.title);
			setPrice(fullProductData.price);
			setSponsorPrice(fullProductData.sponsorPrice || "");

			// Clear any previously selected images
			setImages([]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load product");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = async () => {
		if (!fullProduct) return;

		try {
			setIsLoading(true);
			setError(null);

			const updateData: any = {
				title,
				price: parseFloat(price) || 0,
			};

			if (sponsorPrice) {
				updateData.sponsorPrice = parseFloat(sponsorPrice);
			}

			// Upload images if any
			let updatedProduct = fullProduct;
			if (images.length > 0) {
				updatedProduct = await ProductsAPI.uploadImages(fullProduct.id, images);
			}

			// Update other fields
			updatedProduct = await ProductsAPI.update(fullProduct.id, updateData);

			setFullProduct(updatedProduct);
			setImages([]); // Clear images after successful upload
			onProductUpdate?.(updatedProduct);
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update product");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!fullProduct) return;

		if (!confirm("Are you sure you want to delete this product?")) return;

		try {
			setIsLoading(true);
			setError(null);
			await ProductsAPI.delete(fullProduct.id);
			onProductDelete?.(fullProduct.id);
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete product");
		} finally {
			setIsLoading(false);
		}
	};

	const handleImagesChange = (newImages: File[]) => {
		setImages(newImages);
	};

	if (!product) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="flex flex-col justify-between px-4 py-6 h-11/12 pt-10 bg-[#FAFAFA]"
			>
				<SheetTitle>{product.title}</SheetTitle>
				{/* ----------------------- TOP SECTION ----------------------- */}
				<ScrollArea dir="rtl" className="whitespace-nowrap min-h-0 pb-2">
					<div className="flex flex-col gap-3">
						<AdminProductSheetHeader
							title={title}
							onTitleChange={setTitle}
							images={fullProduct?.images || []}
							newImages={images}
							onImagesChange={handleImagesChange}
						/>

						<AdminProductSheetAttributes />

						<AdminProductSheetPriceBox
							sponsorPrice={sponsorPrice}
							onSponsorPriceChange={setSponsorPrice}
						/>

						<AdminProductSheetFooter price={price} onPriceChange={setPrice} />
					</div>
					<ScrollBar orientation="vertical" className="z-10" />
				</ScrollArea>

				{/* Error display */}
				{error && (
					<div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
						{error}
					</div>
				)}

				{/* ----------------------- BOTTOM SECTION ----------------------- */}
				<div className="flex flex-col gap-3">
					<Button
						size="sm"
						variant="default"
						className="rounded-lg"
						onClick={handleEdit}
						disabled={isLoading}
					>
						{isLoading ? "در حال ذخیره..." : "ویرایش"}
					</Button>
					<Button
						size="sm"
						variant="destructive"
						className="rounded-lg"
						onClick={handleDelete}
						disabled={isLoading}
					>
						{isLoading ? "در حال حذف..." : "حذف"}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
