<script>
export default {
    components: {
        'review': () => import("./review.vue.js"),
    },
    props: {
        product_id: {
            default: 0
        },
        account_id: {
            default: 0
        },
        name : {
            default : ""
        }
    },
    data() {
        return {
            submited: false,
            loading: false,
            error: false,
            message: "",
            Review: "",
            Pros : "",
            Cons : "",
            Rating: 0,
            Value: null,
        };
    },
    computed: {
        ...Vuex.mapState(['user', "cart", "cart_cost_total", "cart_price_total"]),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        user(newValue, oldValue) {
            if (!oldValue) {
                this.load()
            }
        },
    },
    methods: {
        submit(event) {
            
            if(!this.user){
                this.$store.commit('set_showlogin', true )
                this.message = "Please login and then submit review"
                this.error = true
                return
            }
            
            if(!this.Rating){
                this.message = "Rating can not be empty"
                this.error = true
                return
            }
            
            if(!this.Review){
                this.message = "Review can not be empty"
                this.error = true
                return
            }
            if(this.Review.length < 50){
                this.message = "Your review must be at least 50 characters."
                this.error = true
                return
            }
            var data = {
                    Title: this.Title,
                    Review: this.Review,
                    Pros : this.Pros,
                    Cons : this.Cons,
                    Rating: this.Rating,
                }
            this.load(data)
        },
        load: _.debounce(function (data) {
            if(!data){
                data = {}
            }
            
            if(!this.user){
                return
            }
            
            if(!this.account_id && !this.product_id){
                this.message = "atlist Account or Product must be set to submit review"
                this.error = true
                return
            }else{
                data.AccountID = parseInt(this.account_id)
                data.ProductID = parseInt(this.product_id)
            }
            
            this.loading = true
            this.$store.dispatch('call', {
                api: "review",
                data: data
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    this.Value = data.Result.review
                    if(this.Value){
                        this.Value.Name = this.user.Name
                        this.Value.Photo = this.user.Photo
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
        }, 200),
    },
    mounted: function () {
        this.load()
    },
}    
</script>
<template>
<div class="mt-2 pt-4 mt-md-0 pt-md-0">
        <divloading :loading="loading" class="bg-secondary py-grid-gutter px-grid-gutter rounded-3">
            <h3 class="h4 pb-2">
                <span v-if="Value">Your</span>
                <span v-else>Write a</span>
                 review 
                <span v-if="name"> for {{name}}</span>
                </h3>
            <div v-if="message" class="alert" role="alert"
                :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <div v-if="Value">
                <review :value="Value"></review>
                <button class="btn btn-primary btn-shadow d-block w-100" type="button" @click="Value = null">Submit new Review</button>
            </div>
            <form v-else class="needs-validation" method="post" novalidate="" @submit.prevent="submit">
                <div class="mb-3 d-flex justify-content-between">
                    <label class="form-label" for="review-rating">Rating<span class="text-danger">*</span></label>
                    <div class="star-rating">
                        <i class="star-rating-icon ci-star-filled" style="font-size: 1.75rem;" :class="{'active': Rating > 0 }" @click.prevent="Rating = 1"></i>
                        <i class="star-rating-icon ci-star-filled" style="font-size: 1.75rem;" :class="{'active': Rating > 1 }" @click.prevent="Rating = 2"></i>
                        <i class="star-rating-icon ci-star-filled" style="font-size: 1.75rem;" :class="{'active': Rating > 2 }" @click.prevent="Rating = 3"></i>
                        <i class="star-rating-icon ci-star-filled" style="font-size: 1.75rem;" :class="{'active': Rating > 3 }" @click.prevent="Rating = 4"></i>
                        <i class="star-rating-icon ci-star-filled" style="font-size: 1.75rem;" :class="{'active': Rating > 4 }" @click.prevent="Rating = 5"></i>
                    </div>
                    <div class="invalid-feedback">
                        Please choose rating!
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="review-text">Review<span class="text-danger">*</span></label>
                    <textarea class="form-control" rows="6" maxlength="500" required="" id="review-text" v-model="Review"></textarea>
                    <div class="invalid-feedback">
                        Please write a review!
                    </div>
                    <small class="form-text text-muted">Your review must be at least 50 characters.</small>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="review-pros">Pros</label>
                    <textarea class="form-control" rows="2" maxlength="500"  placeholder="Separated by commas" v-model="Pros" id="review-pros"></textarea>
                </div>
                <div class="mb-3 mb-4">
                    <label class="form-label" for="review-cons">Cons</label>
                    <textarea class="form-control" rows="2"maxlength="500"  placeholder="Separated by commas" v-model="Cons" id="review-cons"></textarea>
                </div>
                <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Submit a Review</button>
            </form>
        </divloading>
    </div>        
</template>