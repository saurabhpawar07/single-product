<script>
export default {
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            submitted: false,
            
            Questions: [],
            
            Question1: "",
            Answer1: "",

            Question2: "",
            Answer2: "",

            Question3: "",
            Answer3: "",
        }
    },
    computed: {
        ...Vuex.mapState(["user","showlogin"]),
        Question1Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Question1) {
                return "Please set Question1"
            }
        },
        Answer1Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Answer1) {
                return "Please set Answer1"
            }
        },
        Question2Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Question2) {
                return "Please set Question2"
            }
        },
        Answer2Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Answer2) {
                return "Please set Answer2"
            }
        },
        Question3Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Question3) {
                return "Please set Question3"
            }
        },
        Answer3Error: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.Answer3) {
                return "Please set Answer3"
            }
        },
    },
    watch: {
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
        message: function(newValue, oldValue){
            this.$emit('message', newValue)
        }
    },
    methods: {
        load(){
            this.loading = true
            this.$store.dispatch('call', {
                api: "questions",
                data: {}
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    debugger
                   this.Questions = data.data
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
        submit() {
            this.submitted = true
            if (this.Question1Error || this.Answer1Error || this.Question2Error || this.Answer2Error || this.Question3Error || this.Answer3Error) {
                return
            }
            this.$store.dispatch('call', {
                api: "setquestionanswers",
                data: {
                    Question1: this.Question1,
                    Answer1: this.Answer1,
                    Question2: this.Question2,
                    Answer2: this.Answer2,
                    Question3: this.Question3,
                    Answer3: this.Answer3,
                }
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    this.$router.push('/')
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
        this.load()
    },
}    
</script>
<template>
<divloading :loading="loading" role="document" >
            <form autocomplete="off" novalidate @submit.prevent="submit">
                <div class="mb-3">
                    <label class="text-center">Secret questions are part of our 2 factor authentication which will help to make your account more secure</label>
                    <div v-if="message" class="alert" role="alert" 
                    :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Question1</label>
                    <select class="form-select" id="su-Question1" placeholder="Question1" v-model="Question1" :class="{'is-invalid': Question1Error }">
                        <option v-for="item in Questions">{{item.Question}}</option>
                    </select>
                    <div v-if="Question1Error" class="invalid-feedback">
                        {{Question1Error}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Answer1</label>
                    <input class="form-control" id="su-Answer1" placeholder="Answer1" v-model="Answer1" :class="{'is-invalid': Answer1Error }">
                    <div v-if="Answer1Error" class="invalid-feedback">
                        {{Answer1Error}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Question2</label>
                    <select class="form-select" id="su-Question2" placeholder="Question2" v-model="Question2" :class="{'is-invalid': Question2Error }">
                        <option v-for="item in Questions">{{item.Question}}</option>
                    </select>
                    <div v-if="Question2Error" class="invalid-feedback">
                        {{Question2Error}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Answer2</label>
                    <input class="form-control" id="su-Answer2" placeholder="Answer2" v-model="Answer2" :class="{'is-invalid': Answer2Error }">
                    <div v-if="Answer2Error" class="invalid-feedback">
                        {{Answer2Error}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Question3</label>
                    <select class="form-select" id="su-Question3" placeholder="Question3" v-model="Question3" :class="{'is-invalid': Question3Error }">
                        <option v-for="item in Questions">{{item.Question}}</option>
                    </select>
                    <div v-if="Question3Error" class="invalid-feedback">
                        {{Question3Error}}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="su-mobile">Answer3</label>
                    <input class="form-control" id="su-Answer3" placeholder="Answer3" v-model="Answer3" :class="{'is-invalid': Answer3Error }">
                    <div v-if="Answer3Error" class="invalid-feedback">
                        {{Answer3Error}}
                    </div>
                </div>
                <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Submit</button>
            </form>
        </divloading>        
</template>