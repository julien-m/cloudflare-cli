import { Command } from 'commander';
import { client } from '../lib/client';
import { output } from '../lib/output';
import { handleError } from '../lib/errors';

export const spectrumResource = new Command('spectrum')
  .description('Manage Spectrum applications for TCP/UDP proxying');

spectrumResource
  .command('list <zone-id>')
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
      const query = params.toString();
      const url = `/zones/${zoneId}/spectrum/apps${query ? '?' + query : ''}`;
      const data = await client.get(url);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

spectrumResource
  .command('get <zone-id> <app-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, appId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/spectrum/apps/${appId}`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

spectrumResource
  .command('create <zone-id>')
  .requiredOption('--protocol <protocol>', 'Protocol (tcp/443|udp/53|etc)')
  .requiredOption('--dns-type <type>', 'DNS type (CNAME|ADDRESS)')
  .requiredOption('--dns-name <name>', 'Subdomain')
  .option('--origin-dns-name <name>', 'Origin server hostname')
  .option('--origin-direct <ips>', 'Comma-separated origin IPs with ports (tcp://1.2.3.4:8080)')
  .option('--tls <tls>', 'TLS mode (off|flexible|full|strict)')
  .option('--edge-ips-type <type>', 'Edge IPs type (dynamic|static)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body: any = {
        protocol: options.protocol,
        dns: {
          type: options.dnsType,
          name: options.dnsName,
        },
      };

      if (options.originDnsName) {
        body.origin_dns = {
          name: options.originDnsName,
        };
      } else if (options.originDirect) {
        body.origin_direct = options.originDirect
          .split(',')
          .map((ip: string) => ip.trim());
      }

      if (options.tls) body.tls = options.tls;
      if (options.edgeIpsType) body.edge_ips = { type: options.edgeIpsType };

      const data = await client.post(
        `/zones/${zoneId}/spectrum/apps`,
        body
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

spectrumResource
  .command('update <zone-id> <app-id>')
  .option('--protocol <protocol>', 'Protocol (tcp/443|udp/53|etc)')
  .option('--dns-type <type>', 'DNS type (CNAME|ADDRESS)')
  .option('--dns-name <name>', 'Subdomain')
  .option('--origin-dns-name <name>', 'Origin server hostname')
  .option('--origin-direct <ips>', 'Comma-separated origin IPs with ports')
  .option('--tls <tls>', 'TLS mode (off|flexible|full|strict)')
  .option('--edge-ips-type <type>', 'Edge IPs type (dynamic|static)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, appId, options) => {
    try {
      const body: any = {};

      if (options.protocol) body.protocol = options.protocol;

      if (options.dnsType || options.dnsName) {
        body.dns = {};
        if (options.dnsType) body.dns.type = options.dnsType;
        if (options.dnsName) body.dns.name = options.dnsName;
      }

      if (options.originDnsName) {
        body.origin_dns = {
          name: options.originDnsName,
        };
      } else if (options.originDirect) {
        body.origin_direct = options.originDirect
          .split(',')
          .map((ip: string) => ip.trim());
      }

      if (options.tls) body.tls = options.tls;
      if (options.edgeIpsType) body.edge_ips = { type: options.edgeIpsType };

      const data = await client.put(
        `/zones/${zoneId}/spectrum/apps/${appId}`,
        body
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

spectrumResource
  .command('delete <zone-id> <app-id>')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, appId, options) => {
    try {
      const data = await client.delete(
        `/zones/${zoneId}/spectrum/apps/${appId}`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });
