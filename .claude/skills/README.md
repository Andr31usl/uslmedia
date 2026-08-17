# Skill-uri de design (UI/UX Pro Max)

Set de skill-uri pentru Claude Code, instalate în proiect din
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

- **Versiune:** 2.13.0
- **Licență:** MIT (vezi `LICENSE-ui-ux-pro-max`)
- **Sursa exactă:** directorul `.claude/skills/` din repo-ul de mai sus

Fiind în `.claude/skills/`, Claude Code le încarcă automat când lucrezi în
acest repo — nu trebuie instalat nimic global.

## Ce conține

| Skill | La ce folosește |
|---|---|
| `ui-ux-pro-max` | Nucleul: bază de date căutabilă cu 79 de stiluri UI, 192 de palete, 74 de perechi de fonturi, 119 reguli UX, 25 de tipuri de grafice, 22 de stack-uri |
| `ui-styling` | Componente shadcn/ui, Tailwind, teme, dark mode, design pe canvas |
| `design-system` | Design tokens pe trei straturi (primitive → semantic → component), specificații de componente |
| `design` | Umbrelă peste identitate vizuală, logo-uri, CIP, bannere, iconuri |
| `brand` | Voce de brand, mesaje, consistență, ghiduri de stil |
| `banner-design` | Bannere pentru social media, ads, hero-uri, print |
| `slides` | Prezentări HTML cu Chart.js |

## Cum se folosește

Skill-urile se activează singure când ceri lucruri de design. Baza de date
poate fi interogată și direct (necesită doar Python 3, fără dependențe):

```bash
# stiluri potrivite pentru o secțiune
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hero agenție video" --domain style

# palete de culoare pentru o categorie de produs
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "marketing agency" --domain color

# perechi de fonturi
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "editorial modern" --domain typography

# sistem de design complet
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "site agenție video" --design-system
```

Site-ul e HTML + CSS scris de mână, fără build de framework, deci pentru
sugestii de cod folosește `--stack html-tailwind` doar ca referință de
pattern-uri; clasele Tailwind nu se aplică direct în `assets/styles.css`.

## Limitări cunoscute

`banner-design` și `design` fac referire la skill-urile `ai-artist`,
`ai-multimodal` și `chrome-devtools`, care **nu** fac parte din acest pachet.
Părțile lor de generare de imagini cu Gemini nu funcționează fără acele
skill-uri și fără un `GEMINI_API_KEY`. Restul (art direction, dimensiuni,
recomandări de stil) funcționează normal.

## Actualizare

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uipm
rm -rf .claude/skills/{ui-ux-pro-max,ui-styling,design-system,design,brand,banner-design,slides}
cp -R /tmp/uipm/.claude/skills/. .claude/skills/
cp /tmp/uipm/LICENSE .claude/skills/LICENSE-ui-ux-pro-max
```

Apoi actualizează numărul de versiune de mai sus.
