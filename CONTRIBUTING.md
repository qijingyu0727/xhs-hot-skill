# Contributing

Contributions should improve a scene recipe, add reviewed public-source evidence, or strengthen a test without weakening existing guarantees.

## Corpus updates

1. Use the explicit `更新样本库` workflow in `SKILL.md`.
2. Follow `references/research-protocol.md` and `data/sample.schema.json`.
3. Store raw research outside the repository.
4. Commit only public source metadata and short independent analysis.
5. Use `null` for unavailable engagement. Never infer a metric.
6. Strip cookies, tokens, signatures, tracking parameters, screenshots, full posts, and original images.

## Scene recipes

Every recipe must include audience and use cases, three title formulas, three distinct direction archetypes, 5-9 page structures, copy rhythm, image strategy, Editorial/Swiss routing, positive and counterexample IDs, safety and copyright risks, and a checklist.

Rules must be specific to the scene. A generic recipe copied across categories is not accepted.

## Visual demos

- Use self-created, licensed, public-domain, or clearly labeled generated assets.
- Keep external provenance next to the demo.
- Do not add third-party platform screenshots or creator images.
- Render every card at 1080x1440 and require Guizang validator `0 FAIL`.

## Validation

Run all four commands before submitting a change:

```bash
node scripts/validate-corpus.mjs
node scripts/validate-skill.mjs
node --test
node scripts/check-readme-links.mjs
```

Do not skip tests, reduce sample quotas, relax safety checks, or mock the validators to make a change pass. Test and validator checksums are frozen after the first green run.
