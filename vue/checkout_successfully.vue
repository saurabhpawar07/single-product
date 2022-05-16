<script>
export default {
        props: {
            order_id: {
                required: true
            },
        },
        mounted: function () {
            this.$store.dispatch('load_cart')
        },
}    
</script>
<template>
<div class="container pb-5 mb-sm-4">
        <div class="pt-5">
          <div class="card py-3 mt-sm-3">
            <div class="card-body text-center">
              <h2 class="h4 pb-3">Thank you for your order!</h2>
              <p class="fs-sm mb-2">Your order has been placed and will be processed as soon as possible.</p>
              <p class="fs-sm mb-2">Make sure you make note of your order number, which is <span class="fw-medium">{{order_id}}.</span></p>
              <p class="fs-sm">You will be receiving an email shortly with confirmation of your order. You can now:</p>
              <router-link class="btn btn-secondary mt-3 me-3" to="/shop" >Go back shopping</router-link>
              <router-link class="btn btn-primary mt-3" :to="'/user/orders/'+order_id" ><i class="ci-location"></i>&nbsp;Track order</router-link>
            </div>
          </div>
        </div>
      </div>        
</template>