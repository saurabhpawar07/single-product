export default {
        props: ["theme_id"],
        components: {
            'product_card_vertical': () => import("./product_card_vertical.vue.js"),
            'show_case_category': () => import("./show_case_category.vue.js"),
        },
        data() {
            return {
                loading_: false,
                loading: false,
                error: false,
                message: "",
                account: window.application.Account,
                HerosliderItems: [],
                FeaturedCategories: [],
                ShowTrending: false,
                Trending: [],
                ShowCaseCategory: null,
                ShowCaseProducts: [],
                WideAdvertisingBanner : false,
            };
        },
        computed: {
            ...Vuex.mapState(['user']),
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
            loadData: function () {
                var page_number = 1
                var data = {}
                data.sort = "trending"
                data.sortdesc = true
                data.limit = 8
                data.page = 0
                this.loading = true;
                return this.$store.dispatch('call', {
                    api: "products",
                    data: data,
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        for (var prop in data.data) {
                            this.set_product(data.data[prop])
                        }
                        this.Trending = data.data
                    } else {
                        this.error = true
                    }
                    return data
                }).catch((error) => {
                    console.log(error)
                    this.error = true
                    this.message = error
                    this.$emit('done', false)
                }).finally(() => {
                    this.loading = false;
                });
            },
            loadShowCaseCategory: function () {
                var page_number = 1
                var data = {}
                data.sort = "trending"
                data.sortdesc = true
                data.limit = 18
                data.page = 0
                data.fix_condition = {}
                this.ShowCaseCategory.CategoryID.value = parseInt(this.ShowCaseCategory.CategoryID.value)
                this.ShowCaseCategory.SubcategoryID.value = parseInt(this.ShowCaseCategory.SubcategoryID.value)
                this.ShowCaseCategory.ChildcategoryID.value = parseInt(this.ShowCaseCategory.ChildcategoryID.value)
                if (this.ShowCaseCategory.CategoryID.value) {
                    data.fix_condition.category_id = this.ShowCaseCategory.CategoryID.value
                }
                if (this.ShowCaseCategory.SubcategoryID.value) {
                    data.fix_condition.subcategory_id = this.ShowCaseCategory.SubcategoryID.value
                }
                if (this.ShowCaseCategory.ChildcategoryID.value) {
                    data.fix_condition.childcategory_id = this.ShowCaseCategory.ChildcategoryID.value
                }
                this.loading_ = true;
                return this.$store.dispatch('call', {
                    api: "products",
                    data: data,
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        var page = 0
                        var index = 0
                        for (var prop in data.data) {
                            this.set_product(data.data[prop])
                            if (!this.ShowCaseProducts[page]) {
                                this.ShowCaseProducts[page] = []
                            }
                            this.ShowCaseProducts[page].push(data.data[prop])
                            index++
                            if (index == 6) {
                                index = 0
                                page++
                            }
                        }
                    } else {
                        this.error = true
                    }
                    return data
                }).catch((error) => {
                    console.log(error)
                    this.error = true
                    this.message = error
                    this.$emit('done', false)
                }).finally(() => {
                    this.loading_ = false;
                });
            },
            init() {
                if (window.application.ThemeSettings) {
                    if (window.application.ThemeSettings.Heroslider) {
                        this.HerosliderItems = window.application.ThemeSettings.Heroslider.value
                    }
                    if (window.application.ThemeSettings.FeaturedCategories) {
                        this.FeaturedCategories = window.application.ThemeSettings.FeaturedCategories.value
                    }
                    if (window.application.ThemeSettings.ShowTrending) {
                        this.ShowTrending = window.application.ThemeSettings.ShowTrending.value
                        if (this.ShowTrending) {
                            this.loadData()
                        }
                    }
                    if (window.application.ThemeSettings.ShowCaseCategory) {
                        this.ShowCaseCategory = window.application.ThemeSettings.ShowCaseCategory.value
                        this.loadShowCaseCategory()
                    }
                    if (window.application.ThemeSettings.WideAdvertisingBanner) {
                        this.WideAdvertisingBanner = window.application.ThemeSettings.WideAdvertisingBanner.value
                    }
                    if (window.application.ThemeSettings.ShortAdvertisingbanner) {
                        this.ShortAdvertisingbanner = window.application.ThemeSettings.ShortAdvertisingbanner.value
                    }
                }
            },
            getShowCaseCategoryLink(){
                if (this.ShowCaseCategory.SubcategoryID.value) {
                    return '/shop/'+ this.ShowCaseCategory.CategoryID.value + '/'+ this.ShowCaseCategory.SubcategoryID.value
                }
                return '/shop/'+ this.ShowCaseCategory.CategoryID.value
            }
        },
        mounted: function () {
            debugger
            this.init()
        },
    template: `<main class="page-wrapper">
            <!-- Hero slider-->
            <section v-if="HerosliderItems.length" class="tns-carousel tns-controls-lg">
                <div class="tns-outer" id="tns2-ow">
                    <div class="tns-controls" aria-label="Carousel Navigation" tabindex="0" id="hero_slider_navigation">
                        <button type="button" data-controls="prev" tabindex="-1" aria-controls="tns2">
                            <i class="ci-arrow-left"></i>
                        </button>
                        <button type="button" data-controls="next" tabindex="-1" aria-controls="tns2">
                            <i class="ci-arrow-right"></i>
                        </button>
                    </div>
                    <div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">
                        slide <span class="current">1</span>  of 3
                    </div>
                    <div class="tns-inner" id="tns2-iw">
                        <tiny-slider id="hero_slider" :loop="true" items="1" :nav="false" controlsContainer="#hero_slider_navigation" :autoplay="true" :autoplayButtonOutput="false">
                            <!-- Item-->
                            <div v-for="item in HerosliderItems" class="px-lg-5 tns-item" :style="'background-color: '+item.Backgroundcolor.value+';'" id="tns2-item1" aria-hidden="true">
                                <div class="d-lg-flex justify-content-between align-items-center ps-lg-4" :style="{'background-image' : 'url('+ encodeURI(item.Image.value) +')' }" style="background-position: right top;background-repeat: no-repeat;background-size: contain; min-height: 530px;">
                                    <img v-if="item.Image.value" class="d-block d-md-none order-lg-2 flex-shrink-0" :src="item.Image.value" alt="Women Sportswear">
                                    <div class="position-relative" style="max-width: 0rem; z-index: 10;">
                                        <div class="mx-auto py-5 px-4 mb-lg-5 order-lg-1 w-md-100">
                                            <div class="pb-lg-5 mb-lg-5 text-center text-lg-start text-lg-nowrap">
                                                <h3 v-if="item.Pretext.value" class="h2 text-light fw-light pb-1 from-bottom">{{item.Pretext.value}}</h3>
                                                <h2 v-if="item.Title.value" class="text-light display-5 from-bottom delay-1">{{item.Title.value}}</h2>
                                                <p v-if="item.Description.value" class="fs-lg text-light pb-3 from-bottom delay-2">
                                                    {{item.Description.value}}
                                                </p>
                                                <div v-if="item.Link.value" class="d-table scale-up delay-4 mx-auto mx-lg-0">
                                                    <a class="btn btn-primary" :href="item.Link.value">Shop Now<i class="ci-arrow-right ms-2 me-n1"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </tiny-slider>
                    </div>
                    <div class="tns-nav" aria-label="Carousel Pagination" style="display: none;">
                        <button type="button" data-nav="0" aria-controls="tns2" style="display:none" aria-label="Carousel Page 1 (Current Slide)" class="tns-nav-active"></button><button type="button" data-nav="1" tabindex="-1" aria-controls="tns2" style="display:none" aria-label="Carousel Page 2"></button><button type="button" data-nav="2" tabindex="-1" aria-controls="tns2" style="display:none" aria-label="Carousel Page 3"></button>
                    </div>
                </div>
            </section>
            <!-- Popular categories-->
            <section v-if="FeaturedCategories.length" class="container position-relative pt-3 pt-lg-0 pb-5" :class="{'mt-lg-n10' : HerosliderItems.length}" style="z-index: 10;">
                <div class="row">
                    <div class="col-xl-8 col-lg-9">
                        <div class="card border-0 shadow-lg">
                            <div class="card-body px-3 pt-grid-gutter pb-0">
                                <div class="row g-0 ps-1">
                                    <div v-for="item in FeaturedCategories" class="col-sm-4 px-2 mb-grid-gutter ">
                                        <a class="d-block text-center text-decoration-none me-1" :href="item.Link.value?item.Link.value:'#'">
                                            <div class="border rounded mb-3 square">
                                                <img class="d-block" :src="item.Image.value" :alt="item.Title.value">
                                            </div>
                                            <h3 class="fs-base pt-1 mb-0">{{item.Title.value}}</h3>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Products grid (Trending products)-->
            <section v-if="ShowTrending" class="container pt-md-3 pb-5 mb-md-3">
                <h2 class="h3 text-center">Trending products</h2>
                <divloading :loading="loading" class="row pt-4 mx-n2">
                    <label v-if="loading">Loading...</label>
                    <label v-else-if="(Trending.length == 0) || !Trending ">No Products for current filters conditions</label>
                    <!-- Product-->
                    <div v-for="product in Trending" :key="'product'+product.id" class="col-lg-3 col-md-4 col-sm-6 px-2 mb-4">
                        <product_card_vertical :product="product"></product_card_vertical>
                        <hr class="d-sm-none">
                    </div>
                </divloading>
                <div class="text-center pt-3">
                    <router-link class="btn btn-outline-accent" to="/shop">
                        More products
                        <i class="ci-arrow-right ms-1"></i>
                    </router-link>
                </div>
            </section>
            <!-- Banners-->
            <section class="container pb-4 mb-md-3" v-if="WideAdvertisingBanner">
                <div class="row">
                    <div class="col-md-8 mb-4">
                        <div class="d-sm-flex justify-content-between align-items-center bg-secondary overflow-hidden rounded-3" :style="{'background-image' : 'url('+ encodeURI(WideAdvertisingBanner.Image.value) +')' }" style="background-position: right top;background-repeat: no-repeat;background-size: cover;">
                            <div class="py-4 my-2 my-md-0 py-md-5 px-4 ms-md-3 text-center text-sm-start">
                                <h4 class="fs-lg fw-light mb-2" v-if="WideAdvertisingBanner.Subtitle.value">{{WideAdvertisingBanner.Subtitle.value}}</h4>
                                <h3 class="mb-4" v-if="WideAdvertisingBanner.Title.value">{{WideAdvertisingBanner.Title.value}}</h3>
                                <router-link :to="WideAdvertisingBanner.ButtonLink.value" class="btn btn-primary btn-shadow btn-sm" v-if="WideAdvertisingBanner.ButtonLink.value">{{WideAdvertisingBanner.ButtonText.value}}</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4" v-if="ShortAdvertisingbanner">
                        <div class="d-flex flex-column h-100 justify-content-center bg-size-cover bg-position-center rounded-3" :style="{'background-image' : 'url('+ encodeURI(ShortAdvertisingbanner.Image.value) +')' }" style="background-position: right top;background-repeat: no-repeat;background-size: cover;">
                            <div class="py-4 my-2 px-4 text-center">
                                <div class="py-1">
                                    <h5 class="mb-2"v-if="ShortAdvertisingbanner.Title.value">{{ShortAdvertisingbanner.Title.value}}</h5>
                                    <p class="fs-sm text-muted"v-if="ShortAdvertisingbanner.Subtitle.value">{{ShortAdvertisingbanner.Subtitle.value}}</p>
                                    <router-link :to="ShortAdvertisingbanner.ButtonLink.value" class="btn btn-primary btn-shadow btn-sm" v-if="ShortAdvertisingbanner.ButtonLink.value">{{ShortAdvertisingbanner.ButtonText.value}}</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Featured category (Hoodie)-->
            <section v-if="ShowCaseCategory && ShowCaseCategory.CategoryID && ShowCaseCategory.CategoryID.value" class="container mb-4 pb-3 pb-sm-0 mb-sm-5">
                <div class="row">
                    <!-- Banner with controls-->
                    <div class="col-md-5">
                        <div class="d-flex flex-column h-100 overflow-hidden rounded-3" style="background-color: #e2e9ef;">
                            <div class="d-flex justify-content-between px-grid-gutter py-grid-gutter">
                                <div>
                                    <h3 class="mb-1">{{ShowCaseCategory.Title.value}}</h3>
                                    <router-link class="fs-md" :to="getShowCaseCategoryLink()">Shop All<i class="ci-arrow-right fs-xs align-middle ms-1"></i></router-link>
                                </div>
                                <div class="tns-carousel-controls" id="showcase_category_controls" aria-label="Carousel Navigation" tabindex="0">
                                    <button type="button" aria-controls="tns3" tabindex="-1" data-controls="prev"><i class="ci-arrow-left"></i></button>
                                    <button type="button" aria-controls="tns3" tabindex="-1" data-controls="next"><i class="ci-arrow-right"></i></button>
                                </div>
                            </div>
                            <div class="d-none d-md-block" href="shop-grid-ls.html" :data-image="ShowCaseCategory.Image.value" :style="{'background-image' : 'url('+ ShowCaseCategory.Image.value +')' }" style="background-position: center;background-repeat: no-repeat;background-size: cover; height:100%"></div>
                        </div>
                    </div>
                    <!-- Product grid (carousel)-->
                    <divloading :loading="loading_" class="col-md-7 pt-4 pt-md-0">
                        <div v-if="ShowCaseProducts.length > 0" class="tns-carousel">
                            <tiny-slider id="showcase_category_slider" :loop="true" items="1" :nav="true" controlsContainer="#showcase_category_controls" :autoplay="true" :autoplayButtonOutput="false" style="transition-duration: 0s; transform: translate3d(-33.3333%, 0px, 0px);">
                                <div v-for="page in ShowCaseProducts" class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                    <div class="row mx-n2">
                                        <div v-for="product in page" class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                            <product_card_vertical :product="product"></product_card_vertical>
                                        </div>
                                    </div>
                                </div>
                            </tiny-slider>
                        </div>
                    </divloading>
                </div>
            </section>
            <!-- Shop by brand
            <section class="container py-lg-4 mb-4">
                <h2 class="h3 text-center pb-4">Shop by brand</h2>
                <div class="row">
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/01.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/02.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/03.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/04.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/05.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/06.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/07.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/08.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/09.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/10.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/11.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                    <div class="col-md-3 col-sm-4 col-6">
                        <a class="d-block bg-white shadow-sm rounded-3 py-3 py-sm-4 mb-grid-gutter" href="#"><img class="d-block mx-auto" src="https://cartzilla.createx.studio/img/shop/brands/12.png" style="width: 150px;" alt="Brand"></a>
                    </div>
                </div>
            </section>-->
            <!-- Blog + Instagram info cards-->
            <section class="container-fluid px-0">
                <div class="row g-0">
                    <div class="col-md-6">
                        <router-link to="/blogs" class="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-primary">
                            <div class="card-body text-center">
                                <i class="ci-edit h3 mt-2 mb-4 text-primary"></i>
                                <h3 class="h5 mb-1">Read the blog</h3>
                                <p class="text-muted fs-sm">
                                    Latest store, fashion news and trends
                                </p>
                            </div>
                        </router-link>
                    </div>
                    <div class="col-md-6">
                        <a v-if="account.Instagram" class="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-accent" :href="account.Instagram" target="_blank">
                            <div class="card-body text-center">
                                <i class="ci-instagram h3 mt-2 mb-4 text-accent"></i>
                                <h3 class="h5 mb-1">Follow on Instagram</h3>
                                <p class="text-muted fs-sm">
                                    Shop With #{{account.Subdomain}}
                                </p>
                            </div>
                        </a>
                        <a v-else-if="account.Facebook" class="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-accent" :href="account.Facebook" target="_blank">
                            <div class="card-body text-center">
                                <i class="ci-facebook h3 mt-2 mb-4 text-accent"></i>
                                <h3 class="h5 mb-1">Follow on Facebook</h3>
                                <p class="text-muted fs-sm">
                                    Shop With #{{account.Subdomain}}
                                </p>
                            </div>
                        </a>
                        <a v-else-if="account.WhatsApp" class="card border-0 rounded-0 text-decoration-none py-md-4 bg-faded-accent" :href="account.WhatsApp" target="_blank">
                            <div class="card-body text-center">
                                <i class="ci-whatsapp h3 mt-2 mb-4 text-accent"></i>
                                <h3 class="h5 mb-1">Connect on WhatsApp</h3>
                                <p class="text-muted fs-sm">
                                    Shop With #{{account.Subdomain}}
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    </template>`
                }