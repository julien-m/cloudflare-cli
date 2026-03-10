---
name: cloudflare
description: "Manage Cloudflare via CLI - zones, dns, tunnels, security. Use when user mentions 'cloudflare', 'dns records', 'tunnels', 'waf', 'cdn', or wants to interact with the Cloudflare API."
category: infrastructure
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

### zones

| Command | Description |
|---------|-------------|
| `cloudflare-cli zones list --json` | List all zones in your account |
| `cloudflare-cli zones list --name example.com --json` | Filter zones by domain name |
| `cloudflare-cli zones list --status active --json` | Filter by status (active, pending, initializing, moved, deleted, deactivated) |
| `cloudflare-cli zones list --per-page 50 --json` | Customize page size (max 50) |
| `cloudflare-cli zones list --page 2 --json` | Get specific page of results |
| `cloudflare-cli zones list --fields id,name,status --json` | Display specific columns |

### dns

| Command | Description |
|---------|-------------|
| `cloudflare-cli dns list <zone-id> --json` | List all DNS records for a zone |
| `cloudflare-cli dns list <zone-id> --type A --json` | Filter by record type |
| `cloudflare-cli dns list <zone-id> --name sub.example.com --json` | Filter by record name |
| `cloudflare-cli dns list <zone-id> --per-page 100 --json` | Customize page size (max 100) |
| `cloudflare-cli dns get <zone-id> <record-id> --json` | Get a specific DNS record |
| `cloudflare-cli dns create <zone-id> --type A --name @ --content 1.2.3.4 --json` | Create A record for root domain |
| `cloudflare-cli dns create <zone-id> --type CNAME --name blog --content example.com --proxied --json` | Create proxied CNAME record |
| `cloudflare-cli dns create <zone-id> --type MX --name @ --content mail.example.com --priority 10 --json` | Create MX record with priority |
| `cloudflare-cli dns create <zone-id> --type TXT --name @ --content "v=spf1 include:sendgrid.net ~all" --json` | Create TXT record (SPF) |
| `cloudflare-cli dns create <zone-id> --type A --name api --content 203.0.113.1 --ttl 300 --json` | Create record with custom TTL |
| `cloudflare-cli dns update <zone-id> <record-id> --content 5.6.7.8 --json` | Update record content |
| `cloudflare-cli dns update <zone-id> <record-id> --proxied --json` | Enable Cloudflare proxy (orange cloud) |
| `cloudflare-cli dns update <zone-id> <record-id> --no-proxied --json` | Disable Cloudflare proxy (gray cloud) |
| `cloudflare-cli dns update <zone-id> <record-id> --ttl 3600 --json` | Update TTL value |
| `cloudflare-cli dns delete <zone-id> <record-id> --json` | Delete a DNS record |

### tunnels

| Command | Description |
|---------|-------------|
| `cloudflare-cli tunnels list <account-id> --json` | List all Cloudflare Tunnels |
| `cloudflare-cli tunnels list <account-id> --name my-tunnel --json` | Filter tunnels by name |
| `cloudflare-cli tunnels list <account-id> --is-deleted --json` | Include deleted tunnels |
| `cloudflare-cli tunnels list <account-id> --per-page 50 --json` | Customize page size |
| `cloudflare-cli tunnels get <account-id> <tunnel-id> --json` | Get tunnel details |
| `cloudflare-cli tunnels configs <account-id> <tunnel-id> --json` | Get tunnel configuration |

### security

| Command | Description |
|---------|-------------|
| `cloudflare-cli security get-level <zone-id> --json` | Get security level for a zone |
| `cloudflare-cli security set-level <zone-id> --value medium --json` | Set security level (off, essentially_off, low, medium, high, under_attack) |
| `cloudflare-cli security set-level <zone-id> --value under_attack --json` | Enable under attack mode |
| `cloudflare-cli security firewall-rules <zone-id> --json` | List firewall rules for a zone |
| `cloudflare-cli security firewall-rules <zone-id> --per-page 50 --json` | Customize page size |
| `cloudflare-cli security firewall-rules <zone-id> --fields id,description --json` | Display specific columns |
| `cloudflare-cli security waf-rules <zone-id> --json` | List WAF rulesets for a zone |
| `cloudflare-cli security waf-rules <zone-id> --fields id,name,phase --json` | Display specific WAF ruleset columns |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
