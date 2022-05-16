<script>
export default {
        props: ["category_name",
            "subcategory_name"],
        components: {
            'filters': () => import("./filters.vue.js"),
            'product_card_vertical': () => import("./product_card_vertical.vue.js"),
            'product_card_horizontal': () => import("./product_card_horizontal.vue.js"),
        },
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
                product_card_vertical: true,
                search: "",
                searched: "",
                desc: true,
                sort_by: "id",
                account: window.application.Account,
                conditions: {
                    category: false,
                    subcategory: false,
                    childcategory: false,
                    min_cost: 0,
                    max_cost: 0,
                },
                WideAdvertisingBanner : "",
                loadData: _.debounce(function (page_number, component) {
                    if (!component.conditions || !component.conditions.filtered) {
                        component.loading = false;
                        return
                    }
                    component.loading = true;
                    var data = {}
                    data.sort = component.sort_by
                    if (data.sort == "namez") {
                        data.sort = "name"
                    }
                    data.sortdesc = component.desc
                    data.search = component.search.trim().replace(": ", '":"')
                    data.limit = component.perPage
                    data.page = page_number - 1
                    data.fix_condition = {}
                    if (component.conditions.category && component.conditions.category.ID) {
                        data.fix_condition.category_id = component.conditions.category.ID
                    }
                    if (component.conditions.subcategory && component.conditions.subcategory.ID) {
                        data.fix_condition.subcategory_id = component.conditions.subcategory.ID
                    }
                    if (component.conditions.childcategory && component.conditions.childcategory.ID) {
                        data.fix_condition.childcategory_id = component.conditions.childcategory.ID
                    }
                    if (component.conditions.min_cost) {
                        data.fix_condition.min_cost = component.conditions.min_cost
                    }
                    if (component.conditions.max_cost && component.conditions.max_cost < this.account.MaxPrice) {
                        data.fix_condition.max_cost = component.conditions.max_cost
                    }
                    if (component.conditions.attributes) {
                        data.fix_condition.attributes = component.conditions.attributes
                    }
                    if (component.conditions.attributes) {
                        data.fix_condition.attributes = component.conditions.attributes
                    }
                    if (component.conditions.selectedlocation ) {
                        data.fix_condition.selectedlocation  = component.conditions.selectedlocation 
                    }
                    if (component.conditions.product_rating  ) {
                        data.fix_condition.product_rating   = component.conditions.product_rating  
                    }
                    return component.$store.dispatch('call', {
                        api: "products",
                        data: data,
                    }).then((data) => {
                        component.message = data.Message
                        if (data.Status == 2) {
                            for (var prop in data.data) {
                                component.set_product(data.data[prop])
                            }
                            component.records[page_number] = data.data
                            component.recordsTotal = data.recordsTotal
                            component.recordsFiltered = data.recordsFiltered
                            component.searched = component.search.trim()
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
                }, 500),
            };
        },
        computed: {
            ...Vuex.mapState(['user', "device_type"]),
            maxPage: function () {
                if (this.recordsFiltered > this.perPage) {
                    return Math.ceil(this.recordsFiltered / this.perPage)
                } else {
                    return 1
                }
            },
            title: function() {
                var title = "Shop"
                if (this.conditions.childcategory) {
                    title += " "+ this.conditions.childcategory.Name

                }
                if (this.conditions.subcategory) {
                    if (!title.includes(this.conditions.subcategory.Name)) {
                        title += " "+ this.conditions.subcategory.Name
                    }
                }
                if (this.conditions.category) {
                    if (!title.includes(this.conditions.category.Name)) {
                        title += " "+ this.conditions.category.Name
                    }
                }
                return title
            }
        },
        watch: {
            loading(newValue, oldValue) {
                if (newValue) {

                    this.error = false
                    this.message = ""
                }
            },
            currentPage(newValue, oldValue) {
                if (this.records[newValue] == undefined) {
                    this.records[newValue] = []
                }
                if (this.records[newValue].length == 0) {
                    this.loading = true
                    this.loadData(newValue, this)
                }
            },
            conditions(newValue, oldValue) {
                this.records = {}
                this.records[1] = []
                if (this.currentPage == 1) {
                    this.loading = true
                    this.loadData(this.currentPage, this)
                } else {
                    this.currentPage = 1
                }
            },
            sort_by(newValue, oldValue) {
                switch (newValue) {
                case "cost":
                case "name":
                    this.desc = false
                    break;
                default:
                    this.desc = true
                    break;
                }
                this.records = {}
                this.records[1] = []
                if (this.currentPage == 1) {
                    this.loading = true
                    this.loadData(this.currentPage, this)
                } else {
                    this.currentPage = 1
                }
            }
        },
        methods: {
            priviouspage() {
                if (this.currentPage > 1) {
                    this.currentPage--
                }
            },
            nextpage() {
                if (this.currentPage < this.maxPage) {
                    this.currentPage++
                }
            },
        },
        mounted: function () {

            if (window.application.ThemeSettings.WideAdvertisingBanner) {
                this.WideAdvertisingBanner = window.application.ThemeSettings.WideAdvertisingBanner.value
            }
            this.loading = true
            this.loadData(this.currentPage, this)
        },
}    
</script>
<template>
<main class="page-wrapper">
            <div class="page-title-overlap bg-dark pt-4">
                <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li class="breadcrumb-item">
                                    <router-link class="text-nowrap" to="/">
                                        <i class="ci-home"></i>
                                        Home
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item text-nowrap">
                                    <router-link to="/shop">Shop</router-link>
                                </li>
                                <li v-if="category_name" class="breadcrumb-item text-nowrap" aria-current="page">
                                    <router-link :to="'/shop/'+encodeURI(category_name)">{{category_name}}</router-link>
                                </li>
                                <li v-if="subcategory_name" class="breadcrumb-item text-nowrap" aria-current="page">
                                    <router-link :to="'/shop/'+encodeURI(category_name)+ '/'+encodeURI(subcategory_name)">{{subcategory_name}}</router-link>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                        <h1 class="h3 text-light mb-0">{{title}}</h1>
                    </div>
                </div>
            </div>
            <div class="container pb-5 mb-2 mb-md-4">
                <div class="row">
                    <!-- Sidebar-->
                    <aside class="col-lg-4">
                        <!-- Sidebar-->
                        <filters class="" v-model="conditions"></filters>
                    </aside>
                    <!-- Content  -->
                    <section class="col-lg-8">
                        <!-- Toolbar-->
                        <div class="d-flex justify-content-center justify-content-sm-between align-items-center pt-2 pb-4 pb-sm-5">
                            <div class="d-flex flex-wrap">
                                <div class="d-flex align-items-center flex-nowrap me-3 me-sm-4 pb-3">
                                    <label class="text-light opacity-75 text-nowrap fs-sm me-2 d-none d-sm-block" for="sorting">Sort by:</label>
                                    <select class="form-select" id="sorting" v-model="sort_by">
                                        <option value="id">Latest</option>
                                        <option value="sold">Popularity</option>
                                        <option value="cost">Low - Hight Price</option>
                                        <option value="max_cost">High - Low Price</option>
                                        <option value="avg_rating">Average Rating</option>
                                        <option value="name">A - Z Order</option>
                                        <option value="namez">Z - A Order</option>
                                    </select><span class="fs-sm text-light opacity-75 text-nowrap ms-2 d-none d-md-block">showing {{records[currentPage]?records[currentPage].length: 0}} of {{recordsFiltered}} products in current category</span>
                                </div>
                            </div>
                            <div class="d-flex pb-3">
                                <a class="nav-link-style nav-link-light me-3" href="#" @click.prevent="priviouspage">
                                    <i class="ci-arrow-left"></i>
                                </a>
                                <span class="fs-md text-light">{{currentPage}} / {{maxPage}}</span>
                                <a class="nav-link-style nav-link-light ms-3" href="#" @click.prevent="nextpage">
                                    <i class="ci-arrow-right"></i>
                                </a>
                            </div>
                            <div class="d-none d-sm-flex pb-3">
                                <a class="btn btn-icon nav-link-style nav-link-light me-2" :class="{'bg-light text-dark disabled opacity-100 ':product_card_vertical}" href="#" @click.prevent="product_card_vertical= true">
                                    <i class="ci-view-grid"></i>
                                </a>
                                <a class="btn btn-icon nav-link-style nav-link-light" :class="{'bg-light text-dark disabled opacity-100 ':!product_card_vertical}" href="shop-list-ls.html" @click.prevent="product_card_vertical= false">
                                    <i class="ci-view-list"></i>
                                </a>
                            </div>
                        </div>
                        <!-- Products grid-->
                        <div class="row mx-n2">
                            <label v-if="loading">Loading...</label>
                            <label v-else-if="(records[currentPage] && records[currentPage].length == 0) || !records[currentPage] ">No Products for current filters conditions</label>
                            <!-- Product-->
                            <div v-if="product_card_vertical" v-for="product in records[currentPage]" :key="'product'+product.id" class="col-md-4 col-sm-6 px-2 mb-4">
                                <product_card_vertical :product="product"></product_card_vertical>
                                <hr class="d-sm-none">
                            </div>
                            <div v-if="!product_card_vertical" v-for="product in records[currentPage]" :key="'product'+product.id" class="px-2 mb-4">
                                <product_card_horizontal :product="product"></product_card_horizontal>
                                <hr class="d-sm-none">
                            </div>
                        </div>
                        <hr class="my-3">
                        <!-- Pagination-->
                        <nav class="d-flex justify-content-between pt-2" aria-label="Page navigation">
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
                        <!-- Banner-->
                        <div class="py-sm-2" v-if="WideAdvertisingBanner">
                            <div class="d-sm-flex justify-content-between align-items-center bg-secondary overflow-hidden rounded-3 mb-4" :style="{'background-image' : 'url('+ encodeURI(WideAdvertisingBanner.Image.value) +')' }" style="background-position: right top;background-repeat: no-repeat;background-size: cover;">
                                <div class="py-4 my-2 my-md-0 py-md-5 px-4 ms-md-3 text-center text-sm-start">
                                    <h4 class="fs-lg fw-light mb-2" v-if="WideAdvertisingBanner.Subtitle.value">{{WideAdvertisingBanner.Subtitle.value}}</h4>
                                    <h3 class="mb-4" v-if="WideAdvertisingBanner.Title.value">{{WideAdvertisingBanner.Title.value}}</h3>
                                    <router-link :to="WideAdvertisingBanner.ButtonLink.value" class="btn btn-primary btn-shadow btn-sm" v-if="WideAdvertisingBanner.ButtonLink.value">{{WideAdvertisingBanner.ButtonText.value}}</router-link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </template>        
</template>