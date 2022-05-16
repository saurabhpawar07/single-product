<script>
export default {
    props: {
        order_id: {
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            Order: {
                OrderCode: "Order Number",
                CreatedAt: Math.floor(Date.now() / 1000),
                PaymentMethod: "Wallet",
                AddressLine1: "AddressLine1",
                AddressLine2: "AddressLine2",
                SubLocality: "Sub Locality",
                Locality: "Locality",
                District: "District",
                State: "State",
                Country: "Country",
                Code: "Code",
                Mobile: "Mobile",
                Price: 0,
                Cost: 0,
                ShippingCost: 0,
                Total: 0
            },
            BillingAddress: {
                AddressLine1: "AddressLine1",
                AddressLine2: "AddressLine2",
                SubLocality: "Sub Locality",
                Locality: "Locality",
                District: "District",
                State: "State",
                Country: "Country",
                Code: "Code",
                Mobile: "Mobile",
            },
            Items: [],
            Transactions: [],
            item_to_cancel: false,
            TrackingDetail: "",
        };
    },
    computed: {
        ...Vuex.mapState(['user']),
        ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        user(newValue, oldValue) {
            if (!newValue)
                this.$router.push({
                path: '/user/orders'
            })
        },
        item_to_cancel(newValue, oldValue) {
            if (newValue) {
                this.order_modal.show()
            } else {
                this.order_modal.hide()
            }
        }
    },
    methods: {
        setTrackingDetail(event) {
            this.TrackingDetail = event.target.innerText
        },
        cancel_order() {
            if (!this.TrackingDetail) {
                return
            }
            var data = {
                item_to_cancel: this.item_to_cancel,
                product_to_cancel: this.product_to_cancel,
                TrackingDetail : this.TrackingDetail
            }
            this.load(data)
        },
        set_item_to_cancel(item) {
            if (!item) {
                this.product_to_cancel = false
                this.item_to_cancel = false
            } else {
                if (item != "All") {
                    this.product_to_cancel = item.ProductID
                    this.item_to_cancel = item.SKU
                } else {
                    this.item_to_cancel = item
                }
            }
        },
        load(data) {
            if (!this.order_id) {
                return
            }
            if (!data) {
                data = {}
            }
            data.order = {
                OrderCode: this.order_id
            }
            this.loading = true
            return this.$store.dispatch('call', {
                api: "order",
                data: data,
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    this.set_item_to_cancel(false)
                    // set all data at here
                    this.Order = data.Result.order
                    this.BillingAddress = JSON.parse(this.Order.BillingAddress)
                    if (data.Result.transactions) {
                        this.Transactions = data.Result.transactions
                    } else {
                        this.Transactions = []
                    }

                    if (data.Result.items) {
                        this.Items = data.Result.items
                        this.Items.forEach(element => {
                            debugger
                            if (typeof element.ShippingDetails == "string" && element.ShippingDetails.length) {
                                try {
                                    var ShippingDetailsObject = {}
                                    var ShippingDetails = JSON.parse(element.ShippingDetails)
                                    element.ShippingDetails = {}
                                    ShippingDetails.forEach(item => {
                                        if (!element.ShippingDetails[this.getFullDate(item.CreatedAt)]) {
                                            element.ShippingDetails[this.getFullDate(item.CreatedAt)] = []
                                        }
                                        element.ShippingDetails[this.getFullDate(item.CreatedAt)].push(
                                            {
                                                time: this.getTime(item.CreatedAt),
                                                note: item.Note
                                            }
                                        )
                                    });
                                } catch (error) {
                                    element.ShippingDetails = {}
                                    console.log(error)
                                }
                            }
                        })
                    } else {
                        this.Items = []
                    }
                } else {
                    this.error = true
                }
                return data
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
        if (this.$route.params.order) {
            this.Order = this.$route.params.order
            this.BillingAddress = JSON.parse(this.Order.BillingAddress)
        }
        if (this.order_id && this.user) {
            this.load()
        } else {
            this.$router.push({
                path: '/user/orders'
            })
        }
        this.order_modal = new bootstrap.Modal(this.$refs.order)
        this.$refs.order.addEventListener('hidden.bs.modal', (event) => {
            this.set_item_to_cancel(false)
        })
    },
}    
</script>
<template>
<section>
        <div ref="order" class="modal fade" id="order-details" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-if="Order" class="modal-title">
                            Order No - {{Order.OrderCode}}
                            <span v-if="item_to_cancel != 'All'">, Item - {{item_to_cancel}}</span>
                        </h5>
                        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <divloading class="modal-body pb-0" :loading="loading">
                        <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                            {{message}}
                        </div>
                        <form class="d-flex flex-column m-4 justify-content-center m-auto needs-validation" novalidate @submit.prevent="cancel_order()">
                            <p>
                                If an items of order are not under processing or under shipping order will get canceled and refund will get processed immediately.
                            </p>
                            <p>
                                In case an order or items of order are under process or under shipping we can not cancel it but will request the seller to cancel it. Sellers may deduct the amount of shipping or may refuse to cancel order.
                            </p>
                            <p>
                                In case you don't want this order anymore you can refuse to accept the delivery.
                            </p>

                            <h5> Why do you want to cancel this order <span v-if="item_to_cancel != 'All'"> item</span></h5>
                            <label @click.prevent="setTrackingDetail" class="border border-danger rounded m-1 p-1 px-2"> Ordered by mistake </label>
                            <label @click.prevent="setTrackingDetail" class="border border-danger rounded m-1 p-1 px-2"> Order is too much delayed </label>
                            <label @click.prevent="setTrackingDetail" class="border border-danger rounded m-1 p-1 px-2"> Ordered wrong item</label>
                            <label @click.prevent="setTrackingDetail" class="border border-danger rounded m-1 p-1 px-2"> Item found cheaper some where else </label>
                            <input class="form-control" type="text" placeholder="More details" aria-label="default input example" v-model="TrackingDetail" required="">
                            <div class="invalid-feedback">
                                Please enter reason of cancaling the order or order item.
                            </div>
                            <button class="btn btn-danger m-auto my-2" type="submit">
                                Cancel Order
                            </button>
                        </form>
                    </divloading>
                    <!-- Footer-->
                </div>
            </div>
        </div>
        <!-- Toolbar-->
        <div class="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5 mb-lg-3">
            <div class="d-flex flex-column">
                <div class="d-flex align-items-center">
                    <label class="d-none d-lg-block text-light fs-sm text-nowrap opacity-75 me-2" for="ticket-sort">Order# {{Order.OrderCode}}</label>
                    <label class="d-lg-none fs-sm text-nowrap opacity-75 me-2" for="ticket-sort">Order# {{Order.OrderCode}}</label>
                </div>
                <div class="d-flex align-items-center">
                    <label class="d-none d-lg-block text-light fs-sm text-nowrap opacity-75 me-2" for="ticket-sort">Ordered on {{getFullDateTime(Order.CreatedAt)}}</label>
                    <label class="d-lg-none fs-sm text-nowrap opacity-75 me-2" for="ticket-sort">Ordered on {{getFullDateTime(Order.CreatedAt)}}</label>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-primary me-1" type="button" data-bs-toggle="collapse" data-bs-target="#orderDetails" aria-expanded="false" aria-controls="orderDetails">
                    Show Details
                </button>
                <button class="btn btn-danger" type="button" @click.prevent="set_item_to_cancel('All')">
                    Cancel Order
                </button>
            </div>
        </div>
        <divloading :loading="loading">
            <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <!-- Order Details-->
            <div class="collapse" id="orderDetails">
                <div class="card m-1">
                    <div class="card-body">
                        <div class="row">
                            <!-- Shipping Address-->
                            <div class="col col-lg-4">
                                <h5 class="card-title">Shipping Address</h5>
                                <div class="d-flex flex-column p-2 m-1">
                                    <span> {{Order.AddressLine1}} </span>
                                    <span v-if="Order.AddressLine2"> {{Order.AddressLine2}} </span>
                                    <span> {{Order.SubLocality}} {{Order.Locality}} </span>
                                    <span> {{Order.District}} {{Order.State}} {{Order.Country}} </span>
                                    <span> {{Order.Code}} </span>
                                    <span v-if="Order.Mobile"> Mobile: {{Order.Mobile}}</span>
                                </div>
                            </div>
                            <!-- Billing Address-->
                            <div class="col col-lg-4">
                                <h5 class="card-title">Billing Address</h5>
                                <div class="d-flex flex-column p-2 m-1">
                                    <span> {{BillingAddress.AddressLine1}} </span>
                                    <span v-if="BillingAddress.AddressLine2"> {{BillingAddress.AddressLine2}} </span>
                                    <span> {{BillingAddress.SubLocality}} {{BillingAddress.Locality}} </span>
                                    <span> {{BillingAddress.District}} {{BillingAddress.State}} {{BillingAddress.Country}} </span>
                                    <span> {{BillingAddress.Code}} </span>
                                    <span v-if="BillingAddress.Mobile"> Mobile: {{BillingAddress.Mobile}}</span>
                                </div>
                            </div>
                            <!-- Order Totals-->
                            <div class="col col-lg-4">
                                <h5 class="card-title">Order Summary</h5>
                                <ul class="list-unstyled fs-sm flex-fill">
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span class="me-2">Subtotal:</span>
                                        <span class="text-end">
                                            <span>$</span>{{Order.Price}}<span>.00</span>
                                        </span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span class="me-2">Discount:</span>
                                        <span class="text-end">
                                            <span>$</span>{{Order.Price - Order.Cost }}<span>.00</span>
                                        </span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span class="me-2">Total:</span>
                                        <span class="text-end">
                                            <span>$</span>{{Order.Cost}}<span>.00</span>
                                        </span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span class="me-2">Shipping:</span>
                                        <span class="text-end">
                                            <span>$</span>{{Order.ShippingCost}}<span>.00</span>
                                        </span>
                                    </li>
                                    <li class="d-flex justify-content-between align-items-center">
                                        <span class="me-2 card-title">Grand Total:</span>
                                        <span class="text-end">
                                            <span>$</span>{{Order.Total}}<span>.00</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Order Payment Details-->
                <div class="card m-1">
                    <div class="card-body">
                        <h5 class="card-title">Payment Details</h5>
                        <div class="row" v-for="transaction in Transactions">
                            <div class="col col-auto">
                                <strong>For</strong><br />
                                <p>
                                    {{transaction.For}}
                                </p>
                            </div>
                            <div class="col" :title="transaction.TransactionID">
                                <strong>Method</strong><br />
                                <p>
                                    {{transaction.Method}}
                                </p>
                            </div>
                            <div class="col">
                                <strong>Amount</strong><br />
                                <span>$</span>{{transaction.Amount}}<span>.00</span>
                            </div>
                            <div class="col">
                                <strong>Time</strong><br />
                                <p>
                                    {{getFullDateTime(transaction.UpdatedAt)}}
                                </p>
                            </div>
                            <div class="col">
                                <strong>Status</strong><br />
                                <p>
                                    {{transaction.Status}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Order Items-->
            <div class="card m-1">
                <div class="card-header">
                    {{Items.length}} Shipments
                </div>
                <div class="card-body">
                    <div class="row text-center text-sm-start border-bottom pb-1" v-for="item in Items">
                        <router-link :to="'/product/'+item.ProductID+'/'+encodeURI(item.Name)" class="col col-auto pe-sm-4">
                            <img :src="item.Logo" alt="Product" style="height: auto; width: auto; max-width160px; max-height:160px">
                        </router-link>
                        <div class="col pt-2">
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

                            <div class="fs-sm">
                                <span class="text-muted text-capitalize me-2">Quantity:</span>{{item.Quantity}}
                            </div>
                            <div class="fs-sm">
                                <span class="text-muted text-capitalize me-2">Status:</span>{{item.Status}}
                            </div>
                            <div v-if="item.TrackingID" class="fs-sm">
                                <span class="text-muted text-capitalize me-2">ShippingMethod:</span>{{item.ShippingMethod}}
                            </div>
                            <div v-if="item.TrackingID" class="fs-sm">
                                <span class="text-muted text-capitalize me-2">Tracking ID:</span>{{item.TrackingID}}
                            </div>
                            <div v-if="item.RequestedToCalcel>0" class="fs-sm">
                                <span class="m-1 p-1 border border-danger rounded text-danger" >Requested seller to cancel order on {{getFullDateTime(item.RequestedToCalcel)}}</span>
                            </div>
                        </div>
                        <div class="col col-auto d-flex flex-column">
                            <button class="btn btn-sm btn-primary m-1" data-bs-toggle="collapse" :data-bs-target="'#TrackDetails'+item.SKU" aria-expanded="false" :aria-controls="'TrackDetails'+item.SKU">Track package</button>
                            <button class="btn btn-sm btn-secondary m-1">Leave seller feedback</button>
                            <button class="btn btn-sm btn-secondary m-1">Leave delivery feedback</button>
                            <button class="btn btn-sm btn-secondary m-1">Write a product review</button>
                            <button class="btn btn-sm btn-secondary m-1" @click.prevent="set_item_to_cancel(item)">Cancel item</button>
                        </div>
                        <div :id="'TrackDetails'+item.SKU" class="collapse col-12">
                            <ul class="list-group border rounded" style="overflow-y: scroll; max-height: 379px;">
                                <template v-for="key in Object.keys(item.ShippingDetails)">
                                    <li class="list-group-item">
                                        <strong>{{key}}</strong>
                                    </li>
                                    <li class="list-group-item border-bottom-0" v-for="tracking_item in item.ShippingDetails[key]">
                                        <label class="ms-3">{{tracking_item.time}} :</label> {{tracking_item.note}}
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </divloading>
    </section>        
</template>