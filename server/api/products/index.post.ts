import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('products')
        .insert(body)
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    return data
})
