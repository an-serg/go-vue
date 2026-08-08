export const cookie_config = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict' as const,
    accessMaxAge: 1 * 60 * 1000,
    refreshMaxAge: 3 * 60 * 1000,
}