# Kaivo: deploy steps (run these in your own terminal)

Kaivo is a Next.js 16 app. The code is on GitHub at https://github.com/triozen-tech/kaivo-demo. Local commands run from the project folder:

```bash
cd "/Users/hosanna/3D Websites/kaivo"
```

The site is set to **noindex** (robots.txt disallows everything and every page carries a noindex tag), so a demo link will not show up in search.

## 0. Check the production build locally first (port 3019)

```bash
npm install          # only the first time
npm run build
npm start            # serves on http://localhost:3019  (PORT=4000 npm start for another port)
```

Open http://localhost:3019 and click through. Stop with `Ctrl+C`.

## A. Vercel (main option, from GitHub)

1. In Vercel choose **Add New**, then **Project**.
2. Import **triozen-tech/kaivo-demo**.
3. Framework is **Next.js** (detected automatically); leave the other settings as they are.
4. Click **Deploy**.

Every push to `main` redeploys the site automatically.

Notes:
- Optional: to make the share preview image use your final address, add `NEXT_PUBLIC_SITE_URL` (for example `https://kaivo-demo.vercel.app`) under the project's Settings > Environment Variables, then redeploy. Without it the app uses Vercel's own production URL automatically.
- A Vercel preview deployment may ask visitors to log in if "Deployment Protection" is on for your account. If your client sees a login page on a preview link, send them the production link, or turn protection off in the project's Settings > Deployment Protection.

### Remove the Vercel deployment afterwards

```bash
npx vercel remove kaivo-demo --yes    # deletes the project and all its deployments
npx vercel ls                         # should no longer list kaivo-demo
```

(You can also delete it in the dashboard: vercel.com > kaivo-demo > Settings > Delete Project.)

## B. Backup: a temporary public link from your Mac (cloudflared)

Use this if Vercel is not available. The link works only while your Mac is on, awake and the two terminals stay open.

```bash
brew install cloudflared              # only the first time
```

Terminal 1: the production server

```bash
cd "/Users/hosanna/3D Websites/kaivo"
npm run build
npm start                             # http://localhost:3019
```

Terminal 2: the quick tunnel (no account, no login)

```bash
cloudflared tunnel --url http://localhost:3019
```

After a few seconds it prints a line like `https://random-words.trycloudflare.com`. That is the public link. It changes every time you start the tunnel.

Notes:
- Keep the Mac awake while sharing (`caffeinate -dis` in a third terminal helps).
- Open the link yourself once before sending it.

### Remove the tunnel afterwards

- In Terminal 2 press `Ctrl+C`: the link stops working immediately.
- In Terminal 1 press `Ctrl+C` to stop the server.
- Nothing is stored anywhere else; there is nothing to delete.
