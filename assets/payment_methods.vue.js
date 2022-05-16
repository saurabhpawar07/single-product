export default {
    components: {
        'addfunds': () => import("./addfunds.vue.js"),
    },
    props: {
        value: {
            required: true
        },
        total: {
            required: true,
            type: Number
        },
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations"]),
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            addfunds: false,
        }
    },
    methods: {
        onadded(data) {
            this.message = data.Message
            this.error = false
            this.addfunds = false
        },
        select_wallet() {
            if (this.user.Wallet < this.total) {
                this.error = true
                this.message = "Your wallet don't have sufficient balance to make this payment , please add funds to your wallet or try anathor method or remove some items from cart."
            } else {
                this.$emit('input', {
                    method: "Wallet",
                    amount: this.total
                })
            }
        },
        refresh_wallet() {
            this.$store.dispatch('call', {
                api: "test", data: {}
            })
        },
    },
    mounted: function () {
        this.select_wallet()
    },
    template: `<div>
        <addfunds v-model="addfunds" @added="onadded"></addfunds>
        <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
            {{message}}
        </div>
        <div class="accordion mb-2" id="payment-method">
            <div class="accordion-item">
                <h3 class="accordion-header">
                    <a class="accordion-button collapsed" href="#points" data-bs-toggle="collapse" aria-expanded="false">
                        <i class="ci-wallet me-2"></i>From My Cubizy Wallet</a></h3>
                <div class="accordion-collapse collapse show" id="points" data-bs-parent="#payment-method" style="">
                    <div class="accordion-body">
                        <p>
                            You currently have<span class="fw-medium"><span>$</span>{{user.Wallet}}<span>.00</span></span>&nbsp; to spend.
                            <a href="#" @click.prevent="refresh_wallet">Refresh Wallet</a>
                        </p>
                        <!--<div class="form-check d-block">-->
                        <!--    <input class="form-check-input" type="checkbox" id="use_points">-->
                        <!--    <label class="form-check-label" for="use_points">Use my Cubizy Wallet to pay for this order.</label>-->
                        <!--</div>-->
                        <div class="d-none d-lg-flex p-1 m-1">
                            <div v-if="user.Wallet < total" class="w-50 pe-3">
                                <a class="btn btn-primary d-block w-100" href="#shipping" @click.prevent="addfunds = true">
                                    <i class="ci-add mt-sm-0 me-1"></i>
                                    <span class="d-inline">Add funds</span>
                                </a>
                            </div>
                            <div v-else-if="!value || value.method != 'Wallet'" class="w-50 ps-2 nav">
                                <a class="btn btn-primary d-block w-100" href="#shipping" @click.prevent="select_wallet">
                                    <i class="ci-send mt-sm-0 me-1"></i>
                                    <span class="d-inline">Use wallet as payment method </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h3 class="accordion-header"><a class="accordion-button collapsed" href="#card" data-bs-toggle="collapse" aria-expanded="false"><i class="ci-card fs-lg me-2 mt-n1 align-middle"></i>Pay with Credit Card</a></h3>
                <div class="accordion-collapse collapse" id="card" data-bs-parent="#payment-method" style="">
                    <div class="accordion-body">
                        <p class="h1">
                            Comming soon.......
                        </p>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h3 class="accordion-header"><a class="accordion-button collapsed" href="#paypal" data-bs-toggle="collapse" aria-expanded="false"><i class="ci-paypal me-2 align-middle"></i>Pay with PayPal</a></h3>
                <div class="accordion-collapse collapse" id="paypal" data-bs-parent="#payment-method" style="">
                    <div class="accordion-body fs-sm">
                        <p class="h1">
                            Comming soon.......
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
                }