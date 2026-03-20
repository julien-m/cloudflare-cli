import { Command } from 'commander';
import { client } from '../lib/client.js';
import { output } from '../lib/output.js';
import { handleError } from '../lib/errors.js';

export const emailRoutingResource = new Command('email-routing')
  .description('Manage email routing rules and addresses');

emailRoutingResource
  .command('status <zone-id>')
  .description('Get email routing status')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const response = await client.get(`/zones/${zoneId}/email/routing`);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('enable <zone-id>')
  .description('Enable email routing')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const response = await client.post(
        `/zones/${zoneId}/email/routing/enable`,
        {}
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('disable <zone-id>')
  .description('Disable email routing')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const response = await client.post(
        `/zones/${zoneId}/email/routing/disable`,
        {}
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('rules <zone-id>')
  .description('List email routing rules')
  .option('--page <page>', 'Page number')
  .option('--per-page <per-page>', 'Results per page')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.perPage) params.append('per_page', options.perPage);
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/zones/${zoneId}/email/routing/rules${
        queryStr ? '?' + queryStr : ''
      }`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('rule-get <zone-id> <rule-id>')
  .description('Get email routing rule')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, ruleId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/email/routing/rules/${ruleId}`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('rule-create <zone-id>')
  .description('Create email routing rule')
  .requiredOption('--matchers <matchers>', 'JSON array of matchers')
  .requiredOption('--actions <actions>', 'JSON array of actions')
  .option('--name <name>', 'Rule name')
  .option('--enabled', 'Enable rule (default: true)')
  .option('--priority <priority>', 'Rule priority')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const matchers = JSON.parse(options.matchers);
      const actions = JSON.parse(options.actions);
      const body: any = { matchers, actions };
      if (options.name) body.name = options.name;
      if (options.enabled !== undefined) body.enabled = options.enabled;
      if (options.priority) body.priority = parseInt(options.priority, 10);
      const response = await client.post(
        `/zones/${zoneId}/email/routing/rules`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('rule-update <zone-id> <rule-id>')
  .description('Update email routing rule')
  .option('--matchers <matchers>', 'JSON array of matchers')
  .option('--actions <actions>', 'JSON array of actions')
  .option('--name <name>', 'Rule name')
  .option('--enabled', 'Enable rule')
  .option('--priority <priority>', 'Rule priority')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, ruleId, options) => {
    try {
      const body: any = {};
      if (options.matchers) body.matchers = JSON.parse(options.matchers);
      if (options.actions) body.actions = JSON.parse(options.actions);
      if (options.name) body.name = options.name;
      if (options.enabled !== undefined) body.enabled = options.enabled;
      if (options.priority) body.priority = parseInt(options.priority, 10);
      const response = await client.put(
        `/zones/${zoneId}/email/routing/rules/${ruleId}`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('rule-delete <zone-id> <rule-id>')
  .description('Delete email routing rule')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, ruleId, options) => {
    try {
      const response = await client.delete(
        `/zones/${zoneId}/email/routing/rules/${ruleId}`
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('addresses <account-id>')
  .description('List email routing addresses')
  .option('--page <page>', 'Page number')
  .option('--per-page <per-page>', 'Results per page')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (accountId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.perPage) params.append('per_page', options.perPage);
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/accounts/${accountId}/email/routing/addresses${
        queryStr ? '?' + queryStr : ''
      }`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('address-create <account-id>')
  .description('Create email routing address')
  .requiredOption('--email <email>', 'Destination email address')
  .option('--json', 'Output as JSON')
  .action(async (accountId, options) => {
    try {
      const body = { email: options.email };
      const response = await client.post(
        `/accounts/${accountId}/email/routing/addresses`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('address-delete <account-id> <address-id>')
  .description('Delete email routing address')
  .option('--json', 'Output as JSON')
  .action(async (accountId, addressId, options) => {
    try {
      const response = await client.delete(
        `/accounts/${accountId}/email/routing/addresses/${addressId}`
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('catch-all <zone-id>')
  .description('Get catch-all email routing rule')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/email/routing/rules/catch_all`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

emailRoutingResource
  .command('set-catch-all <zone-id>')
  .description('Set catch-all email routing rule')
  .requiredOption('--actions <actions>', 'JSON array of actions')
  .option(
    '--matchers <matchers>',
    'JSON array of matchers (default: [{type:"all"}])'
  )
  .option('--enabled', 'Enable rule (default: true)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const actions = JSON.parse(options.actions);
      const body: any = { actions };
      if (options.matchers) {
        body.matchers = JSON.parse(options.matchers);
      } else {
        body.matchers = [{ type: 'all' }];
      }
      if (options.enabled !== undefined) body.enabled = options.enabled;
      const response = await client.put(
        `/zones/${zoneId}/email/routing/rules/catch_all`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });
