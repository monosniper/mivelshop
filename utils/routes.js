export const $apiRoutes = {
    items: {
        list: '/api/items',
        create: '/api/items',
        single: (id) => `/api/items/${id}`,
    },
    categories: {
        list: '/api/categories'
    },
    basket: {
        add: '/api/basket',
        remove: '/api/basket/',
        list: (user_id) => `/api/basket/${user_id}`,
    },
    orders: {
        list: (user_id) => `/api/orders?user=${user_id}`,
        create: '/api/orders',
    }
}