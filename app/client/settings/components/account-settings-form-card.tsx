import type { SyntheticEvent } from "react";

type AccountSettingsFormCardProps = {
  usernameInput: string;
  submitLabel: string;
  onUsernameInputChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
};

export function AccountSettingsFormCard({
  usernameInput,
  submitLabel,
  onUsernameInputChange,
  onSubmit,
}: AccountSettingsFormCardProps) {
  return (
    <div className="overflow-hidden border border-[#c3caac]/20 bg-white p-6 shadow-sm">
      <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#181c1b]" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={usernameInput}
            onChange={(event) => onUsernameInputChange(event.target.value)}
            className="w-full border border-[#c3caac] bg-[#f7faf8] px-4 py-3 text-sm text-[#181c1b] transition-colors focus:border-[#4c6700] focus:outline-none focus:ring-1 focus:ring-[#4c6700]"
            placeholder="Enter your username"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#c1ff00] px-6 py-4 text-sm font-bold italic uppercase tracking-wider text-[#567300] transition-colors hover:bg-[#baf600] active:scale-[0.98]"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
