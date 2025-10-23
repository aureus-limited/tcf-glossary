# The Carbon Foundation — Public Glossary (GitHub Pages)

A fast static glossary site (HTML/CSS/JS) published with GitHub Pages.

## Publish in minutes
1) Create a **public** repo (e.g., `tcf-glossary`).
2) Upload everything in this folder.
3) **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/` → **Save**.
4) Set your repo in `index.html`:
```html
<script>
  window.SITE = { owner: 'YOUR_GH_USERNAME_OR_ORG', repo: 'tcf-glossary', branch: 'main' };
</script>
```
5) Visit: `https://<your-username>.github.io/<repo>/`.

## Content edits
Edit `data/glossary.json` (the site auto-pulls it on refresh). Use PRs or the web editor.

## Local preview
Open `index.html` or run: `python3 -m http.server 8080`.

## License
MIT (see `LICENSE`).