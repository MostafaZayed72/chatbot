export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('auth_token')

    // If going to login page
    if (to.path === '/login') {
        // If already logged in, redirect to home
        if (token.value) {
            return navigateTo('/')
        }
        return
    }

    // If not logged in and trying to access protected pages
    if (!token.value) {
        return navigateTo('/login')
    }
})
