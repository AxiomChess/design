# Board theme specification

Language: English only. No emoji.

Source tokens: `tokens/tokens.json` (`board` section) and CSS variables in `tokens/tokens.css`.

## Direction

Chess-native felt and ink. Squares read as a quiet analysis surface, not a toy woodgrain or neon esports board. States reuse the product accent; they do not invent a second palette.

## Squares

| Role | Light theme | Dark theme | CSS variable |
| --- | --- | --- | --- |
| Light square | `#D8DFD4` | `#3A4A42` | `--ax-board-square-light` |
| Dark square | `#5A7264` | `#24302B` | `--ax-board-square-dark` |

Rules:

- Contrast between light and dark squares must remain readable at 320px board width.
- Do not use pure `#000000` or pure `#FFFFFF` for squares.
- Do not use purple, pink, or neon gradients on squares.

## Interaction states

| State | Behavior | Token |
| --- | --- | --- |
| Last move | Soft fill overlay on from/to squares | `--ax-board-last-move` |
| Selected | 2px inset ring using accent; keyboard focus uses the same ring | `--ax-board-selected` / `--ax-focus` |
| Check | Soft danger overlay on king square only | `--ax-board-check` |
| Legal move | Small 6px accent-muted disk centered on empty square; capture = corner notches (stroke 1.5px) | accent tokens |
| Hover (pointer) | 4% ink tint on square; never glow | derived from `--ax-ink` |

## Coordinates

- Font: `--ax-font-mono`, size `--ax-text-xs`.
- Color: `--ax-board-coord`.
- Place outside the playable 8x8 or as subtle corner glyphs; do not fight piece contrast.

## Pieces

- License-clean SVG only. Record SPDX and source in `NOTICE` (or piece pack README) at the moment assets are added. Do not invent license text.
- Style target: flat fills with optional 1px outline at 1.5 stroke weight matching the icon set; no drop-shadow glow stacks; no 3D bevel kits.
- White pieces: light fill near `--ax-surface` with ink outline.
- Black pieces: dark fill near `--ax-ink` (light theme) / darker surface (dark theme) with contrasting outline.
- Until assets land, implementers may use a temporary geometric placeholder set that follows these contrast rules; placeholders must not ship in production UI (see anti-slop checklist).

## Motion on the board

Only the intentional motion `piece-place` from `tokens.json`:

- On ply advance, the moved piece soft-drops 6px with a short fade (`--ax-duration-fast`, `--ax-ease`).
- No continuous idle animations on pieces.

## Accessibility

- Board must be operable by keyboard (arrow keys / focusable squares) in consuming apps.
- Selected and focus states must meet visible focus requirements; do not remove outlines without an equivalent `--ax-focus` treatment.
- Color is not the only signal for check or last move: keep a text or ARIA live update in the report UI.
