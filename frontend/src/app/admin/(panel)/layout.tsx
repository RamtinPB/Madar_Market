export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex w-full flex-col gap-14 bg-white dark:bg-black overflow-hidden">
			{children}
		</div>
	);
}
