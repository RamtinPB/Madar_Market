interface ProductSheetCardProps {
	title: string;
	data: string;
}

export default function ProductSheetCard({
	title,
	data,
}: ProductSheetCardProps) {
	return (
		<div className="flex flex-col bg-white rounded-xl p-3">
			<span className="text-[#979593] text-[12px]">{title}:</span>
			<span className="text-[#787471] font-medium">{data}</span>
		</div>
	);
}
