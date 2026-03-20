import { Command } from 'commander';
import { client } from '../lib/client';
import { output } from '../lib/output';
import { handleError } from '../lib/errors';

export const argoResource = new Command('argo')
  .description('Manage Argo Smart Routing and Tiered Caching');

argoResource
  .command('smart-routing <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/argo/smart_routing`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

argoResource
  .command('set-smart-routing <zone-id>')
  .requiredOption('--value <value>', 'Smart Routing (on|off)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.patch(
        `/zones/${zoneId}/argo/smart_routing`,
        { value: options.value }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

argoResource
  .command('tiered-caching <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/argo/tiered_caching`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

argoResource
  .command('set-tiered-caching <zone-id>')
  .requiredOption('--value <value>', 'Tiered Caching (on|off)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.patch(
        `/zones/${zoneId}/argo/tiered_caching`,
        { value: options.value }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });
