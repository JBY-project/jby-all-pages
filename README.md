# Jeff Brown Yachts — full page source (duplicate)

Complete duplicate of the JBY page work, collected 2026-08-31.
This is a **copy for handoff**. The live sites keep running from their original
per-page repositories under the `ywteamyw` account — those are untouched.

- `pages/` — one folder per page or variant (47 total). Each is a standalone static site: open `index.html`.
- `extras/` — Figma-board scripts, the standalone intro animation, loose drafts, design docs.

## Live URL for each page

Folders that correspond to a published page:

| Folder in `pages/` | Live URL |
|---|---|
| `Jeff Brown Yachts - 404 Page` | https://ywteamyw.github.io/jby-404 |
| `Jeff Brown Yachts - About Us Page` | https://ywteamyw.github.io/jby-about |
| `Jeff Brown Yachts - All Services Page` | https://ywteamyw.github.io/jby-all-services |
| `Jeff Brown Yachts - Brand Page (Axopar)` | https://ywteamyw.github.io/jby-axopar |
| `Jeff Brown Yachts - Events Page` | https://ywteamyw.github.io/jby-events |
| `Jeff Brown Yachts - FAQ Page` | https://ywteamyw.github.io/jby-faq |
| `Jeff Brown Yachts - Home Page (Intro Animation)` | https://ywteamyw.github.io/jby-home-intro |
| `Jeff Brown Yachts - Home Page (Intro V2 Logo Only)` | https://ywteamyw.github.io/jby-home-intro-v2 |
| `Jeff Brown Yachts - Home Page V1` | https://ywteamyw.github.io/jby-home-v1 |
| `Jeff Brown Yachts - Home Search` | https://ywteamyw.github.io/jby-search |
| `Jeff Brown Yachts - Knowledge Center V2` | https://ywteamyw.github.io/jby-knowledge-center |
| `Jeff Brown Yachts - Knowledge Center V3` | https://ywteamyw.github.io/jby-knowledge-center-v3 |
| `Jeff Brown Yachts - Knowledge Center V4` | https://ywteamyw.github.io/jby-knowledge-center-v4 |
| `Jeff Brown Yachts - Knowledge Center` | https://ywteamyw.github.io/jby-news-media |
| `Jeff Brown Yachts - Listing Page` | https://ywteamyw.github.io/jby-listing |
| `Jeff Brown Yachts - Locations Page` | https://ywteamyw.github.io/jby-locations |
| `Jeff Brown Yachts - Marketing Section Variants` | https://ywteamyw.github.io/jby-marketing-variants |
| `Jeff Brown Yachts - Mega Menu` | https://ywteamyw.github.io/jby-mega-menu |
| `Jeff Brown Yachts - Office Page` | https://ywteamyw.github.io/jby-office |
| `Jeff Brown Yachts - Privacy Policy Page` | https://ywteamyw.github.io/jby-privacy-policy |
| `Jeff Brown Yachts - Sell Your Yacht Page V2` | https://ywteamyw.github.io/jby-sell-your-yacht-v2 |
| `Jeff Brown Yachts - Sell Your Yacht Page V3` | https://ywteamyw.github.io/jby-sell-your-yacht-v3 |
| `Jeff Brown Yachts - Sell Your Yacht Page` | https://ywteamyw.github.io/jby-sell-your-yacht |
| `Jeff Brown Yachts - Service & Maintenance Page V2` | https://ywteamyw.github.io/jby-service-maintenance-2 |
| `Jeff Brown Yachts - Service & Maintenance Page` | https://ywteamyw.github.io/jby-service-maintenance |
| `Jeff Brown Yachts - Site Hub` | https://ywteamyw.github.io/jby-site |
| `Jeff Brown Yachts - Statement of Information Page` | https://ywteamyw.github.io/jby-statement-of-information |
| `Jeff Brown Yachts - Team Member Page` | https://ywteamyw.github.io/jby-team-member |
| `Jeff Brown Yachts - Team Page` | https://ywteamyw.github.io/jby-team |
| `Jeff Brown Yachts - Terms Page` | https://ywteamyw.github.io/jby-terms-and-conditions |
| `Jeff Brown Yachts - Testimonials V2` | https://ywteamyw.github.io/jby-testimonials-v2 |
| `Jeff Brown Yachts - Testimonials Variants` | https://ywteamyw.github.io/jby-testimonial-variants |
| `Jeff Brown Yachts - Yacht Management Page` | https://ywteamyw.github.io/jby-yacht-management |
| `riva-112-model-page` | https://ywteamyw.github.io/model-page |

## Folders with no published page

Local-only versions and working copies:

- `JBY-About-Us`
- `JBY-Home-Page`
- `JBY-Home-V3.31 4`
- `JBY-Home-V3.31-SHIPPED`
- `Jeff Brown Yachts - Contact Page`
- `Jeff Brown Yachts - Home Page`
- `Jeff Brown Yachts - Home Page (Crisp Chat V2)`
- `Jeff Brown Yachts - Home Page (Crisp Chat)`
- `Riva-112-Dolcevita-Super`
- `Riva-112-Dolcevita-Super 2`
- `jby-hero-riva-como`
- `jby-search`
- `jby-yacht-management`

## Notes

- Large asset `pages/JBY-Home-V3.31 4/JBY-V3.3-assets/feature_video_user.mov` (174 MB) is stored via **Git LFS**. Run `git lfs install` before cloning, or it arrives as a pointer file.
- Git history of the original per-page repos is not included here; this is a flat snapshot of the working files.
- The packaged `*.zip` dev handoffs are not in this repo: each one is a zipped copy of a folder that is already here.

## Entry file per folder

Most folders open at `index.html`. These do not:

| Folder in `pages/` | Open this file |
|---|---|
| `JBY-About-Us` | `about.html` |
| `JBY-Home-Page` | `JBY-Home.html` |
| `JBY-Home-V3.31 4` | `JBY-Home.html` |
| `JBY-Home-V3.31-SHIPPED` | `JBY-Home.html` |
| `Jeff Brown Yachts - Contact Page` | `JBY-Contact.html` |
| `Jeff Brown Yachts - Home Page` | `JBY-Home.html` |
| `Jeff Brown Yachts - Home Page (Crisp Chat V2)` | `JBY-Home.html` |
| `Jeff Brown Yachts - Home Page (Crisp Chat)` | `JBY-Home.html` |
| `jby-hero-riva-como` | not a page — hero-image assets plus `generator.py` |
