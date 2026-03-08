import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const securityResource = new Command("security")
  .description("Manage zone security settings");

// -- GET-LEVEL --
securityResource
  .command("get-level")
  .description("Get the security level for a zone")
  .argument("<zone-id>", "Zone ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli security get-level abc123\n  cloudflare-cli security get-level abc123 --json",
  )
  .action(async (zoneId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = (await client.get(`/zones/${zoneId}/settings/security_level`)) as { result: unknown };
      output(data.result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- SET-LEVEL --
securityResource
  .command("set-level")
  .description("Set the security level for a zone")
  .argument("<zone-id>", "Zone ID")
  .requiredOption("--value <level>", "Security level: off, essentially_off, low, medium, high, under_attack")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli security set-level abc123 --value medium\n  cloudflare-cli security set-level abc123 --value under_attack --json",
  )
  .action(async (zoneId: string, opts: { value: string; json?: boolean }) => {
    try {
      const data = (await client.patch(`/zones/${zoneId}/settings/security_level`, {
        value: opts.value,
      })) as { result: unknown };
      output(data.result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- FIREWALL-RULES --
securityResource
  .command("firewall-rules")
  .description("List firewall rules for a zone")
  .argument("<zone-id>", "Zone ID")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page", "25")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli security firewall-rules abc123\n  cloudflare-cli security firewall-rules abc123 --json",
  )
  .action(async (zoneId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {
        page: (opts.page as string) ?? "1",
        per_page: (opts.perPage as string) ?? "25",
      };

      const data = (await client.get(`/zones/${zoneId}/firewall/rules`, params)) as { result: unknown[] };
      output(data.result, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format as string | undefined,
        fields: (opts.fields as string)?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- WAF-RULES --
securityResource
  .command("waf-rules")
  .description("List WAF rulesets for a zone")
  .argument("<zone-id>", "Zone ID")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli security waf-rules abc123\n  cloudflare-cli security waf-rules abc123 --json",
  )
  .action(async (zoneId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = (await client.get(`/zones/${zoneId}/rulesets`)) as { result: unknown[] };
      output(data.result, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format as string | undefined,
        fields: (opts.fields as string)?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
