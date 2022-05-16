export default {
        props: ["theme_id"],
        data() {
            return {
                loading: 0,
                error: false,
                message: "",
            };
        },
        computed: {
            ...Vuex.mapState(['user', 'account', "device_type"]),
        },
        methods: {
            loadData: function () {
                this.loading += 1
                this.message = "";
                this.error = false
                if (!this.prefix) {
                    return
                }
                this.$store.dispatch('call', {
                    api: "files",
                    data: {
                        prifix: this.prefix
                    },
                }).then((data) => {
                    this.message = data.Message;
                    if (data.Status == 2) {
                        this.files = data.Result.files
                        if (!this.files) {
                            this.files = []
                        }
                        this.accessURL = data.Result.accessURL
                    } else {
                        this.error = true;
                    }
                }).catch((error) => {
                    this.error = true;
                    this.message = error.Message
                    console.log(error)
                }).finally(() => {
                    this.loading -= 1;
                    this.$emit('oncount', this.files.length)
                });
            },
        },
        mounted: function () {
            //this.loadData()
        },
        template: `<main>
            <div class="container py-5 mb-lg-3">
                <div class="row justify-content-center pt-lg-4 text-center">
                    <div class="col-lg-5 col-md-7 col-sm-9">
                        <h1 class="display-404 py-lg-3">404</h1>
                        <h2 class="h3 mb-4">We can't seem to find the page you are looking for.</h2>
                        <p class="fs-md mb-4">
                            <u>Here are some helpful links instead:</u>
                        </p>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-xl-8 col-lg-10">
                        <div class="row">
                            <div class="col-sm-4 mb-3">
                                <router-link to="/" class="nav-link" :class="{'active': ($route.name == 'home')}">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <i class="ci-home text-primary h4 mb-0"></i>
                                            <div class="ps-3">
                                                <h5 class="fs-sm mb-0">Homepage</h5><span class="text-muted fs-ms">Return to homepage</span>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                            <div class="col-sm-4 mb-3">
                                <a class="card h-100 border-0 shadow-sm" href="#">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <i class="ci-search text-success h4 mb-0"></i>
                                            <div class="ps-3">
                                                <h5 class="fs-sm mb-0">Search</h5><span class="text-muted fs-ms">Find with advanced search</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="col-sm-4 mb-3">
                                <a class="card h-100 border-0 shadow-sm" href="help-topics.html">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <i class="ci-help text-info h4 mb-0"></i>
                                            <div class="ps-3">
                                                <h5 class="fs-sm mb-0">Help &amp; Support</h5><span class="text-muted fs-ms">Visit our help center</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </template>`
                }