export default {
    props: {
        value: {
            type: Object,
            default: null
        },
        dropdown:{
            type: Boolean,
            default: true,
        },
        show_count:{
            type: Boolean,
            default: true,
        },
    },
    data: () => {
        return {
            show: false,
            expand_category : false,
            expand_subcategory : false,
            account: window.application.Account,
        }
    },
    computed:{
        ...Vuex.mapState([ 'categories', 'loading_categories' ]),
        ...Vuex.mapGetters([
            'getCategoryUrl', 'getSubCategoryUrl', 'getChildCategoryUrl'
        ]),
        isCubizy() {
            return (this.account.AccountType == "admin")
        },
        selectedIcon(){
            if(!this.value){
                return '<i class="fas fa-th-large"></i>'
            }else if(this.value.CategoryID){
                var category = this.$store.state.categories.filter(category => (category.ID == this.value.CategoryID))[0];
                return category.Icon
            }else if(this.value.Icon){
                return this.value.Icon
            }
        },
        selectedCategory(){            
            if(!this.value){
                return 'All Categories'
            }else if(this.value.Name){
                return this.value.Name
            }
        }
    },
    methods: {
        setCategory(category){
            this.show = !this.show
            this.$emit('input', category)
        },
        handleOutsideClick() {
            this.show = false
        },
    },
    mounted: function () {
        document.addEventListener('click', this.handleOutsideClick)
        //document.addEventListener('touchstart', this.handleOutsideClick)
    },
    template: `<div :class="{'dropdown category_dropdown': dropdown}">
    <a v-if="dropdown" class="btn btn-outline-primary d-flex align-items-center dropdown-toggle p-1" data-bs-toggle="dropdown" data-bs-auto-close="outside" href="#" role="button">
        <span v-if="isCubizy" v-html="selectedIcon" class="icon_holder p-1 fs-4"></span>
        <span class="p-1">{{selectedCategory}}</span>
    </a>
    <div class="dropdown-menu">
        <ul class="list-group">
            <li v-if="dropdown"  class="text-break" :class="{'list-group-item': dropdown}">
                <div class="d-flex align-items-center ">
                    <a href="#" class="p-1 flex-fill text-break" @click.prevent="setCategory(null)">
                        <span class="icon_holder p-1 fs-4"><i class="fas fa-th-large"></i></span>
                        <span class="p-1">All Categories</span>
                    </a>
                </div>
            </li>
            <li class="text-break" v-for="category in categories" :key="'dcategory_'+category.ID"  :class="{'list-group-item': dropdown}">
                <div class="d-flex align-items-center">
                    <a :href="getCategoryUrl(category)" class="p-1 d-flex flex-fill text-break"
                        @click.prevent="setCategory(category)">
                        <i v-if="!isCubizy" class="icon-star"></i>
                        <span v-if="isCubizy" v-html="category.Icon" class="icon_holder p-1 fs-4"></span>
                        <span class="flex-fill p-1"> {{category.Name}} </span> 
                        <span v-if="show_count" class="p-1"> ({{category.Products}})  </span>
                    </a>
                    <a href="#" @click.prevent="expand_category = false" class="btn"
                        v-if="category.subcategories.length && expand_category.ID == category.ID">
                        <i class="fas fa-chevron-up p-1" style="transition: 1s ease-in-out;"></i>
                    </a>
                    <a href="#" @click.prevent="expand_category = category" class="btn"
                        v-if="category.subcategories.length && expand_category.ID != category.ID">
                        <i class="fas fa-chevron-down p-1" style="transition: 1s ease-in-out;"></i>
                    </a>
                </div>
                <ul v-if="category.subcategories.length && expand_category.ID == category.ID">
                    <li class="text-break" v-for="subcategory in category.subcategories" :class="{'list-group-item': dropdown}"
                        :key="'dsubcategory_'+subcategory.ID" style="font-size: initial;">
                        <div class="d-flex align-items-center">
                            <a :href="getSubCategoryUrl(subcategory)" class="p-1 d-flex flex-fill text-break"
                                @click.prevent="setCategory(subcategory)">       
                                <span class="flex-fill "> {{subcategory.Name}} </span> 
                                <span v-if="show_count" class=""> ({{subcategory.Products}})  </span>
                            </a>
                            <a href="#" @click.prevent="expand_subcategory = false" class="btn"
                                v-if="subcategory.childcategories.length && expand_subcategory.ID == subcategory.ID">
                                <i class="fas fa-chevron-up p-1" style="transition: 1s ease-in-out;"></i>
                            </a>
                            <a href="#" @click.prevent="expand_subcategory = subcategory" class="btn"
                                v-if="subcategory.childcategories.length && expand_subcategory.ID != subcategory.ID">
                                <i class="fas fa-chevron-down p-1" style="transition: 1s ease-in-out;"></i>
                            </a>
                        </div>
                        <ul v-if="subcategory.childcategories.length && expand_subcategory.ID == subcategory.ID">
                            <li class="text-break" v-for="childcategory in subcategory.childcategories"
                                :key="'dchildcategory_'+childcategory.ID" style="font-size: initial;" :class="{'list-group-item': dropdown}">
                                <div class="d-flex align-items-center">
                                    <a :href="getChildCategoryUrl(childcategory)" class="p-1 d-flex flex-fill text-break"
                                        @click.prevent="setCategory(childcategory)">
                                        <span class="flex-fill "> {{childcategory.Name}} </span> 
                                        <span v-if="show_count" class=""> ({{childcategory.Products}})  </span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</div>`
                }