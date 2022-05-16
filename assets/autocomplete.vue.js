export default {
    props: {
        value: {
            required: true
        },
        suggestions: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
        },
        loading: {
            type: Boolean,
        }
    },
    data() {
        return {
            open: false,
            current: 0,
            magic_flag: false
        }
    },
    computed: {
        // Filtering the suggestion based on the input
        matches() {
            if (this.suggestions) {
                var matches = this.suggestions.filter((obj) => {
                    if (this.value) {
                        return obj.toUpperCase().indexOf(this.value.toUpperCase()) >= 0
                    }
                    return false
                })
                if(matches.length == 0){
                    this.$emit('selected', matches[0])
                }
                return matches
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
        pre_text(value){
            if(value && this.value){
                var x = value.toUpperCase().indexOf(this.value.toUpperCase());
                return value.slice(0, x);
            }
            return value
        },
        post_text(value){
            if(value && this.value){
                var x = value.toUpperCase().indexOf(this.value.toUpperCase());
                return value.slice(x + this.value.length , value.length);
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
            this.$emit('selected', this.matches[index])
            this.open = false
        },
        close() {
            setTimeout(() => {
                this.open = false
            }, 1000);
        }
    },
    template: `<div class="dropdown" tabindex="1">
    <input class="form-control" type="text" :value="value" @input="updateValue($event.target.value)"
        @keydown.enter="enter" @keydown.down="down" @keydown.up="up" @blur="close()" :placeholder="placeholder" />
    <div v-if="loading" class="dropdown-menu show" style="font-size:1em; min-width: 100%;">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <ul class="dropdown-menu " style="font-size:1em; min-width: 100%;" :class="{'show': openSuggestion }">
        <li v-for="(suggestion, index) in matches" class="dropdown-item" v-bind:class="{'active': isActive(index)}"
            @click="suggestionClick(index)">
            <span>{{pre_text(suggestion)}}</span><strong>{{value}}</strong><span>{{post_text(suggestion)}}</span>
        </li>
    </ul>
</div>`
                }