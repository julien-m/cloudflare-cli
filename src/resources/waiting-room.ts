import { Command } from 'commander';
import { client } from '../lib/client.js';
import { output } from '../lib/output.js';
import { handleError } from '../lib/errors.js';

export const waitingRoomResource = new Command('waiting-room')
  .description('Manage waiting rooms');

waitingRoomResource
  .command('list <zone-id>')
  .description('List waiting rooms')
  .option('--fields <fields>', 'Comma-separated fields')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, options) => {
    try {
      const params = new URLSearchParams();
      if (options.fields) params.append('fields', options.fields);
      const queryStr = params.toString();
      const url = `/zones/${zoneId}/waiting_rooms${queryStr ? '?' + queryStr : ''}`;
      const response = await client.get(url);
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

waitingRoomResource
  .command('get <zone-id> <wr-id>')
  .description('Get waiting room')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, wrId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/waiting_rooms/${wrId}`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });

waitingRoomResource
  .command('create <zone-id>')
  .description('Create waiting room')
  .requiredOption('--name <name>', 'Waiting room name')
  .requiredOption('--host <host>', 'Hostname')
  .requiredOption(
    '--total-active-users <total-active-users>',
    'Total active users allowed'
  )
  .requiredOption(
    '--new-users-per-minute <new-users-per-minute>',
    'New users per minute'
  )
  .option('--path <path>', 'Path (default: /)')
  .option('--session-duration <session-duration>', 'Session duration in minutes (default: 5)')
  .option('--queue-all', 'Queue all users')
  .option('--disable-session-renewal', 'Disable session renewal')
  .option('--description <description>', 'Waiting room description')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, options) => {
    try {
      const body: any = {
        name: options.name,
        host: options.host,
        total_active_users: parseInt(options.totalActiveUsers, 10),
        new_users_per_minute: parseInt(options.newUsersPerMinute, 10),
      };
      if (options.path) body.path = options.path;
      else body.path = '/';
      if (options.sessionDuration) {
        body.session_duration = parseInt(options.sessionDuration, 10);
      }
      if (options.queueAll) body.queue_all = true;
      if (options.disableSessionRenewal) body.disable_session_renewal = true;
      if (options.description) body.description = options.description;
      const response = await client.post(
        `/zones/${zoneId}/waiting_rooms`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

waitingRoomResource
  .command('update <zone-id> <wr-id>')
  .description('Update waiting room')
  .option('--name <name>', 'Waiting room name')
  .option('--host <host>', 'Hostname')
  .option('--total-active-users <total-active-users>', 'Total active users')
  .option('--new-users-per-minute <new-users-per-minute>', 'New users per minute')
  .option('--path <path>', 'Path')
  .option('--session-duration <session-duration>', 'Session duration in minutes')
  .option('--queue-all', 'Queue all users')
  .option('--disable-session-renewal', 'Disable session renewal')
  .option('--description <description>', 'Waiting room description')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, wrId, options) => {
    try {
      const body: any = {};
      if (options.name) body.name = options.name;
      if (options.host) body.host = options.host;
      if (options.totalActiveUsers)
        body.total_active_users = parseInt(options.totalActiveUsers, 10);
      if (options.newUsersPerMinute)
        body.new_users_per_minute = parseInt(options.newUsersPerMinute, 10);
      if (options.path) body.path = options.path;
      if (options.sessionDuration)
        body.session_duration = parseInt(options.sessionDuration, 10);
      if (options.queueAll) body.queue_all = true;
      if (options.disableSessionRenewal) body.disable_session_renewal = true;
      if (options.description) body.description = options.description;
      const response = await client.patch(
        `/zones/${zoneId}/waiting_rooms/${wrId}`,
        body
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

waitingRoomResource
  .command('delete <zone-id> <wr-id>')
  .description('Delete waiting room')
  .option('--json', 'Output as JSON')
  .action(async (zoneId, wrId, options) => {
    try {
      const response = await client.delete(
        `/zones/${zoneId}/waiting_rooms/${wrId}`
      );
      output(response.result, options.json);
    } catch (error) {
      handleError(error);
    }
  });

waitingRoomResource
  .command('status <zone-id> <wr-id>')
  .description('Get waiting room status')
  .option('--json', 'Output as JSON')
  .option('--format <format>', 'Output format')
  .action(async (zoneId, wrId, options) => {
    try {
      const response = await client.get(
        `/zones/${zoneId}/waiting_rooms/${wrId}/status`
      );
      output(response.result, options.json, options.format);
    } catch (error) {
      handleError(error);
    }
  });
