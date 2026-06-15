"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type User = {
	id: number;
	name: string;
	email?: string;
};

export default function AuthButton() {
	const [user, setUser] = useState<User | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await api.get("/api/me");
				setUser(res.data.data ?? null);
			} catch {
				setUser(null);
			}
		};

        // listen for login/logout changes
        const handler = () => fetchUser();

        window.addEventListener("auth-changed", handler);

        return () => window.removeEventListener("auth-changed", handler);
	}, []);

	const logout = async () => {
		try {
			await api.post("/api/logout");
			setUser(null);
			setOpen(false);
		} catch {}
	};

	// NOT logged in → Login button
	if (!user) {
		return (
			<Link
				href="/login"
				className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
			>
				Login
			</Link>
		);
	}

	// Logged in → Profile dropdown
	return (
		<div className="relative">
			<button
				onClick={() => setOpen(!open)}
				className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50"
			>
				{user.name}
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
					<button
						onClick={logout}
						className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}