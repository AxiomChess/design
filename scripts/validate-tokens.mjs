import { readFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const errors = []

const requireFile = (rel) => {
  const path = join(root, rel)
  if (!existsSync(path)) {
    errors.push(`missing file: ${rel}`)
    return null
  }
  return path
}

const isHex = (value) =>
  typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value)

const isColor = (value) =>
  isHex(value) ||
  (typeof value === "string" && /^rgba?\([\d\s.,%]+\)$/.test(value))

const assert = (condition, message) => {
  if (!condition) errors.push(message)
}

const tokensPath = requireFile("tokens/tokens.json")
const cssPath = requireFile("tokens/tokens.css")
requireFile("tokens/tokens.schema.json")
requireFile("docs/board-theme.md")
requireFile("docs/anti-slop-checklist.md")

if (!tokensPath || !cssPath) {
  console.error(errors.join("\n"))
  process.exit(1)
}

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"))
const css = readFileSync(cssPath, "utf8")
const antiSlop = readFileSync(join(root, "docs/anti-slop-checklist.md"), "utf8")
const boardDoc = readFileSync(join(root, "docs/board-theme.md"), "utf8")

assert(tokens.meta?.direction?.includes("Ink and Felt"), "meta.direction must state Ink and Felt")
assert(tokens.typography?.maxFamilies === 2, "typography.maxFamilies must be 2")
assert(
  Array.isArray(tokens.spacing?.scalePx) && tokens.spacing.scalePx[0] === 4,
  "spacing must be 4-based"
)
assert(tokens.icons?.emojiAsIcons === false, "icons.emojiAsIcons must be false")
assert(tokens.motion?.intentionalCount === 3, "motion.intentionalCount must be 3")
assert(
  Array.isArray(tokens.motion?.signatures) && tokens.motion.signatures.length === 3,
  "motion.signatures must list exactly 3"
)

const bannedFonts = ["Inter", "Roboto", "Arial", "system-ui"]
for (const role of ["display", "body"]) {
  const name = tokens.typography?.families?.[role]?.name
  assert(typeof name === "string" && name.length > 0, `typography.families.${role}.name required`)
  assert(!bannedFonts.includes(name), `banned brand font: ${name}`)
}

for (const theme of ["light", "dark"]) {
  const palette = tokens.color?.[theme]
  assert(palette, `color.${theme} required`)
  if (!palette) continue
  for (const key of ["bg", "surface", "ink", "inkSecondary", "border", "accent", "accentMuted", "focus"]) {
    assert(isHex(palette[key]), `color.${theme}.${key} must be #RRGGBB`)
  }
  assert(palette.ink.toLowerCase() !== "#000000", `color.${theme}.ink must not be #000000`)
  assert(palette.bg.toLowerCase() !== "#000000", `color.${theme}.bg must not be #000000`)
  assert(palette.bg.toLowerCase() !== "#f4f1ea", `color.${theme}.bg must not be warm cream #F4F1EA`)
  const hex = palette.accent.slice(1)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const looksPurple = b > r && b > g && g < 120
  assert(!looksPurple, `color.${theme}.accent must not be purple-like`)
}

for (const theme of ["light", "dark"]) {
  const board = tokens.board?.[theme]
  assert(board, `board.${theme} required`)
  if (!board) continue
  for (const key of ["squareLight", "squareDark", "selected", "coord"]) {
    assert(isHex(board[key]), `board.${theme}.${key} must be #RRGGBB`)
  }
  assert(isColor(board.lastMove), `board.${theme}.lastMove must be color`)
  assert(isColor(board.highlightCheck), `board.${theme}.highlightCheck must be color`)
}

const requiredCssVars = [
  "--ax-font-display",
  "--ax-font-body",
  "--ax-bg",
  "--ax-ink",
  "--ax-accent",
  "--ax-board-square-light",
  "--ax-board-square-dark",
  "--ax-board-selected",
]
for (const name of requiredCssVars) {
  assert(css.includes(name), `tokens.css missing ${name}`)
}

assert(css.includes('[data-theme="dark"]'), 'tokens.css must define [data-theme="dark"]')
assert(antiSlop.includes("B01"), "anti-slop checklist missing B01")
assert(antiSlop.includes("Purple-on-white"), "anti-slop must ban purple-on-white")
assert(antiSlop.includes("Warm cream"), "anti-slop must ban warm cream artisan kit")
assert(antiSlop.includes("Broadsheet"), "anti-slop must ban broadsheet pastiche")
assert(antiSlop.includes("Gradient text"), "anti-slop must ban gradient text")
assert(antiSlop.includes("cheater"), "anti-slop must ban definitive cheater label")
assert(boardDoc.includes("Pieces"), "board-theme.md must specify pieces")
assert(boardDoc.includes("Accessibility"), "board-theme.md must cover accessibility")
assert(/license-clean/i.test(boardDoc), "board-theme.md must require license-clean SVG")

const bands = tokens.suspicionBands
assert(bands?.low?.maxExclusive === 0.45, "band low cut must be 0.45")
assert(bands?.elevated?.minInclusive === 0.45, "band elevated min must be 0.45")
assert(bands?.elevated?.maxExclusive === 0.70, "band elevated max must be 0.70")
assert(bands?.high?.minInclusive === 0.70, "band high min must be 0.70")

if (errors.length > 0) {
  console.error(`validate-tokens FAIL (${errors.length})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("validate-tokens PASS")
console.log(`- tokens.json version ${tokens.meta.version}`)
console.log(`- light accent ${tokens.color.light.accent}`)
console.log(`- dark accent ${tokens.color.dark.accent}`)
console.log(`- fonts ${tokens.typography.families.display.name} / ${tokens.typography.families.body.name}`)
console.log(`- spacing steps ${tokens.spacing.scalePx.length}`)
console.log(`- motion signatures ${tokens.motion.signatures.length}`)
