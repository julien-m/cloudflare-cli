# cloudflare-cli

CLI for the cloudflare API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install <user>/cloudflare-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add <user>/cloudflare-cli
```

## Usage

```bash
cloudflare-cli auth set "your-token"
cloudflare-cli auth test
cloudflare-cli --help
```

## Resources

Run `cloudflare-cli --help` to see available resources.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
