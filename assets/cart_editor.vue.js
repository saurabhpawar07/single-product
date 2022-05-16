export default {
        props: {
            value: {
                required: true,
                default: function () {
                    return []
                }
            },
        },
        data() {
            return {
                submited: false,
                loading: false,
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
            value(newValue, oldValue) {
                if (newValue.length) {
                    this.load_products()
                }
            },
        },
        methods: {
            load_products() {
                if (this.loading) {
                    return
                }
                if(!Array.isArray(this.value)){
                    alert("no cart array")
                    return
                }
                if(!this.value.length){
                    alert("no value in cart array")
                    return
                }
                var ids = []
                this.value.forEach(element => {
                    ids.push(element.ProductID)
                });
                var data = {
                    fix_condition: {
                        "ids": ids
                    }
                }
                this.loading = true
                return this.$store.dispatch('call', {
                    api: "products",
                    data: data,
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        this.products = data.data
                        this.value.forEach(cart_item => {
                            cart_item.error = ""
                            for (var i = 0; i < data.data.length; i++) {
                                var product = data.data[i]
                                if (cart_item.ProductID == product.id) {
                                    this.set_product(product)
                                    cart_item.product = product
                                    if (cart_item.product.shipping && typeof cart_item.product.shipping == "string") {
                                        try{
                                            cart_item.product.shipping = JSON.parse(cart_item.product.shipping)
                                        }catch(e){
                                            console.log(e)
                                            cart_item.product.shipping = []
                                        }
                                        if (cart_item.product.shipping.length == 1) {
                                            cart_item.shipping_method = cart_item.product.shipping[0]
                                        }
                                    }

                                    for (var i = 0; i < cart_item.product.stocks.length; i++) {
                                        var stock = cart_item.product.stocks[i]
                                        if (cart_item.SKU == stock.SKU) {
                                            cart_item.stock = stock
                                            break
                                        }
                                    }
                                    break
                                }
                            }
                            this.validate_item(cart_item)
                        });
                        this.calculate_total()
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
            validate_item(cart_item){
                cart_item.error = ""
                if (!cart_item.product) {
                    cart_item.error = "This product is no longer available"
                }else if (!cart_item.stock) {
                    cart_item.error = "This product variant is no longer available"
                }else if (!cart_item.stock.Quantity) {
                    cart_item.error = "This product variant is out of stock"
                }else if (!cart_item.Quantity) {
                    cart_item.error = "Please select quantity you wish to buy"
                }else if (cart_item.Quantity > cart_item.stock.Quantity) {
                    cart_item.error = "Only  "+ cart_item.stock.Quantity + " items available for " +
                    cart_item.product.name + " ("+ this.getVariationName(cart_item.stock.variation) + ")"
                }
            },
            addQuantity(item){
                item.Quantity++;
                this.validate_item(item)
                this.calculate_total()
                if(!item.error){
                    this.$store.dispatch('update_cart', item); 
                }
            },
            minusQuantity(item){
                if(item.Quantity == 0){
                    return
                }
                item.Quantity--;
                this.validate_item(item)
                this.calculate_total()
                if(!item.Quantity){
                    this.remove_from_cart(item)
                }else if(!item.error){
                    this.$store.dispatch('update_cart', item); 
                }
            },
            remove_from_cart(item){
                this.$store.dispatch('remove_from_cart', item)
            },
            calculate_total(){
                var total = 0
                    if(this.value){
                        this.value.forEach(element => {
                            element.CostTotal = parseInt(element.Cost) * parseInt(element.Quantity)
                            total += element.CostTotal
                        });  
                    }
                    this.cost_total = total
                    
                    total = 0
                    if(this.value){
                        this.value.forEach(element => {
                            element.PriceTotal = parseInt(element.Price) * parseInt(element.Quantity)
                            total += element.PriceTotal
                        });  
                    }
                    this.price_total = total
                    this.$emit('change', {
                        cost_total : this.cost_total,
                        price_total : this.price_total
                    })
            }
        },
        mounted: function () {
            this.load_products()
        },
    template: `<divloading :loading="loading">
            <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <div v-for="item in value" class="d-sm-flex justify-content-between align-items-center my-2 pb-3 border-bottom">
                <div class="d-block d-sm-flex align-items-center text-center text-sm-start">
                    <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)" class="d-inline-block flex-shrink-0 mx-auto me-sm-4">
                        <img :src="item.Logo" alt="Product" style="height: auto; width: auto; max-width160px; max-height:160px">
                    </router-link>
                    <div class="pt-2">
                        <h3 class="product-title fs-base mb-2">
                            <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)">
                                {{item.Name}}
                            </router-link>
                        </h3>
                        <span class="text-muted text-capitalize me-2">SKU:</span>{{item.SKU}}
                        <div v-for="key in Object.keys(item.Variation)" class="fs-sm">
                            <span class="text-muted text-capitalize me-2">{{key}}:</span>{{item.Variation[key]}}
                        </div>
                        <div class="fs-lg text-accent pt-2">
                            <span>$</span>{{item.Cost}}<small>.00</small>
                            <del v-if="item.Cost != item.Price" class="text-muted fs-lg me-3">
                                <span>$</span>{{item.Price}}<small>.00</small>
                            </del>
                            <span v-if="item.Cost != item.Price" class="badge bg-danger badge-shadow align-middle mt-n2">Sale</span>
                        </div>
                        <div v-if="item.error" class="alert alert-danger d-flex align-items-center p-1 m-1 mb-2" role="alert">
                            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill" /></svg>
                            <div>
                                {{item.error}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start" style="max-width: 10rem;">
                    <label class="form-label" for="quantity1">Quantity</label>
                    <div class="d-flex gap-1">
                        <button type="button" class="btn btn-danger btn-sm" @click.prevent="minusQuantity(item)"> - </button>
                        <span class="form-control form-control-sm">{{item.Quantity}}</span>
                        <button type="button" class="btn btn-primary btn-sm" @click.prevent="addQuantity(item)"> + </button>
                    </div>
                    <button class="btn btn-link px-0 text-danger" type="button" @click.prevent="remove_from_cart(item)">
                        <i class="ci-close-circle me-2"></i><span class="fs-sm">Remove</span>
                    </button>
                </div>
            </div>
        </divloading>
    </template>`
                }