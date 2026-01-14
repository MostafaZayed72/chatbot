import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const client = await serverSupabaseClient(event)

    const { error } = await client
        .from('requests')
        .delete()
        .eq('id', id)

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    return { success: true }
})
