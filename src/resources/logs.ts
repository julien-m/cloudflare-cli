import { Command } from 'commander';
import { client } from '../lib/client.js';
import { output } from '../lib/output.js';
import { handleError } from '../lib/errors.js';

export const logsResource = new Command('logs')
  .description('Manage Logpush jobs and instant logs');

logsResource
  .command('jobs <zone-id>')
  .description('List Logpush jobs')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/zones/${zoneId}/logpush/jobs${queryStr ? '?' + queryStr : ''}`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('job-get <zone-id> <job-id>')
  .description('Get Logpush job')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, jobId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/logpush/jobs/${jobId}`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('job-create <zone-id>')
  .description('Create Logpush job')
  .requiredOption(
    '--destination-conf <destination-conf>',
    'Destination configuration (e.g. s3://bucket/path?region=us-east-1)'
  )
  .requiredOption(
    '--dataset <dataset>',
    'Dataset (http_requests|firewall_events|nel_reports|dns_logs)'
  )
  .option('--logpull-options <logpull-options>', 'Logpull options (fields and filters)')
  .option('--enabled', 'Enable job (default: true)')
  .option('--name <name>', 'Job name')
  .option('--frequency <frequency>', 'Frequency (high|low)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body: any = {
        destination_conf: options.destinationConf,
        dataset: options.dataset,
      };
      if (options.logpullOptions) body.logpull_options = options.logpullOptions;
      if (options.enabled !== undefined) body.enabled = options.enabled;
      if (options.name) body.name = options.name;
      if (options.frequency) body.frequency = options.frequency;
      const response = await client.post(
        `/zones/${zoneId}/logpush/jobs`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('job-update <zone-id> <job-id>')
  .description('Update Logpush job')
  .option('--destination-conf <destination-conf>', 'Destination configuration')
  .option('--enabled', 'Enable job')
  .option('--logpull-options <logpull-options>', 'Logpull options')
  .option('--frequency <frequency>', 'Frequency (high|low)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, jobId, options) => {
    try {
      const body: any = {};
      if (options.destinationConf)
        body.destination_conf = options.destinationConf;
      if (options.enabled !== undefined) body.enabled = options.enabled;
      if (options.logpullOptions) body.logpull_options = options.logpullOptions;
      if (options.frequency) body.frequency = options.frequency;
      const response = await client.put(
        `/zones/${zoneId}/logpush/jobs/${jobId}`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('job-delete <zone-id> <job-id>')
  .description('Delete Logpush job')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, jobId, options) => {
    try {
      const response = await client.delete(
        `/zones/${zoneId}/logpush/jobs/${jobId}`
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('datasets <zone-id> <dataset-name>')
  .description('Get available log fields for dataset')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, datasetName, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/logpush/datasets/${datasetName}/fields`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

logsResource
  .command('account-jobs <account-id>')
  .description('List account Logpush jobs')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (accountId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/accounts/${accountId}/logpush/jobs${
        queryStr ? '?' + queryStr : ''
      }`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });
