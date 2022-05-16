export default {
    props: ["blog_id"],
    components: {
        'blogcategories': () => import("./blogcategories.vue.js")
    },
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            blog: null,
            author: null,
            previous: null,
            next: null
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
                this.previous = ""
                this.next = ""
            }
        },
        blog_id(newValue, oldValue) {
            this.loadData()
        }
    },
    methods: {
        loadData: function () {
            var blog_id = parseInt(this.blog_id)
            if (!blog_id) {
                this.$router.push('/blogs')
            }
            var data = {
                blog_id: blog_id
            }
            this.loading = true;
            return this.$store.dispatch('call', {
                api: "blog",
                data: data,
            }).then((data) => {
                this.message = data.Message
                if (data.Status == 2) {
                    this.blog = data.Result.blog
                    this.author = data.Result.author
                    this.previous = data.Result.previous
                    this.next = data.Result.next
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
    template: `<main>
        <!-- Page Title (Light)-->
        <div class="bg-secondary py-4">
            <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                            <li class="breadcrumb-item"><a class="text-nowrap" href="index.html"><i class="ci-home"></i>Home</a></li>
                            <li class="breadcrumb-item text-nowrap"><a href="#">Blog</a>
                            </li>
                            <li class="breadcrumb-item text-nowrap active" aria-current="page">Blog</li>
                        </ol>
                    </nav>
                </div>
                <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                    <h1 class="h3 mb-0">{{blog?blog.Title:'Blog Title'}}</h1>
                </div>
            </div>
        </div>
        <divloading :loading="loading" class="container pb-5">
            <div class="row pt-5 mt-md-2">
                <section v-if="blog" class="col-lg-8">
                    <!-- Post meta-->
                    <div class="d-flex flex-wrap justify-content-between align-items-center pb-4 mt-n1">
                        <div class="d-flex align-items-center fs-sm mb-2">
                            <a class="blog-entry-meta-link" href="#">
                                <div class="blog-entry-author-ava">
                                    <img :src="author.Photo?author.Photo:'/img/user.png'" alt="Cynthia Gomez">
                                </div>
                                {{author.Name}}
                            </a>
                            <span class="blog-entry-meta-divider"></span>
                            <a class="blog-entry-meta-link" href="#">{{getFullDate(blog.UpdatedAt)}}</a>
                        </div>
                        <!--<div class="fs-sm mb-2">-->
                        <!--    <a class="blog-entry-meta-link text-nowrap" href="#comments" data-scroll>-->
                        <!--        <i class="ci-message"></i>3</a>-->
                        <!--</div>-->
                    </div>
                    <!-- Gallery-->
                    <div class="gallery row pb-2">
                        <img :src="blog.Image" :alt="blog.Title">
                    </div>
                    <!-- Post content-->
                    <p v-html="blog.Content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minima veniam, quis nostrum exercitationem occaecat cupidatat non proident.
                    </p>
                    <!-- Post tags + sharing-->
                    <div class="d-flex flex-wrap justify-content-between pt-2 pb-4 mb-1">
                        <div class="mt-3 me-3">
                            <a v-for="tag in blog.Tags.split(',')" class="btn-tag me-2 mb-2" href="#">#{{tag}}</a>
                        </div>
                        <div class="mt-3">
                            <span class="d-inline-block align-middle text-muted fs-sm me-3 mt-1 mb-2">Share post:</span>
                            <a class="btn-social bs-facebook me-2 mb-2" href="#"><i class="ci-facebook"></i></a>
                            <a class="btn-social bs-twitter me-2 mb-2" href="#"><i class="ci-twitter"></i></a>
                            <a class="btn-social bs-pinterest me-2 mb-2" href="#"><i class="ci-pinterest"></i></a>
                        </div>
                    </div>
                    <!-- Post navigation-->
                    <nav class="entry-navigation" aria-label="Post navigation">
                        <router-link v-if="previous" :to="'/blog/'+previous.ID" class="entry-navigation-link"
                            data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover"
                            :data-bs-content="previous.Title">
                            <i class="ci-arrow-left me-2"></i>
                            <span class="d-none d-sm-inline">Prev post</span>
                        </router-link>
                        <router-link to="/blogs" class="entry-navigation-link" href="blog-list.html">
                            <i class="ci-view-list me-2"></i>
                            <span class="d-none d-sm-inline">All posts</span>
                        </router-link>
                        <router-link v-if="next" :to="'/blog/'+next.ID" class="entry-navigation-link"
                            data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover"
                            :data-bs-content="next.Title">
                            <span class="d-none d-sm-inline">Next post</span><i class="ci-arrow-right ms-2"></i>
                        </router-link>
                    </nav>
                </section>
                <section v-else class="col-lg-8">
                    <div v-if="message" class="alert" role="alert"
                        :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                </section>
                <aside class="col-lg-4">
                    <!-- Sidebar-->
                    <div class="offcanvas offcanvas-collapse offcanvas-end border-start ms-lg-auto" id="blog-sidebar" style="max-width: 22rem;">
                        <div class="offcanvas-header align-items-center shadow-sm">
                            <h2 class="h5 mb-0">Sidebar</h2>
                            <button class="btn-close ms-auto" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <blogcategories class="offcanvas-body py-grid-gutter py-lg-1 px-lg-4"></blogcategories>
                    </div>
                </aside>
            </div>
        </divloading>
    </main>`
                }