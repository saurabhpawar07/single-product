Vue.mixin({
    methods: {
        logout() {
            if (!this.user) {
                return
            }
            this.$store.dispatch('call', {
                api: "logout", data: {}
            })
        },
        showproduct(product){
            this.$router.push({ name: 'product', params: { product_id: product.id, product_name: encodeURI(product.name), product : product } })
        },
        getVariationName(variation){
            var name = ""
            if(variation){
                var keys = Object.keys(variation)
                for (let i = 0; i < keys.length; i++) {
                    var key = keys[i]
                    name += " " + variation[key]
                }    
            }
            return name
        },
        set_product(product) {
            try {
                if (product) {
                    if (!product.variations) {
                        product.variations = []
                        try {
                            if (product.variation.trim()) {
                                product.variations = JSON.parse(product.variation)
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    if (!product.stocks) {
                        product.stocks = []
                        try {
                            if (product.stock.trim()) {
                                product.stocks = JSON.parse(product.stock)
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    if (!product.shippings) {
                        product.shippings = []
                        try {
                            if (product.shipping.trim()) {
                                console.log(product.name)
                                product.shippings = JSON.parse(product.shipping)
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    if (!product.stock_filter) {
                        product.stock_filter = {}
                        for (let index = 0; index < product.variations.length; index++) {
                            const variation = product.variations[index];
                            product.stock_filter[variation.Name] = false
                        }
                    }
                }
            } catch (error) {
                console.log(product)
                console.log(error)
            }
        },
        selectStock(product) {
            product.stock_error = ""
            var flag
            
            if (product.image_by && product.stock_filter && product.stock_filter[product.image_by]) {
                product.image_by_vareation = product.stock_filter[product.image_by]
                if (this.$refs.product_gallery) {
                  this.$refs.product_gallery.set_product_gallery()
                }
            }
            var selected_stocks = product.stocks.filter(item => {
                for (let index = 0; index < product.variations.length; index++) {
                    const variation = product.variations[index];
                    if (!product.stock_filter[variation.Name] && !flag) {
                        flag = variation.Name
                    }
                    if (item.Variation[variation.Name] != product.stock_filter[variation.Name]) {
                        return false
                    }
                }
                return true
            });
            if (selected_stocks.length) {
                product.selected_stock = selected_stocks[0]
                if (!product.selected_stock.Quantity) {
                    product.stock_error = "Selected variant is out of stock"
                }
            } else {
                product.selected_stock = false
                if (flag) {
                    product.stock_error = "Please select "+flag+" options"
                } else {
                    product.stock_error = "Selected variant is not available"
                }
            }
        },
        add_to_cart(e, quick_view) {
            if (!this.product) {
                return
            }
            if (!this.product.selected_stock) {
                this.selectStock(this.product)
            }
            if(this.product.stock_error){
                if(quick_view){
                    this.$store.commit('set_quick_view_product', this.product )
                }
            }else{
                this.$store.dispatch('add_to_cart', {
                    product: this.product,
                    quantity: this.quantity
                })
            }
        },
    },
})