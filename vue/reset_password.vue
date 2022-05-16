<script>
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
}    
</script>
<template>
<section>
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
</template>