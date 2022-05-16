export default {
        components: {
            'user_sidebar': () => import("./user_sidebar.vue.js"),
        },
        data() {
            return {
                loading: 0,
                error: false,
                message: "",
            };
        },
        computed: {
            ...Vuex.mapState(['user', "device_type", "pages", "categories", "locations"]),
        },
        methods: {
            load() {
                this.loading = true
                this.$store.dispatch('call', {
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
                    //this.load_locations()
                })
            },
        },
        mounted: function () {
            //this.load()
        },
        template: `<main class="page-wrapper">
            <!-- Page Title-->
            <div class="page-title-overlap bg-dark pt-4">
                <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb breadcrumb-light flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li class="breadcrumb-item"><a class="text-nowrap" href="index.html"><i class="ci-home"></i>Home</a></li>
                                <li class="breadcrumb-item text-nowrap"><a href="#">Account</a>
                                </li>
                                <li class="breadcrumb-item text-nowrap active" aria-current="page">Wishlist</li>
                            </ol>
                        </nav>
                    </div>
                    <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                        <h1 class="h3 text-light mb-0">Forgot your password?</h1>
                    </div>
                </div>
            </div>
            <div class="container pb-5 mb-2 mb-md-4">
                <div class="row">
                    <!-- Sidebar-->
                    <user_sidebar></user_sidebar>
                    <!-- Content  -->
                    <section class="col-lg-8 col-md-10">
                        <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
                            <h6 class="fs-base text-light mb-0">Change your password in three easy steps. This helps to keep your new password secure.</h6>
                        </div>
                        <ol class="list-unstyled fs-md">
                            <li><span class="text-primary me-2">1.</span>Fill in your email address below.</li>
                            <li><span class="text-primary me-2">2.</span>We'll email you a temporary code.</li>
                            <li><span class="text-primary me-2">3.</span>Use the code to change your password on our secure website.</li>
                        </ol>
                        <div class="card py-2 mt-4">
                            <form class="card-body needs-validation" novalidate="">
                                <div class="mb-3">
                                    <label class="form-label" for="recover-email">Enter your email address</label>
                                    <input class="form-control" type="email" id="recover-email" required="">
                                    <div class="invalid-feedback">
                                        Please provide valid email address.
                                    </div>
                                </div>
                                <button class="btn btn-primary" type="submit">Get new password</button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </template>`
                }