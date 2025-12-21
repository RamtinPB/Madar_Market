import { Footer } from "@/src/components/Footer_comp/footer";
import { Header } from "@/src/components/Header_comp/header";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
			<main className="relative flex min-h-screen w-full max-w-3xl flex-col bg-white dark:bg-black">
				{/* HEADER */}
				<Header />

				{/* MAIN CONTENT WRAPPER */}
				<section className="mt-[84px] mb-[74px] flex w-full justify-center px-6 max-[376px]:px-2.5 max-[321px]:px-1">
					{children}
				</section>

				{/* FOOTER NAVIGATION */}
				<Footer />
			</main>
		</div>
	);
}
