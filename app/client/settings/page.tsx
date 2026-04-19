"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaReceipt, FaUser, FaUtensils } from "react-icons/fa";
import { readStoredUsername, USERNAME_STORAGE_KEY } from "../user-config";
import { ClientHeader } from "../components/client-header";

const FIRST_USERNAME_DEFAULT = "john doe";

export default function ClientSettingsPage() {
  const router = useRouter();
  const [headerName, setHeaderName] = useState(() => readStoredUsername());
  const [usernameInput, setUsernameInput] = useState(() => headerName || FIRST_USERNAME_DEFAULT);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = usernameInput.trim() || FIRST_USERNAME_DEFAULT;
    localStorage.setItem(USERNAME_STORAGE_KEY, nextName);
    setHeaderName(nextName);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-24 pt-16 text-[#181c1b] antialiased">
      <ClientHeader username={headerName} />

      <main className="container mx-auto max-w-lg px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Account Settings</h2>
            <p className="text-sm text-[#737a61]">Manage your profile details and preferences.</p>
          </div>

          <div className="overflow-hidden border border-[#c3caac]/20 bg-white p-6 shadow-sm">
            <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-[#181c1b]"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={usernameInput}
                  onChange={(event) => setUsernameInput(event.target.value)}
                  className="w-full border border-[#c3caac] bg-[#f7faf8] px-4 py-3 text-sm text-[#181c1b] transition-colors focus:border-[#4c6700] focus:outline-none focus:ring-1 focus:ring-[#4c6700]"
                  placeholder="Enter your username"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#c1ff00] px-6 py-4 text-sm font-bold italic uppercase tracking-wider text-[#567300] transition-colors hover:bg-[#baf600] active:scale-[0.98]"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-zinc-200 bg-white/95 px-4 shadow-[0_-8px_32px_rgba(24,28,27,0.04)] backdrop-blur-xl md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center gap-1 text-zinc-500">
          <FaUtensils className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Catalog</span>
        </Link>
        <Link
          href="/client/orders"
          className="flex flex-col items-center justify-center gap-1 text-zinc-500"
        >
          <FaReceipt className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Orders</span>
        </Link>
        <Link
          href="/client/settings"
          className="flex flex-col items-center justify-center gap-1 text-zinc-900"
        >
          <FaUser className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Account</span>
        </Link>
      </nav>
    </div>
  );
}
