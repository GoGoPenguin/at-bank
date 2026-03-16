---
description: Generating Conventional Commit Messages
---

## Context

This skill generates standardized commit messages for the **antigravity** project based **exclusively** on staged changes. It ensures a clean, readable, and searchable history by combining Conventional Commit types, Gitmojis, and concise summaries of changed files.

## Command Logic

To identify the changes, always use:
`git diff --staged`

> [!IMPORTANT]
> **No Absolute Paths:** When referencing files in the commit body, always use the path relative to the project root (e.g., `src/servers/gate/...` instead of `/Users/user/Documents/...`).
> Do not stage or unstage files for me.

---

## Message Format

```text
<type>(<scope>): <emoji> <description>

- <Action> <summary> in [relative/path/to/file.ts]
- <Action> <summary>

```

### 1. Header Components

| Component | Rule |
| --- | --- |
| **Type** | `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `perf`, `test` |
| **Scope** | The module being changed, enclosed in parentheses (e.g., `gate`, `information`) |
| **Emoji** | The corresponding [Gitmoji](https://gitmoji.dev/) (e.g., `:sparkles:`, `:bug:`, `:recycle:`) |
| **Description** | A brief, imperative summary (e.g., "add debug logging") |

### 2. Body Components

* Use a bulleted list to detail specific changes.
* Mention the specific file name or relative path.
* Focus on *what* changed and *where*.

---

## Examples

### Infrastructure/Chore

```text
chore(gate): :building_construction: add debug logging for gate authorization and domains

- Add `Logger` import to src/servers/gate/handlers/gate_handler_base.ts
- Log `userAuthorizationData` when evaluating user request headers
- Log `this._domains` mapping when getting platform code by host

```

### Feature

```text
feat(information): :sparkles: add method to retrieve homepage popup list

- Implement `getHomepagePopups` in src/services/CacheManager.ts
- Update interface definitions in src/types/info.d.ts
- Optimize info config retrieval logic for faster resolution

```

### Bug Fix

```text
fix(information): :bug: fix cache race conditions

- Wrap cache initialization in a mutex lock in src/lib/cache/store.ts
- Ensure initialization completes before serving pending requests

```

---

## Generation Prompt

When generating this message, follow these constraints:

1. **Analyze:** Only look at the output of `git diff --staged`.
2. **Standard:** Use `<type>(<scope>): <emoji> <description>`.
3. **Paths:** Strip all absolute system paths; use project-relative paths only.
4. **Tone:** Use the imperative mood ("Add", "Fix", "Update").

---
