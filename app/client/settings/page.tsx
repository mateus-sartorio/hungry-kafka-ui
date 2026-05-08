"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BottomNavigation } from "../components/bottom-navigation";
import { readStoredUsername, USERNAME_STORAGE_KEY } from "../user-config";
import { ClientHeader } from "../components/client-header";
import { AccountSettingsFormCard } from "./account-settings-form-card";
import { AccountSettingsHeader } from "./account-settings-header";

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
          <AccountSettingsHeader />

          <AccountSettingsFormCard
            usernameInput={usernameInput}
            onUsernameInputChange={setUsernameInput}
            onSubmit={onSubmit}
          />
        </div>
      </main>

      <BottomNavigation activeTab="account" />
    </div>
  );
}
