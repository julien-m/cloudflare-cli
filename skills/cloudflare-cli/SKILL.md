---
name: cloudflare
description: "Manage cloudflare via CLI - {{RESOURCES_LIST}}. Use when user mentions 'cloudflare' or wants to interact with the cloudflare API."
category: {{CATEGORY}}
---

# cloudflare-cli

## Setup

If `cloudflare-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle cloudflare
npx api2cli link cloudflare
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
cloudflare-cli auth set "your-token"
cloudflare-cli auth test
```

## Resources

{{RESOURCES_HELP}}

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
