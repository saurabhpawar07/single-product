export default {
        props: {
            product_id: {
                type: Number,
                default: 0,
            },
            product_name: {
                type: String,
                default: "Product Name",
            },
        },
        components: {
            'product': () => import("./product.vue.js"),
            'product_description': () => import("./product_description.vue.js"),
            'reviews': () => import("./reviews.vue.js"),
        },
        data() {
            return {
                loading: 0,
                error: false,
                message: "",
                product : {
                    id: 0,
                    cost: 50,
                    price: 60,
                    logo: "",
                    images: "",
                    name: "Product Name",
                    account_name: "Shop Name",
                    account_id: 0,
                    max_cost: 70,
                    max_price: 82,
                    variation : "",
                    reviews : 72,
                    one_star : 3,
                    two_star : 5,
                    three_star : 40,
                    four_star : 14,
                    five_star : 14,
                },
            }
        },
        methods: {
            get_product(){
                this.loading = true;
                    var data = {}
                    data.limit = 1
                    data.page = 0
                    data.fix_condition = {}
                    data.fix_condition.id = this.product_id
                    return this.$store.dispatch('call', {
                        api: "products",
                        data: data,
                    }).then((data) => {
                        this.message = data.Message
                        if (data.Status == 2) {
                            var product = data.data[0]
                            if(this.product_id == product.id){
                                this.set_product(product)
                                this.product = product
                            }
                        } else {
                            this.error = true
                        }
                        return data
                    }).catch((error) => {
                        console.log(error)
                        this.error = true
                        this.message = error
                    }).finally(() => {
                        this.loading = false;
                    });
            },
        },
        mounted: function () {
            if(this.$route.params.product){
                this.product = this.$route.params.product
            }else if(this.product_id){
                this.get_product()
            }
        },
    template: `<main class="page-wrapper">
            <div class="page-title-overlap bg-dark pt-4">
                <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li class="breadcrumb-item"><a class="text-nowrap" href="index.html"><i class="ci-home"></i>Home</a></li>
                                <li class="breadcrumb-item text-nowrap"><a href="#">Shop</a>
                                </li>
                                <li class="breadcrumb-item text-nowrap active" aria-current="page">Product Page v.1</li>
                            </ol>
                        </nav>
                    </div>
                    <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                        <h1 class="h3 text-light mb-0">{{product_name}}</h1>
                    </div>
                </div>
            </div>
            <div class="container">
                <!-- Gallery + details-->
                <div class="bg-light shadow-lg rounded-3 px-4 py-3 mb-5">
                    <div class="px-lg-3">
                        <div v-if="message" class="col-12 mb-1">
                            <div class="alert alert-dismissible fade show" :class="{'alert-danger': error, 'alert-success': !error}" role="alert">
                              <strong v-if="error">Error!</strong> 
                              <strong v-if="!error">Success!</strong> 
                              {{message}}
                              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="message = false"></button>
                            </div>
                        </div>
                        <product v-if="product" :product="product" />
                    </div>
                </div>
                <product_description id="productdescription" v-if="product" :product="product"></product_description>
            </div>
            <!-- Reviews-->
            <reviews v-if="product" class="" :value="product"></reviews>
            <!-- Product carousel (Style with)
            <div class="container pt-5">
                <h2 class="h3 text-center pb-4">Style with</h2>
                <div class="tns-carousel tns-controls-static tns-controls-outside">
                    <div class="tns-outer" id="tns2-ow">
                        <div class="tns-controls" aria-label="Carousel Navigation" tabindex="0">
                            <button type="button" data-controls="prev" tabindex="-1" aria-controls="tns2"><i class="ci-arrow-left"></i></button><button type="button" data-controls="next" tabindex="-1" aria-controls="tns2"><i class="ci-arrow-right"></i></button>
                        </div>
                        <div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">
                            slide <span class="current">9 to 12</span>  of 5
                        </div>
                        <div id="tns2-mw" class="tns-ovh">
                            <div class="tns-inner" id="tns2-iw">
                                <div class="tns-carousel-inner  tns-slider tns-carousel tns-subpixel tns-calc tns-horizontal" data-carousel-options="{&quot;items&quot;: 2, &quot;controls&quot;: true, &quot;nav&quot;: false, &quot;responsive&quot;: {&quot;0&quot;:{&quot;items&quot;:1},&quot;500&quot;:{&quot;items&quot;:2, &quot;gutter&quot;: 18},&quot;768&quot;:{&quot;items&quot;:3, &quot;gutter&quot;: 20}, &quot;1100&quot;:{&quot;items&quot;:4, &quot;gutter&quot;: 30}}}" id="tns2" style="transition-duration: 0s; transform: translate3d(-38.0952%, 0px, 0px);">
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/18.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Shoes</a>
                                                <h3 class="product-title fs-sm"><a href="#">Men’s Leather Keds</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $64.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/19.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">3 Color Collection of T-shirts</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $27.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/13.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton Polo Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $13.<small>50</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/14.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Jeans</a>
                                                <h3 class="product-title fs-sm"><a href="#">Slim Taper Fit Jeans</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$58.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <span class="badge bg-danger badge-shadow">Sale</span>
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/17.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton T-shirt Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$9.<small>50</small></span>
                                                        <del class="fs-sm text-muted">$11.<small>50</small></del>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/18.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Shoes</a>
                                                <h3 class="product-title fs-sm"><a href="#">Men’s Leather Keds</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $64.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/19.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">3 Color Collection of T-shirts</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $27.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/13.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton Polo Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $13.<small>50</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns2-item0">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/14.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Jeans</a>
                                                <h3 class="product-title fs-sm"><a href="#">Slim Taper Fit Jeans</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$58.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns2-item1">
                                        <div class="card product-card card-static">
                                            <span class="badge bg-danger badge-shadow">Sale</span>
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/17.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton T-shirt Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$9.<small>50</small></span>
                                                        <del class="fs-sm text-muted">$11.<small>50</small></del>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns2-item2">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/18.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Shoes</a>
                                                <h3 class="product-title fs-sm"><a href="#">Men’s Leather Keds</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $64.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns2-item3">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/19.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">3 Color Collection of T-shirts</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $27.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item" id="tns2-item4" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/13.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton Polo Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $13.<small>50</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/14.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Jeans</a>
                                                <h3 class="product-title fs-sm"><a href="#">Slim Taper Fit Jeans</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$58.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <span class="badge bg-danger badge-shadow">Sale</span>
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/17.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton T-shirt Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$9.<small>50</small></span>
                                                        <del class="fs-sm text-muted">$11.<small>50</small></del>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/18.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Shoes</a>
                                                <h3 class="product-title fs-sm"><a href="#">Men’s Leather Keds</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $64.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/19.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">3 Color Collection of T-shirts</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $27.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/13.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton Polo Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $13.<small>50</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/14.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Jeans</a>
                                                <h3 class="product-title fs-sm"><a href="#">Slim Taper Fit Jeans</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$58.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <span class="badge bg-danger badge-shadow">Sale</span>
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/17.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s T-shirts</a>
                                                <h3 class="product-title fs-sm"><a href="#">Cotton T-shirt Regular Fit</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$9.<small>50</small></span>
                                                        <del class="fs-sm text-muted">$11.<small>50</small></del>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/18.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Shoes</a>
                                                <h3 class="product-title fs-sm"><a href="#">Men’s Leather Keds</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $64.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
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
            </div>-->
            <!-- Product carousel (You may also like)
            <div class="container py-5 my-md-3">
                <h2 class="h3 text-center pb-4">You may also like</h2>
                <div class="tns-carousel tns-controls-static tns-controls-outside">
                    <div class="tns-outer" id="tns3-ow">
                        <div class="tns-controls" aria-label="Carousel Navigation" tabindex="0">
                            <button type="button" data-controls="prev" tabindex="-1" aria-controls="tns3"><i class="ci-arrow-left"></i></button><button type="button" data-controls="next" tabindex="-1" aria-controls="tns3"><i class="ci-arrow-right"></i></button>
                        </div>
                        <div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">
                            slide <span class="current">9 to 12</span>  of 5
                        </div>
                        <div id="tns3-mw" class="tns-ovh">
                            <div class="tns-inner" id="tns3-iw">
                                <div class="tns-carousel-inner  tns-slider tns-carousel tns-subpixel tns-calc tns-horizontal" data-carousel-options="{&quot;items&quot;: 2, &quot;controls&quot;: true, &quot;nav&quot;: false, &quot;responsive&quot;: {&quot;0&quot;:{&quot;items&quot;:1},&quot;500&quot;:{&quot;items&quot;:2, &quot;gutter&quot;: 18},&quot;768&quot;:{&quot;items&quot;:3, &quot;gutter&quot;: 20}, &quot;1100&quot;:{&quot;items&quot;:4, &quot;gutter&quot;: 30}}}" id="tns3" style="transition-duration: 0s; transform: translate3d(-38.0952%, 0px, 0px);">
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $25.<small>00</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$24.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $26.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $25.<small>00</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns3-item0">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$24.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns3-item1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $26.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns3-item2">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-active" id="tns3-item3">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item" id="tns3-item4" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $25.<small>00</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$24.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $26.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/23.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/24.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $25.<small>00</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/20.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price">
                                                        <span class="text-accent">$24.<small>99</small></span>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/21.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $26.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1">
                                        <div class="card product-card card-static">
                                            <button class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist"><i class="ci-heart"></i></button><a class="card-img-top d-block overflow-hidden" href="#"><img src="https://cartzilla.createx.studio/img/shop/catalog/22.jpg" alt="Product"></a>
                                            <div class="card-body py-2">
                                                <a class="product-meta d-block fs-xs pb-1" href="#">Men’s Hoodie</a>
                                                <h3 class="product-title fs-sm"><a href="#">Block-colored Hooded Top</a></h3>
                                                <div class="d-flex justify-content-between">
                                                    <div class="product-price text-accent">
                                                        $24.<small>99</small>
                                                    </div>
                                                    <div class="star-rating">
                                                        <i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-filled active"></i><i class="star-rating-icon ci-star-half active"></i><i class="star-rating-icon ci-star"></i><i class="star-rating-icon ci-star"></i>
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
            </div>-->
        </main>`
                }