type AccountSettingsHeaderProps = {
  title?: string;
  description?: string;
};

export function AccountSettingsHeader({
  title = "Account Settings",
  description = "Manage your profile details and preferences.",
}: AccountSettingsHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold uppercase tracking-tight">{title}</h2>
      <p className="text-sm text-[#737a61]">{description}</p>
    </div>
  );
}
