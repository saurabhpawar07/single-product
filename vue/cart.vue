<script>
export default {
    components: {
        'cart_editor': () => import("./cart_editor.vue.js"),
    },
    data() {
        return {
            submited : false,
            loading: 0,
            error: false,
            message: "",
        };
    },
    computed: {
        ...Vuex.mapState(['user', "cart", "cart_cost_total", "cart_price_total"]),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        user(newValue, oldValue) {
            if (newValue && this.submited) {
                this.$router.push("/checkout")
            }
        },
    },
    methods: {
        checkout(event){
            if(!this.cart || !this.cart.length){
                return
            }
            this.error = false
            this.message = ""
            this.cart.forEach(cart_item => {
                if (cart_item.error) {
                    this.error = true
                    this.message = "Stock of some items in cart have beed changed and insufficient, please change quantity or remove item from cart"
                }
            });
            if(this.error){
                return
            }
            if(!this.user){
                this.submited = true
                this.$store.commit('set_showlogin', true )
            }else{
                this.$router.push("/checkout")
            }
        }
    },
    mounted: function () {},
}    
</script>
<template>
<main class="page-wrapper">
        <!-- Page Title-->
        <div class="page-title-overlap bg-dark pt-4">
            <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><a class="text-nowrap" href="index.html"><i class="ci-home"></i>Home</a></li>
                            <li class="breadcrumb-item text-nowrap"><a href="shop-grid-ls.html">Shop</a>
                            </li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">Cart</li>
                        </ol>
                    </nav>
                </div>
                <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                    <h1 class="h3 text-light mb-0">Your cart</h1>
                </div>
            </div>
        </div>
        <div class="container pb-5 mb-2 mb-md-4">
            <div class="row">
                <router-view class="col-lg-8"></router-view>
                <!-- List of items-->
                <section class="col-lg-8">
                    <div class="d-flex justify-content-between align-items-center pt-3 pb-4 pb-sm-5 mt-1">
                        <h2 class="h6 text-light mb-0">Products</h2>
                        <a class="btn btn-outline-primary btn-sm ps-2" href="/" @click.prevent="$router.back()"><i class="ci-arrow-left me-2"></i>Continue shopping</a>
                    </div>
                    <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                    <button v-if="!cart.length" class="btn btn-outline-accent d-block w-100 mt-4" type="button" @click.prevent="$router.back()">
                        <i class="ci-loading fs-base me-2"></i>Cart is Empty, It's time to shop somthing....
                    </button>
                    <cart_editor v-else v-model="cart"></cart_editor>
                </section>
                <!-- Sidebar-->
                <aside class="col-lg-4 pt-4 pt-lg-0 ps-xl-5">
                    <div class="bg-white rounded-3 shadow-lg p-4">
                        <div class="py-2 px-xl-2">
                            <div class="text-center mb-4 pb-3 border-bottom">
                                <h2 class="h6 mb-3 pb-1">Subtotal</h2>
                                <h3 class="fw-normal"><span>$</span>{{cart_cost_total}}<span>.00</span></h3>
                            </div>
                            <h5>Apply promo code</h5>
                            <form class="needs-validation" method="post" novalidate="">
                                <div class="mb-3">
                                    <input class="form-control" type="text" placeholder="Promo code" required="">
                                    <div class="invalid-feedback">
                                        Please provide promo code.
                                    </div>
                                </div>
                                <button class="btn btn-outline-primary d-block w-100" type="submit">Apply promo code</button>
                            </form>
                            <div class="my-4 pb-3 border-bottom">
                                <span v-if="cart_price_total > cart_cost_total" class="d-flex justify-content-between">
                                    <label class="fw-medium">Price Total : </label> 
                                    <span>
                                        <span>$</span>{{cart_price_total}}<span>.00</span>
                                    </span>
                                </span>
                                <br/>
                                <span v-if="cart_price_total > cart_cost_total" class="d-flex justify-content-between">
                                    <label class="fw-medium">You saved : </label> 
                                    <span>
                                        <span>$</span>{{cart_price_total - cart_cost_total}}<span>.00</span>
                                    </span>
                                </span>
                            </div>
                            <h3 class="d-flex justify-content-between mb-3">
                                <label>Total : </label>
                                <span><span>$</span>{{cart_cost_total}}<span>.00</span></span>
                            </h3>
                            <button class="btn btn-primary btn-shadow d-block w-100 mt-4" @click.prevent="checkout">
                                <i class="ci-card fs-lg me-2"></i>Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </main>        
</template>
