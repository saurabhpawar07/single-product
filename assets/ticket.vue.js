export default {
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
    template: `<section>
        <!-- Toolbar-->
        <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-4">
            <div class="d-flex w-100 text-light text-center me-3">
                <div class="fs-ms px-3">
                    <div class="fw-medium">
                        Date Submitted
                    </div>
                    <div class="opacity-60">
                        09/27/2019
                    </div>
                </div>
                <div class="fs-ms px-3">
                    <div class="fw-medium">
                        Last Updated
                    </div>
                    <div class="opacity-60">
                        09/30/2019
                    </div>
                </div>
                <div class="fs-ms px-3">
                    <div class="fw-medium">
                        Type
                    </div>
                    <div class="opacity-60">
                        Website problem
                    </div>
                </div>
                <div class="fs-ms px-3">
                    <div class="fw-medium">
                        Priority
                    </div>
                    <span class="badge bg-warning">High</span>
                </div>
                <div class="fs-ms px-3">
                    <div class="fw-medium">
                        Status
                    </div>
                    <span class="badge bg-success">Open</span>
                </div>
            </div>
            <a class="btn btn-primary btn-sm" href="account-signin.html"><i class="ci-sign-out me-2"></i>Sign out</a>
        </div>
        <!-- Ticket details (visible on mobile)-->
        <div class="d-flex d-lg-none flex-wrap bg-secondary text-center rounded-3 pt-4 px-4 pb-1 mb-4">
            <div class="fs-sm px-3 pb-3">
                <div class="fw-medium">
                    Date Submitted
                </div>
                <div class="text-muted">
                    09/27/2019
                </div>
            </div>
            <div class="fs-sm px-3 pb-3">
                <div class="fw-medium">
                    Last Updated
                </div>
                <div class="text-muted">
                    09/30/2019
                </div>
            </div>
            <div class="fs-sm px-3 pb-3">
                <div class="fw-medium">
                    Type
                </div>
                <div class="text-muted">
                    Website problem
                </div>
            </div>
            <div class="fs-sm px-3 pb-3">
                <div class="fw-medium">
                    Priority
                </div>
                <span class="badge bg-warning">High</span>
            </div>
            <div class="fs-sm px-3 pb-3">
                <div class="fw-medium">
                    Status
                </div>
                <span class="badge bg-success">Open</span>
            </div>
        </div>
        <!-- Comment-->
        <div class="d-flex align-items-start pb-4 border-bottom">
            <img class="rounded-circle" src="https://cartzilla.createx.studio/img/testimonials/03.jpg" width="50" alt="Michael Davis">
            <div class="ps-3">
                <h6 class="fs-md mb-2">Michael Davis</h6>
                <p class="fs-md mb-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat cupidatat non proident, sunt in culpa qui.
                </p>
                <span class="fs-ms text-muted"><i class="ci-time align-middle me-2"></i>Sep 30, 2019 at 11:05AM</span>
            </div>
        </div>
        <!-- Comment reply-->
        <div class="d-flex align-items-start py-4 border-bottom">
            <img class="rounded-circle" src="https://cartzilla.createx.studio/img/testimonials/03.jpg" width="50" alt="Michael Davis">
            <div class="ps-3">
                <h6 class="fs-md mb-2">Michael Davis</h6>
                <p class="fs-md mb-1">
                    Sed elementum tempus egestas sed sed. Aliquam faucibus purus in massa tempor nec feugiat. Interdum varius sit amet mattis. Magna ac placerat vestibulum lectus mauris. Magna fringilla urna porttitor rhoncus dolor purus non. Urna et pharetra pharetra massa massa ultricies mi quis.
                </p>
                <span class="fs-ms text-muted"><i class="ci-time align-middle me-2"></i>Sep 28, 2019 at 10:00AM</span>
                <!-- Comment-->
                <div class="d-flex align-items-start border-top pt-4 mt-4">
                    <img class="rounded-circle" src="https://cartzilla.createx.studio/img/testimonials/04.jpg" width="50" alt="Susan Gardner">
                    <div class="ps-3">
                        <h6 class="fs-md mb-2">Susan Gardner</h6>
                        <p class="fs-md mb-1">
                            Egestas sed sed risus pretium quam vulputate dignissim. A diam sollicitudin tempor id eu nisl. Ut porttitor leo a diam. Bibendum at varius vel pharetra vel turpis nunc.
                        </p>
                        <span class="fs-ms text-muted"><i class="ci-time align-middle me-2"></i>Sep 27, 2019 at 6:30PM</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Leave message-->
        <h3 class="h5 mt-2 pt-4 pb-2">Leave a Message</h3>
        <form class="needs-validation" novalidate="">
            <div class="mb-3">
                <textarea class="form-control" rows="8" placeholder="Write your message here..." required=""></textarea>
                <div class="invalid-tooltip">
                    Please write the message!
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="close-ticket">
                    <label class="form-check-label" for="close-ticket">Submit and close the ticket</label>
                </div>
                <button class="btn btn-primary my-2" type="submit">Submit message</button>
            </div>
        </form>
    </section>`
                }