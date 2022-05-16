<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            submited: "",
            editing_item : {
                Method: false,
                TransactionID: false,
                Amount: false,
                Note: "",
            }
        };
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations"]),
        ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        value(newValue, oldValue) {
            this.error = false
            this.message = ""
            if (newValue) {
                this.editing_item = {
                    Amount: 0,
                    Method: "",
                    TransactionID: "",
                    Note: "",
                }
                this.addfunds_modal.show()
            } else {
                this.addfunds_modal.hide()
            }
        }
    },
    methods: {
        submit() {
            if (this.user && this.user.ID && this.editing_item.Method && this.editing_item.TransactionID) {
                if (this.loading) {
                    return
                }
                this.loading = true;
                var data = {}
                data.item = this.editing_item
                return this.$store.dispatch('call', {
                    api: "addfunds",
                    data: data,
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        this.$emit('added', data)
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
            }
        },
    },
    mounted: function () {
        this.addfunds_modal = new bootstrap.Modal(this.$refs.addfundsmodal)
        this.$refs.addfundsmodal.addEventListener('hidden.bs.modal',
            (event) => {
                this.$emit('input', false)
            }
        )
    },
}    
</script>
<template>
<form class="needs-validation modal fade" method="post" ref="addfundsmodal" tabindex="-1" novalidate="" @submit.prevent="submit">
        <div class="modal-dialog modal-lg">
            <divloading :loading="loading" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Submit new transaction to add funds</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                    <p class="text-muted fs-sm">
                        We normally update transaction status within 1 business days.
                    </p>
                    <div class="row gx-4 gy-3">
                        <div class="col-12">
                            <label class="form-label" for="wallet-amount">Amount</label>
                            <input class="form-control" type="number" id="wallet-amount" min="1" required v-model="editing_item.Amount">
                            <div class="invalid-feedback">
                                Please fill in the amount line!
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="wallet-payment_method">Payment Method</label>
                            <select class="form-select" aria-label="Payment Method" id="wallet-payment_method" required="" v-model="editing_item.Method">
                                <option selected value="">None</option>
                                <option value="Coupon ">Coupon</option>
                                <option value="Checks">Checks</option>
                                <option value="Debit card">Debit card</option>
                                <option value="Credit card">Credit card</option>
                                <option value="Electronic bank transfers">Electronic bank transfers</option>
                            </select>
                            <div class="invalid-feedback">
                                Please select the payment method !
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="wallet-transactionid">Transaction ID</label>
                            <input class="form-control" type="text" id="wallet-transactionid" required="" v-model="editing_item.TransactionID">
                            <div class="invalid-feedback">
                                Please fill in the transactionid line!
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="wallet-note">Note</label>
                            <textarea class="form-control" type="text" id="wallet-note" v-model="editing_item.Note"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary" type="submit">Submit to wallet</button>
                </div>
            </divloading>
        </div>
    </form>        
</template>