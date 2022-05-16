export default {
    components: {
        'cart_editor': () => import("./cart_editor.vue.js"),
        'addresses': () => import("./addresses.vue.js"),
        'shipping_methods': () => import("./shipping_methods.vue.js"),
        'payment_methods': () => import("./payment_methods.vue.js"),
    },
    data() {
        return {
            submited: false,
            loading: 0,
            error: false,
            message: "",
            same_address: true,
            selected_step: 'cart',
            items: [],
            cart_valid: false,
            Price: 0,
            Cost: 0,
            shipping_address: null,
            billing_address: null,
            shipping_calculated: false,
            ShippingCost: 0,
            Total: 0,
            payment_method: null,
            OrderID : 0,
        };
    },
    computed: {
        ...Vuex.mapState(['user', 'cart']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        user(newValue, oldValue) {
            if (!newValue) {
                this.$store.commit('set_showlogin', true)
            }
        },
        shipping_address(newValue, oldValue) {
            if (this.same_address) {
                this.billing_address = this.shipping_address
            }
        },
        same_address(newValue, oldValue) {
            if (newValue) {
                this.billing_address = this.shipping_address
            }
        },
        cart(newValue, oldValue) {
            if(!this.items.length && Array.isArray(this.$store.state.cart) && this.$store.state.cart.length ){
                this.items = this.$store.state.cart
            }
        },
    },
    methods: {
        calculate_total() {
            
            // calculate_shipping
            var ShippingCost = 0
            var shipping_calculated = true
            this.items.forEach(element => {
                if (element.ShippingMethod) {
                    element.ShippingCost = (parseInt(element.ShippingPrice) * parseInt(element.Quantity))
                    ShippingCost += element.ShippingCost
                } else {
                    shipping_calculated = false
                }
            });
            this.ShippingCost = ShippingCost
            this.shipping_calculated = shipping_calculated
            
            this.Total = this.Cost + this.ShippingCost
        },
        validate_items() {
            var error = false
            var message = ""
            if (this.items.length) {
                this.items.forEach(cart_item => {
                    if (cart_item.error) {
                        error = true
                        message = "Stock of some items in cart have beed insufficient or out of stock, please change quantity or remove item from cart"
                    }
                });
            } else {
                error = true
                message = "Cart is empty add somthing to checkout"
            }
            if (error) {
                this.cart_valid = false
                this.error = error
                this.message = message
            } else {
                this.cart_valid = true
            }
        },
        select_step(step) {
            this.error = false
            this.message = ""
            switch (step) {
            case 'addresses':
                this.validate_items()
                if (!this.cart_valid) {
                    return
                }
                break;
            case 'shipping':
                if (!this.shipping_address) {
                    this.error = true
                    this.message = "Add or select shipping address"
                    return
                }
                if (!this.billing_address) {
                    this.error = true
                    this.message = "Add or select billing address"
                    return
                }
                break;
            case 'payment':
                if (!this.shipping_calculated) {
                    this.error = true
                    this.message = "Please select shipping method for each product in cart"
                    return
                }
                break;
            case 'review':
                if (!this.payment_method) {
                    this.error = true
                    this.message = "Please select payment method to pay for this order"
                    return
                }
                break;
            default:
                break;
            }
            this.selected_step = step
            setTimeout(() => {
                window.scrollTo({top: 200, behavior: 'smooth'});
            }, 30);
        },
        place_order() {
            this.error = false
            this.message = ""

            this.validate_items()
            if (!this.cart_valid) {
                return
            }
            if (!this.shipping_address) {
                this.message = "Plesae set shipping address"
                this.error = false
                return
            }
            if (!this.billing_address) {
                this.message = "Plesae set billing address"
                this.error = false
            }
            if (!this.shipping_calculated) {
                this.message = "Plesae select shipping method for all products"
                this.error = false
            }
            if (!this.payment_method) {
                this.message = "Plesae select payment method for this order"
                this.error = false
            }

            var items = []
            this.items.forEach(element => {
                items.push({
                    ID : element.ID?element.ID:0,
                    ProductID : element.ProductID,
                    Name : element.Name,
                    Logo : element.Logo,
                    Variation : element.Variation,
                    SKU : element.SKU,
                    Quantity : element.Quantity,
                    Price : element.Price,
                    Cost : element.Cost,
                    PriceTotal : element.PriceTotal,
                    CostTotal : element.CostTotal,
                    
                    ShippingImage : element.ShippingImage,
                    ShippingMethod : element.ShippingMethod,
                    ShippingPrice : element.ShippingPrice,
                    EDTMin : element.EDTMin,
                    EDTMax : element.EDTMax,
                    
                    ShippingCost : element.ShippingCost,
                })
            });
            var data = {}
            data.order = {
            	ShippingAddress : this.shipping_address.ID,
            	BillingAddress : this.billing_address.ID,
            	Items : items,
            	Price : this.Price,
            	Cost : this.Cost,
            	ShippingCost : this.ShippingCost,
            	Total : this.Total,
            	PaymentMethod : this.payment_method.method,
            }
            try {
                data.order.PaymentMethodDetails = JSON.stringify(this.payment_method)
            } catch (error) {
                console.log(error)  
            }
            this.loading = true
            return this.$store.dispatch('call', {
                api: "order",
                data: data,
            }).then((data) => {
                if(data.Result.tab){
                    this.select_step(data.Result.tab)
                }
                if (data.Status == 2) {
                    this.OrderID = data.Result.OrderID
                    this.$router.push('/checkout_successfully/'+data.Result.OrderID)
                } else {
                    this.error = true
                }
                this.message = data.Message
                return data
            }).catch((error) => {
                console.log(error)
                this.error = true
                this.message = error
            }).finally(() => {
                this.loading = false;
            });
        },
        onItemsChange(values){
            this.Price = values.price_total
            this.Cost = values.cost_total
            this.calculate_total()
            if(this.selected_step == 'cart' && !this.addresses_flag){
                this.addresses_flag = true
                this.select_step('addresses')
            }
        },
    },
    mounted: function () {
        if(!this.user){
            this.$router.back()
        }else if(!this.items.length && Array.isArray(this.$store.state.cart) && this.$store.state.cart.length ){
            this.items = this.$store.state.cart
        }
    },
    template: `<main class="page-wrapper">
        <!-- Page Title-->
        <div class="page-title-overlap bg-dark pt-4">
            <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><a class="text-nowrap" href="index.html"><i class="ci-home"></i>Home</a></li>
                            <li class="breadcrumb-item text-nowrap"><a href="shop-grid-ls.html">Shop</a></li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">Checkout</li>
                            <li class="breadcrumb-item text-nowrap active text-capitalize" aria-current="page">"{{selected_step}}"</li>
                        </ol>
                    </nav>
                </div>
                <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                    <h1 class="h3 text-light mb-0">Checkout</h1>
                </div>
            </div>
        </div>
        <div class="container pb-5 mb-2 mb-md-4">
            <div class="row">
                <section :class="{'col-lg-8': selected_step != 'review'}">
                    <!-- Steps-->
                    <div class="steps steps-light pt-2 pb-3 mb-2 nav">
                        <a href="#cart" class="step-item" @click="select_step('cart')"
                            :class="{'active': selected_step == 'cart' ,'success' : cart_valid}">
                            <div class="step-progress">
                                <span class="step-count">1</span>
                            </div>
                            <div class="step-label">
                                <i class="ci-cart"></i> Cart
                            </div>
                        </a>
                        <a class="step-item" href="#addresses" @click="select_step('addresses')"
                            :class="{'active': selected_step == 'addresses' ,'success' : shipping_address && billing_address}">
                            <div class="step-progress">
                                <span class="step-count">3</span>
                            </div>
                            <div class="step-label">
                                <i class="ci-user-circle"></i> Address
                            </div>
                        </a>
                        <a class="step-item" href="#shipping" @click="select_step('shipping')"
                            :class="{'active': selected_step == 'shipping' , 'success' : shipping_calculated}">
                            <div class="step-progress">
                                <span class="step-count">4</span>
                            </div>
                            <div class="step-label">
                                <i class="ci-package"></i>Shipping
                            </div>
                        </a>
                        <a class="step-item" href="#payment" @click="select_step('payment')"
                            :class="{'active': selected_step == 'payment' , 'success' : payment_method}">
                            <div class="step-progress">
                                <span class="step-count">5</span>
                            </div>
                            <div class="step-label">
                                <i class="ci-card"></i> Payment
                            </div>
                        </a>
                        <a class="step-item" href="#review" @click="select_step('review')"
                            :class="{'active': selected_step == 'review'}">
                            <div class="step-progress">
                                <span class="step-count">6</span>
                            </div>
                            <div class="step-label">
                                <i class="ci-check-circle"></i> Review
                            </div>
                        </a>
                    </div>
                    <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                    <div v-if="selected_step == 'cart'" id="cart">
                        <cart_editor v-if="items && items.length" v-model="items" @change="onItemsChange"></cart_editor>
                        <div v-else>Cart is empty or loading... </div>
                        <!-- Navigation (desktop)-->
                        <div class="d-flex pt-4 mt-3">
                            <div class="w-50 pe-3">
                                <a href="#" @click.prevent="$router.back()" class="btn btn-secondary d-block w-100">
                                    <i class="ci-arrow-left mt-sm-0 me-1"></i>
                                    <span class="d-inline">Back</span>
                                </a>
                            </div>
                            <div class="w-50 ps-2 nav">
                                <a class="btn btn-primary d-block w-100" href="#addresses" @click="select_step('addresses')">
                                    <span class="d-none d-sm-inline">Set Shipping Address</span>
                                    <span class="d-inline d-sm-none">Next</span>
                                    <i class="ci-arrow-right mt-sm-0 ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-if="selected_step == 'addresses'" id="addresses">
                        <!-- Shipping address-->
                        <h2 class="h6 pb-3 mb-3 border-bottom">Shipping address</h2>
                        <addresses v-model="shipping_address"></addresses>
                        <h6 class="mb-3 py-3">Billing address</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" checked id="same-address" v-model="same_address">
                            <label class="form-check-label" for="same-address">Same as shipping address</label>
                        </div>
                        <addresses v-if="!same_address" v-model="billing_address"></addresses>
                        <!-- Navigation (desktop)-->
                        <div class="d-flex pt-4 mt-3">
                            <div class="w-50 pe-3">
                                <a href="#cart" class="btn btn-primary d-block w-100" @click="select_step('cart')">
                                    <i class="ci-arrow-left mt-sm-0 me-1"></i>
                                    <span class="d-none d-sm-inline">Back to Cart</span>
                                    <span class="d-inline d-sm-none">Back</span>
                                </a>
                            </div>
                            <div class="w-50 ps-2 nav">
                                <a class="btn btn-primary d-block w-100" href="#shipping" @click="select_step('shipping')">
                                    <span class="d-none d-sm-inline">Proceed to Shipping</span>
                                    <span class="d-inline d-sm-none">Next</span>
                                    <i class="ci-arrow-right mt-sm-0 ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-if="selected_step == 'shipping'" id="shipping">
                        <h2 class="h6 pb-3 mb-2">Choose shipping method</h2>
                        <shipping_methods v-if="shipping_address" :items="items" :shipping_address="shipping_address" @input="calculate_total"></shipping_methods>
                        <!-- Navigation (desktop)-->
                        <div class="d-flex pt-4 mt-3">
                            <div class="w-50 pe-3">
                                <a class="btn btn-primary d-block w-100" href="#addresses" @click="select_step('addresses')">
                                    <i class="ci-arrow-left mt-sm-0 me-1"></i>
                                    <span class="d-none d-sm-inline">Back to addresses</span>
                                    <span class="d-inline d-sm-none">Back</span>
                                </a>
                            </div>
                            <div class="w-50 ps-2 nav">
                                <a class="btn btn-primary d-block w-100" href="#payment" @click="select_step('payment')">
                                    <span class="d-none d-sm-inline">Proceed to payment</span>
                                    <span class="d-inline d-sm-none">Next</span>
                                    <i class="ci-arrow-right mt-sm-0 ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-if="selected_step == 'payment'" id="payment">
                        <!-- Payment methods accordion-->
                        <h2 class="h6 pb-3 mb-2">Choose payment method</h2>
                        <payment_methods v-model="payment_method" :total="Total"></payment_methods>
                        <div class="d-flex pt-4">
                            <div class="w-50 pe-3">
                                <a class="btn btn-secondary d-block w-100" href="#shipping" @click="select_step('shipping')">
                                    <i class="ci-arrow-left mt-sm-0 me-1"></i>
                                    <span class="d-none d-sm-inline">Back to Shipping</span>
                                    <span class="d-inline d-sm-none">Back</span>
                                </a>
                            </div>
                            <div class="w-50 ps-2">
                                <a class="btn btn-primary d-block w-100" href="#review" @click="select_step('review')">
                                    <span class="d-none d-sm-inline">Review your order</span>
                                    <span class="d-inline d-sm-none">Review order</span>
                                    <i class="ci-arrow-right mt-sm-0 ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <!-- Sidebar-->
                <aside class="pt-4 pt-lg-0 ps-xl-5" :class="{'col-lg-4': selected_step != 'review'}">
                    <div class="bg-white rounded-3 p-4 ms-lg-auto" :class="{'shadow-lg': selected_step != 'review'}">
                        <div class="py-2 px-xl-2 d-flex" :class="{'flex-column': selected_step != 'review', 'flex-wrap': selected_step == 'review'}">
                            <div class="widget mb-3 flex-fill" style="min-width:50%">
                                <h2 class="widget-title text-center">Order summary</h2>
                                <div v-if="selected_step != 'cart'" style="max-height: 50vh; overflow-x: hidden;" data-simplebar data-simplebar-auto-hide="true">
                                    <div v-for="item in items" class="d-flex align-items-center pb-2 border-bottom">
                                        <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)"
                                            class="d-block flex-shrink-0" style="height: 64px; width: 64px;">
                                            <img :src="item.Logo" alt="Product" style="height: auto; width: auto; margin: auto; max-width:100%; max-height:100%">
                                        </router-link>
                                        <div class="ps-2 flex-fill">
                                            <h6 class="widget-product-title">
                                                <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)">
                                                    {{item.Name}}
                                                </router-link>
                                            </h6>
                                            <div class="widget-product-meta d-flex justify-content-between align-items-center">
                                                <div class="me-4">
                                                    <span class="text-accent me-2">
                                                        <span>$</span>{{item.Cost}}<small>.00</small>
                                                    </span>
                                                    <span class="text-muted">x {{item.Quantity}}</span>
                                                </div>
                                                <span v-if="selected_step == 'review'">
                                                    <span>$</span>{{item.CostTotal}}<span>.00</span>
                                                </span>
                                            </div>
                                            <div v-if="selected_step == 'review'" class="widget-product-meta d-flex justify-content-between align-items-center">
                                                <span v-if="item.ShippingMethod" class="text-muted me-4">
                                                    {{item.ShippingMethod}}
                                                    ({{item.EDTMin}} - {{item.EDTMax}} days)
                                                    <span>$</span>{{item.ShippingPrice}}<span>.00</span>
                                                </span>
                                                <span>
                                                    <span>$</span>{{item.ShippingCost}}<span>.00</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap flex-fill justify-content-center" style="min-width:50%">
                                <div class="widget mb-3" style="min-width:50%" :class="{'border-bottom': selected_step != 'review', 'border-right': selected_step == 'review'}">
                                    <h2 class="widget-title text-center">Shipping Address</h2>
                                    <template v-if="shipping_address">
                                        <div class="d-flex flex-column p-2 m-1" v-if="selected_step == 'review'">
                                            <span> {{shipping_address.AddressLine1}} </span>
                                            <span v-if="shipping_address.AddressLine2"> {{shipping_address.AddressLine2}} </span>
                                            <span> {{shipping_address.SubLocality}} {{shipping_address.Locality}} </span>
                                            <span> {{shipping_address.District}} {{shipping_address.State}} {{shipping_address.Country}} </span>
                                            <span> {{shipping_address.Code}} </span>
                                            <span v-if="shipping_address.Mobile"> Mobile: ‪{{shipping_address.Mobile}}</span>
                                        </div>
                                        <p v-else>
                                            {{shipping_address.Title}}
                                        </p>
                                    </template>
                                </div>
                                <div class="widget mb-3" style="min-width:50%" :class="{'border-bottom': selected_step != 'review'}">
                                    <h2 class="widget-title text-center">Billing Address</h2>
                                    <template v-if="billing_address">
                                        <div class="d-flex flex-column p-2 m-1" v-if="selected_step == 'review'">
                                            <span> {{billing_address.AddressLine1}} </span>
                                            <span v-if="billing_address.AddressLine2"> {{billing_address.AddressLine2}} </span>
                                            <span> {{billing_address.SubLocality}} {{billing_address.Locality}} </span>
                                            <span> {{billing_address.District}} {{billing_address.State}} {{billing_address.Country}} </span>
                                            <span> {{billing_address.Code}} </span>
                                            <span v-if="billing_address.Mobile"> Mobile: ‪{{billing_address.Mobile}}</span>
                                        </div>
                                        <p v-else>
                                            {{billing_address.Title}}
                                        </p>
                                    </template>
                                </div>
                            </div>
                            <ul class="list-unstyled fs-sm flex-fill" :class="{'border-bottom pb-2': selected_step != 'review'}" style="min-width:50%">
                                <li class="d-flex justify-content-between align-items-center"><span class="me-2">Subtotal:</span><span class="text-end"><span>$</span>{{Price}}<span>.00</span></span></li>
                                <li class="d-flex justify-content-between align-items-center"><span class="me-2">Discount:</span><span class="text-end"><span>$</span>{{Price - Cost }}<span>.00</span></span></li>
                                <li class="d-flex justify-content-between align-items-center">
                                    <span class="me-2">Total:</span>
                                    <span class="text-end">
                                        <span>$</span>{{Cost}}<span>.00</span>
                                    </span>
                                </li>
                                <li class="d-flex justify-content-between align-items-center">
                                    <span class="me-2">Shipping:</span>
                                    <span class="text-end">
                                        <span>$</span>{{ShippingCost}}<span>.00</span>
                                    </span>
                                </li>
                            </ul>
                            <div class=" d-flex flex-column flex-fill p-2" style="min-width:50%">
                                <label class="text-center">Payment method :  <span v-if="payment_method">{{payment_method.method}}</span> </label>
                                <label class="text-center">You Pay : </label>
                                <h3 class="fw-normal text-center my-4"><span>$</span>{{Total}}<span>.00</span></h3>
                            </div>
                        </div>
                    </div>
                </aside>
                <div class="w-100 ps-2" v-if="selected_step == 'review'">
                    <a class="btn btn-primary d-block w-100" href="#" @click.prevent="place_order">
                        <span class="d-inline">Place your order and Pay</span>
                        <i class="ci-send mt-sm-0 ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    </main>`
                }