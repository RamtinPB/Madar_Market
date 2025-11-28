"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import RightArrowIcon from "@/public/assets/header/right_arrow.svg";
import PhoneIcon from "@/public/assets/login/Phone.svg";
import ClockIcon from "@/public/assets/login/clock.svg";
import EditIcon from "@/public/assets/login/edit.svg";

import LoginLeft from "@/public/assets/login/login_left.png";
import LoginRight from "@/public/assets/login/login_right.png";
import LoginHands from "@/public/assets/login/login_hands.png";
import LoginBasket from "@/public/assets/login/HandBasket.png";

import Logo from "@/public/assets/login/logo.png";
import LogoDesc from "@/public/assets/login/logo_desc.png";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

import { ButtonGroup } from "@/components/ui/button-group";

export default function LoginPage() {
	const router = useRouter();

	/* ------------------------------------------------------------
	 * STATE
	 * ------------------------------------------------------------ */
	const [stage, setStage] = useState(0);
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState(["", "", "", ""]);

	const isValidPhone = /^09\d{9}$/.test(phone);
	const isValidCode = code.every((d) => d.length === 1);

	/* ------------------------------------------------------------
	 * COUNTDOWN FOR STAGE 1
	 * ------------------------------------------------------------ */
	const [timeLeft, setTimeLeft] = useState(120); // 120 seconds
	const resendDisabled = timeLeft > 0;

	useEffect(() => {
		if (stage !== 1) return; // countdown only works on stage 1
		if (timeLeft === 0) return;

		const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
		return () => clearTimeout(timer);
	}, [timeLeft, stage]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const handleResend = () => {
		setTimeLeft(120); // restart countdown
	};

	/* ------------------------------------------------------------
	 * STAGE CONFIG
	 * ------------------------------------------------------------ */
	const stages = [
		{
			title: "ورود",
			subtitle: "شماره موبایل خود را وارد کنید",
			content: (
				<ButtonGroup
					className="
            group flex border border-[#EDEDED] rounded-xl w-full
            focus-within:border-[#FF6A29]
          "
				>
					<InputGroup
						className="
              h-[46px] w-full!
              ring-0 focus:ring-0 focus-visible:ring-0
              has-[[data-slot=input-group-control]:focus-visible]:ring-0
              has-[[data-slot=input-group-control]:focus-visible]:ring-transparent
              shadow-none
            "
					>
						<InputGroupInput
							placeholder="09xx-xxx-xxxx"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="focus:border-[#FF6A29] focus:ring-[#FF6A29]"
						/>
					</InputGroup>

					<InputGroupAddon
						className="
              w-[46px] h-[46px] p-2 bg-[#F7F7F7] border border-[#EDEDED] rounded-xl
              group-focus-within:border-[#FF6A29]
            "
					>
						<PhoneIcon className="w-fit! h-fit!" />
					</InputGroupAddon>
				</ButtonGroup>
			),
			actionLabel: "ادامه",
			valid: isValidPhone,
			onAction: () => {
				setStage(1);
				setTimeLeft(120); // start timer when moving to stage 1
			},
		},

		/* ---------------------- STAGE 1 (OTP) ---------------------- */
		{
			title: "ورود",
			subtitle: `کد ارسال شده به ${phone} را وارد کنید`,
			content: (
				<div dir="ltr" className="flex justify-between w-full gap-5">
					{code.map((digit, i) => (
						<input
							key={i}
							maxLength={1}
							value={digit}
							onChange={(e) => {
								const v = e.target.value.replace(/\D/, "");
								const newCode = [...code];
								newCode[i] = v;
								setCode(newCode);
							}}
							className="
                w-full h-14 border border-[#EDEDED] rounded-lg text-center text-xl
                focus:border-[#FF6A29] focus:outline-none
              "
						/>
					))}
				</div>
			),
			actionLabel: "تایید",
			valid: isValidCode,
			onAction: () => router.push("/"),
		},
	];

	const current = stages[stage];

	/* ------------------------------------------------------------
	 * RENDER
	 * ------------------------------------------------------------ */
	return (
		<div className="relative flex w-full flex-col gap-14 bg-white dark:bg-black overflow-hidden">
			{/* HEADER */}
			<header className="flex h-[72px] fixed z-50 bg-white w-full items-center border-b px-6">
				<Button
					variant="ghost"
					className="h-8 w-8 p-0"
					onClick={() => router.push("/")}
				>
					<RightArrowIcon className="w-fit! h-fit!" />
				</Button>
			</header>

			{/* MAIN CONTENT */}
			<main className="flex flex-col justify-between items-center relative z-20 mt-[135px]">
				{/* LOGO */}
				<div className="flex flex-col items-center gap-2 mb-3">
					<Image src={Logo} alt="Logo" className="w-[46px] h-[34px]" />
					<Image src={LogoDesc} alt="Desc" className="w-[83px] h-8" />
				</div>

				{/* TITLE */}
				<div className="flex flex-col w-full px-5 gap-3 mt-10">
					<span className="px-2 font-medium text-[28px] text-[#514F4D]">
						{current.title}
					</span>

					<p className="px-2 text-[#787471] text-[14px] font-normal">
						{current.subtitle}
					</p>

					{/* STAGE CONTENT */}
					<div className="mt-2">{current.content}</div>

					{/* MAIN ACTION BUTTON */}
					<Button
						className={`
              rounded-lg w-full text-white
              ${current.valid ? "bg-[#FF6A29]" : "bg-[#FFD1B8] opacity-60"}
            `}
						disabled={!current.valid}
						onClick={current.onAction}
					>
						{current.actionLabel}
					</Button>

					{/* ---------------------- STAGE 0 FOOTER ---------------------- */}
					{stage === 0 && (
						<p className="font-normal text-[14px] text-[#787471] leading-6">
							ورود شما به معنای پذیرش{" "}
							<a href="/login" className="text-[#02B1EA] hover:underline">
								شرایط خدمات و حریم خصوصی
							</a>{" "}
							است.
						</p>
					)}

					{/* ---------------------- STAGE 1 FOOTER ---------------------- */}
					{stage === 1 && (
						<div
							dir="ltr"
							className="flex justify-between items-center w-full mt-2"
						>
							{/* EDIT PHONE NUMBER */}
							<Button
								variant="ghost"
								className="text-[#FF6A29] font-medium"
								onClick={() => setStage(0)}
							>
								<span className="text-[#787471] font-normal text-[16px]">
									{" "}
									ویرایش شماره
								</span>
								<EditIcon className="w-fit! h-fit!" />
							</Button>

							{/* RESEND SECTION */}
							<div className="flex items-center gap-2">
								<span className="text-[#FF5500] bg-[#FAFAFA] border border-[#EDEDED] text-[14px] rounded-lg px-2 py-1">
									{formatTime(timeLeft)}
								</span>

								<Button
									variant="ghost"
									disabled={resendDisabled}
									onClick={handleResend}
									className={`
                    font-medium
                    ${resendDisabled ? "text-[#C0C0C0]" : "text-[#787471]"}
                  `}
								>
									<span className="">دریافت مجدد کد</span>
									<ClockIcon className="w-fit! h-fit!" />
								</Button>
							</div>
						</div>
					)}
				</div>
			</main>

			<div className="flex  flex-col items-center mt-10">
				{/* BOTTOM IMAGE — only for stage 0 */}
				{stage === 0 && (
					<Image src={LoginHands} alt="" className="w-[225px] " />
				)}

				{stage === 1 && (
					<Image src={LoginBasket} alt="" className="w-[225px] h-full" />
				)}
			</div>

			{/* DECORATIONS */}
			<Image
				src={LoginLeft}
				alt=""
				width={308}
				height={308}
				className="absolute bottom-0 left-0 pointer-events-none select-none z-10"
			/>

			<Image
				src={LoginRight}
				alt=""
				width={301}
				height={301}
				className="absolute bottom-0 right-0 pointer-events-none select-none z-10"
			/>
		</div>
	);
}
