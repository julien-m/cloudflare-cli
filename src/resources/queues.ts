import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const queuesResource = new Command("queues")
  .description("Manage Cloudflare Queues");

queuesResource
  .command("list")
  .description("List Queues")
  .argument("<account-id>", "Account ID")
  .option("--fields <fields>", "Comma-separated fields to return")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/queues`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("get")
  .description("Get a Queue")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, queueId, options) => {
    try {
      const data = await client.get(`/accounts/${accountId}/queues/${queueId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("create")
  .description("Create a Queue")
  .argument("<account-id>", "Account ID")
  .requiredOption("--name <name>", "Queue name")
  .option("--json", "Output as JSON")
  .action(async (accountId, options) => {
    try {
      const body = { name: options.name };

      const data = await client.post(`/accounts/${accountId}/queues`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("delete")
  .description("Delete a Queue")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, queueId, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/queues/${queueId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("update")
  .description("Update a Queue")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .requiredOption("--name <name>", "New Queue name")
  .option("--json", "Output as JSON")
  .action(async (accountId, queueId, options) => {
    try {
      const body = { name: options.name };

      const data = await client.put(`/accounts/${accountId}/queues/${queueId}`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("consumers")
  .description("List Queue consumers")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .option("--fields <fields>", "Comma-separated fields to return")
  .action(async (accountId, queueId, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/queues/${queueId}/consumers`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("add-consumer")
  .description("Add consumer to Queue")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .requiredOption("--script-name <script>", "Worker script name")
  .option("--batch-size <size>", "Batch size (default: 10)")
  .option("--max-retries <retries>", "Max retries (default: 3)")
  .option("--max-wait-time-ms <ms>", "Max wait time in milliseconds")
  .option("--json", "Output as JSON")
  .action(async (accountId, queueId, options) => {
    try {
      const body: Record<string, any> = {
        script_name: options.scriptName,
      };

      if (options.batchSize) {
        body.batch_size = parseInt(options.batchSize);
      }
      if (options.maxRetries) {
        body.max_retries = parseInt(options.maxRetries);
      }
      if (options.maxWaitTimeMs) {
        body.max_wait_time_ms = parseInt(options.maxWaitTimeMs);
      }

      const data = await client.post(`/accounts/${accountId}/queues/${queueId}/consumers`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

queuesResource
  .command("delete-consumer")
  .description("Delete Queue consumer")
  .argument("<account-id>", "Account ID")
  .argument("<queue-id>", "Queue ID")
  .argument("<consumer-id>", "Consumer ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, queueId, consumerId, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/queues/${queueId}/consumers/${consumerId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

