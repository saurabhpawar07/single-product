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
        <!-- Open Ticket Modal-->
        <form class="needs-validation modal fade" method="post" id="open-ticket" tabindex="-1" novalidate="">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Submit new ticket</h5>
                        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted fs-sm">
                            We normally respond tickets within 2 business days.
                        </p>
                        <div class="row gx-4 gy-3">
                            <div class="col-12">
                                <label class="form-label" for="ticket-subject">Subject</label>
                                <input class="form-control" type="text" id="ticket-subject" required="">
                                <div class="invalid-feedback">
                                    Please fill in the subject line!
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label" for="ticket-type">Type</label>
                                <select class="form-select" id="ticket-type" required="">
                                    <option value="">Choose type</option>
                                    <option value="Website problem">Website problem</option>
                                    <option value="Partner request">Partner request</option>
                                    <option value="Complaint">Complaint</option>
                                    <option value="Info inquiry">Info inquiry</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please choose ticket type!
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label" for="ticket-priority">Priority</label>
                                <select class="form-select" id="ticket-priority" required="">
                                    <option value="">How urgent is your issue?</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please choose how urgent your ticket is!
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="ticket-description">Describe your issue</label>
                                <textarea class="form-control" id="ticket-description" rows="8" required=""></textarea>
                                <div class="invalid-feedback">
                                    Please provide ticket description!
                                </div>
                            </div>
                            <div class="col-12">
                                <input class="form-control" type="file" id="file-input">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                        <button class="btn btn-primary" type="submit">Submit Ticket</button>
                    </div>
                </div>
            </div>
        </form>
        <!-- Toolbar-->
        <div class="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5 mb-lg-3">
            <div class="d-flex align-items-center">
                <label class="d-none d-lg-block fs-sm text-light text-nowrap opacity-75 me-2" for="ticket-sort">Sort tickets:</label>
                <label class="d-lg-none fs-sm text-nowrap opacity-75 me-2" for="ticket-sort">Sort tickets:</label>
                <select class="form-select" id="ticket-sort">
                    <option>All</option>
                    <option>Open</option>
                    <option>Closed</option>
                </select>
            </div>
            <a class="btn btn-primary btn-sm d-none d-lg-inline-block" href="account-signin.html"><i class="ci-sign-out me-2"></i>Sign out</a>
        </div>
        <!-- Tickets list-->
        <div class="table-responsive fs-md mb-4">
            <table class="table table-hover mb-0">
                <thead>
                    <tr>
                        <th>Ticket Subject</th>
                        <th>Date Submitted | Updated</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="py-3"><a class="nav-link-style fw-medium" href="ticket">My new ticket</a></td>
                        <td class="py-3">09/27/2019 | 09/30/2019</td>
                        <td class="py-3">Website problem</td>
                        <td class="py-3"><span class="badge bg-warning m-0">High</span></td>
                        <td class="py-3"><span class="badge bg-success m-0">Open</span></td>
                    </tr>
                    <tr>
                        <td class="py-3"><a class="nav-link-style fw-medium" href="ticket">Another ticket</a></td>
                        <td class="py-3">08/21/2019 | 08/23/2019</td>
                        <td class="py-3">Partner request</td>
                        <td class="py-3"><span class="badge bg-info m-0">Medium</span></td>
                        <td class="py-3"><span class="badge bg-secondary m-0">Closed</span></td>
                    </tr>
                    <tr>
                        <td class="py-3"><a class="nav-link-style fw-medium" href="ticket">Yet another ticket</a></td>
                        <td class="py-3">11/19/2018 | 11/20/2018</td>
                        <td class="py-3">Complaint</td>
                        <td class="py-3"><span class="badge bg-danger m-0">Urgent</span></td>
                        <td class="py-3"><span class="badge bg-secondary m-0">Closed</span></td>
                    </tr>
                    <tr>
                        <td class="py-3"><a class="nav-link-style fw-medium" href="ticket">My old ticket</a></td>
                        <td class="py-3">06/19/2018 | 06/20/2018</td>
                        <td class="py-3">Info inquiry</td>
                        <td class="py-3"><span class="badge bg-success m-0">Low</span></td>
                        <td class="py-3"><span class="badge bg-secondary m-0">Closed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-end">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#open-ticket">Submit new ticket</button>
        </div>
    </section>        
</template>