# Changelog

Semantic versioning: MAJOR = a prop, exported type, or default behaviour changed in a way that
could break an existing consumer without any code change on their side. MINOR = additive only.
Consuming projects should pin to a tag (`#v1.0.0`), never `#main`.

## v1.0.0 — 2026-08-20

First release. `ClaudiaFormRenderer` -- a config-driven field-type registry, not a closed
form-builder. Checked SafeSpaces' own real `FormRenderer.tsx` (589 lines, the platform's most
mature real form-rendering system) for the actual field-type vocabulary in production use
before building anything: text, email, url, phone, number, currency, date, textarea,
select/dropdown, multiselect, checkbox, toggle -- all real, working default renderers.

`fieldRegistry` is merged OVER `DEFAULT_FIELD_REGISTRY`, not replacing it: every built-in type
works first time with zero config, and any single type can be overridden, or a new one added,
without touching this component's own code. An unregistered field type shows a real, visible
error rather than silently rendering nothing.

`date` uses `@jo51yon/claudia-calendar` (verified date math, published from real Claudia
dashboard code the same day) rather than a raw input or a new hand-rolled picker -- reusing
what's already built, not inventing a third way.

Not a claim of full parity with SafeSpaces' real system: table, sheet and dynamic-choice-source
field types are real, in-production SafeSpaces features not built here. Not blocked either --
a project needing them registers its own renderer under that type key, the same way any custom
type is added.

**Known consumers at this tag:** none yet at release.
