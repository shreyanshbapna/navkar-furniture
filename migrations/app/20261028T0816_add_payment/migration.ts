#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6d655a4399988c5767a1552fa5355e316d2fb5dcef6128f0e55f20432b2ea1f8/contract';
import endContract from '../../snapshots/6d655a4399988c5767a1552fa5355e316d2fb5dcef6128f0e55f20432b2ea1f8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/eb5cba255bd8875a2d346f4e6cd96ad5f6fea868b8584d7ba98427ed2e70bfc3/contract';
import startContract from '../../snapshots/eb5cba255bd8875a2d346f4e6cd96ad5f6fea868b8584d7ba98427ed2e70bfc3/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Payment',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('method', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('paidAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Payment',
        index: 'Payment_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Payment',
        foreignKey: {
          name: 'Payment_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
