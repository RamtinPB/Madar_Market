import { Button } from "@/components/ui/button";

interface AdminProductSheetCardProps {
	title: string;
	description: string;
	onTitleChange?: (value: string) => void;
	onDescriptionChange?: (value: string) => void;
	onDelete?: () => void;
}

export default function AdminProductSheetCard({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
	onDelete,
}: AdminProductSheetCardProps) {
	return (
		<div className="flex justify-between bg-white rounded-xl p-3">
			<div className="flex flex-col ">
				<div className="flex gap-2 items-center">
					<span>سر تیتر:</span>
					<input
						className="text-[#979593]"
						value={title}
						onChange={(e) => onTitleChange?.(e.target.value)}
					/>
				</div>

				<div className="flex gap-2 items-center">
					<span>محتوا:</span>
					<input
						className="text-[#787471]"
						value={description}
						onChange={(e) => onDescriptionChange?.(e.target.value)}
					/>
				</div>
			</div>
			<Button variant={"destructive"} onClick={onDelete}>
				X
			</Button>
		</div>
	);
}
