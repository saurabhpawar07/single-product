export default {
        props: {
            product: {
                type: Object,
                default: function () {
                    return {
                        cost: 50,
                        price: 60,
                        logo: "",
                        images: "",
                        name: "Product Name",
                        account_name: "Shop Name",
                        max_cost: 70,
                        max_price: 82,
                        image_by_vareation : "",
                    }
                }
            },
        },
        data() {
            return {
                index : 0,
                quantity : 1,
                variation : false,
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
        watch: {
            product(newValue, oldValue) {},
        },
        mounted: function () {
            if(this.product.variations.length){
                this.variation = this.product.variations[0]
            }
        },
    template: `<div class="card product-card">
        <span v-if="product.cost != product.price" class="badge bg-danger badge-shadow">Sale</span>
        <button v-if="!iswishlisted" class="btn-wishlist btn-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Add to wishlist" @click.prevent="$store.dispatch('add_to_wishlist', product.id)">
            <i class="ci-heart"></i>
        </button>
        <button v-if="iswishlisted" class="btn-wishlist btn-sm text-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="Add to wishlist" aria-label="Remove from wishlist" @click.prevent="$store.dispatch('remove_from_wishlist', product.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
        </button>
        <a class="card-img-top d-block overflow-hidden" :href="'/product/'+product.id+'/'+encodeURI(product.name)" @click.prevent="showproduct(product)">
            <div class="border rounded" :style="{'background-image': 'url('+product.logo+')'}" style="min-height: 150px;width: 100%;padding: 50%;background-size: cover;background-position: center;"></div>
        </a>
        <div class="card-body py-2">
            <leafrating :rating="product.ev_rating ? product.ev_rating : 0" style="margin: auto"></leafrating>
            <h3 class="product-title fs-sm"><a :href="'/product/'+product.id+'/'+encodeURI(product.name)" @click.prevent="showproduct(product)">{{product.name}}</a></h3>
            <a v-if="product.account_name" class="product-meta d-block fs-xs pb-1" href="#">by {{product.account_name}}</a>
            <div class="d-flex justify-content-between">
                <div class="product-price">
                    <span class="text-accent"><span>$</span>{{product.cost}}<small>.00</small></span>
                    <del v-if="product.cost != product.price" class="fs-sm text-muted"><span>$</span>{{product.price}}<small>.00</small></del>
                    <span v-if="product.max_cost > product.cost" class="text-accent"> - <span>$</span>{{product.max_cost}}<small>.00</small></span>
                    <del v-if="product.max_cost > product.cost && product.max_cost != product.max_price" class="fs-sm text-muted"> - <span>$</span>{{product.max_price}}<small>.00</small></del>
                </div>
                <div class="star-rating">
                    <i class="star-rating-icon" :class="product.rating > 0?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="product.rating > 1?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="product.rating > 2?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="product.rating > 3?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="product.rating > 4?'ci-star-filled active':'ci-star'"></i>
                </div>
            </div>
        </div>
        <div class="card-body card-body-hidden">
            <div v-if="variation" class="text-center pb-2">
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
            <button class="btn btn-primary btn-sm d-block w-100 mb-2" type="button" @click.prevent="add_to_cart($event, true)"><i class="ci-cart fs-sm me-1"></i>Add to Cart</button>
            <div class="text-center">
                <a class="nav-link-style fs-ms" href="#" @click.prevent="$store.commit('set_quick_view_product', product )"><i class="ci-eye align-middle me-1"></i>Quick view</a>
            </div>
        </div>
    </div>`
                }