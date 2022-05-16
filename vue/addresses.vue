<script>
export default {
    props: {
        value: {
            type: Object,
        default: null,
        }
    },
    components: {
        'user_sidebar': () => import("./user_sidebar.vue.js"),
        'address_editor': () => import("./address_editor.vue.js"),
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            records: {},
            recordsTotal: 0,
            currentPage: 1,
            perPage: 12,
            editing_address: false,
            deleting_address: false,
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
                if (component.editing_address) {
                    data.items = [component.editing_address]
                }
                if (component.deleting_address) {
                    data.todelete = [component.deleting_address.ID]
                }
                return component.$store.dispatch('call', {
                    api: "addresses",
                    data: data,
                }).then((data) => {
                    component.message = data.Message
                    if (data.Status == 2) {
                        component.records[page_number] = data.data
                        component.recordsTotal = data.recordsTotal
                        component.editing_address = false
                        component.deleting_address = false
                        
                        component.records[page_number].forEach(address => {
                            if(component.user.DefaultAddress == address.ID){
                                component.$emit('input', address)
                            }
                        });
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
            }, 200),
        }
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations"]),
        maxPage: function () {
            if (this.recordsFiltered > this.perPage) {
                return Math.ceil(this.recordsFiltered / this.perPage)
            } else {
                return 1
            }
        },
    },
    watch: {
        user: function (newValue, oldValue) {
            if (!oldValue && newValue) {
                this.records = {}
                this.loadData(this.currentPage, this)
            }
        },
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
    },
    methods: {
        submit(item) {
            this.editing_address = item
            this.loadData(this.currentPage, this)
        },
        deleteAddress(item) {
            this.deleting_address = item
            this.loadData(this.currentPage, this)
        },
        SetAsDefaultAddress(item) {
            debugger
            if(!item || !item.ID){
                return
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "me",
                data: {
                    user: {
                        DefaultAddress: item.ID
                    }
                }
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
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
        },
    },
    mounted: function () {
        if (this.user) {
            this.loadData(this.currentPage, this)
        }
    },
}    
</script>
<template>
<!-- Content  -->
    <section>
        <div v-if="!user">
            <!-- Toolbar-->
            <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
                <h6 class="fs-base mb-0" :class="{'text-light': $route.name == 'addresses'}"> List of user Addresses</h6></h6>
        </div>
        <hr class="mt-2 mb-3">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
            <button class="btn btn-primary mt-3 mt-sm-0" type="button" @click.prevent="$store.commit('set_showlogin', true )">Sign in</button>
        </div>
    </div>
    <divloading v-else-if="editing_address" :loading="loading">
        <!-- Toolbar-->
        <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
            <h6 v-if="editing_address.ID" class="fs-base mb-0" :class="{'text-light': $route.name == 'addresses'}">Edit address:</h6>
            <h6 v-else class="fs-base mb-0" :class="{'text-light': $route.name == 'addresses'}">Add new address:</h6>
            <div class="d-flex">
                <button class="btn btn-primary me-1" href="#add-address" type="button" @click.prevent="$refs.address_form.submit()">Save</button>
                <button class="btn btn-secondary" href="#add-address" type="button" @click.prevent="editing_address = false">Cancel</button>
            </div>
        </div>
        <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
            {{message}}
        </div>
        <!-- Addresses list-->
        <address_editor ref="address_form" :value="editing_address" @input="submit"></address_editor>
    </divloading>
    <divloading v-else :loading="loading">
        <!-- Toolbar-->
        <div class="d-none d-lg-flex justify-content-between align-items-center " :class="{'pt-lg-3 pb-4 pb-lg-5 mb-lg-3': $route.name == 'addresses'}">
            <h6 class="fs-base mb-0" :class="{'text-light': $route.name == 'addresses'}">List of your registered addresses:</h6>
            <a class="btn btn-sm btn-primary" href="#add-address" @click.prevent="editing_address = {}">Add new address</a>
        </div>
        <div v-if="message" class="alert" role="alert" :class="{'alert-success':!error, 'alert-danger':error }">
            {{message}}
        </div>
        <!-- Addresses list-->
        <div v-if="records[currentPage]" class="d-flex flex-row flex-wrap fs-md">
            <div v-for="address in records[currentPage]" class="card address_card shadow-sm p-2 m-2 w-auto"
                @click.prevent="$emit('input', address)" :class="{'border-primary border-2 shadow-lg ' : value && value.ID == address.ID}">
                <div class="d-flex justify-content-between w-100">
                    <a href="#" @click.prevent="editing_address = address">Edit</a>
                    <a href="#" @click.prevent="deleteAddress(address)">Delete</a>
                </div>
                <h5 v-if="address.DefaultAddress" class="w-100"> Default</h5>
                <div class="d-flex flex-column p-2">
                    <span> {{address.AddressLine1}} </span>
                    <span> {{address.AddressLine2}} </span>
                    <span> {{address.SubLocality}} {{address.Locality}} </span>
                    <span> {{address.District}} {{address.State}} {{address.Country}} </span>
                    <span> {{address.Code}} </span>
                    <span v-if="address.Mobile"> Mobile: ‪{{address.Mobile}}</span>
                </div>
                <a v-if="user.DefaultAddress != address.ID" href="#" @click.prevent="SetAsDefaultAddress(address)">Set As Default Address</a>
            </div>
        </div>
        <hr class="my-3">
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
</section>        
</template>
