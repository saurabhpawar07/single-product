<script>
export default {
    props: {
        value: {
            default: function () {
                return {
                    message: 'hello',
                    Title: "Review Title",
                    Review: "Review Content , Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est...",
                    Replay: "Replay",
                    Pros: "Point1, point2, point3",
                    Cons: "Point1, point2, point3",
                    Rating: 4,
                    AccountID: 1,
                    ProductID: 1,
                    CreatedBy: 1,
                    CreatedAt: 0,
                    Likes: 15,
                    Dislikes: 3,
                    Photo: "/img/user.png",
                    Name: "User Name",
                }
            }
        }
    },
    data() {
        return {
            submited: false,
            loading: false,
            error: false,
            message: "",
            percentage : 0,
        }
    },
    computed: {
        ...Vuex.mapState(['user']),
        ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        },
        value(newValue, oldValue) {
            this.get_percentage()
        },
    },
    methods: {
        get_percentage(){
            if (this.value && (this.value.Likes || this.value.Dislikes)) {
                this.value.Likes = parseInt(this.value.Likes)
                this.value.Dislikes = parseInt(this.value.Dislikes)
                this.percentage = Math.ceil(this.value.Likes * 100 / (this.value.Likes + this.value.Dislikes))
            } else {
                this.percentage = 0
            }
        },
        submit(Response) {
            if(!this.user){
                this.$store.commit('set_showlogin', true )
                return
            }
            var data = {
                ReviewID : this.value.ID,
                Response : Response,
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "reviewresponse",
                data: data
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    if(data.Result.review){
                        this.value.Likes = data.Result.review.Likes
                        this.value.Dislikes = data.Result.review.Dislikes
                        this.get_percentage()
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
        this.get_percentage()
    },
}    
</script>
<template>
<div v-if="value" class="product-review pb-4 mb-4 border-bottom">
        <div class="d-flex mb-3">
            <div class="d-flex align-items-center me-4 pe-2">
                <img class="rounded-circle" :src="value.Photo" width="50" alt="Rafael Marquez">
                <div class="ps-3">
                    <h6 class="fs-sm mb-0">{{value.Name}} <span v-if="value.Verefied" class="badge bg-success">Verefied</span></h6>
                    <span class="fs-ms text-muted">{{getFullDate(value.CreatedAt)}}</span>
                </div>
            </div>
            <div>
                <div class="star-rating">
                    <i class="star-rating-icon" :class="value.Rating > 0?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="value.Rating > 1?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="value.Rating > 2?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="value.Rating > 3?'ci-star-filled active':'ci-star'"></i>
                    <i class="star-rating-icon" :class="value.Rating > 4?'ci-star-filled active':'ci-star'"></i>
                </div>
                <div class="fs-ms text-muted" v-if="percentage > 0">
                    {{percentage}}<span>%</span> of users found this review helpful
                </div>
            </div>
        </div>
        <p class="fs-md mb-2" style="white-space: pre-wrap;word-break: break-word;text-align: justify;">
            {{value.Review}}
        </p>
        <ul class="list-unstyled fs-ms pt-1">
            <li v-if="value.Pros" ><span class="fw-medium">Pros:&nbsp;</span></li>
            <li v-if="value.Pros" class="mb-1" v-for="point in value.Pros.split(',')">{{point}}</li>
            <li v-if="value.Cons" ><span class="fw-medium">Cons:&nbsp;</span></li>
            <li v-if="value.Cons" class="mb-1" v-for="point in value.Cons.split(',')">{{point}}</li>
        </ul>
        <p v-if="value.Replay" class="ms-2 fw-medium" >Replay from seller</p>
        <p v-if="value.Replay" class="fs-md mb-2 ms-2" style="white-space: pre-wrap;word-break: break-word;text-align: justify;">
            {{value.Replay}}
        </p>
        <divloading :loading="loading" class="text-nowrap">
            <button class="btn-like" type="button" @click.prevent="submit('Like')">{{value.Likes}}</button>
            <button class="btn-dislike" type="button" @click.prevent="submit('Dislike')">{{value.Dislikes}}</button>
        </divloading>
    </div>        
</template>