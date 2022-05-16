<script>
export default {
    props: {
        placeholder: {
            type: String,
        },
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            
            search_text : "",
            suggestions : [],
            oldsuggestionfilter : "",
            once_closed : "",
            
            open: false,
            current: 0,
            magic_flag: false
        }
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        search_text(newValue, oldValue) {
            var value = newValue.trim()
            if(!value){
                this.suggestions = []
                this.oldsuggestionfilter = ""
                return
            }
            if(this.suggestions.length == 100 && this.oldsuggestionfilter != value ){
                this.loadsuggestions()
            }else if (!this.oldsuggestionfilter || !value.includes(this.oldsuggestionfilter)) {
                this.loadsuggestions()
            }
        },
    },
    computed: {
        ...Vuex.mapGetters([
            'getCategory', 'getSubcategory', 'getCategoryUrl', 'getSubCategoryUrl'
        ]),
        // Filtering the suggestion based on the input
        matches() {
            if (this.suggestions) {
                return this.suggestions.filter((obj) => {
                    if (this.search_text) {
                        return obj.name.toUpperCase().indexOf(this.search_text.toUpperCase()) >= 0
                    }
                    return false
                })
            }
            return []
        },
        openSuggestion() {
            return this.selection !== '' &&
            this.matches.length !== 0 &&
            this.open === true
        }
    },
    methods: {
        pre_text(value) {
            if (value && this.search_text) {
                var x = value.toUpperCase().indexOf(this.search_text.toUpperCase());
                return value.slice(0, x);
            }
            return value
        },
        post_text(value) {
            if (value && this.search_text) {
                var x = value.toUpperCase().indexOf(this.search_text.toUpperCase());
                return value.slice(x + this.search_text.length, value.length);
            }
            return ""
        },
        updateValue(value) {
            if (this.open === false) {
                this.open = true
                this.current = 0
            }
            this.$emit('input', value)
        },
        // When enter pressed on the input
        enter() {
            if (this.matches && this.matches[this.current]) {
                this.$emit('input', this.matches[this.current].name)
                this.open = false
            }
        },
        // When up pressed while suggestions are open
        up() {
            if (this.current > 0) {
                this.current--
            }
        },
        // When up pressed while suggestions are open
        down() {
            if (this.current < this.matches.length - 1) {
                this.current++
            }
        },
        // For highlighting element
        isActive(index) {
            return false;
            return index === this.current
        },
        // When one of the suggestion is clicked
        suggestionClick(index) {
            if (this.matches && this.matches[index]) {
                this.$emit('input', this.matches[index].name)
                this.open = false
            }
        },
        close() {
            setTimeout(() => {
                this.open = false
            }, 1000);
        },
        loadsuggestions(){
            this.oldsuggestionfilter = this.search_text.trim()
            if (!this.loading) {
                this.loading = true
                this.$store.dispatch('call', {
                    api: "productsuggestions",
                    data: {
                        search: this.search_text.trim(),
                    }
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        if (data.data == null) {
                            this.suggestions = []
                        } else {
                            this.suggestions = data.data;
                            this.open = true
                        }
                    }else{
                        this.error = true
                    }
                }).finally(() => {
                    this.loading = false
                })
            }
        }
    },
    mounted: function () {},
}    
</script>
<template>
<div class="dropdown" tabindex="1">
        <div class="input-group">
            <input class="form-control rounded-end pe-5" type="text" v-model="search_text" @keydown.enter="enter"
                @keydown.down="down" @keydown.up="up" @blur="close()" :placeholder="placeholder">
            <i class="ci-search position-absolute top-50 end-0 translate-middle-y text-muted fs-base me-3"></i>
        </div>
        <div v-if="loading" class="dropdown-menu show" style="font-size:1em; min-width: 100%;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <ul class="dropdown-menu " style="font-size:1em; min-width: 100%;" :class="{'show': openSuggestion }">
            <li class="{'text-danger', error}">{{message}}</li>
            <li v-for="(suggestion, index) in matches" class="dropdown-item" @click="suggestionClick(index)">
                <a :href="'/product/'+suggestion.id+'/'+encodeURI(suggestion.name)" v-bind:class="{'active': isActive(index)}">
                    <span>{{pre_text(suggestion.name)}}</span>
                    <strong>{{search_text}}</strong>
                    <span>{{post_text(suggestion.name)}}</span>
                </a><br />
                in 
                <router-link :to="getSubCategoryUrl(getSubcategory(suggestion.subcategory_id, suggestion.base_subcategory_id))">{{getSubcategory(suggestion.subcategory_id, suggestion.base_subcategory_id).Name}}</router-link> 
                in
                <router-link :to="getCategoryUrl(getCategory(suggestion.category_id, suggestion.base_category_id))">{{getCategory(suggestion.category_id, suggestion.base_category_id).Name}}</router-link>
            </li>
        </ul>
    </div>        
</template>