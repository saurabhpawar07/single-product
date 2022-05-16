import _store from "./store.js"
export default [
    {
        name: "home",
        path: '/',
        component: () => import("./home.vue.js")
    },
    {
        name: "shop",
        path: '/shop',
        component: () => import("./shop.vue.js")
    },
    {
        name: "product",
        path: '/product/:product_id/:product_name?',
        component: () => import("./product_page.vue.js"),
        props: (route) => {
            var product_id = ""
            var product_name = ""
            product_id = Number.parseInt(route.params.product_id, 0)
            if (route.params.product_name) {
                product_name = decodeURI(route.params.product_name)
            }
            return {
                product_id: product_id,
                product_name: product_name
            }
        }
    },
    {
        name: "page",
        path: '/pages/:page_id',
        component: () => import("./page.vue.js"),
        props: true
    },
    {
        name: "test",
        path: '/test/',
        component: () => import("./test.js")
    },
    {
        name: "blogs",
        path: '/blogs/:blog_category_id?',
        props: true,
        component: () => import("./blogs.vue.js")
    },
    {
        name: "blog",
        path: '/blog/:blog_id?',
        props: true,
        component: () => import("./blog.vue.js")
    },
    {
        name: "cart",
        path: '/cart',
        component: () => import("./cart.vue.js")
    },
    {
        name: "checkout",
        path: '/checkout',
        component: () => import("./checkout.vue.js")
    },
    {
        name: "checkout_successfully",
        path: '/checkout_successfully/:order_id?',
        props: true,
        component: () => import("./checkout_successfully.vue.js")
    },
    {
        name: "shopbycategory",
        path: '/shop/:category_name',
        props: true,
        component: () => import("./shop.vue.js")
    },
    {
        name: "shopbysubcategory",
        path: '/shop/:category_name/:subcategory_name',
        props: true,
        component: () => import("./shop.vue.js")
    },
    {
        name: "shopbychildcategory",
        path: '/shop/:category_name/:subcategory_name/:childcategory_name',
        props: true,
        component: () => import("./shop.vue.js")
    },
    {
        name: "",
        path: '/user',
        component: () => import("./user.vue.js"),
        children: [
            {
                name: "profile",
                path: '/',
                meta: { title: "Profile info" },
                component: () => import("./profile.vue.js"),
            },
            {
                name: "addresses",
                path: 'addresses',
                meta: { title: "My addresses" },
                component: () => import("./addresses.vue.js")
            },
            {
                name: "orders",
                path: 'orders',
                meta: { title: "My orders" },
                component: () => import("./orders.vue.js")
            },
            {
                name: "order",
                path: 'orders/:order_id',
                component: () => import("./order.vue.js"),
                meta: { title: "Order Details" },
                props: true
            },
            {
                name: "wishlist",
                path: 'wishlist',
                meta: { title: "My wishlist" },
                component: () => import("./wishlist.vue.js")
            },
            {
                name: "support",
                path: 'support',
                meta: { title: "Support tickets" },
                component: () => import("./support.vue.js")
            },
            {
                name: "ticket",
                path: 'ticket',
                meta: { title: "Support ticket" },
                component: () => import("./ticket.vue.js")
            },
            {
                name: "reset password",
                path: 'reset_password',
                meta: { title: "Forgot your password?" },
                component: () => import("./reset_password.vue.js")
            },
            {
                name: "Wallet",
                path: 'wallet',
                meta: { title: "My Wallet" },
                component: () => import("./wallet.vue.js")
            },
            {
                name: "payment methods",
                path: 'paymentmethods',
                meta: { title: "My Payment Methods" },
                component: () => import("./notfound.vue.js")
            },
        ]
    },
    {
        name: "notfound",
        path: '/*',
        component: () => import("./notfound.vue.js")
    },
]