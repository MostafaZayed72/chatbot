export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.username === 'Mostafa' && body.password === 'Mostafa') {
        setCookie(event, 'auth_token', 'valid-session', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            httpOnly: false
        })
        return { success: true }
    }

    throw createError({
        statusCode: 401,
        message: 'Invalid Username or Password'
    })
})
