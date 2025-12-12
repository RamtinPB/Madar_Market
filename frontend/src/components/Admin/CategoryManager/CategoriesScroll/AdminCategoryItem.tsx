"use client";

import { useState } from "react";
import { Card, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import CheckMark from "@/public/assets/shopping_cart_screen/CheckMark.svg";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */

export interface AdminCategoryItemProps {
	id: string;
	icon: string;
	label: string;
	phase?: 0 | 1 | 2;
	onToggle?: () => void;
	onEdit?: (id: string, title: string, imageFile: File | null) => Promise<void>;
	onDelete?: (id: string) => Promise<void>;
}

/* ------------------------------------------------------------
 * ADMIN CATEGORY ITEM COMPONENT
 * Expandable card for admin category management
 * ------------------------------------------------------------ */

export default function AdminCategoryItem({
	id,
	icon,
	label,
	phase = 0,
	onToggle,
	onEdit,
	onDelete,
}: AdminCategoryItemProps) {
	const [title, setTitle] = useState(label);
	const [imageFile, setImageFile] = useState<File | null>(null);

	return (
		<Card className="relative flex flex-col items-center p-4 overflow-visible min-w-50 h-fit">
			{phase === 2 && <CheckMark className="absolute -translate-y-1.5" />}
			{/* Icon container with gradient background */}
			<div
				onClick={onToggle}
				className={`
	         flex h-[76px] aspect-square items-center justify-center
	         rounded-xl bg-linear-to-b from-[#FFF7F5] to-[#FFEBE5]
	         shadow-xs cursor-pointer
	         ${
							phase === 1
								? "border-2 border-cyan-500"
								: phase === 2
								? "border-2  border-[#FF6A29]"
								: "border border-transparent"
						}
	       `}
			>
				{/* Uniform icon sizing */}
				<div className="relative h-[53px] aspect-square overflow-hidden">
					<img
						src={icon}
						alt={label}
						className="h-full w-full object-contain"
					/>
				</div>
			</div>

			{/* Title - input when phase > 0, span otherwise */}
			{phase === 1 ? (
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="mt-1 text-center text-[12px] w-full p-2"
				/>
			) : (
				<span className="mt-1 text-[12px] text-center text-[#333]">
					{label}
				</span>
			)}

			{/* Expanded content */}
			{phase === 1 && (
				<CardContent className="w-full mt-2 p-2">
					<div className="flex flex-col gap-2">
						<div className="flex flex-col w-full">
							<label className="text-xs text-gray-600">آپلود عکس</label>
							<Input
								type="file"
								accept="image/*"
								onChange={(e) => setImageFile(e.target.files?.[0] || null)}
								className="text-xs"
							/>
						</div>
						<Button
							size="sm"
							variant="default"
							className="w-full"
							onClick={() => onEdit?.(id, title, imageFile)}
						>
							ویرایش
						</Button>
						<Button
							size="sm"
							variant="destructive"
							className="w-full"
							onClick={() => onDelete?.(id)}
						>
							حذف
						</Button>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
