"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function SignupPage() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSignup = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!name || !email || !password || !confirmPassword) {
			setError("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);

			await api.post("/api/register", {
				name,
				email,
				password,
				password_confirmation: confirmPassword,
			});

			// update AuthButton instantly
			window.dispatchEvent(new Event("auth-changed"));

			router.push("/");
			router.refresh();
		} catch (err: unknown) {
			console.error(err);
			setError("Signup failed or server error.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50">
			<div className="px-2">
				<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
					<h1 className="text-xl font-semibold text-slate-900 mb-4">
						Sign up
					</h1>
					{error && (
						<p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-500">
							{error}
						</p>
					)}
					<form onSubmit={handleSignup} className="space-y-3">
						<input
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-lg bg-green-600 py-2 text-sm text-white disabled:opacity-50 hover:bg-green-700"
						>
							{loading ? "Creating account..." : "Sign up"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}