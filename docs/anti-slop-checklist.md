# Anti-slop checklist

Language: English only. No emoji.

Matches `PROJECT_SPEC.md` section 11 (Explicit bans). Use before shipping any marketing or report UI that consumes these tokens.

Check a row only when verified on the target surface (landing, analyze, report).

Landing + report verification recorded in `docs/visual-qa-v1.md` (2026-11-06): all applicable B/R items PASS.

## Banned patterns (must FAIL the ship if present)

| ID | Ban | Spec alignment |
| --- | --- | --- |
| B01 | Purple-on-white or purple-to-indigo gradient themes | PROJECT_SPEC bans |
| B02 | Warm cream background near `#F4F1EA` + terracotta accent + default serif artisan kit as the brand look | PROJECT_SPEC bans |
| B03 | Broadsheet hairline newspaper pastiche as the default look | PROJECT_SPEC bans |
| B04 | Gradient text | PROJECT_SPEC bans |
| B05 | Multi-layer glow shadow stacks | PROJECT_SPEC bans |
| B06 | Rounded-full pill clusters | PROJECT_SPEC bans |
| B07 | Emoji in UI, docs, commits, or as icons | RULES + PROJECT_SPEC |
| B08 | Placeholder / lorem copy shipped | PROJECT_SPEC bans |
| B09 | Stock illustration collage as the hero visual | PROJECT_SPEC bans |
| B10 | Generic feature-card grid in the hero | PROJECT_SPEC bans |
| B11 | Detached floating badges, stickers, or promo chips on hero media | PROJECT_SPEC bans |
| B12 | Inter, Roboto, Arial, or system-ui as the brand / display face | PROJECT_SPEC typography |
| B13 | Pure `#000000` large background fields | PROJECT_SPEC color |
| B14 | Definitive "cheater" label without band + methodology | PROJECT_SPEC ethics |
| B15 | Second accent color competing with felt green | tokens meta |

## Required positives (must PASS)

| ID | Requirement |
| --- | --- |
| R01 | Visual direction reads as Ink and Felt (cool chalk / ink, single emerald felt accent) |
| R02 | At most two type families for brand+body; mono only for data |
| R03 | Spacing uses the 4-based scale from tokens |
| R04 | Light and dark themes use the shared CSS variable names |
| R05 | Elevation prefers border + one restrained shadow |
| R06 | At most the three intentional motions in `tokens.json` on landing/report entry |
| R07 | Board squares and states match `docs/board-theme.md` |
| R08 | Brand name remains a hero-level signal on the landing page (brand test with nav removed) |

## Token-level guards already encoded

- Accent is a single felt green (`#0E7A5F` light / `#3DB892` dark), not purple or terracotta-as-brand.
- Light background is cool chalk `#F2F4F3`, not warm cream `#F4F1EA`.
- Ink is `#1A2421`, not `#000000`.
- `icons.emojiAsIcons` is `false`.
- Motion `banned` list rejects noise loops and glow pulse.
