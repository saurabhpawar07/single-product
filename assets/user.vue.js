export default {
    data() {
        return {
            loading: 0,
            error: false,
            message: "",
        };
    },
    computed: {
        ...Vuex.mapState(['user', 'wishlist']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
    },
    methods: {
        getPhoto() {
            if (this.user && this.user.Photo) {
                return this.user.Photo
            } else {
                return "/img/user.png"
            }
        }
    },
    mounted: function () {},
    template: `<main class="page-wrapper">
        <!-- Page Title-->
        <div class="page-title-overlap bg-dark pt-4">
            <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item">
                                <router-link to="/" class="text-nowrap">
                                    <i class="ci-home"></i>
                                    Home
                                </router-link>
                            </li>
                            <li class="breadcrumb-item text-nowrap">
                                <router-link to="/user" class="text-nowrap">
                                    <i class="ci-user"></i>
                                    User
                                </router-link>
                            </li>
                            <li class="text-capitalize breadcrumb-item text-nowrap active" aria-current="page">
                                {{$route.name}}
                            </li>
                        </ol>
                    </nav>
                </div>
                <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                    <h1 class="h3 text-capitalize text-light mb-0">{{$route.meta.title}}</h1>
                </div>
            </div>
        </div>
        <div class="container pb-5 mb-2 mb-md-4">
            <div class="row">
                <!-- Sidebar-->
                <aside class="col-lg-3 pt-4 pt-lg-0">
                    <div class="bg-white rounded-3 shadow-lg pt-1 mb-5 mb-lg-0">
                        <div v-if="user" class="d-md-flex justify-content-between align-items-center text-center text-md-start p-4">
                            <div class="d-md-flex align-items-center">
                                <div class="img-thumbnail rounded-circle position-relative flex-shrink-0 mx-auto mb-2 mx-md-0 mb-md-0" style="width: 6.375rem;">
                                    <span class="badge bg-warning position-absolute end-0 mt-n2" data-bs-toggle="tooltip" title="" data-bs-original-title="Reward points">384</span>
                                    <img class="rounded-circle" :src="getPhoto()" alt="Susan Gardner">
                                </div>
                                <div class="ps-md-3">
                                    <h3 class="fs-base mb-0">{{user.Name}}</h3>
                                    <span class="text-accent fs-sm">{{user.Email}}</span>
                                </div>
                            </div>
                            <a class="btn btn-primary d-lg-none mb-2 mt-3 mt-md-0" href="#account-menu" data-bs-toggle="collapse" aria-expanded="false"><i class="ci-menu me-2"></i>Account menu</a>
                        </div>
                        <a v-else class="d-md-flex justify-content-between align-items-center text-center text-md-start p-4" href="#"
                            @click.prevent="$store.commit('set_showlogin', true )">
                            <div class="navbar-tool-icon-box">
                                <i class="navbar-tool-icon ci-user"></i>
                            </div>
                            <div class="ms-n3">
                                Welcome Guest
                            </div>
                        </a>
                        <div class="d-lg-block collapse" id="account-menu">
                            <div class="bg-secondary px-4 py-3">
                                <h3 class="fs-sm mb-0 text-muted">Dashboard</h3>
                            </div>
                            <ul class="list-unstyled mb-0">
                                <li v-if="user"  class="border-bottom mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user/orders" :class="{'active': ($route.name == 'orders') }">
                                        <i class="ci-bag opacity-60 me-2"></i>
                                        Orders
                                        <span class="fs-sm text-muted ms-auto">{{user.Orders}}</span>
                                    </router-link>
                                </li>
                                <li class="border-bottom mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user/wishlist" :class="{'active': ($route.name == 'wishlist') }">
                                        <i class="ci-heart opacity-60 me-2"></i>
                                        Wishlist
                                        <span v-if="user" class="fs-sm text-muted ms-auto">{{user.Wishlist}}</span>
                                        <span v-else-if="wishlist && wishlist.length" class="fs-sm text-muted ms-auto">{{wishlist.length}}</span>
                                    </router-link>
                                </li>
                                <li v-if="user" class="mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user/support" :class="{'active': ($route.name == 'support') }">
                                        <i class="ci-help opacity-60 me-2"></i>
                                        Support tickets
                                        <span class="fs-sm text-muted ms-auto">1</span>
                                    </router-link>
                                </li>
                            </ul>
                            <div class="bg-secondary px-4 py-3">
                                <h3 class="fs-sm mb-0 text-muted">Account settings</h3>
                            </div>
                            <ul v-if="user" class="list-unstyled mb-0">
                                <li class="border-bottom mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user" :class="{'active': ($route.name == 'profile') }">
                                        <i class="ci-user opacity-60 me-2"></i>
                                        Profile info
                                    </router-link>
                                </li>
                                <li class="border-bottom mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user/addresses" :class="{'active': ($route.name == 'addresses') }">
                                        <i class="ci-location opacity-60 me-2"></i>
                                        Addresses
                                    </router-link>
                                </li>
                                <li class="border-bottom mb-0">
                                    <router-link class="nav-link-style d-flex align-items-center px-4 py-3" to="/user/wallet" :class="{'active': ($route.name == 'wallet') }">
                                        <i class="ci-card opacity-60 me-2"></i>
                                        Wallet
                                    </router-link>
                                </li>
                                <li class="border-top mb-0">
                                    <a class="nav-link-style d-flex align-items-center px-4 py-3 btn btn-danger btn-sm" href="#" @click.prevent="logout()">
                                        <i class="ci-sign-out opacity-60 me-2"></i>
                                        Sign out
                                    </a>
                                </li>
                            </ul>
                            <ul v-else class="list-unstyled mb-0">
                                <li class="border-top mb-0">
                                    <a class="nav-link-style d-flex align-items-center px-4 py-3 btn btn-primary btn-sm" 
                                    href="#" @click.prevent="$store.commit('set_showlogin', true )">
                                        <i class="ci-sign-in opacity-60 me-2"></i>
                                        SignIn Or SignUp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
                <!-- Content  -->
                <router-view class="col-lg-9"></router-view>
            </div>
        </div>
    </main>`
                }