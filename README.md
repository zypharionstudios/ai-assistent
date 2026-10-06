# Atelier — AI Studio

Ein privater, ChatGPT-inspirierter KI-Arbeitsbereich mit E-Mail-Code-Anmeldung, gespeicherten Unterhaltungen und mehreren API-Anbietern.

## Loslegen

1. Installiere Node.js 22.13 oder neuer (die App nutzt Node.js' eingebautes SQLite-Modul).
2. Trage API-Schlüssel und SMTP-Zugang in die `.env`-Datei im Projektordner ein. Sie ist lokal und wird von Git ignoriert.
3. Installiere Abhängigkeiten und starte die App:

   ```powershell
   npm install
   npm start
   ```

4. Öffne `http://localhost:3000`.

Ohne funktionierende SMTP-Einstellungen wird kein Anmeldecode ausgegeben oder angezeigt. Für den produktiven Betrieb empfiehlt sich HTTPS, ein echter SMTP-Anbieter sowie ein eigener, zufälliger `CODE_SECRET`-Wert.

## API-Schlüssel und Anbieter

Server-Schlüssel werden nur vom Node-Server gelesen und niemals an den Browser übertragen:

| Variable | Anbieter | API-Basis |
| --- | --- | --- |
| `GROQ_API_KEYS` | Groq | `https://api.groq.com/openai/v1` |
| `GEMINI_API_KEYS` | Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` |
| `OPENROUTER_API_KEYS` | OpenRouter | `https://openrouter.ai/api/v1` |
| `XKIRO_API_KEYS` | xKiro | `https://api.xkiro.com/v1` |
| `VIGGLE_API_KEYS` | Viggle H3 Video | `https://apis.viggle.ai/v1` |

Trage mehrere Schlüssel durch Kommas getrennt in die jeweilige Zeile ein, zum Beispiel `GEMINI_API_KEYS=schluessel1,schluessel2`. Leerzeichen um Kommas werden ignoriert. Die App verteilt Anfragen auf die eingerichteten Schlüssel und probiert bei Authentifizierungs-, Ratenlimit- oder Serverfehlern einen weiteren Schlüssel desselben Anbieters. Ältere nummerierte Felder bleiben kompatibel.

## Eigene und freigegebene API-Schlüssel

Angemeldete Nutzer können unter **Einstellungen → Deine privaten API-Schlüssel** eigene Groq-, Gemini-, OpenRouter-, xKiro- oder Viggle-Schlüssel speichern und wieder löschen. Eigene Schlüssel funktionieren auch dann, wenn die entsprechenden allgemeinen `*_API_KEYS`-Einträge in der `.env` leer sind. Sie werden mit AES-256-GCM verschlüsselt in der lokalen Datenbank gespeichert und weder beim Anzeigen noch in API-Antworten offengelegt. Dafür muss `API_KEYS_ENCRYPTION_SECRET` in `.env` auf einen eigenen zufälligen Wert mit mindestens 32 Zeichen gesetzt sein. Der bereits lokal gesetzte Wert sollte bei einem Umzug zusammen mit `data/chat.sqlite` sicher übernommen werden; ohne denselben Wert lassen sich die gespeicherten Schlüssel nicht mehr entschlüsseln.

Für nur bestimmte Personen gedachte Server-Schlüssel verwendest du stattdessen `SECRET_GROQ_API_KEYS`, `SECRET_GEMINI_API_KEYS`, `SECRET_OPENROUTER_API_KEYS`, `SECRET_XKIRO_API_KEYS` oder `SECRET_VIGGLE_API_KEYS`. Trage die erlaubten, verifizierten E-Mail-Adressen kommasepariert in `SECRET_API_KEYS_ALLOWED_EMAILS` ein, zum Beispiel:

```env
SECRET_API_KEYS_ALLOWED_EMAILS=du@example.com,team@example.com
SECRET_GROQ_API_KEYS=key1,key2
SECRET_GEMINI_API_KEYS=
SECRET_OPENROUTER_API_KEYS=
SECRET_XKIRO_API_KEYS=
SECRET_VIGGLE_API_KEYS=
```

Nur Konten mit einer in dieser Liste stehenden E-Mail-Adresse erhalten Zugriff auf diese zusätzlichen Schlüssel. Teammitglieder sehen alle vier Anbieter separat mit einem Schloss-Symbol; nicht eingerichtete Team-Schlüssel werden als fehlend angezeigt und können nicht ausgewählt werden. Zusätzlich gibt es **Team Auto**, das ausschließlich tatsächlich eingerichtete und für dieses Konto freigegebene `.env`-Schlüssel verwendet. Das normale **Auto** bleibt davon getrennt und verwendet nur allgemeine oder eigene Schlüssel. Allgemeine `GROQ_API_KEYS` usw. bleiben für alle angemeldeten Konten verfügbar. In einer lokalen `.env` werden Änderungen an Freigabeliste und Team-Schlüsseln laufend neu gelesen; bei Vercel musst du die geänderten Umgebungsvariablen speichern und neu deployen.

Unter **Einstellungen → Sprache und Antworten** kann jedes Konto die Oberflächensprache (Deutsch oder Englisch), den Antwortstil und eigene Antwortwünsche speichern. Diese Einstellungen gelten kontoübergreifend für die Modellantworten des jeweiligen Nutzers und werden nicht mit anderen Konten geteilt.
Die vollständige xKiro-Modellliste wird über das mehrzeilige `XKIRO_MODELS="..."` gepflegt. Sie kann Modell-IDs jeweils in einer eigenen Zeile oder kommasepariert enthalten. OpenRouter zeigt ausschließlich Modelle mit `:free`-ID oder mit einem vom Modellkatalog ausgewiesenen Preis von null an.

Die App fragt die Modellliste eines eingerichteten Anbieters ab. Wenn das nicht klappt, zeigt sie eine kleine Auswahlliste üblicher Modelle an. Im Modellauswahlfeld sucht **Auto** für Text nach einem passenden Standardmodell und für explizite Bild-/Video-Prompts nach Modellen, deren IDs auf Mediengenerierung hindeuten.
Der Schalter **Deep Think** ergänzt bei Textanfragen eine Anweisung für besonders sorgfältiges Prüfen und eine knappe Begründung; er fordert keine verborgenen Gedankengänge an.
Während Text-, Bild- oder Videogenerierung läuft, ersetzt **Stoppen** die Senden-Schaltfläche. Der Abbruch wird an den Server und, soweit vom Anbieter unterstützt, an die Provider-Anfrage weitergegeben; bereits empfangener Antworttext bleibt im Chat erhalten.
Wenn **Deep Think** aktiv ist, kann die App zusätzlich bis zu vier deiner anderen Chats als begrenzten Kontext berücksichtigen. Die **Websuche** fragt DuckDuckGo nach aktuellen Treffern, übermittelt diese an das gewählte Modell und zeigt gefundene Quellen unter der Antwort an. Chats lassen sich per Rechtsklick oder langem Druck auf dem Chatnamen umbenennen.
Das helle/dunkle Design wird im Browser gespeichert. Die verifizierte Anmeldung bleibt standardmäßig 30 Tage erhalten; Chats bleiben in der Datenbank gespeichert.

## Nutzungslimits und Team-Admin

Normale Konten erhalten standardmäßig pro ausgerichtetem 12-Stunden-Zeitraum 20 Textnachrichten, 4 Bildgenerierungen und 1 Videogenerierung. Die Anzeige oben rechts zeigt die verfügbaren Kontingente; die API prüft und verbucht jeden Aufruf serverseitig in SQLite. Erschöpfte Kontingente werden mit HTTP 429 abgelehnt, bevor die Nachricht im Chat gespeichert wird. Teammitglieder aus `SECRET_API_KEYS_ALLOWED_EMAILS` haben unbegrenzte Nutzung.

Teammitglieder können in **Einstellungen → Nutzungsverwaltung · Team-Admin** die Limits und das Reset-Intervall für alle normalen Konten konfigurieren oder die Limits global vorübergehend ausschalten. Dort lassen sich außerdem einmalige Zusatzkontingente für eine E-Mail-Adresse vergeben. Diese Credits werden erst nach dem regulären Kontingent eingesetzt und beim Reset nicht erneuert. Nicht verbrauchte Credits können vom Team-Admin wieder entfernt werden. Die Einstellungen, Zähler und Credits bleiben in `data/chat.sqlite` gespeichert.

## Bild und Video

- `/generate foto <Prompt>` oder `/generate bild <Prompt>` startet die Bildgenerierung mit einem zum Anbieter passenden API-Endpunkt.
- Wenn ein Bildmodell fehlschlägt oder kein Bild zurückgibt, probiert Atelier weitere eingerichtete Bildmodelle und Anbieter. Gemini-Bilder werden über den nativen `generateContent`-Endpunkt angefordert.
- `/generate vid <Prompt>` oder `/generate video <Prompt>` startet eine Videogenerierung. Wenn der ausgewählte Anbieter oder das Modell fehlschlägt, versucht die App weitere verfügbare Videomodelle und Anbieter. Viggle wird als Text-zu-Video-Fallback verwendet, wenn ein Viggle-Schlüssel im ausgewählten Schlüsselbereich verfügbar ist.
- Viggle verwendet die offizielle asynchrone API V1 unter `https://apis.viggle.ai/v1/videos`, pollt den Status bis zur fertigen MP4 und unterstützt reine Text-Prompts (H3). Lege Schlüssel über `VIGGLE_API_KEYS`, `SECRET_VIGGLE_API_KEYS` oder als persönlichen Schlüssel in den Einstellungen ab. Die Viggle-API ist nutzungs-/creditbasiert; Videojobs können Kosten verursachen.
- „Bild erstellen“ und „Video erstellen“ im Komponieren-Menü fügen den jeweiligen Befehl ein.
- Andere Videoanbieter werden über ihren kompatiblen `/videos`-Endpunkt versucht. Nicht standardisierte oder nicht unterstützte Endpunkte werden übersprungen, damit der nächste verfügbare Anbieter getestet werden kann.

## Speicherung und Anmeldung

Die E-Mail-Adresse wird per zeitlich begrenztem Einmalcode verifiziert. Chats und Nachrichten liegen in `data/chat.sqlite`; Sitzungstoken werden serverseitig nur gehasht gespeichert. Codes sind zehn Minuten gültig und pro Adresse/IP begrenzt. SMTP wird über `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` und `SMTP_FROM` konfiguriert.

## Impressum

Das Impressum ist unter `/impressum.html` erreichbar. Prüfe vor einer öffentlichen Bereitstellung, dass Name, vollständige ladungsfähige Anschrift und Kontaktangaben korrekt sind. Die Impressumsseite ist eine allgemeine Vorlage und keine individuelle Rechtsberatung.

## Produktionshinweise

Die Anwendung kann als dauerhafter Node.js-Webdienst auf einem Node-Hoster oder per Docker betrieben werden. Für produktiven Betrieb brauchst du HTTPS, einen SMTP-Anbieter für die Anmeldung und sichere Umgebungsvariablen für die Schlüssel. API-Schlüssel gehören nicht in Frontend-Dateien oder ins öffentliche Repository.

### Auf Render veröffentlichen

Im Repository liegt eine `render.yaml`-Blueprint-Konfiguration:

1. Lade das Projekt in ein privates GitHub-Repository hoch und verbinde das Repository in Render über **New → Blueprint**.
2. Render erkennt `render.yaml` und richtet den Node-Webdienst samt `/healthz`-Prüfung und dauerhaftem Datenträger unter `/data` ein. Für dauerhaften Speicher ist ein kostenpflichtiger Render-Datenträger erforderlich.
3. Ergänze im Render-Dashboard die abgefragten Provider-Keys, SMTP-Zugangsdaten und – falls benötigt – `SECRET_API_KEYS_ALLOWED_EMAILS` samt Team-Keys. Die Werte bleiben Server-Umgebungsvariablen; trage sie nicht in den Quellcode ein.
4. Die Werte `CODE_SECRET` und `API_KEYS_ENCRYPTION_SECRET` werden von Render zufällig erstellt. Bewahre `API_KEYS_ENCRYPTION_SECRET` dauerhaft auf: Ein Austausch dieses Wertes verhindert, dass bereits gespeicherte private API-Keys entschlüsselt werden können.
5. Nach dem Deployment öffnest du die von Render angezeigte URL. Für eine eigene Domain kannst du diese anschließend in den Domaineinstellungen des Dienstes verbinden.

Die Render-Konfiguration startet einen einzelnen Webdienst mit SQLite-Datei `/data/chat.sqlite`. Lass mindestens eine Instanz laufen und lösche oder ersetze den Datenträger nicht, sonst gehen Konten, Chats, Nutzungseinstellungen und gespeicherte private Schlüssel verloren. Wenn du Render später neu verbindest oder migrierst, müssen `API_KEYS_ENCRYPTION_SECRET` und die Datenbank zusammen erhalten bleiben. Der E-Mail-Code-Login funktioniert erst, wenn SMTP korrekt eingetragen ist.

Für Render Free gibt es keinen persistenten Datenträger. Wenn `DATABASE_PATH` auf einen nicht beschreibbaren Pfad wie `/app/data/chat.sqlite` zeigt, startet der Server mit einer gut sichtbaren Warnung ersatzweise mit einer temporären SQLite-Datei im System-Temp-Ordner. Dabei können Daten bei Neustart oder Redeploy verloren gehen. Setze für einen kostenlosen Test `DATABASE_PATH=/tmp/chat.sqlite`; für dauerhafte Daten muss ein beschreibbarer Datenträger unter `/data` gemountet und `DATABASE_PATH=/data/chat.sqlite` gesetzt sein.

### Mit Docker oder Docker Compose hosten

1. Lege eine `.env`-Datei aus `.env.example` an, trage einen zufälligen `CODE_SECRET`, einen zufälligen `API_KEYS_ENCRYPTION_SECRET` mit mindestens 32 Zeichen sowie SMTP und gewünschte Provider-Keys ein.
2. Starte Docker Compose auf dem Server:

   ```sh
   docker compose up -d --build
   ```

3. Öffne Port `3000` oder setze `HOST_PORT`, zum Beispiel `HOST_PORT=8080 docker compose up -d --build`. Für öffentlich erreichbare Seiten richte HTTPS über einen Reverse Proxy oder den Hoster ein.

Compose speichert die SQLite-Datei in einem persistenten Docker-Volume und startet den Dienst nach einem Neustart automatisch. Lege zusätzlich regelmäßige, konsistente Backups des Volumes an. Bei einem Hoster mit eigener Port- und Datenträgerverwaltung verwende das Dockerfile, setze `DATABASE_PATH` auf einen Pfad im persistenten Datenträger und lass den Hoster seinen `PORT` an den Prozess weitergeben. Hinter einem vertrauenswürdigen einzelnen Hoster-Proxy aktiviere `TRUST_PROXY=true`, damit IP-basierte Anmeldebegrenzungen die echte Client-IP nutzen.

Die Nutzungslimits und Login-Versuchsgrenzen liegen derzeit teilweise im Arbeitsspeicher. Deshalb sollte diese SQLite-Version mit genau einer Serverinstanz betrieben werden; mehrere parallele Instanzen teilen weder alle Limits noch sicher ihre SQLite-Datei.

### Auf Vercel veröffentlichen

Vercel stellt Frontend und API-Endpunkte bereit; die dauerhafte Express-/SQLite-Anwendung läuft als Backend auf Render. Der Vercel-API-Proxy leitet `/api/*` über dieselbe Domain weiter, damit Anmeldung, Cookies und Streaming funktionieren. Die SQLite-Datei braucht weiterhin den persistenten Render-Datenträger.

1. Veröffentliche zuerst das Repository mit **New → Blueprint** auf Render und warte, bis der Dienst aus `render.yaml` erreichbar ist. Das Backend benötigt den dort konfigurierten persistenten Datenträger.
2. Importiere dasselbe Repository in Vercel. Das Projekt enthält bereits `vercel.json`: Vercel veröffentlicht `public/` als Website und baut `api/[...path].js` als Weiterleitung zum Backend. Falls Vercel nach dem Framework fragt, wähle **Other** und ändere das Ausgabeverzeichnis nicht.
3. Trage in **Vercel → Project → Settings → Environment Variables** `BACKEND_URL` mit der vollständigen Render-Service-URL ein, z. B. `https://atelier-ai.onrender.com`. Nur den Ursprung eintragen, ohne `/api`, Pfad oder abschließende Route. Danach neu deployen.
4. API-Schlüssel, `SMTP_*`, `CODE_SECRET`, `API_KEYS_ENCRYPTION_SECRET`, `DATABASE_PATH`, Team-Allowlist und Team-Keys bleiben in **Render → Environment**. Die Vercel-Seite bekommt keine Provider-Schlüssel.
5. Öffne die Vercel-Domain. Teste Anmeldung, Chat-Speicherung und API-Modellabruf. Stelle sicher, dass SMTP in Render eingerichtet ist, bevor du die Anmeldung verwendest.

Der Render-Datenträger muss dauerhaft aktiv bleiben; ohne ihn gehen Datenbank und gespeicherte Chats verloren. Sichere Datenbank und `API_KEYS_ENCRYPTION_SECRET` gemeinsam. Deploye Vercel und Render als zwei Dienste aus demselben Repository: Vercel hostet die Oberfläche und proxyt API-Anfragen, Render führt den zustandsbehafteten Server aus. Das Vercel-Projekt allein ersetzt das Backend und dessen dauerhaften Datenträger nicht.

Lange Bild-/Video-Aufträge können die maximale Laufzeit deines Vercel-Tarifs überschreiten. `vercel.json` setzt für den Proxy 300 Sekunden; ob dieser Wert verfügbar ist, hängt vom Vercel-Tarif ab. Bei abgebrochenen langen Anfragen verwende einen Tarif mit ausreichender Function-Laufzeit oder starte Videoaufträge über ein asynchrones Job-System.
