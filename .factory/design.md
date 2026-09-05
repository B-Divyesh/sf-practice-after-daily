# Practice After Daily visual thesis

## Direction

Signal Garden is a night field notebook, not a laboratory dashboard. The game
uses a dark green plotting ground, hand-drawn habitat marks, and quiet paper-like
type. This makes the player read compact clues before acting. It also keeps the
practice path visible without looking like a separate lesson page.

The first screen is the active daily puzzle. The title tells the player what to
do. The field notes and candidate answers appear before any explanatory section.

## Palette and type

| Token | Dark value | Light value | Use |
| --- | --- | --- | --- |
| Ground | `#102a2a` | `#edf2df` | Page and game field |
| Deep ground | `#091b1e` | `#dfe9d1` | Garden art and inputs |
| Surface | `#173839` | `#fffdf2` | Panels |
| Ink | `#eff4e6` | `#17302e` | Main text |
| Muted | `#b8c5b6` | `#4b625d` | Supporting text |
| Leaf | `#c5dd70` | `#45631d` | Main action and success |
| Sun | `#f0b45b` | `#a64a1e` | Hints and steps |
| Focus | `#ffe083` | `#805400` | Keyboard focus |

Display type is Georgia and body type is the platform sans-serif stack. Both are
available on the device, so the site makes no font request. The interface uses a
4/8 px rhythm, 16 px body text, a 16 px panel radius, and a larger 22 px puzzle
radius. The palette was checked against both themes: normal ink on each surface
has at least 4.5:1 contrast.

## Interaction and motion

Choices shift three pixels on hover to suggest a selection without requiring
precise timing. The abstract stems move slowly only when browser motion is
allowed and the player keeps gentle movement enabled. Reduced motion makes the
garden static. The DOM puzzle is turn-based; it has no timing challenge. A small
requestAnimationFrame loop is limited to visual time, clamps elapsed time to 100
ms, and stops simulation time while the tab is hidden.

Assist mode reveals all traits and gives five guesses. Practice always has five
guesses and two optional hints. Daily mode begins with three guesses. The 24
fictional habitat records rotate deterministically from a date or a player-chosen
seed. This offers a broad repeatable practice set without factual biology claims.

## Assets and provenance

All garden art is original hand-authored CSS and SVG: the wordmark mark,
favicon, 1200×630 social image, and procedural stems. No stock image, font,
third-party script, or generated image is used. The asset plan intentionally
keeps the initial visual scene as vector/CSS under the static game budget. The
footer discloses that the garden marks are hand-drawn and fictional.

## Responsive behavior

At 760 px, field art and notes form the top row and answers stack below. At 430
px, region subtitles drop from answer buttons while names remain visible. Header
labels remain available, targets are at least 44 px, and no game action relies
on hover or animation.
