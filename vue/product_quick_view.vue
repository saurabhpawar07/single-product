<script>
export default {
        computed: {
            ...Vuex.mapState(["quick_view_product"]),
        },
        components: {
            'product': () => import("./product.vue.js"),
        },
        data() {
            return {
                quick_view_modal: false,
            }
        },
        watch: {
            quick_view_product(newValue, oldValue) {
                if(newValue && this.quick_view_modal){
                    this.quick_view_modal.show()
                }
            },
        },
        methods: {
            showproduct(product){
                this.$router.push({ name: 'product', params: { product_id: product.id, product_name: encodeURI(product.name), product : product } })
            }
        },
        mounted: function () {
            this.quick_view_modal = new bootstrap.Modal(this.$refs.quickview)
            this.$refs.quickview.addEventListener('hidden.bs.modal', (event) => {
                this.$store.commit('set_quick_view_product', false )
            })
            if(this.quick_view_product){
                this.this.quick_view_modal.show()
            }
        },
}    
</script>
<template>
<div class="modal-quick-view modal fade" ref="quickview" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title product-title">
                            <a v-if="quick_view_product" :href="'/product/'+quick_view_product.id+'/'+encodeURI(quick_view_product.name)" @click.prevent="showproduct(quick_view_product)" 
                               data-bs-toggle="tooltip" data-bs-placement="right" title="Go to product page">
                                {{quick_view_product.name}}
                                <i class="ci-arrow-right fs-lg ms-2"></i>
                            </a>
                            <a v-if="!quick_view_product" href="#" @click.prevent="$store.commit('set_quick_view_product', false )" data-bs-toggle="tooltip" data-bs-placement="right" title="Go to product page">
                                Product not set
                                <i class="ci-arrow-right fs-lg ms-2"></i>
                            </a>
                        </h4>
                        <button ref="close_modal_button" class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <product :product="quick_view_product"/>
                    </div>
                </div>
            </div>
        </div>        
</template>