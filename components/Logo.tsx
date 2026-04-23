interface LogoProps {
  variant?: "dark" | "white";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const sizes = { sm: 28, md: 32, lg: 40 };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  const px = sizes[size];

  const deltaColor = variant === "white" ? "#FFFFFF" : "#1A1A2E";
  const agentsColor = variant === "white" ? "#93B4FF" : "#1B4FD8";

  return (
    <div className="flex items-center gap-2.5">
      <svg width={px} height={px} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#1B4FD8" />
        <path
          d="M16 6L21.5 16.5H18V20.5L12.5 14H16V6Z"
          fill="white"
        />
        <path
          d="M13 13.5L10.5 26L16 19.5V24L21.5 16.5H17L13 13.5Z"
          fill="rgba(255,255,255,0.55)"
        />
      </svg>
      <span className={`font-bold tracking-tight ${textSizes[size]}`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <span style={{ color: deltaColor }}>Delta</span>
        <span style={{ color: agentsColor }}>Agents</span>
      </span>
    </div>
  );
}
