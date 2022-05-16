<script>
export default {
        props: ["theme_id"],
        data: ()=> {
            return {
                loading: 0,
                error: false,
                message: "",
                account: window.application.Account,
            };
        },
        computed: {
            ...Vuex.mapState(['user', "pages", "subcategories"]),
        },
        methods: {
            ...Vuex.mapGetters(['getSubCategoryUrl']),
            load_categories() {
                this.loading = true
                this.error = false
                this.message = ""
                this.$store.dispatch('call',
                    {
                        api: "categories",
                        data: {
                            sort: "weightage",
                            sortdesc: true,
                            limit: 20,
                        }
                    }).then((data) => {
                        this.message = data.Message;
                        if (data.Status == 2) {
                            this.error = false
                            this.$store.commit('set_categories', data.Result)
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
            this.load_categories()
        },
}    
</script>
<template>
<footer class="footer bg-dark pt-5">
            <div class="container">
                <div class="row pb-2">
                    <div class="col-md-4 col-sm-6">
                        <div class="widget widget-links widget-light pb-2 mb-4">
                            <h3 class="widget-title text-light">Shop departments</h3>
                            <ul class="widget-list">
                                <li v-for="subcategory in subcategories" :key="'footer_subcategory'+subcategory.ID" class="widget-list-item">
                                    <a router-link :to="getSubCategoryUrl(subcategory)" class="widget-list-link">{{subcategory.Name}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-6">
                        <div class="widget widget-links widget-light pb-2 mb-4">
                            <h3 class="widget-title text-light">Account &amp; shipping info</h3>
                            <ul class="widget-list">
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Your account</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Shipping rates &amp; policies</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Refunds &amp; replacements</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Order tracking</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Delivery info</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Taxes &amp; fees</a></li>
                            </ul>
                        </div>
                        <div class="widget widget-links widget-light pb-2 mb-4">
                            <h3 class="widget-title text-light">About us</h3>
                            <ul class="widget-list">
                                <li class="widget-list-item"><a class="widget-list-link" href="#">About company</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Our team</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">Careers</a></li>
                                <li class="widget-list-item"><a class="widget-list-link" href="#">News</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="widget pb-2 mb-4">
                            <h3 class="widget-title text-light pb-1">Stay informed</h3>
                            <form class="subscription-form validate" action="https://studio.us12.list-manage.com/subscribe/post?u=c7103e2c981361a6639545bd5&amp;amp;id=29ca296126" method="post" name="mc-embedded-subscribe-form" target="_blank" novalidate="">
                                <div class="input-group flex-nowrap">
                                    <i class="ci-mail position-absolute top-50 translate-middle-y text-muted fs-base ms-3"></i>
                                    <input class="form-control rounded-start" type="email" name="EMAIL" placeholder="Your email" required="">
                                    <button class="btn btn-primary" type="submit" name="subscribe">Subscribe*</button>
                                </div>
                                <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                                <div style="position: absolute; left: -5000px;" aria-hidden="true">
                                    <input class="subscription-form-antispam" type="text" name="b_c7103e2c981361a6639545bd5_29ca296126" tabindex="-1">
                                </div>
                                <div class="form-text text-light opacity-50">
                                    *Subscribe to our newsletter to receive early discount offers, updates and new products info.
                                </div>
                                <div class="subscription-status"></div>
                            </form>
                        </div>
                        <div class="widget pb-2 mb-4">
                            <h3 class="widget-title text-light pb-1">Download our app</h3>
                            <div class="d-flex flex-wrap">
                                <div class="me-2 mb-2">
                                    <a class="btn-market btn-apple" href="#" role="button"><span class="btn-market-subtitle">Download on the</span><span class="btn-market-title">App Store</span></a>
                                </div>
                                <div class="mb-2">
                                    <a class="btn-market btn-google" href="#" role="button"><span class="btn-market-subtitle">Download on the</span><span class="btn-market-title">Google Play</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5 bg-darker">
                <div class="container">
                    <div class="row pb-3">
                        <div class="col-md-3 col-sm-6 mb-4">
                            <div class="d-flex">
                                <i class="ci-rocket text-primary" style="font-size: 2.25rem;"></i>
                                <div class="ps-3">
                                    <h6 class="fs-base text-light mb-1">Fast and free delivery</h6>
                                    <p class="mb-0 fs-ms text-light opacity-50">
                                        Free delivery for all orders over $200
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-4">
                            <div class="d-flex">
                                <i class="ci-currency-exchange text-primary" style="font-size: 2.25rem;"></i>
                                <div class="ps-3">
                                    <h6 class="fs-base text-light mb-1">Money back guarantee</h6>
                                    <p class="mb-0 fs-ms text-light opacity-50">
                                        We return money within 30 days
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-4">
                            <div class="d-flex">
                                <i class="ci-support text-primary" style="font-size: 2.25rem;"></i>
                                <div class="ps-3">
                                    <h6 class="fs-base text-light mb-1">24/7 customer support</h6>
                                    <p class="mb-0 fs-ms text-light opacity-50">
                                        Friendly 24/7 customer support
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-4">
                            <div class="d-flex">
                                <i class="ci-card text-primary" style="font-size: 2.25rem;"></i>
                                <div class="ps-3">
                                    <h6 class="fs-base text-light mb-1">Secure online payment</h6>
                                    <p class="mb-0 fs-ms text-light opacity-50">
                                        We possess SSL / Secure сertificate
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="hr-light mb-5">
                    <div class="row pb-2">
                        <div class="col-md-6 text-center text-md-start mb-4">
                            <div class="text-nowrap mb-4">
                                <a class="d-inline-block align-middle mt-n1 me-3" href="#"><img class="d-block" :src="account.WideLogo" style="height: 60px;" :alt="account.Title"></a>
                            </div>
                            <!--<div class="widget widget-links widget-light">-->
                            <!--    <ul class="widget-list d-flex flex-wrap justify-content-center justify-content-md-start">-->
                            <!--        <li class="widget-list-item me-4"><a class="widget-list-link" href="#">Outlets</a></li>-->
                            <!--        <li class="widget-list-item me-4"><a class="widget-list-link" href="#">Affiliates</a></li>-->
                            <!--        <li class="widget-list-item me-4"><a class="widget-list-link" href="#">Support</a></li>-->
                            <!--        <li class="widget-list-item me-4"><a class="widget-list-link" href="#">Privacy</a></li>-->
                            <!--        <li class="widget-list-item me-4"><a class="widget-list-link" href="#">Terms of use</a></li>-->
                            <!--    </ul>-->
                            <!--</div>-->
                        </div>
                        <div class="col-md-6 text-center text-md-end mb-4">
                            <div class="mb-3">
                                <a v-if="account.WhatsApp" :href="account.WhatsApp" class="btn-social bs-light bs-whatsapp ms-2 mb-2"><i class="ci-twitter"></i></a>
                                <a v-if="account.Twitter" :href="account.Twitter" class="btn-social bs-light bs-twitter ms-2 mb-2"><i class="ci-twitter"></i></a>
                                <a v-if="account.Facebook" :href="account.Facebook" class="btn-social bs-light bs-facebook ms-2 mb-2"><i class="ci-facebook"></i></a>
                                <a v-if="account.Instagram" :href="account.Instagram" class="btn-social bs-light bs-instagram ms-2 mb-2"><i class="ci-instagram"></i></a>
                                <a v-if="account.Pinterest" :href="account.Pinterest" class="btn-social bs-light bs-pinterest ms-2 mb-2"><i class="ci-pinterest"></i></a>
                                <a v-if="account.Youtube" :href="account.Youtube" class="btn-social bs-light bs-youtube ms-2 mb-2"><i class="ci-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="pb-4 fs-xs text-light opacity-50 text-center text-md-start">
                        © All rights reserved. Made by <a class="text-light" href="#" target="_blank" rel="noopener">{{account.Title}}</a>
                    </div>
                </div>
            </div>
        </footer>
    </template>        
</template>