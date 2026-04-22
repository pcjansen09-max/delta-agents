import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-semibold text-text-primary text-[15px]">
              Delta<span className="text-accent">Agents</span>
            </span>
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed max-w-[220px]">
            Digitale Werknemers voor het Nederlandse MKB. 24/7 beschikbaar.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-text-primary text-sm mb-4">Product</h4>
          <ul className="space-y-2.5 text-sm text-text-secondary">
            <li><a href="#how-it-works" className="hover:text-text-primary transition-colors">Hoe het werkt</a></li>
            <li><a href="#pricing" className="hover:text-text-primary transition-colors">Prijzen</a></li>
            <li><Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link></li>
            <li><Link href="/login" className="hover:text-text-primary transition-colors">Inloggen</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-text-primary text-sm mb-4">Juridisch</h4>
          <ul className="space-y-2.5 text-sm text-text-secondary">
            <li><Link href="/privacy" className="hover:text-text-primary transition-colors">Privacyverklaring</Link></li>
            <li><Link href="/algemene-voorwaarden" className="hover:text-text-primary transition-colors">Algemene Voorwaarden</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-text-primary text-sm mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-text-secondary">
            <li>
              <a href="mailto:team@delta-design.nl" className="hover:text-text-primary transition-colors">
                team@delta-design.nl
              </a>
            </li>
            <li>
              <a href="tel:+31683417723" className="hover:text-text-primary transition-colors">
                06-83417723
              </a>
            </li>
            <li className="text-text-secondary">Middenmeer, Noord-Holland</li>
            <li>
              <a href="https://deltaagents.nl" className="hover:text-text-primary transition-colors">
                deltaagents.nl
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-text-secondary text-sm">
          © {new Date().getFullYear()} DeltaAgents · DeltaDesign, KVK 42031960
        </p>
        <p className="text-text-secondary text-xs">
          Digitale Werknemers voor het MKB · Nederland
        </p>
      </div>
    </footer>
  );
}
