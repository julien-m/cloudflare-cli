import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const zonesResource = new Command("zones")
  .description("Manage Cloudflare zones");

// -- LIST --
zonesResource
  .command("list")
  .description("List all zones in your account")
  .option("--name <name>", "Filter by domain name")
  .option("--status <status>", "Filter by status: active, pending, initializing, moved, deleted, deactivated")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page (max 50)", "20")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli zones list\n  cloudflare-cli zones list --name example.com\n  cloudflare-cli zones list --status active --per-page 50 --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {
        page: opts.page ?? "1",
        per_page: opts.perPage ?? "20",
      };
      if (opts.name) params.name = opts.name;
      if (opts.status) params.status = opts.status;

      const data = (await client.get("/zones", params)) as { result: unknown[] };
      output(data.result, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
