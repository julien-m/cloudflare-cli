import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface ActionOpts {
  json?: boolean;
  format?: string;
  fields?: string;
  page?: string;
  perPage?: string;
  threshold?: string;
  period?: string;
  actionMode?: string;
  actionTimeout?: string;
  urlPattern?: string;
  methods?: string;
  description?: string;
}

export const rateLimitsResource = new Command("rate-limits")
  .description("Manage rate limiting rules");

// ── LIST ────────────────────────────────────────────────────
rateLimitsResource
  .command("list")
  .description("List rate limiting rules for a zone")
  .argument("<zone-id>", "Zone ID")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page", "20")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  cloudflare-cli rate-limits list abc123\n  cloudflare-cli rate-limits list abc123 --json")
  .action(async (zoneId: string, opts: ActionOpts) => {
    try {
      const params: Record<string, string> = {
        page: opts.page ?? "1",
        per_page: opts.perPage ?? "20",
      };

      const response = await client.get(`/zones/${zoneId}/rate_limits`, params);
      const data = (response as Record<string, any>).result;
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ─────────────────────────────────────────────────────
rateLimitsResource
  .command("get")
  .description("Get a specific rate limiting rule")
  .argument("<zone-id>", "Zone ID")
  .argument("<rule-id>", "Rule ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExample:\n  cloudflare-cli rate-limits get abc123 rule-id-123")
  .action(async (zoneId: string, ruleId: string, opts: ActionOpts) => {
    try {
      const response = await client.get(`/zones/${zoneId}/rate_limits/${ruleId}`);
      const data = (response as Record<string, any>).result;
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ──────────────────────────────────────────────────
rateLimitsResource
  .command("create")
  .description("Create a rate limiting rule")
  .argument("<zone-id>", "Zone ID")
  .requiredOption("--threshold <n>", "Number of requests")
  .requiredOption("--period <n>", "Period in seconds")
  .requiredOption("--action-mode <mode>", "Action mode: ban|challenge|js_challenge|managed_challenge|simulate")
  .option("--action-timeout <n>", "Action timeout in seconds (for ban mode)")
  .option("--url-pattern <pattern>", "URL pattern (default: *)")
  .option("--methods <methods>", "Comma-separated HTTP methods (default: GET)")
  .option("--description <desc>", "Rule description")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExample:\n  cloudflare-cli rate-limits create abc123 --threshold 100 --period 60 --action-mode challenge')
  .action(async (zoneId: string, opts: ActionOpts) => {
    try {
      const methods = opts.methods?.split(",").map((m) => m.trim()) ?? ["GET"];
      const urlPattern = opts.urlPattern ?? "*";

      const body: Record<string, unknown> = {
        threshold: parseInt(opts.threshold || "0"),
        period: parseInt(opts.period || "0"),
        action: {
          mode: opts.actionMode,
        },
        match: {
          request: {
            url_pattern: urlPattern,
            methods,
          },
          response: {},
        },
        disabled: false,
      };

      if (opts.actionTimeout) {
        (body.action as Record<string, unknown>).timeout = parseInt(opts.actionTimeout);
      }
      if (opts.description) body.description = opts.description;

      const response = await client.post(`/zones/${zoneId}/rate_limits`, body);
      const data = (response as Record<string, any>).result;
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ──────────────────────────────────────────────────
rateLimitsResource
  .command("update")
  .description("Update a rate limiting rule")
  .argument("<zone-id>", "Zone ID")
  .argument("<rule-id>", "Rule ID")
  .option("--threshold <n>", "Number of requests")
  .option("--period <n>", "Period in seconds")
  .option("--action-mode <mode>", "Action mode: ban|challenge|js_challenge|managed_challenge|simulate")
  .option("--action-timeout <n>", "Action timeout in seconds")
  .option("--url-pattern <pattern>", "URL pattern")
  .option("--methods <methods>", "Comma-separated HTTP methods")
  .option("--description <desc>", "Rule description")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExample:\n  cloudflare-cli rate-limits update abc123 rule-id-123 --threshold 200")
  .action(async (zoneId: string, ruleId: string, opts: ActionOpts) => {
    try {
      const body: Record<string, unknown> = {};

      if (opts.threshold) body.threshold = parseInt(opts.threshold);
      if (opts.period) body.period = parseInt(opts.period);
      if (opts.actionMode || opts.actionTimeout) {
        body.action = {};
        if (opts.actionMode) (body.action as Record<string, unknown>).mode = opts.actionMode;
        if (opts.actionTimeout) (body.action as Record<string, unknown>).timeout = parseInt(opts.actionTimeout);
      }
      if (opts.urlPattern || opts.methods) {
        body.match = { request: {}, response: {} };
        if (opts.urlPattern) ((body.match as Record<string, unknown>).request as Record<string, unknown>).url_pattern = opts.urlPattern;
        if (opts.methods) {
          ((body.match as Record<string, unknown>).request as Record<string, unknown>).methods = opts.methods.split(",").map((m) => m.trim());
        }
      }
      if (opts.description) body.description = opts.description;

      const response = await client.put(`/zones/${zoneId}/rate_limits/${ruleId}`, body);
      const data = (response as Record<string, any>).result;
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ──────────────────────────────────────────────────
rateLimitsResource
  .command("delete")
  .description("Delete a rate limiting rule")
  .argument("<zone-id>", "Zone ID")
  .argument("<rule-id>", "Rule ID")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExample:\n  cloudflare-cli rate-limits delete abc123 rule-id-123")
  .action(async (zoneId: string, ruleId: string, opts: ActionOpts) => {
    try {
      const response = await client.delete(`/zones/${zoneId}/rate_limits/${ruleId}`);
      const data = (response as Record<string, any>).result;
      output({ deleted: true, ...data }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
