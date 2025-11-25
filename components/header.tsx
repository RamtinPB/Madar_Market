import { Button } from "@/components/ui/button";

// SVG Icons (imported as React components via SVGR)
import Logo from "@/public/assets/header/logo.svg";
import RightArrowIcon from "@/public/assets/header/right_arrow.svg";
import BasketIcon from "@/public/assets/header/basket.svg";

export function Header() {
	return (
		<header className="flex h-[72px] w-full items-center justify-between border-b px-6">
			{/* --------------------------------------------------------
			 * LEFT SECTION
			 * - Navigation back arrow
			 * - Center-aligned logo
			 * -------------------------------------------------------- */}
			<div className="flex h-8 min-w-[92px] items-center gap-1">
				<Button variant="ghost" className="h-8 w-8 p-0">
					<RightArrowIcon className="h-8! w-8!" />
				</Button>

				<Logo className="h-full w-full" />
			</div>

			{/* --------------------------------------------------------
			 * RIGHT SECTION
			 * - Basket button
			 * -------------------------------------------------------- */}
			<div>
				<Button
					variant="outline"
					className="h-10 w-10 p-0 border-2 transition-all duration-150
				hover:bg-zinc-50 active:scale-95"
				>
					<BasketIcon className="h-5! w-5! text-[#B3B2B2]" />
				</Button>
			</div>
		</header>
	);
}
