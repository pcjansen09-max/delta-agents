# DeltaAgents — Architectuur

> Een premium, veilige, zelflerende AI-collega voor het Nederlandse MKB.
> Cloud-versie van de Digitale Werknemer (delta-design.nl/digitale-werknemer).

---

## 1. Visie

DeltaAgents bouwt **één digitale collega per klant**, geen generiek chatbot-platform.
De agent kent het bedrijf van binnenuit, leert dagelijks bij van correcties van
de eigenaar, en handelt alleen extern na expliciete goedkeuring.

Drie principes die alles bepalen:

1. **Premium** — geen "AI-druk"-uitstraling. Echt vakwerk, doordachte UX,
   geen overdaad aan animaties of emoji-jargon.
2. **Veilig** — bedrijfsdata is heilig. Versleuteling-at-rest, RLS op
   elke tabel, audit op elke privileged actie, geen externe AI voor
   gevoelige content zonder expliciete toestemming.
3. **Zelflerend** — dit is dé USP. Niet "ChatGPT met prompts", maar een
   echte Wisdom Layer: corrigeer de agent één keer, hij onthoudt het
   voor altijd. Per klant uniek, per klant beter wordend.

## 2. Doelgroep en MVP-scope

**Doelgroep:** ambitieuze NL MKB-bedrijven (5-250 medewerkers) met
terugkerend admin-werk in sectoren als loonwerk, grondverzet,
mechanisatie, bouw, agrarisch, transport. Tone-of-voice: "u", premium-zakelijk.

**MVP scenario** (eerste 4 weken): voicebericht → factuur via WhatsApp +
Moneybird. Dit ene scenario perfect, daarna uitbreiden.

Bewust UIT scope voor MVP:
- Meerdere boekhoudpakketten (alleen Moneybird)
- Klantenservice 24/7 (komt na pilot)
- Agenda integraties
- Multi-tenant self-serve billing

## 3. Tech stack en hosting

| Laag | Keuze | Reden |
|---|---|---|
| Frontend + API | Next.js 16 op Vercel | App Router, server actions, edge-ready |
| Database + auth | Supabase (Pro, EU-Frankfurt) | RLS, pgvector, EU-residency, magic-links |
| LLM | Anthropic Claude Sonnet 4.6 | Premium reasoning, native audio in/out, lange context |
| Audio transcription | Anthropic native audio | Geen aparte Whisper-call, alles in 1 model |
| WhatsApp | Meta Business Platform (direct) | Lagere kosten dan Twilio, native templates |
| Boekhouden | Moneybird REST API (OAuth 2) | NL-marktleider voor MKB |
| Email transactional | Resend (later) | Voor waitlist + onboarding mails |
| Monitoring | Vercel Analytics + Sentry (later) | |
| Payments | Mollie (later) | iDEAL-native, NL-marktleider |

## 4. Security model

### 4.1 Data isolation (multi-tenant)
- **Elke tabel met klantdata heeft `company_id`** en een RLS-policy
  die alleen rijen toelaat waar `auth.jwt()->>'email'` matcht met
  de owner-email van die company.
- **`SUPABASE_SERVICE_ROLE_KEY`** wordt alleen server-side gebruikt
  voor systeem-acties (OAuth callbacks, webhooks). Nooit in client code.
- **`oauth_tokens` tabel heeft géén public RLS-policy** — alleen de
  service role kan lezen. Encrypted-at-rest op application-laag.

### 4.2 Encryption-at-rest voor OAuth tokens
- AES-256-GCM via Node `crypto` module.
- Master key in `TOKEN_ENCRYPTION_KEY` env var (32 bytes, base64).
- Elke token krijgt een eigen IV (12 bytes random).
- Encrypted payload: `iv:ciphertext:authTag` (base64-joined).
- Token wordt alleen ge-decrypt binnen één request-cycle, nooit gelogd.

### 4.3 WhatsApp webhook security
- HMAC-SHA256 signature verificatie op elke inbound (Meta's `X-Hub-Signature-256` header).
- `WHATSAPP_VERIFY_TOKEN` voor initial GET handshake.
- Idempotency: `wa_message_id` UNIQUE constraint in DB voorkomt dubbel verwerken.

### 4.4 Vier-Ogen Principe voor externe acties
**De agent voert NOOIT autonoom externe acties uit.** Tools zijn opgedeeld in:

- **Read tools** (autonoom): `search_customer`, `get_prices`, `get_recent_invoices`
- **Write tools** (proposed only): `create_invoice_draft`, `send_message_to_customer`
- **Execute tools** (require approval): `send_invoice`, `book_appointment`

Werking:
1. Agent stelt actie voor → opslaan in `actions` tabel met `status='pending'`
2. Agent stuurt WhatsApp-bericht naar gebruiker: *"Concept-factuur €X. Typ JA om te versturen."*
3. Gebruiker antwoordt `JA` → status='approved' → executor draait
4. Bij succes: `status='executed'`. Bij fout: `status='failed'` + audit log + WhatsApp error message.

### 4.5 Rolgebaseerde toegangsrechten
- Elke medewerker is gekoppeld aan een 06-nummer (E.164 formaat).
- Drie rollen voorgedefinieerd: `directie`, `voorman`, `monteur`.
- **De ondernemer kan permissies aanpassen per medewerker** (override JSONB).
- Bij elke agent-call: lookup user uit nummer → check permissies → restrict tools/data.
- Niet-bevoegd? Vriendelijke afwijzing: *"Sorry, die info is alleen voor de directie."*

### 4.6 Audit logging
**Elke** privileged actie wordt gelogd in `deltaagents_audit`:
- Agent-acties (proposed + executed)
- User-approvals (JA / NEE / no-response timeout)
- OAuth flows (connect, refresh, revoke)
- Login events
- Wisdom rule changes (added, decayed, deleted)

Voor AVG: bedrijven kunnen audit-log exporteren via dashboard.

### 4.7 PII minimization
- Audio bestanden in Supabase Storage: 30-dagen retention, dan auto-delete.
- Transcripts: in DB voor wisdom-learning, maar zonder klant-PII waar mogelijk.
- Encryption-in-transit overal (HTTPS, Supabase TLS).

## 5. Zelflerende kern: de Wisdom Layer

Dit is wat DeltaAgents fundamenteel anders maakt dan een ChatGPT-wrapper.

### 5.1 Concept
De agent heeft een **per-company bibliotheek van expliciete regels** die hij
toepast op elke interactie. Geen vaag "AI leert vanzelf", maar concrete,
zichtbare regels die de ondernemer kan inzien en bewerken.

Voorbeelden van regels:
- `"Facturen voor klant Boskalis altijd naar adres Vredehof 12, Rotterdam"`
- `"Bij voicebericht van Jan (06-12345678) altijd factuur opmaken in
   euro, niet dollar"`
- `"Uurtarief monteur na 18:00 is €120/uur ipv €85/uur"`
- `"Klant Van Dijk krijgt 10% korting op alle materialen"`

### 5.2 Data model
Tabel `deltaagents_wisdom_rules` (zie migration 004):
```
id, company_id, rule_text, category, source,
confidence (0-1), applied_count, last_applied_at,
created_at, expires_at (optional),
embedding vector(1536) -- voor semantische lookup
```

`category` ∈ `{pricing, customer, communication, workflow, security, general}`
`source` ∈ `{onboarding, user-correction, auto-detected, system}`

### 5.3 Hoe rules ontstaan
1. **Onboarding**: bij setup vraagt de wizard standaard regels uit
   (uurtarief, BTW-tarief, vaste klanten met bijzonderheden).
2. **User correction**: gebruiker antwoordt "nee, het moet zo en zo" op een
   voorstel. Agent detecteert dit als correctie, stelt rule voor, vraagt
   bevestiging via WhatsApp: *"Begrepen — vanaf nu factureer ik X naar Y.
   Klopt dat?"*. Bij JA: rule opgeslagen met `confidence=1.0, source='user-correction'`.
3. **Auto-detected pattern**: bij ≥3 consistent dezelfde actie, agent stelt
   rule voor (lagere initial confidence).

### 5.4 Hoe rules worden toegepast
Bij elke agent-call:
1. **Retrieval**: vector search op rule embeddings tegen huidige user
   message embedding. Top-N relevante rules (typisch 5-10).
2. **Context injection**: rules als bullet list in system prompt:
   ```
   <bedrijf_regels>
   - Facturen voor Boskalis altijd naar Vredehof 12, Rotterdam
   - Uurtarief na 18:00: €120/uur
   ...
   </bedrijf_regels>
   ```
3. **Track applied**: na succesvolle call, increment `applied_count` op
   gebruikte rules.

### 5.5 Confidence en decay
- Nieuwe rule: `confidence=1.0`
- Auto-detected rule: start op `0.7`
- Bij gebruiker-correctie tegen een bestaande rule: confidence verlaagd of
  rule vervangen
- Niet-gebruikte rules na 90 dagen: confidence × 0.9
- Rule onder threshold (`0.3`): inactief, niet meer in retrieval, wel zichtbaar

### 5.6 Conflict resolution
Bij twee regels die elkaar tegenspreken:
1. Most recent rule wint
2. Bij gelijke datum: hoogste confidence
3. Bij gelijke confidence: meest specifieke (bv per-klant > algemeen)

Dashboard toont conflicten zodat user kan kiezen welke blijft.

### 5.7 Inspecteerbaarheid
**Elke beslissing van de agent moet uitlegbaar zijn.** Dashboard heeft:
- Lijst van alle rules per company, sorteerbaar/filterbaar
- Per audit-log entry: welke rules zijn toegepast bij die actie
- "Why did the agent do X?" — terug-traceerbaar

## 6. Agent runtime

### 6.1 Architectuur
```
WhatsApp inbound
  ↓
[webhook] verify signature, idempotency check
  ↓
[message ingestion] save raw + transcribe audio if needed
  ↓
[context builder]
  - load company config
  - lookup user by phone, check permissions
  - load conversation history (summarized if >20 messages)
  - retrieve relevant wisdom rules
  ↓
[Claude call] system prompt + context + user message + tools
  ↓
[response handling]
  - if proposed action: save to actions table, send approval-request via WhatsApp
  - if direct answer: send WhatsApp message
  - if requires more info: send clarifying question
  ↓
[audit log]
```

### 6.2 Tool design
Tools zijn TypeScript functions met Zod schemas. Elke tool heeft:
- `read | write | execute` classification
- Permission requirements (which roles can trigger this)
- Audit log entry on every call
- Error handling met user-friendly fallback message

Tool lijst voor MVP:
- `search_customer(query)` → read
- `get_customer_history(customer_id)` → read
- `get_prices(query)` → read
- `transcribe_audio(audio_url)` → read (system-internal)
- `propose_invoice(customer_id, line_items, total)` → write (save to actions table)
- `execute_invoice(action_id)` → execute (requires approved status)

### 6.3 Streaming en latency
- WhatsApp heeft 24-uur conversation window — geen instant response nodig
- Maar gebruikers verwachten <30s response op een appje
- Agent runtime: max 20s budget. Bij timeout: graceful "Even kijken, ik kom zo terug"
- Background job continues, sends result als ready

### 6.4 Cost management
- Sonnet 4.6 voor reasoning + tool use
- Haiku 4.5 voor lichte taken (intent classification, summarization)
- Prompt caching (Anthropic native) voor system prompts + wisdom rules
- Token budget per agent-call: log voor cost monitoring

## 7. Onboarding-flow (MVP design)

Stappen die de nieuwe klant doorloopt:

1. **Account** — magic link email, geen wachtwoord
2. **Bedrijfsinfo** — naam, KVK, branche, BTW-tarief
3. **Moneybird koppelen** — OAuth flow, sync klanten + producten
4. **Eerste rules** — wizard vraagt 5 standaard rules uit
   (uurtarief, voorrijkosten, BTW-tarief, betaaltermijn, etc)
5. **Medewerkers** — voeg 06-nummers toe + rol per medewerker
6. **WhatsApp activeren** — DeltaAgents-nummer wordt gekoppeld; testbericht
7. **Klaar** — dashboard toont eerste taken

Inschatting: 20-30 minuten voor eerste setup, daarna agent gaat aan de slag.

## 8. Bestandsstructuur

```
app/
  page.tsx                  → waitlist LP (huidige live versie)
  layout.tsx                → fonts, metadata
  globals.css               → delta-design DNA tokens
  api/
    waitlist/route.ts       → email capture (live)
    wa/
      webhook/route.ts      → WhatsApp inbound (verify + dispatch)
      send/route.ts         → outbound helper (internal)
    moneybird/
      connect/route.ts      → OAuth init
      callback/route.ts     → OAuth callback (token exchange + encrypt + save)
      sync/route.ts         → manual re-sync trigger
    agent/
      run/route.ts          → manual trigger voor testing
  onboarding/               → wizard (te herschrijven in volgende sessie)
  dashboard/                → admin UI (te bouwen in volgende sessies)
  login/                    → magic link login

lib/
  supabase-client.ts        → browser SSR client (bestaand)
  supabase-server.ts        → server SSR client (bestaand)
  supabase-admin.ts         → service role client (nieuw)
  crypto.ts                 → AES-256-GCM voor OAuth tokens (nieuw)
  audit.ts                  → audit log helpers (nieuw, vervangt activity.ts deels)
  utils.ts                  → bestaand
  agent/
    runtime.ts              → Claude orchestratie
    prompts.ts              → system prompts
    tools.ts                → tool definitions + executors
    context.ts              → wisdom retrieval + history loading
  wisdom/
    store.ts                → CRUD op wisdom rules
    retrieval.ts            → semantic search via embeddings
    learning.ts             → user-correction detection + rule extraction
    decay.ts                → cron job voor confidence decay
  moneybird/
    client.ts               → OAuth + REST API wrapper
    sync.ts                 → klanten + producten sync logic
  whatsapp/
    verify.ts               → HMAC signature check
    client.ts               → Meta API wrapper
    transcribe.ts           → audio download + Anthropic transcribe
    templates.ts            → goedgekeurde template messages

types/
  index.ts                  → re-exports
  database.ts               → Supabase row types
  agent.ts                  → tool/action/conversation types
  moneybird.ts              → Moneybird API types
  whatsapp.ts               → Meta API types

supabase/
  migrations/
    001_initial.sql         → legacy (te negeren voor MVP)
    002_dashboard.sql       → deltaagents_* base tables
    003_mvp.sql             → MVP scenario tables (users, customers, products, ...)
    004_wisdom.sql          → wisdom rules tabel + pgvector setup
```

## 9. Wat NIET in deze architectuur

Bewust uit MVP gehouden, in latere fases:
- **Voice output** (alleen text/audio in, text out — voor MVP)
- **Image input** (foto's van werkbonnen, kapotte onderdelen)
- **Multi-agent collaboration** (één agent per klant, niet meerdere)
- **Custom AI model training** (alleen prompt + wisdom rules)
- **Real-time dashboard** (refresh werkt prima voor MKB-volume)
- **Mobile apps** (web-only, WhatsApp is de mobiele interface)

## 10. Open beslissingen

Punten waar later expliciet over besloten moet worden:

1. **Encryption key rotation strategy** — hoe vervang je TOKEN_ENCRYPTION_KEY
   zonder alle tokens te invalideren?
2. **Wisdom rule conflicts UX** — toont dashboard automatisch conflicten of
   alleen op verzoek?
3. **WhatsApp template vs free-form** — buiten 24u conversation window mag
   alleen template. Hoeveel templates pre-approven?
4. **Multi-instance per company** — kan een groot bedrijf meerdere agents
   willen (één voor planning, één voor facturatie)? MVP = nee.
5. **Pilot pricing** — gratis, gereduceerd, of vol tarief?
   Aanbeveling: €99/mnd voor pilot in ruil voor feedback-commitment.
