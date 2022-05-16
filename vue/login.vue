<script>
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
            show_email_otp: false,
            show_mobile_otp: false,
            rememberme: false,
            emailotp: "",
            mobileotp: "",
            resetotp: "",
            show_reset_otp: false,
            forgot_password: false,
            regMobileExp: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/,
            regEmailExp: /\S+@\S+\.\S+/
        }
    },
    components: {
        'setquestionanswers': () => import("./setquestionanswers.vue.js"),
    },
    computed: {
        ...Vuex.mapState(["user", "showlogin"]),
        resetotpError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.resetotp.trim()) {
                return "Please enter reset otp"
            }
        },
        emailotpError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.emailotp.trim()) {
                return "Please enter email otp"
            }
        },
        mobileotpError: function () {
            if (!this.submitted) {
                return false
            }
            if (!this.mobileotp.trim()) {
                return "Please enter mobile otp"
            }
        },
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
            debugger
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
        user: function (newValue, oldValue) {
            if (!oldValue && newValue) {
                this.email = newValue.Email
                this.mobile = newValue.Mobile
            }
            if (this.user) {
                if (this.user.Joined) {
                    this.$store.commit('set_showlogin', false)
                } else if (this.user.EmailVerified && this.user.MobileVerified && this.user.AuthVerified) {
                    var component = this
                    setTimeout(function() {
                        component.join()
                    }, 10);
                }
            }
        },
    },
    methods: {
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
        send_reset_otp() {
            this.submitted = true
            if (this.usernameError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "resetcode",
                data: {
                    username: this.username,
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
        reset_password() {
            this.submitted = true
            if (this.usernameError || this.resetotpError || this.passwordError || this.conform_passwordError) {
                return
            }
            var component = this
            component.loading = true
            this.$store.dispatch('call', {
                api: "resetpassword",
                data: {
                    username: this.username,
                    resetcode: this.resetotp,
                    password: this.password,
                }
            }).then(function (data) {
                component.message = data.Message;
                if (data.Status == 2) {
                    component.forgot_password = false
                } else {
                    component.error = true
                }
            }).catch((error) => {
                console.error('Error:', error);
                component.error = true
                component.message = error
            }).finally(() => {
                component.loading = false
            })
        },
        register() {
            this.submitted = true
            if (this.nameError || this.emailError || this.mobileError || this.passwordError || this.conform_passwordError) {
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
        send_email_otp() {
            this.submitted = true
            if (this.emailError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "sendvirificationemail",
                data: {
                    Email: this.email,
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
        verify_email() {
            this.submitted = true
            if (this.emailError || this.emailotpError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "verifyemail",
                data: {
                    Email: this.email,
                    EmailCode: this.emailotp,
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
        send_mobile_otp() {
            this.submitted = true
            if (this.mobileError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "sendvirificationmobile",
                data: {
                    Email: this.mobile,
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
        verify_mobile() {
            this.submitted = true
            if (this.mobileError) {
                return false
            }
            this.loading = true
            this.$store.dispatch('call', {
                api: "verifymobile",
                data: {
                    Mobile: this.mobile,
                    MobileCode: this.mobileotp,
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
        join() {
            this.loading = true
            this.$store.dispatch('call',
                {
                    api: "me",
                    data: {
                        user: {
                            Joined: true
                        }
                    }
                }).then((data) => {
                    this.message = data.Message;
                }).catch((error) => {
                    console.error('Error:', error);
                    this.error = true
                    this.message = error
                }).finally(() => {
                    this.loading = false
                })
        }
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
        if (this.user) {
            this.email = this.user.Email
            this.mobile = this.user.Mobile
        }
    },
}    
</script>
<template>
<div class="modal fade" id="signin-modal" tabindex="-1" role="dialog" ref="loginview" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div v-if="!user" class="modal-content">
                <div class="modal-header bg-secondary">
                    <ul v-if="!forgot_password" class="nav nav-tabs card-header-tabs" role="tablist">
                        <li class="nav-item"><a ref="signintab" class="nav-link fw-medium active" :class="{'disabled': user}" href="#signin-tab" data-bs-toggle="tab" role="tab" aria-selected="true"><i class="ci-unlocked me-2 mt-n1"></i>Sign in</a></li>
                        <li class="nav-item"><a ref="signuptab" class="nav-link fw-medium" href="#signup-tab" data-bs-toggle="tab" role="tab" aria-selected="false"><i class="ci-user me-2 mt-n1"></i>Sign up</a></li>
                    </ul>
                    <h5 v-else class="modal-title">Reset Password</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <divloading v-if="!forgot_password" :loading="loading" class="modal-body tab-content py-4">
                    <form id="signin-tab" class="tab-pane fade show active" autocomplete="off" novalidate @submit.prevent="login">
                        <div class="mb-3">
                            <div v-if="message" class="alert" role="alert"
                                :class="{'alert-success':!error, 'alert-danger':error }">
                                {{message}}
                            </div>
                        </div>
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
                            <a class="fs-sm" href="#" @click.prevent="forgot_password = !forgot_password">Forgot password?</a>
                        </div>
                        <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Sign in</button>
                    </form>
                    <form id="signup-tab" role="document" class="tab-pane fade" autocomplete="off" novalidate @submit.prevent="register">
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
                            <input class="form-control" type="password" id="su-password" required v-model="password" :class="{'is-invalid': passwordError }">
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
                        <div class="d-flex gap-1">
                            <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Sign up</button>
                        </div>
                    </form>
                </divloading>
                <form v-if="forgot_password" autocomplete="off" novalidate @submit.prevent="reset_password" class="modal-body tab-content py-4">
                    <div class="mb-3">
                        <label class="form-label text-center">Reset Password</label>
                        <div v-if="message" class="alert" role="alert"
                            :class="{'alert-success':!error, 'alert-danger':error }">
                            {{message}}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="si-email">Email or Mobile</label>
                        <input class="form-control" type="email" id="si-email" placeholder="johndoe@example.com" v-model="username" :class="{'is-invalid': usernameError }">
                        <div v-if="usernameError" class="invalid-feedback">
                            {{usernameError}}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-shadow d-block w-100" type="button" @click.prevent="send_reset_otp">Get OTP</button>
                    <div class="mb-3">
                        <label for="su-mobile">Reset OTP</label>
                        <div class="password-toggle" :class="{'is-invalid': resetotpError }">
                            <input class="form-control" :type="show_reset_otp?'text':'password'" id="su-reset-otp" placeholder="------" v-model="resetotp" :class="{'is-invalid': resetotpError }" autocomplete="one-time-code">
                            <label class="password-toggle-btn" aria-label="Show/hide password">
                                <input class="password-toggle-check" type="checkbox" v-model="show_reset_otp">
                                <span class="password-toggle-indicator"></span>
                            </label>
                        </div>
                        <div v-if="resetotpError" class="invalid-feedback">
                            {{resetotpError}}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="su-password">Password</label>
                        <input class="form-control" type="password" id="su-password" required v-model="password" :class="{'is-invalid': passwordError }">
                        <div v-if="passwordError" class="invalid-feedback">
                            {{passwordError}}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="su-password-confirm">Confirm password</label>
                        <div class="password-toggle" :class="{'is-invalid': conform_passwordError }">
                            <input class="form-control" id="su-password-confirm" required :type="show_conform_password?'text':'password'" v-model="conform_password" :class="{'is-invalid': conform_passwordError }">
                            <label class="password-toggle-btn" aria-label="Show/hide password">
                                <input class="password-toggle-check" type="checkbox" v-model="show_conform_password">
                                <span class="password-toggle-indicator"></span>
                            </label>
                        </div>
                        <div class="invalid-feedback">
                            {{conform_passwordError}}
                        </div>
                    </div>
                    <div class="d-flex gap-1">
                        <button class="btn btn-primary btn-shadow d-block" type="submit">Reset Password</button>
                        <button class="btn btn-shadow d-block" type="button" @click.prevent="forgot_password = !forgot_password">Cancel</button>
                    </div>
                </form>
            </div>
            <div v-else class="modal-content">
                <div class="modal-header bg-secondary">
                    <h5 class="modal-title">Complete Signup</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body tab-content py-4">
                    <divloading v-if="!user.EmailVerified" :loading="loading" role="document">
                        <form autocomplete="off" novalidate @submit.prevent="verify_email">
                            <div class="mb-3">
                                <div v-if="message" class="alert" role="alert"
                                    :class="{'alert-success':!error, 'alert-danger':error }">
                                    {{message}}
                                </div>
                                <label class="form-label text-center" for="su-name">Please verify your email to complete signup</label>
                            </div>
                            <div class="mb-3">
                                <label for="su-email">Email address</label>
                                <input class="form-control" type="email" id="su-email" placeholder="johndoe@example.com" v-model="email" :class="{'is-invalid': emailError }">
                                <div v-if="emailError" class="invalid-feedback">
                                    {{emailError}}
                                </div>
                            </div>
                            <div v-if="user.EmailCodeSet" class="mb-3">
                                <label for="su-mobile">Email OTP</label>
                                <div class="password-toggle" :class="{'is-invalid': emailotpError }">
                                    <input class="form-control" :type="show_email_otp?'text':'password'" id="su-email-otp" placeholder="------" v-model="emailotp" :class="{'is-invalid': emailotpError }" autocomplete="one-time-code">
                                    <label class="password-toggle-btn" aria-label="Show/hide password">
                                        <input class="password-toggle-check" type="checkbox" v-model="show_email_otp">
                                        <span class="password-toggle-indicator"></span>
                                    </label>
                                </div>
                                <div v-if="emailotpError" class="invalid-feedback">
                                    {{emailotpError}}
                                </div>
                            </div>
                            <div v-if="user.EmailCodeSet" class="mb-3 d-flex flex-wrap justify-content-between">
                                <div class="flex-fill mb-2">
                                </div>
                                <a class="fs-sm" href="#" @click.prevent="send_email_otp">Resend OTP</a>
                            </div>
                            <div class="d-flex gap-1">
                                <button v-if="!user.EmailCodeSet" class="btn btn-primary btn-shadow d-block w-100" type="button" @click.prevent="send_email_otp">Get OTP</button>
                                <button v-if="user.EmailCodeSet" class="btn btn-primary btn-shadow d-block w-100" type="submit">Verify email</button>
                                <button class="btn btn-primary btn-shadow d-block w-100" type="button" @click.prevent="logout">Sign Out</button>
                            </div>
                        </form>
                    </divloading>
                    <divloading v-else-if="!user.MobileVerified" :loading="loading" role="document">
                        <form autocomplete="off" novalidate @submit.prevent="verify_mobile">
                            <div class="mb-3">
                                <div v-if="message" class="alert" role="alert"
                                    :class="{'alert-success':!error, 'alert-danger':error }">
                                    {{message}}
                                </div>
                                <label class="form-label text-center" for="su-name">Please verify your mobile to complete signup</label>
                            </div>
                            <div class="mb-3">
                                <label for="su-mobile">Mobile</label>
                                <input class="form-control" type="mobile" id="su-mobile" placeholder="9999999999" v-model="mobile" :class="{'is-invalid': mobileError }">
                                <div v-if="mobileError" class="invalid-feedback">
                                    {{mobileError}}
                                </div>
                            </div>
                            <div v-if="user.MobileCodeSet" class="mb-3">
                                <label for="su-mobile">Mobile OTP</label>
                                <div class="password-toggle" :class="{'is-invalid': mobileotpError }">
                                    <input class="form-control" :type="show_mobile_otp?'text':'password'" id="su-mobile-otp" placeholder="------" v-model="mobileotp" :class="{'is-invalid': mobileotpError }" autocomplete="one-time-code">
                                    <label class="password-toggle-btn" aria-label="Show/hide password">
                                        <input class="password-toggle-check" type="checkbox" v-model="show_mobile_otp">
                                        <span class="password-toggle-indicator"></span>
                                    </label>
                                </div>
                                <div v-if="mobileotpError" class="invalid-feedback">
                                    {{mobileotpError}}
                                </div>
                            </div>
                            <div v-if="user.MobileCodeSet" class="mb-3 d-flex flex-wrap justify-content-between">
                                <div class="flex-fill mb-2">
                                </div>
                                <a class="fs-sm" href="#" @click.prevent="send_mobile_otp">Resend OTP</a>
                            </div>
                            <div class="d-flex gap-1">
                                <button v-if="!user.MobileCodeSet" class="btn btn-primary btn-shadow d-block w-100" type="button" @click.prevent="send_mobile_otp">Get OTP</button>
                                <button v-if="user.MobileCodeSet" class="btn btn-primary btn-shadow d-block w-100" type="submit">Verify mobile</button>
                                <button class="btn btn-primary btn-shadow d-block w-100" type="button" @click.prevent="logout">Sign Out</button>
                            </div>
                        </form>
                    </divloading>
                    <setquestionanswers v-else-if="!user.Question1 || !user.Answer1 || !user.Question2 || !user.Answer2 || !user.Question3 || !user.Answer3" @message="message = $event"></setquestionanswers>
                    <divloading v-else :loading="loading" role="document">
                        <form autocomplete="off" novalidate @submit.prevent="join">
                            <div class="mb-3">
                                <div v-if="message" class="alert" role="alert"
                                    :class="{'alert-success':!error, 'alert-danger':error }">
                                    {{message}}
                                </div>
                                <h3 class="text-center">Welcome {{user.Name}},</h3>
                                <label class="text-center w-100">Lets beging shopping</label>
                            </div>
                            <button class="btn btn-primary btn-shadow d-block w-100" type="submit">Go....</button>
                        </form>
                    </divloading>
                </div>
            </div>
        </div>
    </div>                
</template>        
</template>