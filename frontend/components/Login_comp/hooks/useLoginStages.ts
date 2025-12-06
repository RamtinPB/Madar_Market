"use client";

import { useState } from "react";

export function useLoginStages() {
	const [stage, setStage] = useState(0);
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState(["", "", "", ""]);

	const isValidPhone = /^09\d{9}$/.test(phone);
	const isValidCode = code.every((d) => d.length === 1);

	return {
		stage,
		setStage,
		password,
		setPassword,
		phone,
		setPhone,
		code,
		setCode,
		isValidPhone,
		isValidCode,
	};
}
