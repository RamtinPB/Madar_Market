import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthBootstrap } from "@/components/AuthBootstrap";

const vazir = Vazirmatn({
	subsets: ["arabic"],
	variable: "--font-vazir",
	weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Madar Market",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fa" dir="rtl">
			<body className={`${vazir.variable} antialiased`}>
				<AuthBootstrap>{children}</AuthBootstrap>
			</body>
		</html>
	);
}
