export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
			<main className="relative flex min-h-screen w-full max-w-3xl flex-col bg-white dark:bg-black">
				{children}
			</main>
		</div>
	);
}
