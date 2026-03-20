import { Command } from 'commander';
import { client } from '../lib/client';
import { output } from '../lib/output';
import { handleError } from '../lib/errors';

export const sslResource = new Command('ssl')
  .description('Manage SSL/TLS certificates and settings');

sslResource
  .command('mode <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(`/zones/${zoneId}/settings/ssl`);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('set-mode <zone-id>')
  .requiredOption('--value <value>', 'SSL mode (off|flexible|full|strict)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.patch(`/zones/${zoneId}/settings/ssl`, {
        value: options.value,
      });
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('universal <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/ssl/universal/settings`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('set-universal <zone-id>')
  .option('--enabled', 'Enable universal SSL')
  .option('--no-enabled', 'Disable universal SSL')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const enabled = options.enabled !== false;
      const data = await client.patch(
        `/zones/${zoneId}/ssl/universal/settings`,
        { enabled }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('certificate-packs <zone-id>')
  .option('--status <status>', 'Filter by status (all|active|expired|etc)')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.fields) params.append('fields', options.fields);
      const query = params.toString();
      const url = `/zones/${zoneId}/ssl/certificate_packs${
        query ? '?' + query : ''
      }`;
      const data = await client.get(url);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('order-pack <zone-id>')
  .requiredOption('--type <type>', 'Certificate type (advanced)')
  .requiredOption('--hosts <hosts>', 'Comma-separated hostnames')
  .option('--certificate-authority <ca>', 'Certificate authority')
  .option('--validation-method <method>', 'Validation method (txt|http|email)')
  .option('--validity-days <days>', 'Validity days (14|30|90|365)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body: any = {
        type: options.type,
        hosts: options.hosts.split(',').map((h: string) => h.trim()),
      };
      if (options.certificateAuthority)
        body.certificate_authority = options.certificateAuthority;
      if (options.validationMethod)
        body.validation_method = options.validationMethod;
      if (options.validityDays)
        body.validity_days = parseInt(options.validityDays);
      const data = await client.post(
        `/zones/${zoneId}/ssl/certificate_packs/order`,
        body
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('delete-pack <zone-id> <pack-id>')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, packId, options) => {
    try {
      const data = await client.delete(
        `/zones/${zoneId}/ssl/certificate_packs/${packId}`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('tls-versions <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/settings/min_tls_version`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('set-tls-version <zone-id>')
  .requiredOption('--value <value>', 'TLS version (1.0|1.1|1.2|1.3)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.patch(
        `/zones/${zoneId}/settings/min_tls_version`,
        { value: options.value }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('always-https <zone-id>')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const data = await client.get(
        `/zones/${zoneId}/settings/always_use_https`
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('set-always-https <zone-id>')
  .requiredOption('--value <value>', 'Always HTTPS (on|off)')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const data = await client.patch(
        `/zones/${zoneId}/settings/always_use_https`,
        { value: options.value }
      );
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('origin-certs')
  .option('--zone-id <zone-id>', 'Filter by zone ID')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (options) => {
    try {
      const params = new URLSearchParams();
      if (options.zoneId) params.append('zone_id', options.zoneId);
      if (options.fields) params.append('fields', options.fields);
      const query = params.toString();
      const url = `/certificates${query ? '?' + query : ''}`;
      const data = await client.get(url);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('create-origin-cert')
  .requiredOption('--hostnames <hostnames>', 'Comma-separated hostnames')
  .option('--requested-validity <days>', 'Requested validity in days')
  .option('--request-type <type>', 'Request type (origin-rsa|origin-ecc)')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const body: any = {
        hostnames: options.hostnames.split(',').map((h: string) => h.trim()),
      };
      if (options.requestedValidity)
        body.requested_validity = parseInt(options.requestedValidity);
      if (options.requestType) body.request_type = options.requestType;
      const data = await client.post('/certificates', body);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });

sslResource
  .command('revoke-origin-cert <cert-id>')
  .option('--json', 'Output as JSON')
  .action(async (certId, options) => {
    try {
      const data = await client.delete(`/certificates/${certId}`);
      output(data.result, options);
    } catch (error) {
      handleError(error);
    }
  });
