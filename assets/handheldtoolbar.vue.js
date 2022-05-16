export default {
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            showSideBarBtn : false,
        }
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations", "cart", "cart_cost_total"]),
        ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        $route(to, from) {
            this.init()
        },
    },
    methods: {
        gotouser(from) {
            if (this.user) {
                this.$router.push('/user')
            } else {
                this.$store.commit('set_showlogin', true )
            }
        },
        init(){
            switch (this.$route.name) {
                case 'blogs':
                case 'blog':
                    this.showSideBarBtn = true
                    break;
                default:
                    // code
            }
        },
    },
    mounted: function () {
        this.init()
    },
    template: `<div class="handheld-toolbar">
        <div class="d-table table-layout-fixed w-100">
            <a v-if="showSideBarBtn" class="d-table-cell handheld-toolbar-item" href="#" data-bs-toggle="offcanvas" data-bs-target="#blog-sidebar">
                <span class="handheld-toolbar-icon"><i class="ci-sign-in"></i></span>
                <span class="handheld-toolbar-label">Sidebar</span>
            </a>
            <a href="/user" class="d-table-cell handheld-toolbar-item" @click.prevent="gotouser">
                <span class="handheld-toolbar-icon"><i class="ci-user"></i></span>
                <span class="handheld-toolbar-label">User</span>
            </a>
            <router-link class="d-table-cell handheld-toolbar-item" to="/user/wishlist">
                <span class="handheld-toolbar-icon"><i class="ci-heart"></i></span>
                <span class="handheld-toolbar-label">Wishlist</span>
            </router-link>
            <a class="d-table-cell handheld-toolbar-item" href="javascript:void(0)" 
                data-bs-toggle="collapse" data-bs-target="#navbarCollapse" onclick="window.scrollTo(0, 0)">
                <span class="handheld-toolbar-icon"><i class="ci-menu"></i></span>
                <span class="handheld-toolbar-label">Menu</span>
            </a>
            <router-link to="/cart" class="d-table-cell handheld-toolbar-item">
                <span class="handheld-toolbar-icon"><i class="ci-cart"></i>
                    <span class="badge bg-primary rounded-pill ms-1">{{cart?cart.length:'0'}}</span>
                </span>
                <span class="handheld-toolbar-label"><span>$</span>{{cart_cost_total}}<span>.00</span></span>
            </router-link>
        </div>
    </div>`
                }