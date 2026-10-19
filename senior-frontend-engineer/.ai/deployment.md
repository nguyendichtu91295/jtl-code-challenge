# Deployment rules

Extracted from the reusable release guidance in `bpm-counter`. Apply when deployment is in the authorized scope.

## Target and configuration

- User-confirmed default/production branch for this repository: `master` (replaces the earlier `main` assumption). Verify the intended remote branch and Git integration during deployment execution; do not rename/switch branches as part of planning.

- Keep deployment configuration and local metadata inside `senior-frontend-engineer/`. Resolve the deployment application root and build/output paths relative to this frontend workspace and its actual monorepo layout; the Git repository root is its parent.

- Vercel under the `coding-challenge` team is the reference deployment approach. Verify the intended account and team for this repository before publishing.
- Determine the project name, Git repository, production branch, application root, framework, install command, build command, and output directory from this project's requirements and configuration. Do not reuse another application's identifiers or local project link.
- Reuse an existing intended project and Git integration when present; avoid duplicate projects and changes to unrelated projects.
- For a Vite app, the reference build settings are `npm ci`, `npm run build`, and `dist`. Adapt these to the actual package manager, scripts, and monorepo layout before adding deployment configuration.
- Verify effective settings; repository configuration may override dashboard defaults.
- Use current CLI help or official documentation when executing deployment commands.

## Release preparation

- Inspect existing workspace changes and preserve user work.
- Keep credentials, `.env` files, local `.vercel` metadata, dependencies, and build output out of releases. Add appropriate ignore rules before generating those files. Never print credentials.
- Review the exact release file set and remote identity before staging or pushing.
- Run the relevant available type, lint, test, and production-build checks. Reuse recorded passing results when release inputs are unchanged; rerun affected checks when inputs change.
- Prepare the application and configuration before publishing. A push to a connected branch may trigger deployment automatically.

## Publishing and verification

- Creating a deployment plan or task does not itself authorize publishing. When the user requests deployment or execution of a queue that includes publishing, carry out those authorized steps without repeatedly asking.
- Inspect remote state before pushing. Do not force-push or overwrite existing remote work. Avoid duplicate releases when Git integration already triggers deployment.
- Monitor the resulting deployment until ready, inspect logs and effective configuration, and verify it corresponds to the intended release.
- For a public app, verify successful public HTTP access, follow expected redirects, inspect the delivered HTML, and fetch referenced scripts and styles to confirm successful responses and appropriate content types.
- Match access protection to the project's requirements; do not change account-wide or unrelated-project settings.
- HTTP and asset checks establish availability, not browser interaction or visual correctness. Use the workflow's validation guidance for any additional checks required by the feature.
- Record the actual production URL, release details, checks, and results in project documentation and the task execution record when a task exists.
- Mark deployment complete only after availability is confirmed. Record the exact failure and follow the task workflow if a blocker prevents completion.
