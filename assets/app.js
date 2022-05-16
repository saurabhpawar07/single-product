import routes from "./routes.js"
import _store from "./store.js"
import divloading from "./divloading.vue.js"
import tinyslider from "./tinyslider.js"
import leafrating from "./leafrating.vue.js"
const store = new Vuex.Store(_store)
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})
Vue.component('divloading', divloading)
Vue.component('tiny-slider', tinyslider)
Vue.component('leafrating', leafrating)

var app = new Vue({
    el: '#app',
    store,
    router,
    components: {
        'theme_header': () => import("./header.vue.js"),
        'theme_footer': () => import("./footer.vue.js"),
        'quick_view_modal': () => import("./product_quick_view.vue.js"),
        'login_view_modal': () => import("./login.vue.js"),
        'handheld_toolbar' : () => import("./handheldtoolbar.vue.js")
    },
    data: {
        message: 'Hello Vue!',
        FullHD: 1408,
        Widescreen: 1216,
        Desktop: 1024,
        Tablet: 769
    },
    computed: {
        ...Vuex.mapState(['user', "device_type"]),
    },
    watch: {
        user(newValue, oldValue) {
            if (newValue) {
                if(!this.user.Joined){
                    this.$store.commit('set_showlogin', true )
                }
            }
        },
    },
    created() {
        window.addEventListener("resize", this.onScreenSizeChange);
    },
    mounted: function () {
        this.setDeviceType()
        if(this.user && this.user.ID> 0 && !this.user.Joined){
            this.$store.commit('set_showlogin', true )
        }
    },
    methods: {
        onScreenSizeChange(e) {
            this.deviceWidth = window.innerWidth
            this.setDeviceType()
        },
        setDeviceType() {
            if (window.innerWidth > this.Desktop) {
                this.$store.commit('set_device_type', "Desktop")
            } else if (window.innerWidth > this.Tablet) {
                this.$store.commit('set_device_type', "Tablet")
            } else if (window.innerWidth < this.Tablet) {
                this.$store.commit('set_device_type', "Mobile")
            }
        },
    }
})