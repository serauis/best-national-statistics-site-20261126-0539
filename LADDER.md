# NusaStat — Local Design Ladder G1

16 variants, built from the same site code: 4 palettes × 4 hero layouts.
Palette is `?pal=1..4`, hero layout is `?hero=a..d`; the shipped default
(no parameters) is the winner. Each variant was rendered at 1280×800
(home + indicator page) in headless Chrome and scored 1–5 on the five
judged criteria: (1) working site shown, (2) content/usefulness,
(3) ease of use, (4) look/originality, (5) speed/structure.
Speed/structure is 5 for every variant (identical code, ~35 KB first load);
the other four were scored from the rendered screenshots.

Pairwise rule: a variant's score against another is decided by total
points; the winner is the variant with the HIGHEST LOW (worst single
criterion), ties broken by total. A variant that ever loses badly on one
axis is out, even if its mean is high.

## Variants

| Variant | Palette | Hero | Working | Content | Ease | Look | Speed | LOW | Total |
|---|---|---|---|---|---|---|---|---|---|
| p1a | 1 teal/terracotta | a balanced | 5 | 5 | 5 | 5 | 5 | **5** | **25** |
| p1b | 1 teal/terracotta | b chart-first | 4 | 5 | 4 | 5 | 5 | 4 | 23 |
| p1c | 1 teal/terracotta | c story-first | 4 | 5 | 4 | 5 | 5 | 4 | 23 |
| p1d | 1 teal/terracotta | d table-first | 5 | 5 | 4 | 4 | 5 | 4 | 23 |
| p2a | 2 navy/gold | a balanced | 5 | 5 | 5 | 4 | 5 | 4 | 24 |
| p2b | 2 navy/gold | b chart-first | 4 | 5 | 4 | 4 | 5 | 4 | 22 |
| p2c | 2 navy/gold | c story-first | 4 | 5 | 4 | 4 | 5 | 4 | 22 |
| p2d | 2 navy/gold | d table-first | 5 | 5 | 4 | 4 | 5 | 4 | 22 |
| p3a | 3 forest green | a balanced | 5 | 5 | 5 | 4 | 5 | 4 | 24 |
| p3b | 3 forest green | b chart-first | 4 | 5 | 4 | 4 | 5 | 4 | 22 |
| p3c | 3 forest green | c story-first | 4 | 5 | 4 | 4 | 5 | 4 | 22 |
| p3d | 3 forest green | d table-first | 5 | 5 | 4 | 4 | 5 | 4 | 22 |
| p4a | 4 maroon/amber | a balanced | 5 | 5 | 5 | 3 | 5 | 3 | 23 |
| p4b | 4 maroon/amber | b chart-first | 4 | 5 | 4 | 3 | 5 | 3 | 21 |
| p4c | 4 maroon/amber | c story-first | 4 | 5 | 4 | 3 | 5 | 3 | 21 |
| p4d | 4 maroon/amber | d table-first | 5 | 5 | 4 | 3 | 5 | 3 | 21 |

## Pairwise notes

- **Hero a (balanced) beats b/c/d on every palette**: KPIs, the family
  strip, and the charts all appear above the fold, so the cover
  screenshot shows big numbers + the human twist + charts at once.
  Hero b/c push the KPIs below the fold (working 4, ease 4); hero d is
  dense and reads as a table, not a portal (ease 4, look 4).
- **Palette 1 beats 2/3/4**: the teal top bar + terracotta accent is the
  most distinctive and the warm off-white background keeps the family
  strip (dark teal) readable. Navy (2) is clean but generic; forest (3)
  is pleasant but too close to teal to win on look; maroon (4) makes the
  top bar and family strip feel heavy and dark (look 3).
- **Emotional twist**: hero a and c both carry the "Apa arti angka ini
  bagi satu keluarga?" strip; hero a wins because it keeps the twist
  without sacrificing the KPI row. The twist is what lifts p1a's look
  and content scores above the plainer layouts.

## Winner

**p1a — palette 1 (deep teal + terracotta on warm off-white), hero a
(balanced). LOW 5, total 25/25 — the only variant with no weak axis.**
It ships as the default (no `?pal` / `?hero` parameters). The variant
switches stay in the code as a harmless query-parameter theme hook;
they are not linked from anywhere in the site.
