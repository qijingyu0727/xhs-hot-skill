---
name: xhs-hot-skill
description: Create polished Xiaohongshu content packages from one topic by routing it to one of 20 scene recipes, presenting 2-3 distinct editorial and visual directions, then producing titles, 5-9 carousel pages, a 300-500-character Chinese post, tags, sources, risks, and a Guizang-ready visual brief. Use for 小红书选题、标题、正文、图文卡片、内容改写、系列策划，或用户明确要求更新小红书样本库时。
---

# XHS Hot Skill

Turn one topic into a usable Xiaohongshu copy and visual package. Keep normal generation local: do not browse or refresh trends unless the user explicitly says `更新样本库` or asks for current evidence.

## Normal workflow

1. Read [references/category-router.md](references/category-router.md) and choose the primary scene. If two scenes are plausible, state the assumption in one sentence; ask only when the choice materially changes safety or evidence needs.
2. Read exactly one matching file from `references/scenes/`. Also read [references/copy-constitution.md](references/copy-constitution.md), [references/visual-constitution.md](references/visual-constitution.md), and [references/safety-copyright.md](references/safety-copyright.md).
3. Return 2-3 direction cards before writing the full post. Each direction must change all five dimensions: angle, title promise, page order, visual system, and image strategy. Do not present cosmetic rewrites as different directions.
4. End with one direct choice question and wait. Do not generate the final package before the user chooses, unless the user explicitly asks for all directions.
5. After selection, deliver every section in [references/output-contract.md](references/output-contract.md). Count only the body section toward the 300-500-character limit.
6. If `guizang-social-card-skill` is installed, invoke it as an independent downstream skill with the selected copy and visual brief. Request 1080x1440 output and run its validator. If it is absent, return the complete copy package plus a render-ready visual brief and recommend installation; do not claim images were rendered.

## Direction response

Use this compact shape for each candidate:

```text
方向 A｜名称
切入：读者为什么会停下
标题：一条代表标题
页面：5-9 页的叙事顺序
视觉：版式、色彩、图片节奏
素材：需要什么；缺失时如何降级
```

Make one direction practical, one editorial or insight-led, and one contrast or decision-led when the scene recipe supports all three. Prefer two strong directions over three weak ones.

## Evidence rules

- Treat user facts and supplied materials as primary.
- Mark assumptions and missing inputs. Never invent dates, prices, locations, product specs, personal experience, outcomes, or engagement.
- A dramatic emotion is allowed; a verifiable fact is not.
- Do not call a post `高赞`, `爆款`, `最全`, or `第一` without visible evidence.
- For real visits, wear tests, product tests, recipes, health, beauty, parenting, or finance, preserve source and risk notes in the final package.

## Update sample library

Only enter this mode when the user explicitly requests an update. Read [references/research-protocol.md](references/research-protocol.md), use `agent-reach` and `last30days-cn`, and keep raw results outside the repository. Store only public metadata and short derived patterns that satisfy `data/sample.schema.json`. Never save complete third-party posts, images, screenshots, cookies, tokens, or caches.

## Guizang handoff

Pass a structured brief, not loose prose:

```yaml
canvas: 1080x1440
pages: 5-9
style_route: editorial | swiss
page_rhythm: light-dark-light or dark-light-dark
palette: two neutrals plus one accent
copy: selected carousel copy
image_plan: per-page subject, source, crop, fallback
constraints: high contrast, clean hierarchy, no fake documentary image
```

Keep `guizang-social-card-skill` external. Do not copy its templates, scripts, assets, or license-covered implementation into this skill.
