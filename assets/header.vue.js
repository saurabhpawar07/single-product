
    export default {
            components: {
                //'category_dropdown': () => import("./category_dropdown.vue.js"),
                'locationtree': () => import("./locationtree.vue.js"),
                'autocomplete': () => import("./autocomplete.vue.js"),
            },
            data() {
                return {
                    loading: 0,
                    error: false,
                    message: "",
                    searchCetegory: null,
                    searchLocation: null,
                    account: window.application.Account,
                    TopNotificationBarItems: [],
                    SearchByLocation: false,
                };
            },
            computed: {
                ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations", "cart", "cart_cost_total"]),
            },
            watch: {
                user(newValue, oldValue) {
                    if (!oldValue && newValue) {
                        this.load_wishlist()
                        this.$store.dispatch('load_cart')
                    }
                },
                loading: function (newValue, oldValue) {
                    if (newValue) {
                        this.error = false
                        this.message = false
                        this.submitted = false
                    }
                },
                pages: function (newValue, oldValue) {
                    if (newValue) {}
                },
                $route(to, from) {
                    this.$refs.navbartoggler.click()
                }
            },
            methods: {
                pages_from(from) {
                    if (this.pages.length > from) {
                        return this.pages.slice(from, from + 5);
                    } else {
                        return []
                    }
                },
                checkout(event) {
                    if (!this.cart || !this.cart.length) {
                        return
                    }
                    if (!this.user) {
                        this.submited = true
                        this.$store.commit('set_showlogin', true)
                    } else {
                        this.$router.push("/checkout")
                    }
                },
                load() {
                    this.loading = true
                    this.$store.dispatch('call', {
                        api: "pages",
                        data: {
                            sort: "weightage",
                            sortdesc: true,
                            limit: 20,
                        }
                    }).then((data) => {
                        this.message = data.Message;
                        if (data.Status == 2) {
                            this.error = false
                            if (Array.isArray(data.data)) {
                                this.$store.commit('set_pages', data.data)
                            }
                        } else {
                            this.error = true
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                        this.error = true
                        this.message = error
                    }).finally(() => {
                        this.loading = false
                    })
                },
                load_locations() {
                    this.loading = true
                    this.$store.dispatch('call',
                        {
                            api: "locations",
                            data: {
                                limit: 1200,
                            }
                        }).then((data) => {
                            this.message = data.Message;
                            if (data.Status == 2) {
                                this.error = false
                                this.$store.commit('set_locations', data.data)
                            } else {
                                this.error = true
                            }
                        }).catch((error) => {
                            console.error('Error:', error);
                            this.error = true
                            this.message = error
                        }).finally(() => {
                            this.loading = false
                        })
                },
                load_wishlist() {
                    if (!this.user) {
                        return
                    }
                    this.$store.dispatch('call', {
                        api: "wishlist",
                        data: {}
                    }).then((data) => {
                        this.message = data.Message;
                        if (data.Status == 2) {
                            this.error = false
                            if (Array.isArray(data.data)) {
                                this.$store.commit('add_to_wishlist', data.data)
                            }
                        } else {
                            this.error = true
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                        this.error = true
                        this.message = error
                    })
                },
                init() {
                    if (window.application.ThemeSettings) {
                        if (window.application.ThemeSettings.TopNotificationBar) {
                            this.TopNotificationBarItems = window.application.ThemeSettings.TopNotificationBar.value
                        }
                    }
                    debugger
    
                    if (window.application.ThemeSettings) {
                        if (window.application.ThemeSettings.SearchByLocation) {
                            this.SearchByLocation = window.application.ThemeSettings.SearchByLocation.value
                        }
                    }
                },
                toggle_navbar() {
                    this.$refs.stuckMenu.classList.toggle('show');
                }
            },
            mounted: function () {
                this.init()
                this.load()
                if (this.user) {
                    this.load_wishlist()
                    this.$store.dispatch('load_cart')
                }
                var navbar = this.$refs.stickynavbar
                if (navbar != null) {
                    var navbarClass = navbar.classList,
                    navbarH = navbar.offsetHeight,
                    scrollOffset = 500;
                    window.addEventListener('scroll', function (e) {
                        if (e.currentTarget.pageYOffset > scrollOffset) {
                            document.body.style.paddingTop = navbarH + 'px';
                            navbar.classList.add('navbar-stuck');
                        } else {
                            document.body.style.paddingTop = '';
                            navbar.classList.remove('navbar-stuck');
                        }
                    });
                }
            },
    
        template: `
    <header class="shadow-sm">
                <!-- Topbar-->
                <div class="topbar topbar-dark bg-dark">
                    <div class="container">
                        <div class="topbar-text dropdown d-md-none">
                            <a class="topbar-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Useful links</a>
                            <ul class="dropdown-menu">
                                <li v-if="account.Mobile"><a class="dropdown-item" :href="'tel:'+account.Mobile"><i class="ci-support"></i>{{account.Mobile}}</a></li>
                                <li><router-link to="/user/orders" class="dropdown-item" href="order-tracking.html"><i class="ci-location"></i>Orders tracking</router-link></li>
                            </ul>
                        </div>
                        <div class="topbar-text text-nowrap d-none d-md-inline-block">
                            <span v-if="account.Mobile">
                                <i class="ci-support"></i><span class="text-muted me-1">Support</span><a class="topbar-link" :href="'tel:'+account.Mobile">{{account.Mobile}}</a>
                            </span>
                        </div>
                        <div class="tns-carousel tns-controls-static d-none d-md-block" style="width: 50%; text-align: center;">
                            <div id="top_tns_controls_container" class="tns-controls" aria-label="Carousel Navigation" tabindex="0">
                                <button type="button" data-controls="prev" tabindex="-1" aria-controls="tns1">
                                    <i class="ci-arrow-left"></i>
                                </button>
                                <button type="button" data-controls="next" tabindex="-1" aria-controls="tns1">
                                    <i class="ci-arrow-right"></i>
                                </button>
                            </div>
                            <tiny-slider id="top_tns" v-if="TopNotificationBarItems.length" :loop="true" items="1" :nav="false" controlsContainer="#top_tns_controls_container" :autoplay="true" :autoplayButtonOutput="false">
                                <div v-for="(item, index) in TopNotificationBarItems" class="topbar-text tns-item" id="'top_tns-item' + index">
                                    <a v-if="item.link.value" :href="item.link">{{item.note.value}}</a>
                                    <span v-else-if="item.note">{{item.note.value}}</span>
                                    <span v-else>{{item}}</span>
                                </div>
                            </tiny-slider>
                        </div>
                        <div class="ms-3 text-nowrap">
                            <router-link to="/user/orders" class="topbar-link me-4 d-none d-md-inline-block" href="order-tracking.html"><i class="ci-location"></i>Order tracking</router-link>
                            <!--<div class="topbar-text dropdown disable-autohide">-->
                            <!--    <a class="topbar-link dropdown-toggle" href="#" data-bs-toggle="dropdown"><img class="me-2" src="https://cartzilla.createx.studio/img/flags/en.png" width="20" alt="English">Eng / $</a>-->
                            <!--    <ul class="dropdown-menu dropdown-menu-end">-->
                            <!--        <li class="dropdown-item">-->
                            <!--            <select class="form-select form-select-sm">-->
                            <!--                <option value="usd">$ USD</option>-->
                            <!--                <option value="eur">€ EUR</option>-->
                            <!--                <option value="ukp">£ UKP</option>-->
                            <!--                <option value="jpy">¥ JPY</option>-->
                            <!--            </select>-->
                            <!--        </li>-->
                            <!--        <li><a class="dropdown-item pb-1" href="#"><img class="me-2" src="https://cartzilla.createx.studio/img/flags/fr.png" width="20" alt="Français">Français</a></li>-->
                            <!--        <li><a class="dropdown-item pb-1" href="#"><img class="me-2" src="https://cartzilla.createx.studio/img/flags/de.png" width="20" alt="Deutsch">Deutsch</a></li>-->
                            <!--        <li><a class="dropdown-item" href="#"><img class="me-2" src="https://cartzilla.createx.studio/img/flags/it.png" width="20" alt="Italiano">Italiano</a></li>-->
                            <!--    </ul>-->
                            <!--</div>-->
                        </div>
                    </div>
                </div>
                <!-- Remove "navbar-sticky" class to make navigation bar scrollable with the page.-->
                <div class="navbar-sticky bg-light" ref="stickynavbar">
                    <div class="navbar navbar-expand-lg navbar-light">
                        <div class="container">
                            <a v-if="account.Logo" class="navbar-brand d-sm-none flex-shrink-0 me-2" href="/">
                                <img :src="account.Logo" style="height: 50px;" :alt="account.Title">
                            </a>
                            <a v-if="account.WideLogo" class="navbar-brand d-none d-sm-block flex-shrink-0" href="/">
                                <img :src="account.WideLogo" style="height: 60px;" :alt="account.Title">
                            </a>
                            <a v-else class="navbar-brand d-none d-sm-block flex-shrink-0 text-capitalize" href="/">{{account.Title}}</a>
                            <autocomplete placeholder="Search for products" class="d-none d-lg-block mx-4 w-100"></autocomplete>
                            <div class="navbar-toolbar d-flex flex-shrink-0 align-items-center">
                                <button ref="navbartoggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"><span class="navbar-toggler-icon"></span></button>
                                <a class="navbar-tool navbar-stuck-toggler" href="#" @click.prevent="toggle_navbar">
                                    <span class="navbar-tool-tooltip">Expand menu</span>
                                    <div class="navbar-tool-icon-box">
                                        <i class="navbar-tool-icon ci-menu"></i>
                                    </div>
                                </a>
                                <router-link class="navbar-tool d-none d-lg-flex" to="/user/wishlist">
                                    <span class="navbar-tool-tooltip">Wishlist</span>
                                    <div class="navbar-tool-icon-box">
                                        <i class="navbar-tool-icon ci-heart"></i>
                                    </div>
                                </router-link>
                                <router-link to="/user" v-if="user" class="navbar-tool ms-1 ms-lg-0 me-n1 me-lg-2">
                                    <div class="navbar-tool-icon-box">
                                        <i class="navbar-tool-icon ci-user"></i>
                                    </div>
                                    <div class="navbar-tool-text ms-n3">
                                        <small>Hello, {{user.Name}}</small>
                                        My Account
                                    </div>
                                </router-link>
                                <a v-else class="navbar-tool ms-1 ms-lg-0 me-n1 me-lg-2" href="#signin-modal"
                                    @click.prevent="$store.commit('set_showlogin', true )">
                                    <div class="navbar-tool-icon-box">
                                        <i class="navbar-tool-icon ci-user"></i>
                                    </div>
                                    <div class="navbar-tool-text ms-n3">
                                        <small>Sign in or</small>Sign up
                                    </div>
                                </a>
                                <div class="navbar-tool dropdown ms-3">
                                    <router-link to="/cart" class="navbar-tool-icon-box bg-secondary dropdown-toggle">
                                        <span class="navbar-tool-label">{{cart?cart.length:''}}</span>
                                        <i class="navbar-tool-icon ci-cart"></i>
                                    </router-link>
                                    <router-link to="/cart" class="navbar-tool-text">
                                        <small>My Cart</small><span>$</span>{{cart_cost_total}}<span>.00</span>
                                    </router-link>
                                    <!-- Cart dropdown-->
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <div class="widget widget-cart px-3 pt-2 pb-3" style="width: 20rem;">
                                            <div style="height: 15rem; overflow-x: hidden;" data-simplebar data-simplebar-auto-hide="false">
                                                <div v-for="item in cart" class="widget-cart-item pb-2 border-bottom">
                                                    <button class="btn-close text-danger" type="button" aria-label="Remove"
                                                        @click.prevent="$store.dispatch('remove_from_cart', item)">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <div class="d-flex align-items-center">
                                                        <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)" class="flex-shrink-0">
                                                            <img :src="item.Logo" width="64" alt="Product" style="height: 70px; width: 70px;">
                                                        </router-link>
                                                        <div class="ps-2">
                                                            <h6 class="widget-product-title">
                                                                <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)">{{item.Name}}</router-link>
                                                            </h6>
                                                            <small>{{getVariationName(item.Variation)}} <span>({{item.SKU}})</span></small>
                                                            <div class="widget-product-meta">
                                                                <span class="text-accent me-2"><span>$</span>{{item.Cost}}<small>.00</small></span><span class="text-muted">x {{item.Quantity}}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-flex flex-wrap justify-content-between align-items-center py-3">
                                                <div class="fs-sm me-2 py-2">
                                                    <span class="text-muted">Subtotal:</span><span class="text-accent fs-base ms-1"><span>$</span>{{cart_cost_total}}<small>.00</small></span>
                                                </div>
                                                <router-link to="/cart" class="btn btn-outline-secondary btn-sm">
                                                    Expand cart
                                                    <i class="ci-arrow-right ms-1 me-n1"></i>
                                                </router-link>
                                            </div>
                                            <button class="btn btn-primary btn-sm d-block w-100" @click.prevent="checkout">
                                                <i class="ci-card me-2 fs-base align-middle"></i>Checkout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref="stuckMenu" class="navbar navbar-expand-lg navbar-light navbar-stuck-menu mt-n2 pt-0 pb-2">
                        <div class="container">
                            <div class="collapse navbar-collapse" id="navbarCollapse">
                                <!-- Search-->
                                <autocomplete placeholder="Search for products" class="d-lg-none my-3"></autocomplete>
                                <!-- Departments menu-->
                                <ul class="navbar-nav navbar-mega-nav pe-lg-2 me-lg-2">
                                    <li class="nav-item dropdown"><a class="nav-link dropdown-toggle ps-lg-0" href="#" data-bs-toggle="dropdown"><i class="ci-view-grid me-2"></i>Departments</a>
                                        <div class="dropdown-menu px-2 pb-4">
                                            <div class="d-flex flex-wrap" style="width: 80vw;">
                                                <div v-for="category in categories" :key="'category'+category.ID" class="mega-dropdown-column pt-3 pt-sm-4 px-2 px-lg-3">
                                                    <div class="widget widget-links">
                                                        <router-link v-if="category.Logo" class="d-block overflow-hidden rounded-3 mb-3" :to="'/shop/'+encodeURI(category.Name)">
                                                            <img :src="category.Logo" :alt="category.Name" style="height: 117px;width: 100%;min-width: 200px;">
                                                        </router-link>
                                                        <h6 class="fs-base mb-2">{{category.Name}}</h6>
                                                        <ul class="widget-list">
                                                            <li class="widget-list-item mb-1" v-for="subcategory in category.subcategories" :key="'subcategory'+subcategory.ID">
                                                                <router-link :to="'/shop/'+encodeURI(category.Name)+'/'+encodeURI(subcategory.Name)" class="widget-list-link">{{subcategory.Name}}</router-link>
                                                            </li>
                                                            <li class="widget-list-item mb-1">
                                                                <router-link :to="'/shop/'+encodeURI(category.Name)" class="widget-list-link" :class="{'active': ($route.path == '/shop/'+encodeURI(category.Name))}">
                                                                    Shop All {{category.Name}}
                                                                </router-link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <!-- Primary menu-->
                                <ul class="navbar-nav">
                                    <li class="nav-item active">
                                        <router-link to="/" class="nav-link">Home</router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link to="/shop" class="nav-link">Shop</router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link to="/blogs" class="nav-link">Blogs</router-link>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside">Pages</a>
                                        <ul class="dropdown-menu">
                                            <!--<li class="dropdown">-->
                                            <!--    <a class="dropdown-item dropdown-toggle" href="#" data-bs-toggle="dropdown">Navbar Variants</a>-->
                                            <!--    <ul class="dropdown-menu">-->
                                            <!--        <li><a class="dropdown-item" href="navbar-1-level-light.html">1 Level Light</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="navbar-1-level-dark.html">1 Level Dark</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="navbar-2-level-light.html">2 Level Light</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="navbar-2-level-dark.html">2 Level Dark</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="navbar-3-level-light.html">3 Level Light</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="navbar-3-level-dark.html">3 Level Dark</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="home-electronics-store.html">Electronics Store</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="home-marketplace.html">Marketplace</a></li>-->
                                            <!--        <li><a class="dropdown-item" href="home-grocery-store.html">Side Menu (Grocery)</a></li>-->
                                            <!--    </ul>-->
                                            <!--</li>-->
                                            <!--<li class="dropdown-divider"></li>-->
                                            <li v-for="page in pages">
                                                <router-link :to="'/pages/'+page.ID" class="dropdown-item">{{page.Title}}</router-link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </template>        
    `
}    
    