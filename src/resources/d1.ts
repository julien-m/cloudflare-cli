import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const d1Resource = new Command("d1")
  .description("Manage D1 databases");

d1Resource
  .command("list")
  .description("List D1 databases")
  .argument("<account-id>", "Account ID")
  .option("--name <name>", "Filter by database name")
  .option("--page <page>", "Page number")
  .option("--per-page <per-page>", "Results per page")
  .option("--fields <fields>", "Comma-separated fields to return")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.name) params.name = options.name;
      if (options.page) params.page = options.page;
      if (options.perPage) params.per_page = options.perPage;
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/d1/database`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

d1Resource
  .command("get")
  .description("Get a D1 database")
  .argument("<account-id>", "Account ID")
  .argument("<database-id>", "Database ID")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, databaseId, options) => {
    try {
      const data = await client.get(`/accounts/${accountId}/d1/database/${databaseId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

d1Resource
  .command("create")
  .description("Create a D1 database")
  .argument("<account-id>", "Account ID")
  .requiredOption("--name <name>", "Database name")
  .option(
    "--primary-location-hint <hint>",
    "Primary location (wnam|enam|weur|eeur|apac)"
  )
  .option("--json", "Output as JSON")
  .action(async (accountId, options) => {
    try {
      const body: Record<string, string> = {
        name: options.name,
      };

      if (options.primaryLocationHint) {
        body.primary_location_hint = options.primaryLocationHint;
      }

      const data = await client.post(`/accounts/${accountId}/d1/database`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

d1Resource
  .command("delete")
  .description("Delete a D1 database")
  .argument("<account-id>", "Account ID")
  .argument("<database-id>", "Database ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, databaseId, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/d1/database/${databaseId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

d1Resource
  .command("query")
  .description("Execute a query on a D1 database")
  .argument("<account-id>", "Account ID")
  .argument("<database-id>", "Database ID")
  .requiredOption("--sql <sql>", "SQL query string")
  .option("--params <params>", "JSON array of bind parameters")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, databaseId, options) => {
    try {
      const body: Record<string, any> = {
        sql: options.sql,
      };

      if (options.params) {
        body.params = JSON.parse(options.params);
      }

      const data = await client.post(`/accounts/${accountId}/d1/database/${databaseId}/query`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

d1Resource
  .command("raw")
  .description("Execute raw query on a D1 database")
  .argument("<account-id>", "Account ID")
  .argument("<database-id>", "Database ID")
  .requiredOption("--sql <sql>", "SQL query string")
  .option("--params <params>", "JSON array of bind parameters")
  .option("--json", "Output as JSON")
  .action(async (accountId, databaseId, options) => {
    try {
      const body: Record<string, any> = {
        sql: options.sql,
      };

      if (options.params) {
        body.params = JSON.parse(options.params);
      }

      const data = await client.post(`/accounts/${accountId}/d1/database/${databaseId}/raw`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

