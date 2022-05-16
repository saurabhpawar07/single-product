<script>
export default {
    props: {parent},
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            TrackingDetail : "",
        }
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        order(newValue, oldValue) {
            if(this.order || this.order_item){
                this.order_modal.show()
            }else{
                this.order_modal.hide()
            }
        },
        order_item(newValue, oldValue) {
            if(this.order || this.order_item){
                this.order_modal.show()
            }else{
                this.order_modal.hide()
            }
        },
    },
    methods: {
        submit() {
            debugger
            var data = {}
            if(this.order){
                data.items = this.order.items
            }else if(this.order_item){
                data.items = [this.order.items]
            }else{
                return
            }
            
            this.loading = true;
            return this.$store.dispatch('call', {
                api: "cancelorderitems",
                data: data,
            }).then((data) => {
                this.message = data.Message
                if (data.Status == 2) {
                    debugger
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
        this.order_modal = new bootstrap.Modal(this.$refs.order)
        this.$refs.order.addEventListener('hidden.bs.modal', (event) => {
            this.$emit('closed')
        })
        if(this.order || this.order_item){
            this.order_modal.show()
        }
    },
}    
</script>
<template>
<div ref="order" class="modal fade" id="order-details" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 v-if="order" class="modal-title">Order No - {{order.OrderCode}}</h5>
                    <h5 v-if="order_item" class="modal-title">Order No - {{order.OrderCode}} , Item - {{order_item.SKU}}</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <divloading class="modal-body pb-0" :loading="loading">
                    <!-- Item-->
                    <div class="d-flex m-4 justify-content-center align-items-center">
                        <p>{{order}}</p>
                        <p>{{order_item}}</p>
                        <h5> Do you realy want to cancel this order</h5>
                        
                        <button class="btn btn-danger" type="button">
                            Cancel Order
                        </button>
                    </div>
                </divloading>
                <!-- Footer-->
            </div>
        </div>
    </div>        
</template>