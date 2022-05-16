export default {
    data() {
        return {
            loading: 0,
            error: false,
            message: "",
            records: {},
            recordsTotal: 0,
            recordsFiltered: 0,
            currentPage: 1,
            perPage: 12,
            sort: "paid_on",
            sortdesc: true,
        };
    },
    computed: {
        ...Vuex.mapState(['user']),
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
        user(newValue, oldValue) {
            if(!newValue || !oldValue || newValue.ID != oldValue.ID){
                this.records = []
                this.recordsTotal = 0
                this.recordsFiltered = 0
                this.currentPage = 1
                if(newValue){
                    this.load(this.currentPage)
                }
            }
            if(!newValue){
                
            }
        },
        sort(newValue, oldValue) {
            this.records = {}
            this.currentPage = 12
            this.load(this.currentPage)
        },
        currentPage(newValue, oldValue) {
            if (this.records[this.currentPage] == undefined) {
                this.records[this.currentPage] = []
            }
            if (this.records[this.currentPage].length == 0) {
                this.load(this.currentPage)
            }
        },
    },
    methods: {
        load(page_number) {
            if(!this.user){
                return
            }
            this.loading = page_number
            this.$store.dispatch('call', {
                api: "orders",
                data: {
                    sort: this.sort,
                    sortdesc: this.sortdesc,
                    limit: this.perPage,
                    page: page_number - 1,
                }
            }).then((data) => {
                this.message = data.Message
                if (data.Status == 2) {
                    this.records[page_number] = data.data
                    this.recordsTotal = data.recordsTotal
                    this.recordsFiltered = data.recordsFiltered
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
        getStatusClass(status) {
            status = status.trim().toLowerCase()
            switch (status) {
            case "delivered":
                return "bg-success";
            case "canceled":
                return "bg-danger";
            case "paid":
                return "bg-warning";
            default:
                return "bg-info";
            }
        },
        showorder(order) {
            this.$router.push({
                name: 'order',
                params: {
                    order_id: order.OrderCode,
                    order: order
                }
            })
        },
        refresh(order){
            this.$store.dispatch('call', {
                api: "refreshorders",
                data: {
                    sort: this.sort,
                    sortdesc: this.sortdesc,
                    limit: this.perPage,
                    page: page_number - 1,
                }
            }).then((data) => {
                this.message = data.Message
                if (data.Status == 2) {
                    this.records[page_number] = data.data
                    this.recordsTotal = data.recordsTotal
                    this.recordsFiltered = data.recordsFiltered
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
        }
    },
    mounted: function () {
        this.load(this.currentPage)
    },
    template: `<section>
        <div v-if="user" class="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5 mb-lg-3">
            <div class="d-flex align-items-center">
                <label class="d-none d-lg-block fs-sm text-light text-nowrap opacity-75 me-2" for="order-sort">Sort orders:</label>
                <label class="d-lg-none fs-sm text-nowrap opacity-75 me-2" for="order-sort">Sort orders:</label>
                <select class="form-select" id="order-sort" v-model="sort">
                    <option value="delivered_on">Delivered</option>
                    <option value="paid_on">In Progress</option>
                    <option value="created_at">Delayed</option>
                    <option value="deleted_at">Canceled</option>
                </select>
            </div>
            <div class="d-flex">
                <a class="btn btn-primary btn-sm d-none d-lg-inline-block" href="#" @click.prevent="logout()"><i class="ci-sign-out me-2"></i>Sign out</a>
            </div>
        </div>
        <div v-else  class="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5 mb-lg-3">
            <label>Please login to see order history</label>
            <button class="btn btn-primary mt-3 mt-sm-0" type="button" @click.prevent="$store.commit('set_showlogin', true )">Sign in</button>
        </div>
        <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
            {{message}}
        </div>
        <!-- Orders list-->
        <div v-if="user" class="table-responsive fs-md mb-4">
            <table class="table table-hover mb-0">
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date Purchased</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in records[currentPage]" :key="'order'+order.ID" >
                        <td class="py-3">
                            <a class="nav-link-style fw-medium fs-sm" href="#order-details" >
                                {{order.OrderCode}}
                            </a>
                        </td>
                        <td class="py-3">{{getFullDateTime(order.CreatedAt)}}</td>
                        <td class="py-3">
                            <span class="badge m-0 text-capitalize" :class="getStatusClass(order.Status)">
                                {{order.Status}}
                            </span>
                        </td>
                        <td class="py-3"><span>$</span>{{order.Total}}<span>.00</span></td>
                        <td class="py-3">
                            <button type="button" class="btn btn-light btn-shadow btn-sm mb-2" @click.prevent="showorder(order)">View Details & Track Order </button>
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
    </section>`
                }