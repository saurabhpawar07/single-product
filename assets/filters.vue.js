export default {
    props: {
        value: {
            type: Object,
            default: function () {
                return {
                    category_id: 0,
                }
            }
        },
    },
    components: {
        'searchablelist': () => import("./searchablelist.vue.js"),
        'autocomplete': () => import("./location_autocomplete.vue.js"),
    },
    data() {
        return {
            loading: 0,
            error: false,
            message: "",
            min_cost: 0,
            max_cost: 680,
            category: null,
            subcategory: null,
            childcategory: null,
            rangeSlider: false,
            attributes: false,
            selectedlocation: "",
            account: window.application.Account,
            SearchByLocation: false,
            product_rating : 0,
        };
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "pages", "categories"]),
    },
    watch: {
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
        $route(to, from) {
            this.setDefaultCategories()
        },
        categories(newValue, oldValue) {
            this.setDefaultCategories()
        },
        category: function(newValue, oldValue) {
            if (!newValue) {
                this.subcategory = false
                this.childcategory = false
            } else if (this.subcategory && this.subcategory.CategoryID && this.subcategory.CategoryID != newValue.ID) {
                this.subcategory = false
                this.childcategory = false
            }
            this.emit()
        },
        subcategory: function(newValue, oldValue) {
            if (!newValue) {
                this.childcategory = false
            } else if (this.childcategory && this.childcategory.subcategoryID && this.childcategory.subcategoryID != newValue.ID) {
                this.childcategory = false
            }
            this.SetAttributes()
            this.emit()
        },
        childcategory: function(newValue, oldValue) {
            this.SetAttributes()
            this.emit()
        },
        selectedlocation: function (newValue, oldValue) {
            this.debounce_func()
        },
        product_rating: function (newValue, oldValue) {
            this.debounce_func()
        },
    },
    methods: {
        SetAttributes: _.debounce(function() {
            if (!this.subcategory && !this.childcategory) {
                return
            }
            var data = {}
            if (this.account.AccountType == "admin") {
                data.SubcategoryID = this.subcategory?this.subcategory.ID: 0
                data.ChildcategoryID = this.childcategory?this.childcategory.ID: 0
            } else {
                data.SubcategoryID = this.subcategory?this.subcategory.BaseSubcategoryID: 0
                data.ChildcategoryID = this.childcategory?this.childcategory.BaseChildcategoryID: this.subcategory.BaseChildcategoryID
            }
            if (this.value) {
                this.loading = true
                return this.$store.dispatch('call', {
                    api: "attributes",
                    data: data,
                }).then((data) => {
                    if (Array.isArray(data.data)) {
                        var attributes = data.data
                        attributes.forEach(attribute => {
                            attribute.filter = []
                        });
                        this.attributes = attributes
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                    this.error = true
                    this.message = error
                }).finally(() => {
                    this.loading = false
                });
            }
        }, 500),
        emit() {
            var value = {}
            value.filtered = true
            if (this.category) {
                value.category = this.category
            }
            if (this.subcategory) {
                value.subcategory = this.subcategory
            }
            if (this.childcategory) {
                value.childcategory = this.childcategory
            }
            if (this.min_cost) {
                value.min_cost = this.min_cost
            }
            if (this.max_cost) {
                value.max_cost = this.max_cost
            }
            if (this.selectedlocation) {
                value.selectedlocation = this.selectedlocation
            }
            if (this.product_rating) {
                value.product_rating = this.product_rating
            }
            // attribute.filter
            if (this.attributes) {
                this.attributes.forEach(attribute => {
                    if (attribute.filter.length) {
                        if (!value.attributes) {
                            value.attributes = {}
                        }
                        value.attributes[attribute.ProductColumn] = attribute.filter
                    }
                });
            }
            this.$emit('input',
                value)
        },
        setDefaultCategories() {
            if (this.categories && this.categories.length && this.$route.params.category_name) {
                var categories = this.categories.filter(item => item.Name == this.$route.params.category_name)
                if (categories && categories.length) {
                    this.category = categories[0]
                    if (this.$route.params.subcategory_name) {
                        var subcategories = this.category.subcategories.filter(item => item.Name == this.$route.params.subcategory_name)
                        if (subcategories && subcategories.length) {
                            this.subcategory = subcategories[0]
                        }
                    } else {
                        this.subcategory = false
                    }
                }
            } else {
                this.category = false
                this.subcategory = false
                this.childcategory = false
                this.attributes = false
            }
        },
        init() {
            var rangeSlider = this.$refs.rangeSlider
            var options = {
                dataStartMin: this.min_cost,
                dataStartMax: this.max_cost,
                dataMin: 0,
                dataMax: JSON.parse(JSON.stringify(this.max_cost)),
                dataStep: 1
            }
            this.rangeSlider = noUiSlider.create(rangeSlider, {
                start: [options.dataStartMin, options.dataStartMax],
                connect: true,
                step: options.dataStep,
                pips: {
                    mode: 'count',
                    values: 5
                },
                tooltips: true,
                range: {
                    'min': options.dataMin,
                    'max': options.dataMax
                },
                format: {
                    to: function to(value) {
                        return '$' + parseInt(value, 10);
                    },
                    from: function from(value) {
                        return Number(value);
                    }
                }
            });
            var component = this
            rangeSlider.noUiSlider.on('update', (values, handle) => {
                var value = values[handle];
                value = value.replace(/\D/g, '');

                if (handle) {
                    component.max_cost = Math.round(value);
                } else {
                    component.min_cost = Math.round(value);
                }
                component.debounce_func()
            });
        },
        debounce_func: _.debounce(function () {
            this.emit()
        },1000),
        load() {
            this.loading = true
            this.$store.dispatch('call',
                {
                    api: "pages",
                    data: {
                        sort: "weightage",
                        sortdesc: true,
                        limit: 20,
                    }
                }).then((data) => {
                    this.message = data.Message;
                    if (data.Status == 2) {
                        this.error = false
                        if (Array.isArray(data.data)) {
                            this.$store.commit('set_pages', data.data)
                        }
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
        if (this.account) {
            this.max_cost = this.account.MaxPrice
        }
        if (this.$route.query && this.$route.query.location) {
            this.selectedlocation = this.$route.query.location
        }
        if (window.application.ThemeSettings) {
            if (window.application.ThemeSettings.SearchByLocation) {
                this.SearchByLocation = window.application.ThemeSettings.SearchByLocation.value
            } else {
                var SearchByLocation = localStorage.getItem("SearchByLocation")
                if (SearchByLocation) {
                    this.SearchByLocation = SearchByLocation
                }
            }
        }
        this.setDefaultCategories()
        this.init()
        this.emit()
    },
    template: `<div class="offcanvas offcanvas-collapse bg-white w-100 rounded-3 shadow-lg py-1" id="shop-sidebar" style="max-width: 22rem;">
        <div class="offcanvas-header align-items-center shadow-sm">
            <h2 class="h5 mb-0">Filters.</h2>
            <button class="btn-close ms-auto" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body py-grid-gutter px-lg-grid-gutter">
            <!-- Categories-->
            <div class="widget widget-categories mb-4 pb-4 border-bottom">
                <h3 class="widget-title">Categories</h3>
                <div v-if="!category">
                    <ul class="widget-list widget-filter-list pt-1">
                        <li v-for="category in categories" :key="'filter_category'+category.ID" class="widget-list-item widget-filter-item">
                            <router-link class="widget-list-link d-flex justify-content-between align-items-center" :to="'/shop/'+encodeURI(category.Name)">
                                <span class="widget-filter-item-text">{{category.Name}}    </span>
                                <span class="fs-xs text-muted ms-3">{{category.Products}}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <ul v-else-if="this.$route.params.subcategory_name && subcategory" class="widget-list widget-filter-list pt-1" style="max-height: 12rem;" data-simplebar data-simplebar-auto-hide="false">
                    <li class="widget-list-item widget-filter-item">
                        <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="childcategory = false">
                            <span class="widget-filter-item-text">View all</span>
                            <span class="fs-xs text-muted ms-3">{{subcategory.Products}}</span>
                        </a>
                    </li>
                    <li v-for="_childcategory in subcategory.childcategories" class="widget-list-item widget-filter-item">
                        <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="childcategory = _childcategory;">
                            <span class="widget-filter-item-text">{{_childcategory.Name}}</span>
                            <span class="fs-xs text-muted ms-3">{{_childcategory.Products}}</span>
                        </a>
                    </li>
                </ul>
                <div v-else class="accordion mt-n1" id="shop-categories">
                    <!-- Shoes-->
                    <div v-for="_subcategory in category.subcategories" :key="'filter_subcategory'+_subcategory.ID" class="accordion-item">
                        <h3 class="accordion-header">
                            <a class="accordion-button collapsed d-flex justify-content-between" :href="'#filter_subcategory'+_subcategory.ID" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="shoes">
                                <span class="widget-filter-item-text">{{_subcategory.Name}}</span>
                                <span class="fs-xs text-muted ms-3">{{_subcategory.Products}}</span>
                            </a>
                        </h3>
                        <div v-if="_subcategory.childcategories && _subcategory.childcategories.length" class="accordion-collapse collapse" :id="'filter_subcategory'+_subcategory.ID" data-bs-parent="#shop-categories" style="">
                            <div class="accordion-body">
                                <searchablelist :values="_subcategory.childcategories" filter_column="Name" display_column="Name" :show_default="true">
                                    <template v-slot:defaultcard>
                                        <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="subcategory = _subcategory; childcategory = false">
                                            <span class="widget-filter-item-text">View all</span>
                                            <span class="fs-xs text-muted ms-3">{{_subcategory.Products}}</span>
                                        </a>
                                    </template>
                                    <template v-slot:itemcard="{ item }">
                                        <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="subcategory = _subcategory; childcategory = item;">
                                            <span class="widget-filter-item-text">{{item.Name}}</span>
                                            <span class="fs-xs text-muted ms-3">{{item.Products}}</span>
                                        </a>
                                    </template>
                                </searchablelist>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Location-->
            <div v-if="SearchByLocation" class="widget mb-4 pb-4 border-bottom">
                <h3 class="widget-title">Locations</h3>
                <autocomplete placeholder="Type city name to search" v-model="selectedlocation" />
            </div>
            <!-- Ratings-->
            <div v-if="SearchByLocation" class="widget mb-4 pb-4 border-bottom d-flex flex-column">
                <h3 class="widget-title">Ratings</h3>
                <div id="emailHelp" class="form-text">Showing {{product_rating?product_rating:'any'}} rating products</div>
                <div class="star-rating" @click.prevent="product_rating = 5">
                    <i class="star-rating-icon" :class="product_rating == 5?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 5?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 5?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 5?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 5?'ci-star-filled active':'ci-star-filled'" ></i>
                </div>
                <div class="star-rating" @click.prevent="product_rating = 4">
                    <i class="star-rating-icon" :class="product_rating == 4?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 4?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 4?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 4?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                </div>
                <div class="star-rating" @click.prevent="product_rating = 3">
                    <i class="star-rating-icon" :class="product_rating == 3?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 3?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 3?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                </div>
                <div class="star-rating" @click.prevent="product_rating = 2">
                    <i class="star-rating-icon" :class="product_rating == 2?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon" :class="product_rating == 2?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                </div>
                <div class="star-rating" @click.prevent="product_rating = 1">
                    <i class="star-rating-icon" :class="product_rating == 1?'ci-star-filled active':'ci-star-filled'" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                    <i class="star-rating-icon ci-star" ></i>
                </div>
                <a v-if="product_rating != 0" class="m-1" href="#" @click.prevent="product_rating = 0">
                    Show All
                </a>
            </div>
            <!-- Price range-->
            <div class="widget mb-4 pb-4 border-bottom">
                <h3 class="widget-title">Price</h3>
                <div class="range-slider">
                    <div ref="rangeSlider" class="range-slider-ui"></div>
                    <!--<div class="d-flex pb-1">-->
                    <!--    <div class="w-50 pe-2 me-2">-->
                    <!--        <div class="input-group input-group-sm">-->
                    <!--            <span class="input-group-text">$</span>-->
                    <!--            <input class="form-control range-slider-value-min" id="range-slider-value-min" name="range-slider-value-min" v-model="min_cost">-->
                    <!--        </div>-->
                    <!--    </div>-->
                    <!--    <div class="w-50 ps-2">-->
                    <!--        <div class="input-group input-group-sm">-->
                    <!--            <span class="input-group-text">$</span>-->
                    <!--            <input class="form-control range-slider-value-max" id="range-slider-value-max" name="range-slider-value-max" v-model="max_cost">-->
                    <!--        </div>-->
                    <!--    </div>-->
                    <!--</div>-->
                </div>
            </div>
            <!-- Filter by Brand-->
            <div v-if="attributes && attribute.FieldType == 'Dropdown'" v-for="attribute in attributes" class="widget widget-filter mb-4 pb-4 border-bottom">
                <h3 class="widget-title">{{attribute.Name}}</h3>
                <searchablelist :values="attribute.Options.split(',')">
                    <template v-slot:itemcard="{ item, index }">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'attribute'+attribute.ID +'option'+ index" :name="'attribute'+attribute.ID" :value="item" v-model="attribute.filter" @change="debounce_func">
                            <label class="form-check-label widget-filter-item-text cap" :for="'attribute'+attribute.ID +'option'+ index">{{item}}</label>
                        </div>
                    </template>
                </searchablelist>
            </div>
        </div>
    </div>`
                }