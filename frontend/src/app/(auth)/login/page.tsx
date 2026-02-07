"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import LoginLeft from "../../../../public/assets/login/login_left.png";
import LoginRight from "../../../../public/assets/login/login_right.png";
import LoginHands from "../../../../public/assets/login/login_hands.png";
import LoginBasket from "../../../../public/assets/login/HandBasket.png";
import Logo from "../../../../public/assets/login/logo.png";
import LogoDesc from "../../../../public/assets/login/logo_desc.png";

import { Button } from "@/components/ui/button";

import { useLoginStages } from "@/features/Login/hooks/useLoginStages";
import { useOTPCountdown } from "@/features/Login/hooks/useOTPCountdown";
import { formatTime } from "@/features/Login/utils/formatTime";

import { StagePhone } from "@/features/Login/StagePhone";
import { StageOTP } from "@/features/Login/StageOTP";
import { LoginHeader } from "@/features/Login/LoginHeader";
import { LoginFooterPhone } from "@/features/Login/LoginFooterPhone";
import { LoginFooterOTP } from "@/features/Login/LoginFooterOTP";
import { requestOtp, login as apiLogin, setAccessToken } from "@/lib/api/auth";
import { useAuthenticateUser } from "@/hooks/useAuth";

export default function LoginPage() {
	const router = useRouter();
	const setUser = useAuthenticateUser();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const {
		stage,
		setStage,
		password,
		setPassword,
		phone,
		setPhone,
		code,
		setCode,
		isValidPhone,
		isValidPassword,
		isValidCode,
	} = useLoginStages();

	const { timeLeft, resendDisabled, reset } = useOTPCountdown(stage === 1);

	const [visibleOtp, setVisibleOtp] = useState<string | null>(null);

	/* ------------------------------------------------------------
	 * RENDER
	 * ------------------------------------------------------------ */
	return (
		<>
			{/* HEADER */}
			<LoginHeader />

			{/* MAIN CONTENT */}
			<main className="flex flex-col justify-between items-center relative z-20 mt-[45px]">
				{/* LOGO */}
				<div className="flex flex-col items-center gap-2 mb-3">
					<Image src={Logo} alt="Logo" className="w-[46px] h-[34px]" />
					<Image src={LogoDesc} alt="Desc" className="w-[83px] h-8" />
				</div>

				{/* TITLE */}
				<div className="flex flex-col w-full px-5 gap-3 mt-10">
					<span className="px-2 font-medium text-[28px] text-[#514F4D]">
						ورود
					</span>

					<p className="px-2 text-[#787471] text-[14px] font-normal">
						{stage === 0 && "شماره موبایل خود را وارد کنید"}
						{stage === 1 && `کد ارسال شده به شماره موبایل ${phone} را وارد کن`}
					</p>

					{/* STAGE CONTENT */}
					<div className="mt-2">
						{stage === 0 && (
							<StagePhone
								phone={phone}
								setPhone={setPhone}
								password={password}
								setPassword={setPassword}
							/>
						)}
						{stage === 1 && <StageOTP code={code} setCode={setCode} />}
					</div>

					{/* MAIN ACTION BUTTON */}
					<Button
						className={`w-full text-white rounded-lg ${
							(stage === 0 ? isValidPhone && isValidPassword : isValidCode) &&
							!loading
								? "bg-[#FF6A29]"
								: "bg-[#FFD1B8] opacity-60"
						}`}
						disabled={
							loading ||
							(stage === 0 ? !isValidPhone && !isValidPassword : !isValidCode)
						}
						onClick={async () => {
							setError(null);
							setLoading(true);
							try {
								if (stage === 0) {
									// request OTP
									const { otp } = await requestOtp(phone, "login");
									setVisibleOtp(otp);
									reset();
									setStage(1);
								} else {
									// verify OTP (login)
									const data = await apiLogin(phone, password, code.join(""));

									// Update auth with zustand hooks
									if (data.accessToken) {
										setAccessToken(data.accessToken);
									}
									if (data.user) {
										setUser(data.user);
									}

									router.push("/");
								}
							} catch (err: any) {
								setError(err.message || "خطا در ورود. لطفا دوباره تلاش کنید.");
							} finally {
								setLoading(false);
							}
						}}
					>
						{loading ? "در حال پردازش..." : stage === 0 ? "ادامه" : "تایید"}
					</Button>

					{/* FOOTERS */}
					{stage === 0 && (
						<>
							<LoginFooterPhone />
							<p className="font-normal text-[14px] text-[#787471] leading-6">
								<a href="/signup" className="text-[#02B1EA] hover:underline">
									ثبت نام
								</a>{" "}
								رایگان!
							</p>
						</>
					)}
					{stage === 1 && (
						<LoginFooterOTP
							timeLeft={formatTime(timeLeft)}
							resendDisabled={resendDisabled}
							editPhone={() => setStage(0)}
							resend={async () => {
								setError(null);
								setLoading(true);
								try {
									const { otp } = await requestOtp(phone, "login");
									setVisibleOtp(otp);
									reset();
									setStage(1);
								} catch (err: any) {
									setError(err.message || "خطا در ارسال کد");
								} finally {
									setLoading(false);
								}
							}}
						/>
					)}

					{visibleOtp && (
						<div className="mt-3 w-full text-center text-sm text-[#0b0b0b] bg-[#FFF7E6] border border-[#FFE5B4] rounded py-2">
							کد (برای تست):{" "}
							<span className="font-mono text-lg">{visibleOtp}</span>
						</div>
					)}

					{error && <div className="mt-2 text-right text-red-600">{error}</div>}
				</div>
			</main>

			{/* BOTTOM IMAGES */}
			<div className="flex items-center justify-center mt-10">
				{stage === 0 && (
					<Image src={LoginHands} alt="Hands" className="w-[225px] " />
				)}
				{stage === 1 && (
					<Image src={LoginBasket} alt="Basket" className="w-[225px] h-full" />
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
		</>
	);
}
