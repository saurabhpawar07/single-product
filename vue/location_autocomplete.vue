<script>
export default {
        props: {
            value: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                default: "Search in your city"
            },
            show: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                open: false,
                current: 0,
                magic_flag: false,
                search_text: "",
                oldsearch: "",
                limit: 100,
                loading: false,
                suggestions: [],
                matches: [],
            }
        },
        computed: {
            // Filtering the suggestion based on the input
            openSuggestion() {
                return this.matches.length !== 0 &&
                this.open === true
            }
        },
        watch: {
            search_text: function (newValue, oldValue) {
                debugger
                if (newValue != oldValue) {
                    if (this.search_text && this.search_text.length > 1) {
                        if (!this.oldsearch) {
                            this.load_locations()
                        } else if (!this.search_text.trim().includes(this.oldsearch)) {
                            this.load_locations()
                        } if (!this.locations.length == this.limit) {
                            this.load_locations()
                        } else {
                            this.matches = this.suggestions.filter((obj) => {
                                if (this.search_text) {
                                    return obj.toUpperCase().indexOf(this.search_text.toUpperCase()) >= 0
                                }
                                return false
                            })
                            this.open = true
                        }
                    }
                }
            },
            value: function (newValue, oldValue) {
                if(!this.show){
                    this.search_text = this.value
                }
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
            },
            // When enter pressed on the input
            enter() {
                this.$emit('input', this.matches[this.current])
                this.open = false
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
                this.$emit('input', this.matches[index])
                this.open = false
            },
            close() {
                setTimeout(() => {
                    this.open = false
                }, 1000);
            },
            load_locations() {
                if (this.loading) {
                    return
                }
                this.oldsearch = this.search_text
                this.locations = []
                this.loading = true
                this.$store.dispatch('call', {
                    api: "cities", data: {
                        city: this.search_text,
                        limit: this.limit,
                    }
                }).then((data) => {
                    if (data.Status == 2) {
                        if (data.data == null) {
                            this.suggestions = []
                        } else {
                            this.suggestions = data.data;
                            this.matches = data.data;
                            this.open = true
                        }
                        if (this.suggestions.length == 1) {
                            this.$emit('input', this.suggestions[0])
                        }
                    }
                }).finally(() => {
                    this.loading = false
                })
            },
        },
        mounted: function () {},
}    
</script>
<template>
<div class="dropdown" tabindex="1">
            <label v-if="show && value"> Showing Result from sellers at</label>
            <div v-if="show && value" class="input-group mb-3">
                <input type="text"readonly="" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" :value="value">
                <span class="input-group-text" id="basic-addon1" @click.prevent="$emit('input', '')">
                    <i class="ci-close-circle me-2"></i>
                </span>
            </div>
            
            <input class="form-control ps-1" type="text" v-model="search_text" @input="open = true"
            @keydown.enter="enter" @keydown.down="down" @keydown.up="up" @blur="close()" :placeholder="placeholder" style="padding-left: 2rem !important;"/>
            <i class="ci-location" style="position: fixed; margin-top: -2em; margin-left: 0.5em;"></i>
            <div v-if="loading" class="dropdown-menu show" style="font-size:1em; min-width: 100%;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <ul class="dropdown-menu " style="font-size:1em; min-width: 100%;" :class="{'show': openSuggestion }">
                <li v-for="(suggestion, index) in matches" class="dropdown-item" v-bind:class="{'active': isActive(index)}"
                    @click="suggestionClick(index)">
                    <span>{{pre_text(suggestion)}}</span><strong>{{search_text}}</strong><span>{{post_text(suggestion)}}</span>
                </li>
            </ul>
        </div>
    </template>        
</template>