export const cookie_config = {
    httpOnly: true,
    secure: false, // Для локальной разработки HTTP
    sameSite: 'strict' as const,
    accessMaxAge: 1 * 60 * 1000,
    refreshMaxAge: 3 * 60 * 1000,
}