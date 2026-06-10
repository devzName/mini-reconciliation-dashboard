/// <reference types="jest" />

import { ReconciliationService } from '../src/modules/reconciliation/services/reconciliation.service';

describe('ReconciliationService', () => {
  it('normalizes reconciliation query before calling repository', async () => {
    let receivedQuery: unknown;
    const ordersRepository = {
      getReconciliation: async (query: unknown) => {
        receivedQuery = query;
        return {
          items: [],
          meta: {
            limit: 100,
            page: 1,
            total: 0,
            totalPages: 0,
          },
          statusCounts: {
            all: 0,
            matched: 0,
            orphan: 0,
            refunded: 0,
            unsettled: 0,
          },
        };
      },
    };
    const incomeRepository = {
      getKpi: async () => ({
        reconciliation_rate: 0,
        refund_count: 0,
        refund_total: 0,
        total_fees: 0,
        total_gross: 0,
        total_net: 0,
      }),
    };

    const service = new ReconciliationService(
      ordersRepository as never,
      incomeRepository as never,
    );

    await service.getReconciliation({
      limit: '999',
      page: '-3',
      q: '  ORD-2026  ',
      status: 'refunded',
    });

    expect(receivedQuery).toEqual({
      limit: 100,
      page: 1,
      search: 'ORD-2026',
      status: 'refunded',
    });
  });

  it('ignores invalid status values', async () => {
    let receivedQuery: unknown;
    const service = new ReconciliationService(
      {
        getReconciliation: async (query: unknown) => {
          receivedQuery = query;
          return {
            items: [],
            meta: {
              limit: 10,
              page: 2,
              total: 0,
              totalPages: 0,
            },
            statusCounts: {
              all: 0,
              matched: 0,
              orphan: 0,
              refunded: 0,
              unsettled: 0,
            },
          };
        },
      } as never,
      {
        getKpi: async () => ({
          reconciliation_rate: 0,
          refund_count: 0,
          refund_total: 0,
          total_fees: 0,
          total_gross: 0,
          total_net: 0,
        }),
      } as never,
    );

    await service.getReconciliation({
      limit: '10',
      page: '2',
      status: 'unknown' as never,
    });

    expect(receivedQuery).toEqual({
      limit: 10,
      page: 2,
      search: undefined,
      status: undefined,
    });
  });
});
