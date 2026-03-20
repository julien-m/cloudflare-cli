import { Command } from 'commander';
import { client } from '../lib/client.js';
import { output } from '../lib/output.js';
import { handleError } from '../lib/errors.js';

export const cacheResource = new Command('cache')
  .description('Manage cache settings and purge');

cacheResource
  .command('purge <zone-id>')
  .description('Purge cache')
  .option('--everything', 'Purge all cache')
  .option('--files <files>', 'Comma-separated URLs to purge')
  .option('--tags <tags>', 'Comma-separated cache tags')
  .option('--hosts <hosts>', 'Comma-separated hostnames')
  .option('--prefixes <prefixes>', 'Comma-separated URL prefixes')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      let body: any = {};
      if (options.everything) {
        body.purge_everything = true;
      } else {
        if (options.files) {
          body.files = options.files.split(',').map((f: string) => f.trim());
        }
        if (options.tags) {
          body.tags = options.tags.split(',').map((t: string) => t.trim());
        }
        if (options.hosts) {
          body.hosts = options.hosts.split(',').map((h: string) => h.trim());
        }
        if (options.prefixes) {
          body.prefixes = options.prefixes.split(',').map((p: string) => p.trim());
        }
      }
      const response = await client.post(`/zones/${zoneId}/purge_cache`, body);
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('level <zone-id>')
  .description('Get cache level setting')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const response = await client.get(`/zones/${zoneId}/settings/cache_level`);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('set-level <zone-id>')
  .description('Set cache level')
  .requiredOption('--value <value>', 'Cache level (aggressive|basic|simplified)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body = { value: options.value };
      const response = await client.patch(
        `/zones/${zoneId}/settings/cache_level`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('ttl <zone-id>')
  .description('Get browser cache TTL setting')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/settings/browser_cache_ttl`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('set-ttl <zone-id>')
  .description('Set browser cache TTL')
  .requiredOption('--value <value>', 'Cache TTL in seconds')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body = { value: parseInt(options.value, 10) };
      const response = await client.patch(
        `/zones/${zoneId}/settings/browser_cache_ttl`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('dev-mode <zone-id>')
  .description('Get development mode setting')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/settings/development_mode`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

cacheResource
  .command('set-dev-mode <zone-id>')
  .description('Set development mode')
  .requiredOption('--value <value>', 'Development mode (on|off)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body = { value: options.value };
      const response = await client.patch(
        `/zones/${zoneId}/settings/development_mode`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });
