"use client";

import { useEffect, useMemo, useState } from "react";

import CountdownAdImage from "@/public/assets/home_screen/CountdownAd.svg";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */

interface TimeLeft {
	hours: string;
	minutes: string;
	seconds: string;
}

/* ------------------------------------------------------------
 * COUNTDOWN UTILITY
 * Calculates the remaining time in hh:mm:ss format.
 * ------------------------------------------------------------ */
function getTimeRemaining(target: Date): TimeLeft {
	const now = Date.now();
	const distance = target.getTime() - now;

	if (distance <= 0) {
		return { hours: "00", minutes: "00", seconds: "00" };
	}

	const hours = Math.floor(distance / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	return {
		hours: String(hours).padStart(2, "0"),
		minutes: String(minutes).padStart(2, "0"),
		seconds: String(seconds).padStart(2, "0"),
	};
}

/* ------------------------------------------------------------
 * MAIN COMPONENT — COUNTDOWN AD
 * ------------------------------------------------------------ */

export default function CountdownAd() {
	/**
	 * Memoized target expiration time.
	 * Avoids re-creating the target on each re-render.
	 */
	const targetDate = useMemo(
		() => new Date(Date.now() + 2 * 60 * 60 * 1000), // 1 hour from now
		[]
	);

	const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
		getTimeRemaining(targetDate)
	);

	/* ------------------------------------------------------------
	 * INTERVAL — Updates timer every second
	 * ------------------------------------------------------------ */
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(getTimeRemaining(targetDate));
		}, 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	/* ------------------------------------------------------------
	 * RENDER
	 * ------------------------------------------------------------ */
	return (
		<div className="flex h-[58px] w-full items-center justify-between rounded-xl border-2 border-[#FFCACA] bg-[#FDF2F6] px-3">
			<CountdownAdImage />

			{/* TIMER */}
			<div className="flex flex-row items-center gap-1 font-semibold text-xs text-white">
				{/* Seconds */}
				<div className="w-7 rounded-sm bg-[#FA2C37] py-1 text-center">
					{timeLeft.seconds}
				</div>
				<span className="py-0.5 font-bold text-[#FA2C37]">:</span>

				{/* Minutes */}
				<div className="w-7 rounded-sm bg-[#FA2C37] py-1 text-center">
					{timeLeft.minutes}
				</div>
				<span className="py-0.5 font-bold text-[#FA2C37]">:</span>

				{/* Hours */}
				<div className="w-7 rounded-sm bg-[#FA2C37] py-1 text-center">
					{timeLeft.hours}
				</div>
			</div>
		</div>
	);
}
