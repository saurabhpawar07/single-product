export default {
    data() {
        return {
            loading: false,
            error: false,
            message: "",
            submitted: false,
            login_view_modal: false,
            username: "",
            password: "",
            name: "",
            email: "",
            mobile: "",
            conform_password: "",
            show_password: false,
            show_conform_password: false,
            rememberme: false,
            regMobileExp: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/,
            regEmailExp: /\S+@\S+\.\S+/
        }
    },
    computed: {
        ...Vuex.mapState(["showlogin"]),
        usernameError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.username.trim()) {
                return "Please enter email or mobile number"
            }
        },
        nameError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.name.trim()) {
                return "Name can not be empty"
            }
        },
        emailError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.email.trim()) {
                return "Email can not be empty"
            } else if (!this.regEmailExp.test(this.email)) {
                return "Please enter valid email"
            } else {
                return ""
            }
        },
        mobileError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.mobile.trim()) {
                return "Mobile can not be empty"
            } else if (!this.regMobileExp.test(this.mobile)) {
                return "Please enter valid mobile"
            } else {
                return ""
            }
        },
        passwordError: function () {
            if (!this.submitted) {
                return false
            }
            var password = this.password.trim()
            if (!password) {
                return "Please provide a valid password"
            }
            if (!/[a-z]/.test(password)) {
                return "Password must have atlist one small character"
            }
            if (!/[A-Z]/.test(password)) {
                return "Password must have atlist one capital character"
            }
            if (!/[0-9]/.test(password)) {
                return "Password must have atlist one number"
            }
        },
        conform_passwordError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.conform_password.trim()) {
                return "Please enter same password again in conform password"
            }
            if (this.conform_password != this.password) {
                return "Conform password and password should be exactly same"
            }
        }
    },
    watch: {
        showlogin(newValue, oldValue) {
            if (this.login_view_modal) {
                if (newValue) {
                    this.login_view_modal.show()
                } else {
                    this.login_view_modal.hide()
                }
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false
                this.message = false
                this.submitted = false
            }
        },
    },
    methods: {
        forgot_password() {
            this.$store.commit('set_showlogin', false)
            this.$router.push('/reset_password')
        },
        login() {
            this.submitted = true
            if (this.usernameError || this.passwordError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "login",
                data: {
                    username: this.username,
                    password: this.password,
                    rememberme: this.rememberme,
                }
            }).then((data) => {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    this.$store.commit('set_showlogin', false)
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
        register() {
            this.submitted = true
            if (this.nameError || this.emailError || this.mobileError || this.passwordError) {
                return
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "register",
                data: {
                    Name: this.name,
                    Email: this.email,
                    Mobile: this.mobile,
                    Password: this.password,
                }
            }).then((data)=> {
                this.message = data.Message;
                if (data.Status == 2) {
                    this.error = false
                    this.$store.commit('set_showlogin', false)
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
        this.login_view_modal = new bootstrap.Modal(this.$refs.loginview)
        this.$refs.loginview.addEventListener('hidden.bs.modal',
            (event) => {
                this.$store.commit('set_showlogin', false)
            })
        if (this.showlogin) {
            this.login_view_modal.show()
        }
    },
    template: `<div class="modal fade" id="signin-modal" tabindex="-1" role="dialog" ref="loginview">
        <divloading :loading="loading" class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header bg-secondary">
                    <ul class="nav nav-tabs card-header-tabs" role="tablist">
                        <li class="nav-item"><a class="nav-link fw-medium active" href="#signin-tab" data-bs-toggle="tab" role="tab" aria-selected="true"><i class="ci-unlocked me-2 mt-n1"></i>Sign in</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="#signup-tab" data-bs-toggle="tab" role="tab" aria-selected="false"><i class="ci-user me-2 mt-n1"></i>Sign up</a></li>
                    </ul>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body tab-content py-4">
                    <div v-if="message" class="alert" role="alert" 
                    :class="{'alert-success':!error, 'alert-danger':error }">
                        {{message}}
                    </div>
                    <form class="tab-pane fade show active" autocomplete="off" novalidate id="signin-tab" @submit.prevent="login">
                        <div class="mb-3">
                            <label class="form-label" for="si-email">Email or Mobile</label>
                            <input class="form-control" type="email" id="si-email" placeholder="johndoe@example.com" v-model="username" :class="{'is-invalid': usernameError }">
                            <div v-if="usernameError" class="invalid-feedback">
                                {{usernameError}}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="si-password">Password</label>
                            <div class="password-toggle" :class="{'is-invalid': passwordError }">
                                <input class="form-control" id="si-password" required :type="show_password?'text':'password'" v-model="password" :class="{'is-invalid': passwordError }">
                                <label class="password-toggle-btn" aria-label="Show/hide password">
                                    <input class="password-toggle-check" type="checkbox" v-model="show_password">
                                    <span class="password-toggle-indicator"></span>
                                </label>
                            </div>
                            <div v-if="passwordError" class="invalid-feedback">
                                {{passwordError}}
                            </div>
                        </div>
                        <div class="mb-3 d-flex flex-wrap justify-content-between">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="si-remember" v-model="rememberme">
                                <label class="form-check-label" for="si-remember">Remember me</label>
                            </div>
                            <a class="fs-sm" href="#" @click.prevent="forgot_password">Forgot password?</a>
                        </div>
                        <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Sign in</button>
                    </form>
                    <form class="tab-pane fade" autocomplete="off" novalidate id="signup-tab" @submit.prevent="register">
                        <div class="mb-3">
                            <label class="form-label" for="su-name">Full name</label>
                            <input class="form-control" type="text" id="su-name" placeholder="John Doe" v-model="name" :class="{'is-invalid': nameError }">
                            <div v-if="nameError" class="invalid-feedback">
                                {{nameError}}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="su-email">Email address</label>
                            <input class="form-control" type="email" id="su-email" placeholder="johndoe@example.com" v-model="email" :class="{'is-invalid': emailError }">
                            <div v-if="emailError" class="invalid-feedback">
                                {{emailError}}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="su-mobile">Mobile address</label>
                            <input class="form-control" type="mobile" id="su-mobile" placeholder="9999999999" v-model="mobile" :class="{'is-invalid': mobileError }">
                            <div v-if="mobileError" class="invalid-feedback">
                                {{mobileError}}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="su-password">Password</label>
                            <div class="password-toggle" :class="{'is-invalid': passwordError }">
                                <input class="form-control" type="password" id="su-password" required :type="show_password?'text':'password'" v-model="password" :class="{'is-invalid': passwordError }">
                                <label class="password-toggle-btn" aria-label="Show/hide password">
                                    <input class="password-toggle-check" type="checkbox" v-model="show_password">
                                    <span class="password-toggle-indicator"></span>
                                </label>
                            </div>
                            <div v-if="passwordError" class="invalid-feedback">
                                {{passwordError}}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="su-password-confirm">Confirm password</label>
                            <div class="password-toggle" :class="{'is-invalid': conform_passwordError }">
                                <input class="form-control" type="password" id="su-password-confirm" required :type="show_conform_password?'text':'password'" v-model="conform_password" :class="{'is-invalid': conform_passwordError }">
                                <label class="password-toggle-btn" aria-label="Show/hide password">
                                    <input class="password-toggle-check" type="checkbox" v-model="show_conform_password">
                                    <span class="password-toggle-indicator"></span>
                                </label>
                            </div>
                            <div class="invalid-feedback">
                                {{conform_passwordError}}
                            </div>
                        </div>
                        <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        </divloading>
    </div>`
                }