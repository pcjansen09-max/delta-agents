"use client";

import Image from "next/image";

interface AppLogoProps {
  name: string;
  size?: number;
  className?: string;
}

const LOGO_COLORS: Record<string, string> = {
  whatsapp: "#25D366",
  gmail: "#EA4335",
  googlecalendar: "#4285F4",
  microsoftoutlook: "#0078D4",
  slack: "#4A154B",
  zapier: "#FF4A00",
  stripe: "#635BFF",
  shopify: "#96BF48",
  hubspot: "#FF7A59",
  notion: "#000000",
  mollie: "#000000",
  googledrive: "#4285F4",
  moneybird: "#1AB5C1",
};

const LOGO_NAMES: Record<string, string> = {
  whatsapp: "WhatsApp",
  gmail: "Gmail",
  googlecalendar: "Google Calendar",
  microsoftoutlook: "Outlook",
  slack: "Slack",
  zapier: "Zapier",
  stripe: "Stripe",
  shopify: "Shopify",
  hubspot: "HubSpot",
  notion: "Notion",
  mollie: "Mollie",
  googledrive: "Google Drive",
  moneybird: "Moneybird",
};

export default function AppLogo({ name, size = 32, className = "" }: AppLogoProps) {
  const slug = name.toLowerCase().replace(/\s/g, "");
  const color = LOGO_COLORS[slug] ?? "#1B4FD8";
  const label = LOGO_NAMES[slug] ?? name;
  const firstLetter = label.charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      title={label}
    >
      <Image
        src={`/logos/${slug}.svg`}
        alt={label}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.style.background = color;
            parent.style.borderRadius = "50%";
            parent.style.color = "#fff";
            parent.style.fontWeight = "700";
            parent.style.fontSize = `${Math.round(size * 0.45)}px`;
            parent.style.fontFamily = "'DM Sans', system-ui, sans-serif";
            parent.textContent = firstLetter;
          }
        }}
      />
    </div>
  );
}
