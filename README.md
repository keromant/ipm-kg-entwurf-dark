# Jana – Hauswirtschaft & Betreuungsdienst + Reinigungsservice

Statischer, mobile-first Website-Entwurf für die Marke **Jana** mit zwei Geschäftsbereichen:

1. **Hauswirtschaft & Betreuungsdienst** (Privatkunden – warm, persönlich, Telefon zuerst)
2. **Reinigungsservice** (B2B – Schule, Kita, Büro, Firma – nüchtern, „Angebot anfordern")

> ⚠️ **Repo-/Worker-Name:** Dieses Projekt liegt im Repo **`keromant/ipm-kg-entwurf-dark`**
> und wird über den bestehenden **Cloudflare Worker `ipm-kg-entwurf-dark`** ausgeliefert
> (`wrangler.jsonc`, `assets.directory: "."`). Name bewusst beibehalten, um die vorhandene
> Cloudflare-Verbindung weiterzunutzen – Inhalt ist jetzt Jana, nicht mehr ipm-KG.

## Tech
- Reines statisches HTML/CSS/JS, **kein Build-Schritt**.
- Multi-Page mit Ordner-`index.html` → saubere URLs (`/reinigung/schulreinigung/`).
- Root-absolute Pfade (`/assets/...`) – funktionieren am Domain-Root (Cloudflare) und lokalem Server.

## Struktur
```
index.html · hauswirtschaft/ · reinigung/{,schulreinigung,kindergartenreinigung,bueroreinigung,firmenreinigung}/
ueber-uns/ · kontakt/ · impressum/ · datenschutz/
assets/css/tokens.css   (Design-Tokens: 3-Schicht, Navy/Grün aus Logo)
assets/css/styles.css   (Layout + Komponenten + Interaktion)
assets/js/main.js       (ScrollSmoother-Init, Scroll-Reveal, Button-Sweep, Mobile-Nav)
assets/img/jana-logo-transparent.png
```

## Design / Interaktion
- Farben exakt aus dem Logo: Navy `#13305c` (Primär) + Grün `#7cb342` (Akzent), Off-White BG.
- Schriften: **Great Vibes** (nur Wortmarke „Jana"), **Montserrat** (Headlines),
  **Figtree** (Fließtext), **Nunito** (Buttons/Tags) – via Google Fonts.
- Interaktionssprache aus dem KoSta-Projekt übernommen:
  - **Buttons:** schräger Farb-Sweep (Hover), Aktion feuert erst nach der Sweep-Animation.
  - **Cards:** dauerhaftes Spotlight-Glow + federnder Pop-Hover (easeOutBack).
  - **Scroll-Reveal** via IntersectionObserver.
- **GreenSock ScrollSmoother** (weicher Trägheits-Scroll): Wrapper `#smooth-wrapper > #smooth-content`
  umschließt `main`+`footer`; fixierter Header und Sticky-Call liegen **außerhalb**. GSAP von
  jsDelivr-CDN. Respektiert `prefers-reduced-motion` (dann kein Smoother, keine Reveals/Sweeps).
- Telefon **0173 6171063** überall als `tel:`-Link; mobil prominenter Sticky-„Jetzt anrufen"-Button.

## Lokal testen
```
python -m http.server 8099   # im Projektordner
# http://localhost:8099/
```

## Deploy
Ausgeliefert über den bestehenden Cloudflare Worker `ipm-kg-entwurf-dark`.
Push auf `origin master` (GitHub `keromant/ipm-kg-entwurf-dark`); ist Workers-Builds-Git-Integration
aktiv, deployt der Push automatisch. Manueller Fallback: `npx wrangler deploy` (Cloudflare-Login nötig).

## Offene TODOs (im Code als `<!-- TODO -->` markiert)
- [ ] Exakte Leistungsbeschreibungen (Hauswirtschaft & Reinigung)
- [ ] Referenzen / Kundenlogos / Zitate (B2B) – aktuell Platzhalter
- [ ] Einzugsgebiet / Region für lokales SEO (Titles/Meta + Kontaktseite)
- [ ] Team-Fotos & Über-uns-Texte
- [ ] E-Mail-Adresse & vollständige Kontakt-/Impressumsdaten
- [ ] **Impressum & Datenschutz rechtlich prüfen** (Platzhalter-Gerüste, keine Rechtsberatung)
- [ ] Kontaktformular an Backend/Mailservice anbinden (`action`, Spam-Schutz)
- [ ] Optional: Empfehlung visueller Browser-Check des Smooth-Scrolls (kein Headless-Browser im Setup)
