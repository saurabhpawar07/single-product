<script>
export default {
    components: {
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
            loadData: _.debounce(function (page_number, component) {
                component.loading = true;
                var data = {}
                data.limit = component.perPage
                if (Array.isArray(page_number)) {
                    data.products = page_number
                    data.page = 0
                    page_number = 1
                } else {
                    data.page = page_number - 1
                }

                return component.$store.dispatch('call', {
                    api: "wishlistproducts",
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
                    if (!component.recordsTotal && component.wishlist && component.wishlist.length) {
                        component.loadData(component.wishlist, component)
                    }
                });
            }, 200),
        };
    },
    computed: {
        ...Vuex.mapState(['user', "wishlist"]),
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
        wishlist(newValue, oldValue) {
            this.loadData(this.currentPage, this)
        },
        user(newValue, oldValue) {
            if (!oldValue && newValue) {
                this.records = {}
                this.currentPage = 1
                if (this.wishlist.length) {
                    this.loadData(this.wishlist, this)
                } else {
                    this.loadData(this.currentPage, this)
                }

            }
        },
        currentPage(newValue, oldValue) {
            if (this.records[this.currentPage] == undefined) {
                this.records[this.currentPage] = []
            }
            if (this.records[this.currentPage].length == 0) {
                this.loadData(this.currentPage, this)
            }
        },
    },
    methods: {},
    mounted: function () {
        this.loadData(this.currentPage, this)
    },
}    
</script>
<template>
<section>
        <!-- Toolbar-->
        <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
            <h6 class="fs-base text-light mb-0">List of items you added to wishlist:</h6>
            <div class="d-none d-sm-flex pb-3">
                <a class="btn btn-icon nav-link-style nav-link-light me-2" :class="{'bg-light text-dark disabled opacity-100 ':product_card_vertical}" href="#" @click.prevent="product_card_vertical= true">
                    <i class="ci-view-grid"></i>
                </a>
                <a class="btn btn-icon nav-link-style nav-link-light" :class="{'bg-light text-dark disabled opacity-100 ':!product_card_vertical}" href="shop-list-ls.html" @click.prevent="product_card_vertical= false">
                    <i class="ci-view-list"></i>
                </a>
            </div>
        </div>
        <!-- Wishlist grid-->
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
    </section>        
</template>