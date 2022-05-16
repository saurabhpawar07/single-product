<script>
export default {
    props: ["theme_id"],
    components: {
        'product_card_vertical': () => import("./product_card_vertical.vue.js"),
        'show_case_category': () => import("./show_case_category.vue.js"),
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            account: window.application.Account,
            HerosliderItems: [],
            FeaturedCategories: [],
            ShowTrending: false,
            Trending: [],
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
            }
        }
    },
    mounted: function () {
        this.init()
    },
}    
</script>
<template>
<!-- Featured category (Hoodie)-->
    <section class="container mb-4 pb-3 pb-sm-0 mb-sm-5">
        <div class="row">
            <!-- Banner with controls-->
            <div class="col-md-5">
                <div class="d-flex flex-column h-100 overflow-hidden rounded-3" style="background-color: #e2e9ef;">
                    <div class="d-flex justify-content-between px-grid-gutter py-grid-gutter">
                        <div>
                            <h3 class="mb-1">Hoodie day</h3><a class="fs-md" href="shop-grid-ls.html">Shop hoodies<i class="ci-arrow-right fs-xs align-middle ms-1"></i></a>
                        </div>
                        <div class="tns-carousel-controls" id="hoodie-day" aria-label="Carousel Navigation" tabindex="0">
                            <button type="button" aria-controls="tns3" tabindex="-1" data-controls="prev"><i class="ci-arrow-left"></i></button>
                            <button type="button" aria-controls="tns3" tabindex="-1" data-controls="next"><i class="ci-arrow-right"></i></button>
                        </div>
                    </div>
                    <a class="d-none d-md-block mt-auto" href="shop-grid-ls.html"><img class="d-block w-100" src="https://cartzilla.createx.studio/img/home/categories/cat-lg04.jpg" alt="For Women"></a>
                </div>
            </div>
            <!-- Product grid (carousel)-->
            <div class="col-md-7 pt-4 pt-md-0">
                <div class="tns-carousel">
                    <div class="tns-outer" id="tns3-ow">
                        <div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">
                            slide <span class="current">3</span>  of 2
                        </div>
                        <div id="tns3-mw" class="tns-ovh">
                            <div class="tns-inner" id="tns3-iw">
                                <div class="tns-carousel-inner  tns-slider tns-carousel tns-subpixel tns-calc tns-horizontal" data-carousel-options="{&quot;nav&quot;: false, &quot;controlsContainer&quot;: &quot;#hoodie-day&quot;}" id="tns3" style="transition-duration: 0s; transform: translate3d(-33.3333%, 0px, 0px);">
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$26.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <span class="badge badge-danger badge-shadow">Sale</span>
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$17.<small>99</small></span>
                                                                <del class="fs-sm text-muted">24.<small>99</small></del>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/51.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/54.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/53.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/52.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/56.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/55.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/57.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$23.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Carousel item-->
                                    <div class="tns-item tns-slide-active" id="tns3-item0">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$26.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <span class="badge badge-danger badge-shadow">Sale</span>
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$17.<small>99</small></span>
                                                                <del class="fs-sm text-muted">24.<small>99</small></del>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/51.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/54.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Carousel item-->
                                    <div class="tns-item" id="tns3-item1" aria-hidden="true" tabindex="-1">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/53.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/52.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/56.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/55.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/57.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$23.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$26.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <span class="badge badge-danger badge-shadow">Sale</span>
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$17.<small>99</small></span>
                                                                <del class="fs-sm text-muted">24.<small>99</small></del>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/51.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/54.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="row mx-n2">
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/53.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Mono Color Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$21.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4 d-none d-lg-block">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/52.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/56.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Printed Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$25.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/55.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$24.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 col-6 px-0 px-sm-2 mb-sm-4">
                                                <div class="card product-card card-static">
                                                    <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="shop-single-v1.html"><img src="https://cartzilla.createx.studio/img/shop/catalog/57.jpg" alt="Product"></a>
                                                    <div class="card-body py-2">
                                                        <a class="product-meta d-block fs-xs pb-1" href="#">Hoodies &amp; Sweatshirts</a>
                                                        <h3 class="product-title fs-sm"><a href="shop-single-v1.html">Block-colored Hooded Top</a></h3>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="product-price">
                                                                <span class="text-accent">$23.<small>99</small></span>
                                                            </div>
                                                            <div class="star-rating">
                                                                <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>        
</template>