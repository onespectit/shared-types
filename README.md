# @onespectit/shared-types

Shared TypeScript types for the [1nspecT](https://1nspect.app) platform.

## What lives here

Type definitions consumed by all 1nspecT services:

- `SOPConfiguration` + `RatingDefinition` + supporting types (Universal SoP architecture)
- `PromptConfiguration` (AI narrative prompt assembly)
- `LayoutConfiguration` (rating display modes — single-rating / pill-tags / checklist / narrative-only)
- `NarrativeLanguageConfig` (standards-only language + banned-term scrub)
- `SoPReinspectionMode` (reinspection overlay)
- Other cross-service contracts

## Consumers

- **Backend** — `apps/backend-api` (NestJS) imports the published package
- **Web admin** — `apps/web-admin` (Vite/React) imports the published package
- **Mobile** — Sibling repo at `OneSpectIT` (Expo/RN) imports the published package via npm

## Publishing

GitHub Packages npm registry. See `.github/workflows/publish.yml` for the auto-publish-on-tag workflow.

Manual publish:

```bash
npm version patch  # or minor / major
npm publish
git push --follow-tags
```

## Installing

In a consumer repo, add a `.npmrc`:

```
@onespectit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```bash
npm install @onespectit/shared-types
```

For EAS / CI builds, `GITHUB_TOKEN` should be a Personal Access Token with `read:packages` scope, set as a build secret.
