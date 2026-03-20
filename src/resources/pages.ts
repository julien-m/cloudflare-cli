import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const pagesResource = new Command("pages")
  .description("Manage Pages projects and deployments");

pagesResource
  .command("list")
  .description("List Pages projects")
  .argument("<account-id>", "Account ID")
  .option("--fields <fields>", "Comma-separated fields to return")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/pages/projects`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("get")
  .description("Get a Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, projectName, options) => {
    try {
      const data = await client.get(`/accounts/${accountId}/pages/projects/${projectName}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("create")
  .description("Create a Pages project")
  .argument("<account-id>", "Account ID")
  .requiredOption("--name <name>", "Project name")
  .option("--production-branch <branch>", "Production branch (default: main)")
  .option("--json", "Output as JSON")
  .action(async (accountId, options) => {
    try {
      const body: Record<string, string> = {
        name: options.name,
      };

      if (options.productionBranch) {
        body.production_branch = options.productionBranch;
      }

      const data = await client.post(`/accounts/${accountId}/pages/projects`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("delete")
  .description("Delete a Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/pages/projects/${projectName}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("deployments")
  .description("List deployments for a Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .option("--page <page>", "Page number")
  .option("--per-page <per-page>", "Results per page")
  .option("--fields <fields>", "Comma-separated fields to return")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, projectName, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.page) params.page = options.page;
      if (options.perPage) params.per_page = options.perPage;
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/pages/projects/${projectName}/deployments`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("deployment-get")
  .description("Get a Pages deployment")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .argument("<deployment-id>", "Deployment ID")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .action(async (accountId, projectName, deploymentId, options) => {
    try {
      const data = await client.get(`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("deployment-delete")
  .description("Delete a Pages deployment")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .argument("<deployment-id>", "Deployment ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, deploymentId, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("deployment-retry")
  .description("Retry a Pages deployment")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .argument("<deployment-id>", "Deployment ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, deploymentId, options) => {
    try {
      const data = await client.post(`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/retry`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("deployment-rollback")
  .description("Rollback a Pages deployment")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .argument("<deployment-id>", "Deployment ID")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, deploymentId, options) => {
    try {
      const data = await client.post(`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/rollback`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("domains")
  .description("List custom domains for a Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .option("--json", "Output as JSON")
  .option("--format <format>", "Output format (json|table|text)")
  .option("--fields <fields>", "Comma-separated fields to return")
  .action(async (accountId, projectName, options) => {
    try {
      const params: Record<string, string> = {};
      if (options.fields) params.fields = options.fields;

      const data = await client.get(`/accounts/${accountId}/pages/projects/${projectName}/domains`, params);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("add-domain")
  .description("Add custom domain to Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .requiredOption("--name <name>", "Custom domain name")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, options) => {
    try {
      const body = { name: options.name };

      const data = await client.post(`/accounts/${accountId}/pages/projects/${projectName}/domains`, body);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

pagesResource
  .command("delete-domain")
  .description("Delete custom domain from Pages project")
  .argument("<account-id>", "Account ID")
  .argument("<project-name>", "Project name")
  .argument("<domain-name>", "Domain name")
  .option("--json", "Output as JSON")
  .action(async (accountId, projectName, domainName, options) => {
    try {
      const data = await client.delete(`/accounts/${accountId}/pages/projects/${projectName}/domains/${domainName}`);
      output(data.result, { json: !!options.json, format: options.format as string });
    } catch (err) {
      handleError(err, !!options.json);
    }
  });

