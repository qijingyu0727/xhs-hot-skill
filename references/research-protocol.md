# Research Protocol

## Category ownership

| No. | Scene ID | Label | Owner |
| --- | --- | --- | --- |
| 01 | ai-tools | AI 工具 | A |
| 02 | digital-software | 数码软件 | A |
| 03 | office-productivity | 办公效率 | A |
| 04 | career-job-search | 职场求职 | A |
| 05 | study-exams | 学习考试 | A |
| 06 | books-knowledge | 读书知识 | A |
| 07 | content-photography | 内容创作摄影 | A |
| 08 | travel-guides | 旅行攻略 | B |
| 09 | local-discovery | 本地探店 | B |
| 10 | food-recipes | 美食食谱 | B |
| 11 | home-organization | 家居收纳 | B |
| 12 | renovation-renting | 装修租房 | B |
| 13 | fashion | 穿搭 | B |
| 14 | beauty-skincare | 美妆护肤 | B |
| 15 | fitness-fat-loss | 健身减脂 | C |
| 16 | health-wellness | 健康养生 | C |
| 17 | emotional-growth | 情绪成长 | C |
| 18 | parenting | 亲子育儿 | C |
| 19 | personal-finance | 理财消费 | C |
| 20 | product-reviews | 好物测评 | C |

## Required outputs per owner

- Write one JSON object per line to `data/shards/<owner>.jsonl`.
- Produce exactly 20 unique samples for every assigned scene.
- Write one recipe per scene to `references/scenes/<scene>.md`.
- Use live, read-only research now. Prefer Xiaohongshu; supplement with WeChat, Bilibili, Zhihu, Weibo, Douyin, Toutiao, or public web sources when direct access is sparse.
- Never infer engagement values. Use `null` for every unavailable metric.
- Use `verified-high-engagement` only when the source is directly accessible and a visible metric reaches at least one threshold: 1,000 likes, 1,000 collections, 200 comments, or 100 shares.
- Each scene keeps at least 2 verified-high-engagement samples, 8 quality references, 1 trend reference, and 3 counterexamples. High interaction is one evidence type, not the definition of quality.
- Keep every analysis field below the Schema limit. Do not copy paragraphs, image captions, screenshots, or original images.
- Use `/tmp/` for raw research output. Only the JSONL shard and scene recipes belong in this repository.

## Scene recipe contract

Every scene file must contain: audience and use cases; three title formulas; three genuinely different direction archetypes; 5-9 page structures; copy rhythm; image strategy and missing-asset behavior; Guizang Editorial/Swiss routing; positive sample IDs; counterexample IDs; safety/copyright risks; and a short checklist. Avoid generic rules that could be pasted unchanged into all scenes.

## Evidence language

- `verified-high-engagement`: direct access plus a visible metric meeting the fixed threshold above.
- `quality-reference`: useful writing or visual structure, regardless of interaction.
- `trend-reference`: repeated or recent theme, but quality/interaction is incomplete.
- `counterexample`: a real sample that demonstrates a pattern to avoid.

The sample index is research metadata, not a republication archive. Copyright remains with original authors.
