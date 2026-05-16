# DeltaAgents — MVP setup checklist

Concrete actiepunten voor Peter om deze week parallel te doen aan code-werk.
Volgorde maakt niet uit, maar Meta WhatsApp eerst starten = minste wachttijd later.

---

## 1. Meta WhatsApp Business Platform (start zsm — duurt 2-4 weken approval)

**Waarom eerst:** Meta moet je bedrijf verifiëren en templates goedkeuren.
Zonder dit kan de agent geen klantberichten ontvangen of versturen.

### Acties
- [ ] Ga naar https://business.facebook.com → maak Business Manager aan met
      `info@delta-design.nl` (of dedicated DeltaAgents email)
- [ ] Voeg `deltaagents.nl` toe als verified domain (DNS TXT record)
- [ ] Verifieer KVK-nummer (42031960) als business asset
- [ ] In Business Manager → **WhatsApp Manager** → request access
- [ ] Provisioning telefoonnummer:
      - **Optie A (Recommended)**: koop Nederlands 085-nummer via Vonage of
        BulkSMS (€20-30/mnd, verifieerbaar als business)
      - **Optie B**: gebruik bestaand 06-83 41 77 23, maar verliest persoonlijke
        WhatsApp toegang. Niet doen.
- [ ] Koppel het nummer aan WhatsApp Business Platform
- [ ] Maak eerste 2 template messages aan (Meta moet approven, 24-72u):
      - `wachtlijst_welcome_nl` — "Welkom bij DeltaAgents, {{name}}..."
      - `factuur_approval_nl` — "Concept-factuur €{{amount}} voor {{customer}}. Typ JA om te versturen."

### Wat je daarna krijgt
- `WHATSAPP_PHONE_NUMBER_ID` — unieke ID voor jouw nummer
- `WHATSAPP_ACCESS_TOKEN` — system user token (langlevend, in env vars)
- `WHATSAPP_VERIFY_TOKEN` — kies zelf, voor webhook verificatie

---

## 2. Moneybird developer account (start zsm — duurt ~1-2 dagen)

**Waarom:** factuur-creatie loopt via Moneybird API. Andere boekhoudpakketten
(Exact, e-Boekhouden) komen later.

### Acties
- [ ] Maak Moneybird account (gratis sandbox volstaat voor dev) op
      https://moneybird.com
- [ ] Ga naar **Mijn account → OAuth applicaties** → "Nieuwe applicatie"
- [ ] Naam: "DeltaAgents", redirect URI: `https://deltaagents.nl/api/moneybird/callback`
- [ ] Scopes: `sales_invoices`, `documents`, `settings` (voor contacts en products)
- [ ] Noteer `MONEYBIRD_CLIENT_ID` en `MONEYBIRD_CLIENT_SECRET`

### Test
- Tijdens dev: maak een test-administratie aan met 2 fake klanten en een prijslijst,
  zodat we tegen echte API kunnen ontwikkelen zonder echte factuur-risico.

---

## 3. Supabase project (start vandaag — 15 min)

**Status:** er bestaan al migrations (001_initial, 002_dashboard, 003_mvp na deze
sessie). Er moet een Supabase project zijn waar deze geapplied worden.

### Acties
- [ ] Ga naar https://supabase.com/dashboard → "New project"
      - Naam: `delta-agents-prod` (of `delta-agents-mvp`)
      - Region: `eu-central-1` (Frankfurt) — AVG-friendly + dicht bij NL gebruikers
      - Plan: Pro (€25/mnd) — pgvector, point-in-time recovery, geen pause
- [ ] Wacht 2 min op project provisioning
- [ ] Project Settings → API → noteer:
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      - `SUPABASE_SERVICE_ROLE_KEY` (server-side only, NIET leaken)
- [ ] Database → SQL Editor → run alle migrations in volgorde:
      1. `001_initial.sql`
      2. `002_dashboard.sql`
      3. `003_mvp.sql` (nieuw — komt uit deze sessie)
- [ ] Authentication → Providers → **Magic Link** enabled (geen password gedoe)

---

## 4. Anthropic API key (5 min)

### Acties
- [ ] https://console.anthropic.com → API Keys → "Create key" met label `delta-agents-prod`
- [ ] Top up €100 credit (genoeg voor ~10K agent runs in MVP-fase)
- [ ] Noteer `ANTHROPIC_API_KEY`

---

## 5. Vercel environment variables (5 min, na bovenstaande)

In Vercel dashboard → delta-agents project → Settings → Environment Variables.
Voeg toe voor **Production** én **Preview** (samen aan te vinken):

```
ANTHROPIC_API_KEY                    sk-ant-...

NEXT_PUBLIC_SUPABASE_URL             https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY        eyJ...
SUPABASE_SERVICE_ROLE_KEY            eyJ...

MONEYBIRD_CLIENT_ID                  xxx
MONEYBIRD_CLIENT_SECRET              xxx

WHATSAPP_PHONE_NUMBER_ID             xxx  (pas in week 3-4 beschikbaar)
WHATSAPP_ACCESS_TOKEN                xxx  (idem)
WHATSAPP_VERIFY_TOKEN                deltaagents-{kies-iets-random}

WEB3FORMS_ACCESS_KEY                 84ab51cd-7f92-4ec1-9b77-492755ff5167
```

Na invoer: redeploy de waitlist (Vercel dashboard → Deployments → Redeploy).

---

## 6. Volgorde van implementatie (sprint planning)

| Week | Wat ik bouw | Wat jij regelt |
|---|---|---|
| **1 (deze week)** | Schema + onboarding-flow herschrijven naar MVP doelgroep (loonwerk/grondverzet ipv kapper/bakker) | Meta-aanvraag indienen, Moneybird OAuth, Supabase project, env vars |
| **2** | Moneybird OAuth-flow, prijslijst sync, klanten import vanuit MB | Wachten op Meta + Moneybird approval, eerste pilot-klant benaderen |
| **3** | WhatsApp webhook + voicebericht ontvangen + transcription via Anthropic | Templates door Meta laten goedkeuren, pilot-klant interview |
| **4** | Agent runtime (Claude met tools) + concept-factuur + "typ JA" approval flow | Pilot-klant onboarden voor eerste test |

Tegen einde week 4: één klant kan een echte voicebericht-naar-factuur flow draaien.

---

## 7. Wat NIET in MVP

Bewust uitgesloten om scope te houden:
- Multiple boekhoudpakketten (alleen Moneybird in MVP)
- Google Calendar / agenda-flows
- Klantenservice 24/7 (komt na pilot)
- Voorraadbeheer
- Kwartaalrapportages
- 55-integraties library (deltaagents.nl/integraties pagina staat al, maar achterliggende koppelingen komen pas in fase 3)
- Multi-tenant billing met Stripe (eerst pilot-klant handmatig factureren)

Komt allemaal na: pilot werkt → product-market-fit bewezen → schaal.
