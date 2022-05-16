<script>
export default {
    data() {
        return {
            loading: 0,
            error: false,
            message: "",
            submited: false,
            name: "",
            email: "",
            phone: "",
            photo: "",
            subscribed: false,
            default_photo: "/img/user.png",
        };
    },
    computed: {
        ...Vuex.mapState(['user']),
    },
    watch: {
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
        user: function (newValue, oldValue) {
            if (!oldValue && newValue) {
                this.init()
            }
        },
    },
    methods: {
        init() {
            this.name = this.user.Name
            this.email = this.user.Email
            this.phone = this.user.Mobile
            this.photo = this.user.Photo
        },
        submit() {
            debugger
            this.loading = true
            if (this.photo.includes('data:image/jpeg')) {
                this.getphotourl()
                return
            }
            this.$store.dispatch('call', {
                api: "me",
                data: {
                    user: {
                        Name: this.name,
                        Photo: this.photo,
                    }
                }
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
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
        getphotourl() {
            this.$store.dispatch('call',
                {
                    api: "getpresignedphotourl",
                    data: {},
                }).then((data) => {
                    this.message = data.Message
                    if (data.Status == 2) {
                        var file = this.$refs.fileinput.files[0]
                        file.Key = data.Result.key
                        this.putFile(file, data.Result.presignedUrl, data.Result.accessURL)
                    } else {
                        this.error = true
                    }
                }).catch((error) => {
                    this.error = true
                    this.message = error.Message
                    if (error) console.log(error)
                });
        },
        putFile(file,
            presignedUrl,
            accessURL) {
            fetch(presignedUrl,
                {
                    // Your PUT endpoint
                    method: 'PUT',
                    headers: {
                        "x-amz-acl": "public-read"
                    },
                    body: file // This is your file object
                }).then(response => response.text()).then((data) => {
                    debugger
                    if (data == "") {
                        this.photo = accessURL + file.Key
                        this.submit()
                    }
                }).catch(error => {
                    console.log("Fail to upload file " + file.name + error)
                });
        },
        readURL(event) {
            debugger
            var input = event.currentTarget
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = (e) => {
                    this.photo = e.target.result
                };

                reader.readAsDataURL(input.files[0]);
            }
        },
    },
    mounted: function () {
        if (this.user) {
            this.init()
        }
    },
}    
</script>
<template>
<section class="col-lg-8">
        <!-- Toolbar-->
        <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
            <h6 class="fs-base text-light mb-0">Update you profile details below:</h6>
        </div>
        <!-- Profile form-->
        <form v-if="user && user.ID" @submit.prevent="submit">
            <div v-if="message" class="alert" role="alert"
                :class="{'alert-success':!error, 'alert-danger':error }">
                {{message}}
            </div>
            <div class="bg-secondary rounded-3 p-4 mb-4">
                <div class="d-flex align-items-center">
                    <img class="rounded" :src="photo?photo:default_photo" width="90" alt="Susan Gardner">
                    <div class="ps-3">
                        <input ref="fileinput" type="file" style="height:0; width: 0" @input="readURL($event)">
                        <button class="btn btn-light btn-shadow btn-sm mb-2" type="button" @click.prevent="$refs.fileinput.click()"><i class="ci-loading me-2"></i>Change avatar</button>
                        <button v-if="user && photo != user.Photo" class="btn btn-light btn-shadow btn-sm mb-2" type="button" @click.prevent="photo = user.Photo"></i>Reset avatar</button>
                        <button v-if="photo" class="btn btn-light btn-shadow btn-sm mb-2" type="button" @click.prevent="photo = ''"></i>Remove avatar</button>
                        <div class="p mb-0 fs-ms text-muted">
                            Upload JPG image. 300 x 300 required.
                        </div>
                    </div>
                </div>
            </div>
            <div class="row gx-4 gy-3">
                <div class="col-sm-6">
                    <label class="form-label" for="account-fn">Full Name</label>
                    <input class="form-control" type="text" id="account-fn" v-model="name">
                </div>
                <div class="col-sm-6">
                    <label class="form-label" for="account-email">Email Address</label>
                    <input class="form-control" type="email" id="account-email" v-model="email" readonly>
                </div>
                <div class="col-sm-6">
                    <label class="form-label" for="account-phone">Phone Number</label>
                    <input class="form-control" type="text" id="account-phone" v-model="phone" readonly>
                </div>
                <div class="col-12">
                    <hr class="mt-2 mb-3">
                    <div class="d-flex flex-wrap justify-content-between align-items-center">
                        <!--<div class="form-check">-->
                        <!--    <input class="form-check-input" type="checkbox" id="subscribe_me" v-model="subscribed">-->
                        <!--    <label class="form-check-label" for="subscribe_me">Subscribe me to Newsletter</label>-->
                        <!--</div>-->
                        <button class="btn btn-primary mt-3 mt-sm-0" type="submit">Update profile</button>
                    </div>
                </div>
            </div>
        </form>
        <div v-else>
            <hr class="mt-2 mb-3">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <button class="btn btn-primary mt-3 mt-sm-0" type="button" @click.prevent="$store.commit('set_showlogin', true )">Sign in</button>
            </div>
        </div>
    </section>        
</template>