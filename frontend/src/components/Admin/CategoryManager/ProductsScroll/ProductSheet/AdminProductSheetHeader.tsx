"use client";
import { useEffect } from "react";
import { BannerCarousel } from "@/src/components/HomeScreen_comp/BannerCarousel";
import { Input } from "@/src/components/ui/input";
import { ProductImage } from "@/src/lib/api/products";

interface Props {
	title: string;
	onTitleChange: (title: string) => void;
	description: string;
	onDescriptionChange: (description: string) => void;
	images: ProductImage[];
	newImages: File[];
	onImagesChange: (images: File[]) => void;
}

export function AdminProductSheetHeader({
	title,
	onTitleChange,
	description,
	onDescriptionChange,
	images,
	newImages,
	onImagesChange,
}: Props) {
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		onImagesChange(files);
	};

	// Create object URLs for new images
	const newImageUrls = newImages.map((file) => URL.createObjectURL(file));

	// Cleanup object URLs on unmount or when newImages change
	useEffect(() => {
		return () => {
			newImageUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [newImages]);

	const allBanners =
		newImages.length > 0 ? newImageUrls : images.map((img) => img.path);

	return (
		<>
			<div className="w-full max-w-sm mx-auto">
				<BannerCarousel
					banners={allBanners}
					imageObject="contain"
					shadowAmount="none"
				/>
			</div>
			<div className="flex flex-col w-full">
				<label className="text-xs text-gray-600">آپلود عکس</label>
				<Input
					key={newImages.length}
					type="file"
					accept="image/*"
					multiple
					onChange={handleImageChange}
					className="text-xs"
				/>
			</div>
			<div className="flex flex-col w-full">
				<label className="text-xs text-gray-600">ویرایش نام محصول</label>
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					className="rounded-lg text-center text-[12px] p-0"
				/>
			</div>
			<div className="flex flex-col w-full">
				<label className="text-xs text-gray-600">ویرایش شرح محصول</label>
				<Input
					value={description}
					onChange={(e) => onDescriptionChange(e.target.value)}
					className="rounded-lg text-center text-[12px] p-0"
				/>
			</div>
		</>
	);
}
