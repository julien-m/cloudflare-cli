import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tunnelsResource = new Command("tunnels")
  .description("Manage Cloudflare Tunnels");

// -- LIST --
tunnelsResource
  .command("list")
  .description("List all tunnels for an account")
  .argument("<account-id>", "Account ID")
  .option("--name <name>", "Filter by tunnel name")
  .option("--is-deleted", "Include deleted tunnels")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page", "20")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli tunnels list acc123\n  cloudflare-cli tunnels list acc123 --name my-tunnel --json",
  )
  .action(async (accountId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {
        page: (opts.page as string) ?? "1",
        per_page: (opts.perPage as string) ?? "20",
      };
      if (opts.name) params.name = opts.name as string;
      if (opts.isDeleted) params.is_deleted = "true";

      const data = (await client.get(`/accounts/${accountId}/cfd_tunnel`, params)) as { result: unknown[] };
      output(data.result, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format as string | undefined,
        fields: (opts.fields as string)?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- GET --
tunnelsResource
  .command("get")
  .description("Get details for a specific tunnel")
  .argument("<account-id>", "Account ID")
  .argument("<tunnel-id>", "Tunnel ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli tunnels get acc123 tun456\n  cloudflare-cli tunnels get acc123 tun456 --json",
  )
  .action(async (accountId: string, tunnelId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = (await client.get(`/accounts/${accountId}/cfd_tunnel/${tunnelId}`)) as { result: unknown };
      output(data.result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CONFIGS --
tunnelsResource
  .command("configs")
  .description("Get configuration for a tunnel")
  .argument("<account-id>", "Account ID")
  .argument("<tunnel-id>", "Tunnel ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli tunnels configs acc123 tun456\n  cloudflare-cli tunnels configs acc123 tun456 --json",
  )
  .action(async (accountId: string, tunnelId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = (await client.get(`/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`)) as { result: unknown };
      output(data.result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
