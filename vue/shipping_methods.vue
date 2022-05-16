<script>
export default {
    props: {
        items: {
            required: true,
            type: Array
        },
        shipping_address: {
            required: true,
            type: Object
        },
    },
    computed: {
        ...Vuex.mapState(['user']),
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            submited : false
        }
    },
    methods: {
        setShippingMethod(event ,item, shipping_method){
            debugger
            item.ShippingImage = shipping_method.Image
            item.ShippingMethod = shipping_method.Name
            item.ShippingPrice = shipping_method.Price
            item.EDTMin = shipping_method.EDTMin
            item.EDTMax = shipping_method.EDTMax
            item.ShippingCost = item.ShippingPrice * item.Quantity
            this.$emit('input', {})
            this.submited = !this.submited
        },
        can_ship_to_your_location(item) {
            if (!this.shipping_address) {
                return false
            }
            if (!item.Country) {
                return true
            }
            if (this.shipping_address.Country == item.Country) {

                if (!item.District) {
                    return true
                }
                if (this.shipping_address.District == item.District) {
                    if (!item.Locality) {
                        return true
                    }
                    if (this.shipping_address.Locality == item.Locality) {
                        if (!item.SubLocality) {
                            return true
                        }
                        if (this.shipping_address.SubLocality == item.SubLocality) {
                            return true
                        }
                    }
                }
            }
            return false
        },
    },
    mounted: function () {
    },
}    
</script>
<template>
<div class="accordion" id="shipping_accordion">
        <div class="accordion-item" v-for="(item, index) in items">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button d-flex justify-content-between" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index" aria-expanded="true" :aria-controls="'collapse'+index">
                    <span v-if="item.product" class="me-4">{{item.product.name}}</span>
                    <span v-if="item.ShippingMethod || submited" class="text-muted">
                        {{item.ShippingMethod}}
                        ({{item.EDTMin}} - {{item.EDTMax}} days)
                        <span>$</span>{{item.ShippingPrice}}<span>.00</span>
                    </span>
                </button>
            </h2>
            <div :id="'collapse'+index" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#shipping_accordion">
                <div class="accordion-body">
                    <div class="table-responsive" v-if="item.product">
                        <table class="table table-hover fs-sm border-top">
                            <thead>
                                <tr>
                                    <th class="align-middle"></th>
                                    <th class="align-middle">Shipping method</th>
                                    <th class="align-middle">Delivery time</th>
                                    <th class="align-middle">Handling fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(shipping, shipping_index) in item.product.shipping"
                                    :key="'row'+index+'_'+shipping_index">
                                    <td>
                                        <div v-if="can_ship_to_your_location(shipping)" class="form-check mb-4">
                                            <input class="form-check-input" type="radio" :id="'courier'+index+'_' + shipping_index"
                                            :name="'shipping_method'+index" :checked="item.ShippingMethod == shipping.Name" :value="shipping.Name" @change="setShippingMethod($event, item, shipping)">
                                            <label class="form-check-label" :for="'courier'+index+'_' + shipping_index"></label>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <label class="text-dark fw-medium" :for="'courier'+index+'_' + shipping_index">{{shipping.Name}}</label><br>
                                        <span class="text-muted">
                                            All addresses
                                            <span v-if="shipping.SubLocality">{{shipping.SubLocality}}, </span>
                                            <span v-if="shipping.Locality">{{shipping.Locality}}, </span>
                                            <span v-if="shipping.District">{{shipping.District}}, </span>
                                            <span v-if="shipping.Country">in {{shipping.Country}}, </span>
                                        </span>
                                        <div v-if="!can_ship_to_your_location(shipping)" class="alert alert-danger" role="alert">
                                            Item can not be dispatched to current address, You can try with different address
                                        </div>
                                    </td>
                                    <td class="align-middle">{{shipping.EDTMin}} - {{shipping.EDTMax}} days</td>
                                    <td class="align-middle"><span>$</span>{{shipping.Price}}<span>.00</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>        
</template>