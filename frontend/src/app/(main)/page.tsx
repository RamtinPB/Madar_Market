// src/app/(main)/page.tsx
import { redirect } from "next/navigation";

export default function MainIndex() {
	redirect("/home");
}
