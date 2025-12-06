import { Button } from "@/components/ui/button";
import { useCartStore } from "@/data_store/useCartStore";

// SVG Icons (imported as React components via SVGR)
import Logo from "@/public/assets/header/logo.svg";
import RightArrowIcon from "@/public/assets/header/right_arrow.svg";
import BasketIcon from "@/public/assets/header/basket.svg";
import SearchIcon from "@/public/assets/home_screen/search.svg";

export function Header() {
	const cartCount = useCartStore((s) =>
		Object.values(s.items).reduce((a, b) => a + b, 0)
	);

	return (
		<header className="fixed flex h-[72px] z-50 w-full items-center bg-white justify-between border-b px-6">
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
			<div className="flex flex-row items-center gap-3">
				{cartCount > 0 ? (
					<div className="flex flex-row justify-between items-center gap-3 p-1 bg-[#C50F1F] text-white rounded-[12px]">
						<div className="flex flex-col gap-1 pr-2">
							<span className="font-semibold text-[12px] "> مشاهده سبد</span>
							<span className="font-normal text-[10px] ">
								{cartCount} محصول
							</span>
						</div>
						<Button
							variant="outline"
							className="h-10 w-10 p-0 border-2 transition-all duration-150
				hover:bg-zinc-50 active:scale-95"
						>
							<BasketIcon className="h-fit! w-fit! text-[#C0C0C0]" />
						</Button>
					</div>
				) : (
					<Button
						variant="outline"
						className="h-10 w-10 p-0 border-2 transition-all duration-150
				hover:bg-zinc-50 active:scale-95"
					>
						<BasketIcon className="h-fit! w-fit! text-[#C0C0C0]" />
					</Button>
				)}

				<Button
					variant="outline"
					className="h-10 w-10 p-0 border-2 transition-all duration-150
				hover:bg-zinc-50 active:scale-95"
				>
					<SearchIcon className="h-fit! w-fit! text-[#C0C0C0]" />
				</Button>
			</div>
		</header>
	);
}
