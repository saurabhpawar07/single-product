    export default {
        props: {
            page_id: {
                default: 0,
            },
        },
        data: () => {
            return {
                loading: false,
                submitted: false,
                error: false,
                message: "",
                content: "",
                title : "",
                oldid : 0
            }
        },
        watch: {
            loading: function (newValue, oldValue) {
                if (newValue) {
                    this.error = false
                    this.message = false
                    this.submitted = false
                }
            },
            page_id: function (newValue, oldValue) {
                if (newValue != oldValue) {
                    this.load()
                }
            },
        },
        computed: {
        },
        methods: {
            load() {
                if (this.loading) { return }
                this.loading = true
                this.oldid = this.page_id
                this.$store.dispatch('call', {
                    api: "page",
                    data: {
                        page_id: this.page_id
                    }
                }).then((data) => {
                    this.content = data.Message;
                    if (data.Status == 2) {
                        this.error = false
                        this.content = data.Result.content
                        this.title = data.Result.title
                    } else {
                        this.error = true
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                    this.error = true
                    this.message = error
                }).finally(() => {
                    this.loading = false
                    if(this.oldid != this.page_id){
                        this.load()
                    }
                })
            },
        },
        mounted: function () {
            this.load()
        },
        template: `<main>
    <div class="page-title full-color">
        <div class="container">
            <div class="row">
                <div class="col-md-12">                    
                    <div class="page-title-heading">
                        <h2 class="title">{{title}}</h2>
                    </div>                
                </div><!-- /.col-md-12 -->  
            </div><!-- /.row -->  
        </div><!-- /.container -->                      
    </div>
    <section class="main-content blog-posts">
        <div class="container" v-html="content">
        </div>
    </section>
</main>`
                }