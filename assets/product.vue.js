export default {
    props: {
        product: {
            default: function () {
                return {
                    cost: 50,
                    price: 60,
                    logo: "",
                    name: "Product Name",
                    account_name: "Shop Name",
                    max_cost: 70,
                    max_price: 82,
                    variation: "",
                    variations: [],
                    stocks: [],
                    stock_filter: {},
                    stock_error: "",
                }
            }
        }
    },
    computed: {
        ...Vuex.mapState(['user', "wishlist"]),
        iswishlisted: function () {
            if (this.wishlist && this.product && this.wishlist.includes(this.product.id)) {
                return true
            } else {
                return false
            }
        },
    },
    components: {
        'product_gallery': () => import("./product_gallery.vue.js"),
    },
    data() {
        return {
            quantity: 1,
        }
    },
    watch: {
        product(newValue, oldValue) {},
    },
    methods: {
        on_filter_change(variation_name) {
            if (variation_name == this.product.image_by) {
                if (product.image_by && product.stock_filter && product.stock_filter[product.image_by]) {
                    product.image_by_vareation = product.stock_filter[product.image_by]
                }
            }
            this.selectStock()
        }
    },
    mounted: function () {},
    template: `<div class="row">
        <!-- Product gallery-->
        <div class="col-lg-7 pe-lg-0">
            <product_gallery ref="product_gallery" v-if="product" :product="product" :variation="product.image_by_vareation" />
        </div>
        <!-- Product details-->
        <div class="col-lg-5 pt-4 pt-lg-0 image-zoom-pane">
            <div v-if="product" class="product-details ms-auto pb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <a href="#reviews">
                        <div class="star-rating">
                            <i class="star-rating-icon" :class="product.rating > 0?'ci-star-filled active':'ci-star'"></i>
                            <i class="star-rating-icon" :class="product.rating > 1?'ci-star-filled active':'ci-star'"></i>
                            <i class="star-rating-icon" :class="product.rating > 2?'ci-star-filled active':'ci-star'"></i>
                            <i class="star-rating-icon" :class="product.rating > 3?'ci-star-filled active':'ci-star'"></i>
                            <i class="star-rating-icon" :class="product.rating > 4?'ci-star-filled active':'ci-star'"></i>
                        </div>
                        <span class="d-inline-block fs-sm text-body align-middle mt-1 ms-1">{{product.reviews}} Reviews</span></a>
                    <button v-if="!iswishlisted" class="btn-wishlist" type="button" data-bs-toggle="tooltip" title="Add to wishlist" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist" @click.prevent="$store.dispatch('add_to_wishlist', product.id)">
                        <i class="ci-heart"></i>
                    </button>
                    <button v-if="iswishlisted" class="btn-wishlist" type="button" data-bs-toggle="tooltip" title="Remove from wishlist" data-bs-original-title="Remove from wishlist" aria-label="Remove from wishlist" @click.prevent="$store.dispatch('remove_from_wishlist', product.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                        </svg>
                    </button>
                </div>
                <h2 class="h3 mb-0">{{product.name}}</h2>
                <h5> Sold By : <a href="#">{{product.account_name}}</a></h5>
                <leafrating :rating="product.ev_rating ? product.ev_rating : 0"></leafrating>
                <div class="position-relative me-n4">
                    <div class="my-3">
                        <span class="h3 fw-normal text-accent me-1"><span>$</span>{{product.cost}}<small>.00</small></span>
                        <del v-if="product.cost != product.price" class="text-muted fs-lg me-3"><span>$</span>{{product.price}}<small>.00</small></del>
                        <span v-if="product.max_cost > product.cost" class="h3 fw-normal text-accent me-1"><span>- $</span>{{product.max_cost}}<small>.00</small></span>
                        <del v-if="product.max_cost > product.cost && product.max_cost != product.max_price" class="text-muted fs-lg me-3"><span>$</span>{{product.max_price}}<small>.00</small></del>
                        <span v-if="product.cost != product.price" class="badge bg-danger badge-shadow align-middle mt-n2">Sale</span>
                    </div>
                    <div v-if="product.quantity" class="product-badge product-available mt-n1">
                        <i class="ci-security-check"></i>Product available
                    </div>
                </div>
                <form class="mb-grid-gutter" @submit.prevent="add_to_cart">
                    <div v-for="(variation, index) in product.variations" class="position-relative">
                        <label class="fw-medium pb-1" :for="'variation'+index">{{variation.Name}}:</label>
                        <div v-if="variation.Color">
                            <div v-for="(option, option_index) in variation.Options" class="form-check form-option form-check-inline">
                                <input class="form-check-input" type="radio" :name="'variation'+index" :id="'variation'+index+'_option'+ option_index" :data-bs-label="'variation'+index+'_option'+ option_index" :value="option.Name" v-model="product.stock_filter[variation.Name]" @change="selectStock(product)">
                                <label class="form-option-label rounded-circle" :for="'variation'+index+'_option'+ option_index">
                                    <span class="form-option-color rounded-circle border" :style="'background-color:'+option.Color"></span>
                                </label>
                            </div>
                        </div>
                        <div v-else-if="variation.Image">
                            <div v-for="(option, option_index) in variation.Options" class="form-check form-option form-check-inline">
                                <input class="form-check-input" type="radio" :name="'variation'+index" :id="'variation'+index+'_option'+ option_index" :data-bs-label="'variation'+index+'_option'+ option_index" :value="option.Name" v-model="product.stock_filter[variation.Name]" @change="selectStock(product)">
                                <label class="form-option-label rounded-circle" :for="'variation'+index+'_option'+ option_index">
                                    <span class="form-option-color rounded-circle" :style="'background-image: url('+option.Image+')'"></span>
                                </label>
                            </div>
                        </div>
                        <div v-else>
                            <select class="form-select form-select-sm mb-2" id="product-size" :name="'variation'+index" :id="'variation'+index" :data-bs-label="'variation'+index" v-model="product.stock_filter[variation.Name]" @change="selectStock(product)">
                                <option value="">Select {{variation.Name}}</option>
                                <option v-for="(option, option_index) in variation.Options" :value="option.Name">{{option.Name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <div v-if="product.selected_stock" class="flex-fill">
                            <span class="h3 fw-normal text-accent me-1"><span>$</span>{{product.selected_stock.Cost}}<small>.00</small></span>
                            <del v-if="product.selected_stock.Cost != product.selected_stock.Price" class="text-muted fs-lg me-3"><span>$</span>{{product.selected_stock.Price}}<small>.00</small></del>
                            <span v-if="product.selected_stock.Cost != product.selected_stock.Price" class="badge bg-danger badge-shadow align-middle mt-n2">Sale</span>
                        </div>
                        <div v-if="product.selected_stock" class="alert alert-success d-flex align-items-center p-1 m-1" role="alert">
                            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#exclamation-triangle-fill" /></svg>
                            <div class="text-center">
                                SKU: {{product.selected_stock.SKU}}
                            </div>
                        </div>
                    </div>
                    <div v-if="product.selected_stock && product.selected_stock.Quantity <= product.selected_stock.LowStockLimit"
                        class="alert alert-warning d-flex align-items-center p-1 m-1 mb-2" role="alert">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill" /></svg>
                        <div>
                            Hurry up! limited stock available.
                        </div>
                    </div>
                    <div v-if="product.stock_error" class="alert alert-danger d-flex align-items-center p-1 m-1 mb-2" role="alert">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill" /></svg>
                        <div>
                            {{product.stock_error}}
                        </div>
                    </div>
                    <div class="mb-3 d-flex align-items-center">
                        <select class="form-select me-3" style="width: 5rem;" v-model="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button class="btn btn-primary btn-shadow d-block w-100" type="submit"><i class="ci-cart fs-lg me-2"></i>Add to Cart</button>
                    </div>
                </form>
                <ul v-if="product && product.quick_points" class="fs-sm ps-4">
                    <li v-for="quick_point in product.quick_points.split(',')">{{quick_point}}</li>
                </ul>
                <!-- Product panels-->
                <div class="accordion mb-4" id="productPanels">
                    <div v-if="product.summary" class="accordion-item">
                        <h3 class="accordion-header"><a class="accordion-button" href="#productInfo" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="productInfo"><i class="ci-announcement text-muted fs-lg align-middle mt-n1 me-2"></i>Product info</a></h3>
                        <div class="accordion-collapse collapse show" id="productInfo" data-bs-parent="#productPanels">
                            <div class="accordion-body">
                                <p v-if="product.summary.length > 300">
                                    {{product.summary.substring(0,300)}}
                                    <a href="#productdescription"> Read More </a>
                                </p>
                                <p v-else>
                                    {{product.summary}}
                                </p>
                                <h6 class="fs-sm mb-2">Tags.</h6>
                                <p class="text-muted">
                                    {{product.keywords}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h3 class="accordion-header"><a class="accordion-button collapsed" href="#shippingOptions" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="shippingOptions"><i class="ci-delivery text-muted lead align-middle mt-n1 me-2"></i>Shipping options</a></h3>
                        <div class="accordion-collapse collapse" id="shippingOptions" data-bs-parent="#productPanels">
                            <div class="accordion-body fs-sm">
                                <div v-for="shipping in product.shippings" class="d-flex justify-content-between border-bottom pb-2">
                                    <div>
                                        <div class="fw-semibold text-dark">
                                            {{shipping.Name}}
                                        </div>
                                        <div class="fs-sm text-muted">
                                            {{shipping.EDTMin}} - {{shipping.EDTMax}} days
                                        </div>
                                        <span class="text-muted">
                                            All addresses
                                            <span v-if="shipping.SubLocality">{{shipping.SubLocality}}, </span>
                                            <span v-if="shipping.Locality">{{shipping.Locality}}, </span>
                                            <span v-if="shipping.District">{{shipping.District}}, </span>
                                            <span v-if="shipping.Country">in {{shipping.Country}}, </span>
                                        </span>
                                    </div>
                                    <div>
                                        <span>$</span>{{shipping.Price}}<span>.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div
                    <!-- Sharing-->
                    <label class="form-label d-inline-block align-middle my-2 me-3">Share:</label><a class="btn-share btn-twitter me-2 my-2" href="#"><i class="ci-twitter"></i>Twitter</a><a class="btn-share btn-instagram me-2 my-2" href="#"><i class="ci-instagram"></i>Instagram</a><a class="btn-share btn-facebook my-2" href="#"><i class="ci-facebook"></i>Facebook</a>
                </div>
            </div>
        </div>
    </div>`
                }