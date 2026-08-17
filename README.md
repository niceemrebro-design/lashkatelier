# Lash Katelier — Website

Statische Website für ein Studio für Wimpernverlängerung, Lash Lifting und
Augenbrauen. Kein Build-Schritt, kein Framework, keine externen Requests:
drei HTML-Dateien, ein Stylesheet, eine JS-Datei, lokale Schriften.

```
index.html            Startseite mit allen Abschnitten
impressum.html        Pflichtangaben (Vorlage)
datenschutz.html      Datenschutzerklärung (Vorlage)
assets/css/styles.css Design-Tokens und alle Komponenten
assets/css/fonts.css  @font-face für die lokalen Schriften
assets/js/main.js     Navigation, Farbschema, Formular
assets/fonts/         Fraunces und Figtree, je variabel (woff2)
assets/img/           Fotos — noch leer, siehe unten
assets/favicon.svg    Wimpern-Signet
```

## Lokal ansehen

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Direktes Öffnen der Datei per `file://` funktioniert auch, die Schriften
werden dann aber je nach Browser blockiert.

## Vor dem Livegang ausfüllen

Alle noch offenen Stellen sind im Quelltext mit `class="todo"` markiert und
erscheinen auf der Seite in Granat mit gestrichelter Unterstreichung. So
findest du sie:

```bash
grep -rn 'class="todo"' *.html
```

Nach dem Eintragen jeweils nur das `<span class="todo">…</span>` entfernen,
der Text bleibt stehen.

| Wo | Was |
| --- | --- |
| `index.html`, Hero | Stadt |
| `index.html`, Preise | Stand der Preisliste (Monat / Jahr) |
| `index.html`, Atelier | Jahr der Eröffnung |
| `index.html`, Kontakt | Strasse, PLZ, Ort, Telefonnummer |
| `impressum.html` | vollständig — Name, Anschrift, USt-ID, Gewerbeamt |
| `datenschutz.html` | Hoster, Löschfrist der Logfiles, Aufsichtsbehörde |

Ausserdem ohne `todo`-Markierung anzupassen, weil dort plausible Vorgaben
stehen, die trotzdem stimmen müssen:

- **Preise** in `index.html` (Abschnitt `id="preise"`)
- **Öffnungszeiten** in `index.html` (Abschnitt `id="kontakt"`)
- **E-Mail-Adresse** `hallo@lashkatelier.de` — kommt in `index.html`,
  `impressum.html`, `datenschutz.html` und in `assets/js/main.js`
  (Konstante `MAIL_TO`) vor
- **Instagram-Handle** `@lashkatelier`
- **Domain** in `<link rel="canonical">`, den Open-Graph-Tags und im
  JSON-LD-Block am Ende von `index.html`
- **Adresse und Öffnungszeiten im JSON-LD** — Google liest diesen Block für
  die lokale Suche aus, er muss zur Kontaktseite passen

## Fotos einsetzen

Die Bildstrecke im Abschnitt „Atelier" erwartet vier Dateien:

```
assets/img/arbeit-01.jpg    Klassisch 1:1
assets/img/arbeit-02.jpg    Volumen
assets/img/arbeit-03.jpg    Browlifting
assets/img/atelier-01.jpg   Arbeitsplatz
```

Hochformat 4:5, etwa 800 × 1000 px, unter 200 KB. Fehlt eine Datei, zeigt der
Rahmen automatisch einen gestrichelten Platzhalter mit Beschriftung — die
Seite bleibt also heil, solange noch nichts da ist. Die `alt`-Texte in
`index.html` bitte an das tatsächliche Motiv anpassen.

Für Fotos von Kundinnen braucht es eine schriftliche Einwilligung; der
entsprechende Abschnitt steht bereits in der Datenschutzerklärung.

## Anfrageformular

Das Formular kommt ohne Server aus: Beim Absenden baut `main.js` eine fertige
E-Mail und öffnet das Mailprogramm der Besucherin. Es werden keine Daten
übertragen, deshalb ist auch kein Auftragsverarbeitungsvertrag nötig.

Wer stattdessen einen Formulardienst nutzen möchte, trägt die Adresse in
`assets/js/main.js` ein:

```js
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Dann wird das Formular normal per POST abgeschickt. In dem Fall gehört ein
Abschnitt über diesen Dienstleister in die Datenschutzerklärung.

## Datenschutz

Die Seite lädt nichts von fremden Servern:

- Schriften liegen unter `assets/fonts/` und werden lokal ausgeliefert. Eine
  Einbindung über das Google-Fonts-CDN wäre ohne Einwilligung angreifbar
  (LG München I, Urteil vom 20.01.2022, 3 O 17493/20).
- Keine Cookies, kein Tracking, keine Karten- oder Social-Media-Einbettung.
  Instagram ist nur verlinkt.
- Deshalb ist kein Cookie-Banner nötig. Das ändert sich, sobald ein
  Buchungstool, eine Google-Map oder ein Analysedienst eingebunden wird.

Im Browser wird lediglich die gewählte Farbeinstellung unter dem Schlüssel
`lk-theme` in `localStorage` abgelegt.

Impressum und Datenschutzerklärung sind Vorlagen und ersetzen keine
Rechtsberatung.

## Gestaltung

Zwei Schriften, eine Akzentfarbe, klare Blöcke. Hierarchie entsteht über
Schriftgewicht und Fläche — nicht über einen dritten Schriftwechsel.

- **Schriften** Fraunces für Überschriften, Zahlen und Preise, Figtree für
  Lauftext, Labels und Bedienelemente. Beide variabel, beide lokal, zusammen
  164 KB. Kursive Schnitte sind absichtlich nicht dabei: Sie kosteten 152 KB
  und wurden nur für zwei Wörter gebraucht. Betonung läuft über Gewicht und
  Farbe, `font-synthesis: none` verhindert eine gefälschte Schräge.
- **Farben** Porzellan `#f2f1f3`, Papier `#ffffff`, abgesenktes Band
  `#eae8ec`, Tinte `#16141a`, Lauftext `#3c3646`, Nebentext `#635d6a`, Granat
  `#6b2f44`. Der Dunkelmodus hat eine eigenständige Abstufung, er ist nicht
  invertiert.
- **Aufbau** Eine Inhaltsspalte, keine Marginalie. Jeder Abschnitt beginnt mit
  einer Marke aus Nummer, Name und Linie (`.label`) — die steht im Textfluss
  und ist deshalb auch auf dem Telefon sichtbar. Abschnitte wechseln zwischen
  Grundfläche und abgesenktem Band, damit sie sich voneinander abheben.
- **Flächen** Leistungen, Pflegehinweise und das Formular sitzen in Karten
  bzw. Tafeln auf weissem Grund (`.card`, `.panel`). Das ersetzt die frühere
  Trennung nur über Haarlinien, bei der alle Abschnitte gleich aussahen.
- **Signet** Die Lash Map im Kopfbereich ist das Diagramm, das vor jedem Set
  tatsächlich gezeichnet wird: sieben Zonen, Längen von 9 bis 12 mm. Sie
  zeichnet sich beim Laden von innen nach aussen auf — Lidkante, Wimpern,
  Zonengrenzen, Beschriftung. Bei `prefers-reduced-motion` erscheint sie
  sofort fertig.

Farben und Schriftgrössen stehen als Custom Properties am Anfang von
`styles.css`. Wer die Palette ändern will, ändert dort die Werte in `:root`
und die gleichen Namen in den beiden Dunkelmodus-Blöcken.

Zwei Stellen sind auf die Schrift eingemessen und müssen beim Ändern von Text
oder Schrift neu geprüft werden: `--t-h1` (die Hero-Überschrift darf nicht
breiter werden als ihre Spalte) und die weichen Trennstellen `&shy;` in
`Milli&shy;meter&shy;arbeit`, die nur unterhalb von 30 em greifen.

## Barrierefreiheit

Sprungmarke zum Inhalt, sichtbarer Fokusrahmen, beschriftete Bedienelemente,
FAQ über natives `<details>`, Lash Map mit `<title>`/`<desc>`, Bewegung nur
ausserhalb von `prefers-reduced-motion`. Nach inhaltlichen Änderungen lohnt
ein Kontrastcheck, vor allem wenn der Akzent angepasst wird.

## Veröffentlichen

Die Seite besteht nur aus statischen Dateien und läuft auf jedem Webspace —
Ordner hochladen, fertig.

Für GitHub Pages: unter *Settings → Pages* als Quelle den Branch wählen und
`/` als Verzeichnis. Danach ist die Seite unter
`https://<benutzer>.github.io/lashkatelier/` erreichbar. Bei eigener Domain
zusätzlich eine Datei `CNAME` mit dem Domainnamen anlegen.
