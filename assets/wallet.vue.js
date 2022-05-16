export default {
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            records: {
                0 : [ 
                    {
                        ID : 0,
                        Note : "",
                    }
                ]
            },
            recordsTotal: 0,
            currentPage: 1,
            perPage: 12,
            editing_item: false,
            deleting_item: false,
            loadData: _.debounce(function (page_number, component) {
                if (component.loading) {
                    return
                }
                component.loading = true;
                var data = {}
                data.sort = "ID"
                data.sortdesc = true
                data.limit = component.perPage
                data.page = page_number - 1
                if (component.editing_item) {
                    data.items = [component.editing_item]
                }
                if (component.deleting_item) {
                    data.todelete = [component.deleting_item.ID]
                }
                return component.$store.dispatch('call', {
                    api: "transactions",
                    data: data,
                }).then((data) => {
                    component.message = data.Message
                    if (data.Status == 2) {
                        component.records[page_number] = data.data
                        component.recordsTotal = data.recordsTotal
                        component.editing_item = false
                        component.deleting_item = false
                    } else {
                        component.error = true
                    }
                    return data
                }).catch((error) => {
                    console.log(error)
                    component.error = true
                    component.message = error
                    component.$emit('done', false)
                }).finally(() => {
                    component.loading = false;
                });
            }, 300),
        };
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations"]),
        ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
        maxPage: function () {
            if (this.recordsFiltered > this.perPage) {
                return Math.ceil(this.recordsFiltered / this.perPage)
            } else {
                return 1
            }
        },
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        editing_item(newValue, oldValue) {
            debugger
            if (newValue) {
                this.addfunds_modal.show()
            } else {
                this.addfunds_modal.hide()
            }
            this.error = false
            this.message = ""
        },
        user(newValue, oldValue) {
            this.records = {}
            this.currentPage = 1
            if (!oldValue && newValue) {
                this.loadData(this.currentPage, this)
            }
        },
    },
    methods: {
        submit() {
            if (this.editing_item.Method && this.editing_item.TransactionID) {
                this.loadData(this.currentPage, this)
            }
        },
        delete_item(item) {
            this.deleting_item = item
            this.loadData(this.currentPage, this)
        },
        addnew(event) {
            this.editing_item = {
                Amount: 0,
                Method: "",
                TransactionID: "",
                Note: "",
            }
        },
        getStatusClass(status) {
            status = status.trim().toLowerCase()
            switch (status) {
            case "successful":
                return "bg-success";
            case "failed":
                return "bg-danger";
            case "pending":
                return "bg-warning";
            case "cancelled":
                return "bg-info";
            default:
                return "bg-info";
            }
        },
    },
    mounted: function () {
        this.addfunds_modal = new bootstrap.Modal(this.$refs.addfunds)
        this.$refs.addfunds.addEventListener('hidden.bs.modal',
            (event) => {
                if (this.editing_item) {
                    this.editing_item = false
                }
            }
        )
        if (this.user) {
            this.loadData(this.currentPage, this)
        }
    },
    template: `<section>
        <!-- Open wallet Modal-->
        <form class="needs-validation modal fade" method="post" ref="addfunds" tabindex="-1" novalidate="" @submit.prevent="submit">
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
        <divloading :loading="loading">
            <!-- Toolbar-->
            <div class="d-flex justify-content-between align-items-center pt-lg-2 pb-2 mb-lg-3">
                <span v-if="user" class="text-light">
                    Funds you have :
                    <h3 class="text-light"><span>$</span>{{user.Wallet?user.Wallet:00}}<span>.00</span></h3>
                </span>
                <h5 v-else class="text-light">
                    Login to access your Wallet
                </h5>
                <div v-if="user" class="d-flex gap-1">
                    <div class="d-flex align-items-center">
                        <label class="d-none d-lg-block fs-sm text-light text-nowrap opacity-75 me-2" for="order-sort">Sort orders:</label>
                        <label class="d-lg-none fs-sm text-nowrap opacity-75 me-2" for="order-sort">Sort orders:</label>
                        <select class="form-select form-select-sm" id="order-sort">
                            <option>All</option>
                            <option>Delivered</option>
                            <option>In Progress</option>
                            <option>Delayed</option>
                            <option>Canceled</option>
                        </select>
                    </div>
                    <button class="btn btn-primary btn-sm d-none d-lg-inline-block" @click.prevent="addnew"><i class="ci-add me-2"></i>Add Funds</button>
                </div>
            </div>
            <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <!-- Orders list-->
            <div v-if="user" class="table-responsive fs-md mb-4">
                <table class="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>For</th>
                            <th>TransactionID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in records[currentPage]">
                            <td class="py-3">
                                {{getFullDate(item.CreatedAt)}}
                            </td>
                            <td class="py-3">
                                {{item.Amount}}
                            </td>
                            <td class="py-3">
                                {{item.Method}}
                            </td>
                            <td class="py-3">
                                {{item.For}}
                            </td>
                            <td class="py-3">
                                {{item.TransactionID}}
                            </td>
                            <td v-if="item.Note" class="py-3">
                                <span class="badge m-0 p-1" :class="getStatusClass(item.Status)" data-bs-toggle="collapse" :data-bs-target="'#collapseExample'+index">
                                    {{item.Status}} 
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill text-warning" viewBox="0 0 16 16" data-bs-toggle="collapse" :data-bs-target="'#collapseExample'+index">
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg> 
                                <div class="collapse" :id="'collapseExample'+index" :class="getStatusClass(item.Status).replace('bg', 'text')">
                                  <div class="card card-body">
                                    {{item.Note}}
                                  </div>
                                </div>
                            </td>
                            <td v-else class="py-3">
                                <span class="badge m-0 p-1" :class="getStatusClass(item.Status)" data-bs-toggle="popover" title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">
                                    {{item.Status}} 
                                </span>
                            </td>
                            <td class="py-3">
                                <button v-if="!item.Accepted" type="button" class="btn btn-danger btn-sm" @click.prevent="delete_item(item)">
                                    <i class="ci-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination-->
            <nav v-if="maxPage > 1" class="d-flex justify-content-between pt-2" aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#" @click.prevent="priviouspage"><i class="ci-arrow-left me-2"></i>Prev</a></li>
                </ul>
                <ul class="pagination">
                    <li class="page-item d-sm-none"><span class="page-link page-link-static">{{currentPage}} / {{maxPage}}</span></li>

                    <li v-if="currentPage != 1" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="currentPage = 1">1</a>
                    </li>
                    <li v-if="currentPage-2 > 1" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="currentPage = currentPage-2">{{currentPage-2}}</a>
                    </li>
                    <li v-if="currentPage-1 > 1" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="priviouspage">{{currentPage-1}}</a>
                    </li>
                    <li class="page-item d-none d-sm-block active ">
                        <a class="page-link" href="#">{{currentPage}}<span class="visually-hidden">(current)</span></a>
                    </li>
                    <li v-if="currentPage + 1 < maxPage" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="currentPage = currentPage + 1">{{currentPage + 1}}</a>
                    </li>
                    <li v-if="currentPage + 2 < maxPage" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="currentPage = currentPage + 2">{{currentPage + 2}}</a>
                    </li>
                    <li v-if="currentPage != maxPage" class="page-item d-none d-sm-block">
                        <a class="page-link" href="#" @click.prevent="currentPage = maxPage">{{maxPage}}</a>
                    </li>
                </ul>
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#" aria-label="Next" @click.prevent="nextpage">Next<i class="ci-arrow-right ms-2"></i></a></li>
                </ul>
            </nav>
        </divloading>
        <div v-if="!user">
            <hr class="mt-2 mb-3">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <button class="btn btn-primary mt-3 mt-sm-0" type="button" @click.prevent="$store.commit('set_showlogin', true )">Sign in</button>
            </div>
        </div>
    </section>`
                }