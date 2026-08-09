# RIDGE Attendance — GitHub + Netlify deployment

This version has a real shared backend (Netlify Blobs — built into every
Netlify site, no separate database account needed). Every device that opens
your Netlify URL reads and writes the same data.

## 1. Push this folder to GitHub

```bash
cd ridge-netlify
git init
git add .
git commit -m "RIDGE attendance app"
```
Create a new empty repo on GitHub (github.com → New repository), then:
```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## 2. Connect it to Netlify

1. Go to https://app.netlify.com → **Add new site → Import an existing project**
2. Choose **GitHub**, authorize it, and pick this repository
3. Build settings: leave them as detected (this project needs no build step —
   publish directory `.`, functions directory `netlify/functions`, both
   already set in `netlify.toml`)
4. Click **Deploy**

That's it — no environment variables, no database setup. Netlify installs
`@netlify/blobs` automatically and the function just works.

## 3. Use it

Netlify gives you a URL like `https://your-site-name.netlify.app`. Open that
on any phone or computer — Add user, Scan, and Entries all read/write the
same shared data through `/.netlify/functions/data`.

Every ~8 seconds each open tab quietly refreshes from the backend, so if
someone enrolls a user on one phone, it shows up on another shortly after
(or immediately on next reload).

## Notes

- **No login/auth** — anyone with your site URL can add users and log
  attendance. Fine for an internal tool; if you ever need it locked down,
  Netlify supports password-protecting a whole site (Site settings → Access
  control) as an easy option, or we can add per-admin auth later.
- Data lives in Netlify Blobs under the store name `ridge-attendance`. You
  can inspect/clear it from the Netlify dashboard under your site →
  **Blobs**.
- To test locally before deploying: install the Netlify CLI
  (`npm install -g netlify-cli`), then run `netlify dev` from this folder —
  it emulates both the static site and the function together.
