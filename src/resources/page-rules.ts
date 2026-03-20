import { Command } from 'commander';
import { client } from '../lib/client.js';
import { output } from '../lib/output.js';
import { handleError } from '../lib/errors.js';

export const pageRulesResource = new Command('page-rules')
  .description('Manage page rules');

pageRulesResource
  .command('list <zone-id>')
  .description('List page rules')
  .option('--status <status>', 'Filter by status (active|disabled)')
  .option('--order <order>', 'Order by (status|priority)')
  .option('--page <page>', 'Page number')
  .option('--per-page <per-page>', 'Results per page')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.order) params.append('order', options.order);
      if (options.page) params.append('page', options.page);
      if (options.perPage) params.append('per_page', options.perPage);
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/zones/${zoneId}/pagerules${queryStr ? '?' + queryStr : ''}`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

pageRulesResource
  .command('get <zone-id> <rule-id>')
  .description('Get page rule')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, ruleId, options) => {
    try {
      const response = await client.get(`/zones/${zoneId}/pagerules/${ruleId}`);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

pageRulesResource
  .command('create <zone-id>')
  .description('Create page rule')
  .requiredOption('--url <url>', 'URL pattern with * wildcards')
  .requiredOption('--actions <actions>', 'JSON array of action objects')
  .option('--priority <priority>', 'Priority number')
  .option('--status <status>', 'Status (active|disabled, default: active)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const actions = JSON.parse(options.actions);
      const body: any = {
        targets: [
          {
            target: 'url',
            constraint: {
              operator: 'matches',
              value: options.url,
            },
          },
        ],
        actions,
      };
      if (options.priority) body.priority = parseInt(options.priority, 10);
      if (options.status) body.status = options.status;
      const response = await client.post(`/zones/${zoneId}/pagerules`, body);
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

pageRulesResource
  .command('update <zone-id> <rule-id>')
  .description('Update page rule')
  .option('--url <url>', 'URL pattern with * wildcards')
  .option('--actions <actions>', 'JSON array of action objects')
  .option('--priority <priority>', 'Priority number')
  .option('--status <status>', 'Status (active|disabled)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, ruleId, options) => {
    try {
      const body: any = {};
      if (options.url) {
        body.targets = [
          {
            target: 'url',
            constraint: {
              operator: 'matches',
              value: options.url,
            },
          },
        ];
      }
      if (options.actions) body.actions = JSON.parse(options.actions);
      if (options.priority) body.priority = parseInt(options.priority, 10);
      if (options.status) body.status = options.status;
      const response = await client.patch(
        `/zones/${zoneId}/pagerules/${ruleId}`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

pageRulesResource
  .command('delete <zone-id> <rule-id>')
  .description('Delete page rule')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, ruleId, options) => {
    try {
      const response = await client.delete(
        `/zones/${zoneId}/pagerules/${ruleId}`
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });
