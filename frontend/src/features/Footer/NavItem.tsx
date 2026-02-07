import { Button } from "@/components/ui/button";
import ActiveIndicatorIcon from "@/public/assets/footer/item_active.svg";

type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface NavItemProps {
	icon: SVGComponent;
	label: string;
	active?: boolean;
	onClick?: () => void;
}

export default function NavItem({
	icon: IconComponent,
	label,
	active = false,
	onClick,
}: NavItemProps) {
	return (
		<Button
			onClick={() => {
				window.scrollTo({ top: 0, behavior: "smooth" });
				onClick?.();
			}}
			variant="ghost"
			className="relative flex flex-col items-center justify-center gap-1"
		>
			{/* ACTIVE INDICATOR */}
			{active && (
				<ActiveIndicatorIcon className="absolute -top-[18.6px] left-1/2 -translate-x-1/2 text-[#FF6A29] w-9! h-1!" />
			)}

			{/* ICON */}
			<IconComponent
				className={`w-5! h-5! ${active ? "text-[#FF6A29]" : "text-[#B3B2B2]"}`}
			/>

			{/* LABEL */}
			<span
				className={`text-[12px] font-medium ${
					active ? "text-[#FF6A29]" : "text-[#B3B2B2]"
				}`}
			>
				{label}
			</span>
		</Button>
	);
}
