import { Command } from 'commander';
import { client } from '../lib/client';
import { output } from '../lib/output';
import { handleError } from '../lib/errors';

export const customHostnamesResource = new Command('custom-hostnames')
  .description('Manage custom hostnames for SSL for SaaS');

customHostnamesResource
  .command('list <zone-id>')
  .option('--hostname <hostname>', 'Filter by hostname')
  .option('--page <page>', 'Page number')
  .option('--per-page <per-page>', 'Results per page')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.hostname) params.append('hostname', options.hostname);
      if (options.page) params.append('page', options.page);
      if (options.perPage) params.append('per_page', options.perPage);
      if (options.fields) params.append('fields', options.fields);
      const query = params.toString();
      const url = `/zones/${zoneId}/custom_hostnames${
        query ? '?' + query : ''
      }`;
      const data = await client.get(url);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('get <zone-id> <hostname-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, hostnameId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/custom_hostnames/${hostnameId}`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('create <zone-id>')
  .requiredOption('--hostname <hostname>', 'Custom hostname')
  .option('--ssl-method <method>', 'SSL method (http|txt|cname)')
  .option('--ssl-type <type>', 'SSL type (dv)')
  .option('--wildcard', 'Enable wildcard coverage')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body: any = {
        hostname: options.hostname,
        custom_metadata: {},
      };
      if (options.sslMethod || options.sslType) {
        body.ssl = {};
        if (options.sslMethod) body.ssl.method = options.sslMethod;
        if (options.sslType) body.ssl.type = options.sslType;
      }
      if (options.wildcard) body.wildcard = true;
      const data = await client.post(
        `/zones/${zoneId}/custom_hostnames`,
        body
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('update <zone-id> <hostname-id>')
  .option('--ssl-method <method>', 'SSL method (http|txt|cname)')
  .option('--ssl-type <type>', 'SSL type (dv)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, hostnameId, options) => {
    try {
      const body: any = {};
      if (options.sslMethod || options.sslType) {
        body.ssl = {};
        if (options.sslMethod) body.ssl.method = options.sslMethod;
        if (options.sslType) body.ssl.type = options.sslType;
      }
      const data = await client.patch(
        `/zones/${zoneId}/custom_hostnames/${hostnameId}`,
        body
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('delete <zone-id> <hostname-id>')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, hostnameId, options) => {
    try {
      const data = await client.delete(
        `/zones/${zoneId}/custom_hostnames/${hostnameId}`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('fallback <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/custom_hostnames/fallback_origin`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('set-fallback <zone-id>')
  .requiredOption('--origin <origin>', 'Fallback origin hostname')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.put(
        `/zones/${zoneId}/custom_hostnames/fallback_origin`,
        { origin: options.origin }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

customHostnamesResource
  .command('delete-fallback <zone-id>')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.delete(
        `/zones/${zoneId}/custom_hostnames/fallback_origin`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });
