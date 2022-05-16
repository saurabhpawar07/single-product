<script>
export default {
        props: {
            product: {
                cost: 50,
                price: 60,
                logo: "",
                name: "Product Name",
                account_name: "Shop Name",
                max_cost: 70,
                max_price: 82,

            },
        },
        data() {
            return {
                loading: false,
                submitted: false,
                error: false,
                message: "",
                description : ""
            }
        },
        watch: {
            product(newValue, oldValue) {
                this.getContent()
            },
            description(newValue, oldValue){
                this.$refs.descriptionholder.innerHTML = newValue
            }
        },
        methods: {
            getContent() {
                if (this.loading || !this.product || !this.product.id) {
                    return
                }
                var data = {}
                data.ProductID = this.product.id
                this.loading = true
                return this.$store.dispatch('call', {
                    api: "description",
                    data: data
                }).then((data) => {
                    this.message = data.Message;
                    if (data.Status == 2) {
                        this.error = false
                        this.description =  data.Result.Content
                    } else {
                        this.error = true
                        this.description = ""
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                    this.error = true
                    this.message = error
                }).finally(() => {
                    this.loading = false
                })
            },
        },
        mounted: function () {
            this.getContent()
        },
}    
</script>
<template>
<div class="container" v-if="(product.summary && product.summary.length > 300) || description"  >
    <h5 class="h6 mb-3 pb-2 border-bottom"><i class="ci-announcement text-muted fs-lg align-middle mt-n1 me-2"></i>Product Details</h5>
    <div v-if="product.summary && product.summary.length > 300">
        <p>
            {{product.summary}}
        </p> 
    </div>
    <div v-if="description">
        <p ref="descriptionholder">
        </p> 
    </div>
</div>        
</template>