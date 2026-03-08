#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { zonesResource } from "./resources/zones.js";
import { dnsResource } from "./resources/dns.js";
import { tunnelsResource } from "./resources/tunnels.js";
import { securityResource } from "./resources/security.js";

const program = new Command();

program
  .name("cloudflare-cli")
  .description("CLI for the Cloudflare API - manage zones, DNS, tunnels, and security")
  .version("0.1.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

program.addCommand(authCommand);
program.addCommand(zonesResource);
program.addCommand(dnsResource);
program.addCommand(tunnelsResource);
program.addCommand(securityResource);

program.parse();
