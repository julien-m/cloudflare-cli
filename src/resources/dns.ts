import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const dnsResource = new Command("dns")
  .description("Manage DNS records for a zone");

// -- LIST --
dnsResource
  .command("list")
  .description("List DNS records for a zone")
  .argument("<zone-id>", "Zone ID")
  .option("--type <type>", "Filter by record type: A, AAAA, CNAME, MX, TXT, NS, etc.")
  .option("--name <name>", "Filter by record name")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page (max 100)", "50")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli dns list abc123\n  cloudflare-cli dns list abc123 --type CNAME\n  cloudflare-cli dns list abc123 --name sub.example.com --json",
  )
  .action(async (zoneId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {
        page: opts.page ?? "1",
        per_page: opts.perPage ?? "50",
      };
      if (opts.type) params.type = opts.type;
      if (opts.name) params.name = opts.name;

      const data = (await client.get(`/zones/${zoneId}/dns_records`, params)) as { result: unknown[] };
      output(data.result, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- GET --
dnsResource
  .command("get")
  .description("Get a specific DNS record")
  .argument("<zone-id>", "Zone ID")
  .argument("<record-id>", "DNS record ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli dns get abc123 rec456\n  cloudflare-cli dns get abc123 rec456 --json",
  )
  .action(async (zoneId: string, recordId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = (await client.get(`/zones/${zoneId}/dns_records/${recordId}`)) as { result: unknown };
      output(data.result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CREATE --
dnsResource
  .command("create")
  .description("Create a new DNS record")
  .argument("<zone-id>", "Zone ID")
  .requiredOption("--type <type>", "Record type: A, AAAA, CNAME, MX, TXT, NS, etc.")
  .requiredOption("--name <name>", "DNS record name (e.g. sub.example.com or @ for root)")
  .requiredOption("--content <content>", "Record content (IP address, hostname, text, etc.)")
  .option("--ttl <seconds>", "TTL in seconds (1 = automatic)", "1")
  .option("--proxied", "Enable Cloudflare proxy (orange cloud)")
  .option("--priority <n>", "Priority for MX records")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  cloudflare-cli dns create abc123 --type A --name @ --content 1.2.3.4\n  cloudflare-cli dns create abc123 --type CNAME --name blog --content example.com --proxied\n  cloudflare-cli dns create abc123 --type MX --name @ --content mail.example.com --priority 10',
  )
  .action(async (zoneId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        type: opts.type as string,
        name: opts.name as string,
        content: opts.content as string,
        ttl: Number(opts.ttl ?? 1),
      };
      if (opts.proxied) body.proxied = true;
      if (opts.priority) body.priority = Number(opts.priority);

      const data = (await client.post(`/zones/${zoneId}/dns_records`, body)) as { result: unknown };
      output(data.result, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
dnsResource
  .command("update")
  .description("Update an existing DNS record")
  .argument("<zone-id>", "Zone ID")
  .argument("<record-id>", "DNS record ID")
  .option("--type <type>", "Record type")
  .option("--name <name>", "Record name")
  .option("--content <content>", "Record content")
  .option("--ttl <seconds>", "TTL in seconds (1 = automatic)")
  .option("--proxied", "Enable Cloudflare proxy")
  .option("--no-proxied", "Disable Cloudflare proxy")
  .option("--priority <n>", "Priority for MX records")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli dns update abc123 rec456 --content 5.6.7.8\n  cloudflare-cli dns update abc123 rec456 --proxied --json\n  cloudflare-cli dns update abc123 rec456 --ttl 300",
  )
  .action(async (zoneId: string, recordId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.type) body.type = opts.type;
      if (opts.name) body.name = opts.name;
      if (opts.content) body.content = opts.content;
      if (opts.ttl) body.ttl = Number(opts.ttl);
      if (opts.proxied === true) body.proxied = true;
      if (opts.proxied === false) body.proxied = false;
      if (opts.priority) body.priority = Number(opts.priority);

      const data = (await client.patch(`/zones/${zoneId}/dns_records/${recordId}`, body)) as { result: unknown };
      output(data.result, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
dnsResource
  .command("delete")
  .description("Delete a DNS record")
  .argument("<zone-id>", "Zone ID")
  .argument("<record-id>", "DNS record ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  cloudflare-cli dns delete abc123 rec456\n  cloudflare-cli dns delete abc123 rec456 --json",
  )
  .action(async (zoneId: string, recordId: string, opts: { json?: boolean }) => {
    try {
      const data = (await client.delete(`/zones/${zoneId}/dns_records/${recordId}`)) as { result: unknown };
      output(data.result ?? { deleted: true, record_id: recordId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
