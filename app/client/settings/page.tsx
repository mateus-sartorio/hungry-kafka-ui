"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../components/bottom-navigation";
import { ClientHeader } from "../components/client-header";
import { AccountSettingsFormCard } from "./account-settings-form-card";
import { AccountSettingsHeader } from "./account-settings-header";
import { ensureStoredClientId, writeStoredUsername } from "../user-config";
import { useClientIdentity } from "../use-client-identity";

const FIRST_USERNAME_DEFAULT = "john doe";

export default function ClientSettingsPage() {
  const router = useRouter();
  const { username } = useClientIdentity();
  const [usernameInput, setUsernameInput] = useState("");
  const [hasEditedUsername, setHasEditedUsername] = useState(false);

  const displayedUsername = hasEditedUsername
    ? usernameInput
    : username || FIRST_USERNAME_DEFAULT;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = (hasEditedUsername ? usernameInput : username).trim() || FIRST_USERNAME_DEFAULT;
    ensureStoredClientId();
    writeStoredUsername(nextName);
    router.push("/");
  };

  function handleUsernameInputChange(value: string) {
    setHasEditedUsername(true);
    setUsernameInput(value);
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-24 pt-16 text-[#181c1b] antialiased">
      <ClientHeader username={username} />

      <main className="container mx-auto max-w-lg px-6 py-8">
        <div className="flex flex-col gap-8">
          <AccountSettingsHeader />

          <AccountSettingsFormCard
            usernameInput={displayedUsername}
            onUsernameInputChange={handleUsernameInputChange}
            onSubmit={onSubmit}
          />
        </div>
      </main>

      <BottomNavigation activeTab="account" />
    </div>
  );
}
