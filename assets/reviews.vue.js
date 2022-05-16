export default {
    components: {
        'write_review': () => import("./write_review.vue.js"),
        'review': () => import("./review.vue.js"),
    },  
    props: {
        value: {
            default: function () {
                return {
                    ID : 0,
                    AccountID: 0,
                    Name: "Product Name",
                }
            }
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",

            reviews : [1,2,3,4,5,6],
            records: {},
            recordsTotal: 0,
            recordsFiltered: 0,
            currentPage: 1,
            perPage: 12,
            desc: true,
            sort_by: "Newest",
            product_id : 0,
            account_id : 0,
            name : "",
            Reviews : 72,
            OneStar : 3,
            TwoStar : 5,
            ThreeStar : 40,
            FourStar : 14,
            FiveStar : 14,
            average : 0,
            positive : 0,
            percentage : 0,
        };
    },
    computed: {
        ...Vuex.mapState(['user']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        value(newValue, oldValue) {
            this.init()
        }, 
        product_id(newValue, oldValue) {
            this.currentPage = 1
            this.load(this.currentPage)
        },
        account_id(newValue, oldValue) {
            this.currentPage = 1
            this.load(this.currentPage)
        },
    },
    methods: {
        init(){
            if(this.value.account_id){
                this.product_id = this.value.id
                this.account_id = this.value.account_id
                this.name = this.value.name
                this.Reviews = this.value.reviews
                this.OneStar = this.value.one_star
                this.TwoStar = this.value.two_star
                this.ThreeStar = this.value.three_star
                this.FourStar = this.value.four_star
                this.FiveStar = this.value.five_star
            }else{
                this.product_id = 0
                this.account_id = this.value.ID
                this.name = this.value.Title
                this.Reviews = this.value.Reviews
                this.OneStar = this.value.OneStar
                this.TwoStar = this.value.TwoStar
                this.ThreeStar = this.value.ThreeStar
                this.FourStar = this.value.FourStar
                this.FiveStar = this.value.FiveStar
            }
            if (this.Reviews) {
                this.average = Math.ceil(((5 * parseInt(this.FiveStar) +  4 * parseInt(this.FourStar) + 3 * parseInt(this.ThreeStar) +  2 * parseInt(this.TwoStar) +  1 * parseInt(this.OneStar))/ parseInt(this.Reviews))* 10)/ 10
            } else {
                this.average = 0
            }
            this.positive = parseInt(this.FiveStar) + parseInt(this.FourStar) + parseInt(this.ThreeStar)
            if (this.value && this.Reviews && this.positive) {
                this.percentage = Math.ceil(parseInt(this.positive) * 100 / parseInt(this.Reviews))
            } else {
                this.percentage = 0
            }
        },
        getWidth(Rating){
            if(this.value && this.Reviews){
                return (Math.ceil(parseInt(Rating) * 100 / parseInt(this.Reviews))) + "%"
            }
        },
        load: _.debounce(function (page_number) {
            var data = {}
            if(!this.account_id && !this.product_id){
                this.message = "atlist Account or Product must be set to submit review"
                this.error = true
                return
            }else{
                data.fix_condition = {}
                data.fix_condition.account_id = parseInt(this.account_id)
                data.fix_condition.product_id = parseInt(this.product_id)
            }
            data.sort = this.sort_by
            data.limit = this.perPage
            data.page = page_number - 1
            
            this.loading = true
            this.$store.dispatch('call', {
                api: "reviews",
                data: data
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.reviews = this.reviews.concat(data.data);
                    this.records[page_number] = data.data
                    this.recordsTotal = data.recordsTotal
                    this.recordsFiltered = data.recordsFiltered
                } else {
                    this.error = true
                }
            }).catch((error) => {
                console.error('Error:', error);
                this.error = true
                this.message = error
            }).finally(() => {
                this.loading = false
            })
        }, 200),
    },
    mounted: function () {
        this.init()
    },
    template: `<div class="border-top border-bottom my-lg-3 py-5">
        <div class="container pt-md-2" id="reviews">
            <div class="row pb-3">
                <div class="col-lg-4 col-md-5">
                    <h2 class="h3 mb-4">{{Reviews}} Reviews</h2>
                    <div class="star-rating me-2">
                        <i class="me-1" :class="average > 0?'ci-star-filled fs-sm text-accent':'ci-star fs-sm text-muted'"></i>
                        <i class="me-1" :class="average > 1?'ci-star-filled fs-sm text-accent':'ci-star fs-sm text-muted'"></i>
                        <i class="me-1" :class="average > 2?'ci-star-filled fs-sm text-accent':'ci-star fs-sm text-muted'"></i>
                        <i class="me-1" :class="average > 3?'ci-star-filled fs-sm text-accent':'ci-star fs-sm text-muted'"></i>
                        <i class="me-1" :class="average > 4?'ci-star-filled fs-sm text-accent':'ci-star fs-sm text-muted'"></i>
                    </div>
                    <span class="d-inline-block align-middle">{{average}} Overall rating</span>
                    <p class="pt-3 fs-sm text-muted">
                        {{positive}} out of {{Reviews}} ({{percentage}}<span>%</span>)<br>
                        Customers recommended 
                        <span v-if="product_id">this product</span>
                        <span v-else>products from this seller</span>
                        
                    </p>
                </div>
                <div class="col-lg-8 col-md-7">
                    <div class="d-flex align-items-center mb-2">
                        <div class="text-nowrap me-3">
                            <span class="d-inline-block align-middle text-muted">5</span><i class="ci-star-filled fs-xs ms-1"></i>
                        </div>
                        <div class="w-100">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-success" role="progressbar" v-bind:style="{ width: getWidth(FiveStar) }" :aria-valuenow="getWidth(FiveStar)" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <span class="text-muted ms-3">{{FiveStar}}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="text-nowrap me-3">
                            <span class="d-inline-block align-middle text-muted">4</span><i class="ci-star-filled fs-xs ms-1"></i>
                        </div>
                        <div class="w-100">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar" role="progressbar" style="background-color: #a7e453;" v-bind:style="{ width: getWidth(FourStar) }"  :aria-valuenow="getWidth(FiveStar)" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <span class="text-muted ms-3">{{FourStar}}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="text-nowrap me-3">
                            <span class="d-inline-block align-middle text-muted">3</span><i class="ci-star-filled fs-xs ms-1"></i>
                        </div>
                        <div class="w-100">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar" role="progressbar" style="background-color: #ffda75;" v-bind:style="{ width: getWidth(ThreeStar) }"  :aria-valuenow="getWidth(FiveStar)" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <span class="text-muted ms-3">{{ThreeStar}}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="text-nowrap me-3">
                            <span class="d-inline-block align-middle text-muted">2</span><i class="ci-star-filled fs-xs ms-1"></i>
                        </div>
                        <div class="w-100">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar" role="progressbar" style="background-color: #fea569;" v-bind:style="{ width: getWidth(TwoStar) }"  :aria-valuenow="getWidth(FiveStar)" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <span class="text-muted ms-3">{{TwoStar}}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <div class="text-nowrap me-3">
                            <span class="d-inline-block align-middle text-muted">1</span><i class="ci-star-filled fs-xs ms-1"></i>
                        </div>
                        <div class="w-100">
                            <div class="progress" style="height: 4px;">
                                <div class="progress-bar bg-danger" role="progressbar" v-bind:style="{ width: getWidth(OneStar) }"  :aria-valuenow="getWidth(FiveStar)" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <span class="text-muted ms-3">{{OneStar}}</span>
                    </div>
                </div>
            </div>
            <hr class="mt-4 mb-3">
            <div class="row pt-4">
                <!-- Reviews list-->
                <divloading :loading="loading" class="col-md-7">
                    <div v-if="message" class="alert" role="alert"
                        :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
            
                    <div class="d-flex justify-content-end pb-4">
                        <div class="d-flex align-items-center flex-nowrap">
                            <label class="fs-sm text-muted text-nowrap me-2 d-none d-sm-block" for="sort-reviews">Sort by:</label>
                            <select class="form-select form-select-sm" id="sort-reviews" v-model="sort_by">
                                <option selected>Newest</option>
                                <option>Oldest</option>
                                <option>Popular</option>
                                <option>High rating</option>
                                <option>Low rating</option>
                            </select>
                        </div>
                    </div>
                    <!-- Review-->
                    <review v-for="(review, index) in records[currentPage]" :key="'review_'+index" :value="review"></review>
                    <div class="text-center">
                        <button class="btn btn-outline-accent" type="button"><i class="ci-reload me-2"></i>Load more reviews</button>
                    </div>
                </divloading>
                <!-- Leave review form-->
                <write_review class="col-md-5" :product_id="product_id" :account_id="account_id" :name="name"></write_review>
            </div>
        </div>
    </div>`
                }