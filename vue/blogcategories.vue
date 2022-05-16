<script>
export default {
    data() {
        return {
            loading_: false,
            loading: false,
            error: false,
            message: "",
            Blogcategories: []
        }
    },
    computed: {
        ...Vuex.mapState(['user']),
    },
    watch: {
        loading(newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = ""
            }
        }
    },
    methods: {
        loadData: function () {
            var page_number = 1
            var data = {}
            this.loading = true;
            return this.$store.dispatch('call', {
                api: "blogcategories",
                data: data,
            }).then((data) => {
                this.message = data.Message
                if (data.Status == 2) {
                    this.Blogcategories = data.data
                } else {
                    this.error = true
                }
                return data
            }).catch((error) => {
                console.log(error)
                this.error = true
                this.message = error
            }).finally(() => {
                this.loading = false;
            });
        },
    },
    mounted: function () {
        this.loadData()
    },
}    
</script>
<template>
<div>
        <!-- Categories-->
        <divloading :loading="loading" class="widget widget-links mb-grid-gutter pb-grid-gutter border-bottom mx-lg-2">
            <div v-if="message" class="alert" role="alert"
                :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <h3 class="widget-title">Blog categories</h3>
            <ul class="widget-list">
                <li class="widget-list-item" v-for="Blogcategory in Blogcategories">
                    <router-link :to="'/blogs/'+Blogcategory.ID" class="widget-list-link d-flex justify-content-between align-items-center" href="#">
                        <span>{{Blogcategory.Name}}</span><span class="fs-xs text-muted ms-3">{{Blogcategory.Blogs}}</span>
                    </router-link>
                </li>
            </ul>
        </divloading>
        <!-- Trending posts
                <div class="widget mb-grid-gutter pb-grid-gutter border-bottom mx-lg-2">
                    <h3 class="widget-title">Trending posts</h3>
                    <div class="d-flex align-items-center mb-3">
                        <a class="flex-shrink-0" href="blog-single.html"><img class="rounded" src="img/blog/widget/01.jpg" width="64" alt="Post image"></a>
                        <div class="ps-3">
                            <h6 class="blog-entry-title fs-sm mb-0"><a href="blog-single.html">Retro Cameras are Trending. Why so Popular?</a></h6><span class="fs-ms text-muted">by <a href='#' class='blog-entry-meta-link'>Andy Williams</a></span>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mb-3">
                        <a class="flex-shrink-0" href="blog-single.html"><img class="rounded" src="img/blog/widget/02.jpg" width="64" alt="Post image"></a>
                        <div class="ps-3">
                            <h6 class="blog-entry-title fs-sm mb-0"><a href="blog-single.html">New Trends in Suburban Fashion</a></h6><span class="fs-ms text-muted">by <a href='#' class='blog-entry-meta-link'>Susan Mayer</a></span>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <a class="flex-shrink-0" href="blog-single.html"><img class="rounded" src="img/blog/widget/03.jpg" width="64" alt="Post image"></a>
                        <div class="ps-3">
                            <h6 class="blog-entry-title fs-sm mb-0"><a href="blog-single.html">Augmented Reality - Game Changing Technology</a></h6><span class="fs-ms text-muted">by <a href='#' class='blog-entry-meta-link'>John Doe</a></span>
                        </div>
                    </div>
                </div>-->
        <!-- Popular tags
                <div class="widget pb-grid-gutter mx-lg-2">
                    <h3 class="widget-title">Popular tags</h3><a class="btn-tag me-2 mb-2" href="#">#fashion</a><a class="btn-tag me-2 mb-2" href="#">#gadgets</a><a class="btn-tag me-2 mb-2" href="#">#online shopping</a><a class="btn-tag me-2 mb-2" href="#">#top brands</a><a class="btn-tag me-2 mb-2" href="#">#travel</a><a class="btn-tag me-2 mb-2" href="#">#cartzilla news</a><a class="btn-tag me-2 mb-2" href="#">#personal finance</a><a class="btn-tag me-2 mb-2" href="#">#tips &amp; tricks</a>
                </div>-->
        <!-- Promo banner
                <div class="bg-size-cover bg-position-center rounded-3 py-5 mx-lg-2" style="background-image: url(img/blog/banner-bg.jpg);">
                    <div class="py-5 px-4 text-center">
                        <h5 class="mb-2">Your Add Banner Here</h5>
                        <p class="fs-sm text-muted">
                            Hurry up to reserve your spot
                        </p>
                        <a class="btn btn-primary btn-shadow btn-sm" href="#">Contact us</a>
                    </div>
                </div>-->
    </div>        
</template>