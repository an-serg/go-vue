export const token_config = {
    accessTtl: '1m' as const,
    refreshTtl: '3m' as const,

    accessTtlMs: 1 * 60 * 1000,
    refreshTtlMs: 3 * 60 * 1000,

    verifyTtl: '24h' as const,
};