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
> **No Additional operations:** Do not stage or unstage files for me.

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
3. **No Markdown Links:** NEVER use square brackets `[]` or parentheses `()` to link to files. Use plain text for paths only (e.g., "in src/path/file.ts" NOT "[file](path)").
4. **No Metadata:** Do not include `cci:`, `file:///`, or line numbers (e.g., `:798:0`).
5. **Clean Paths:** Use project-relative paths only. Strip all absolute paths starting with `/Users/...`.
6. **Tone:** Use the imperative mood ("Add", "Fix", "Update").

---
