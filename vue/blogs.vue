<script>
export default {
        props: ["blog_category_id"],
        components: {
            'blogcategories': () => import("./blogcategories.vue.js")
        },
        data() {
            return {
                loading: false,
                error: false,
                message: "",
                
                records: {},
                recordsTotal: 0,
                recordsFiltered: 0,
                currentPage: 1,
                perPage: 6,
                
                loadData: _.debounce(function (page_number, component) {
                    component.loading = true;
                    var data = {}
                    data.sort = "blogs`.`created_at "
                    data.sortdesc = true
                    //data.search = component.search.trim().replace(": ", '":"')
                    data.limit = component.perPage
                    data.page = page_number - 1
                    if (this.blog_category_id) {
                        data.fix_condition = {}
                        data.fix_condition.category = parseInt(this.blog_category_id)
                    }
                    return component.$store.dispatch('call', {
                        api: "blogs",
                        data: data,
                    }).then((data) => {
                        component.message = data.Message
                        if (data.Status == 2) {
                            component.records[page_number] = data.data
                            component.recordsTotal = data.recordsTotal
                            component.recordsFiltered = data.recordsFiltered
                            component.searched = component.search.trim()
                        } else {
                            component.error = true
                        }
                        return data
                    }).catch((error) => {
                        console.log(error)
                        component.error = true
                        component.message = error
                        component.$emit('done', false)
                    }).finally(() => {
                        component.loading = false;
                    });
                }, 500),
            };
        },
        computed: {
            ...Vuex.mapState(['user', "device_type"]),
            ...Vuex.mapGetters(['getFullDate', 'getMonth', 'getFullDateTime', 'getDate', 'getTime']),
            maxPage: function () {
                if (this.recordsFiltered > this.perPage) {
                    return Math.ceil(this.recordsFiltered / this.perPage)
                } else {
                    return 1
                }
            },
        },
        watch: {
            loading(newValue, oldValue) {
                if (newValue) {

                    this.error = false
                    this.message = ""
                }
            },
            blog_category_id(newValue, oldValue) {
                this.records = []
                this.currentPage = 1
                this.loadData(this.currentPage, this)
            },
            currentPage(newValue, oldValue) {
                if (this.records[newValue] == undefined) {
                    this.records[newValue] = []
                }
                if (this.records[newValue].length == 0) {
                    this.loading = true
                    this.loadData(newValue, this)
                }
            },
        },
        methods: {
            priviouspage() {
                if (this.currentPage > 1) {
                    this.currentPage--
                }
            },
            nextpage() {
                if (this.currentPage < this.maxPage) {
                    this.currentPage++
                }
            },
        },
        mounted: function () {
            this.loading = true
            this.loadData(this.currentPage, this)
        },
}    
</script>
<template>
<main class="page-wrapper">
            <!-- Page Title (Light)-->
            <div class="bg-secondary py-4">
                <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
                    <div class="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-start">
                                <li class="breadcrumb-item">
                                    <router-link to="/" class="text-nowrap">
                                        <i class="ci-home"></i>Home
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item active">
                                    <router-link to="/blogs" class="text-nowrap">Blogs</router-link>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
                        <h1 class="h3 mb-0">Blogs</h1>
                    </div>
                </div>
            </div>
            <div class="container pb-5 mb-2 mb-md-4">
                <!-- Featured posts carousel
                                                                            <div class="featured-posts-carousel tns-carousel pt-5">
                                                                              <div class="tns-outer" id="tns2-ow"><div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" tabindex="-1" aria-controls="tns2"><i class="ci-arrow-left"></i></button><button type="button" data-controls="next" tabindex="-1" aria-controls="tns2"><i class="ci-arrow-right"></i></button></div><div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">5 to 6</span>  of 3</div><div id="tns2-mw" class="tns-ovh tns-ah" style="height: 436px;"><div class="tns-inner" id="tns2-iw"><div class="tns-carousel-inner  tns-slider tns-carousel tns-subpixel tns-calc tns-horizontal" data-carousel-options="{&quot;items&quot;: 2, &quot;nav&quot;: false, &quot;autoHeight&quot;: true, &quot;responsive&quot;: {&quot;0&quot;:{&quot;items&quot;:1},&quot;700&quot;:{&quot;items&quot;:2, &quot;gutter&quot;: 20},&quot;991&quot;:{&quot;items&quot;:2, &quot;gutter&quot;: 30}}}" id="tns2" style="transition-duration: 0s; transform: translate3d(-36.3636%, 0px, 0px);"><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 16</span><img src="https://cartzilla.createx.studio/img/blog/featured/03.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">We Launched New Store in San Francisco!</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>23</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/03.jpg" alt="Paul Woodred" class="loaded tns-complete"></div>Paul Woodred</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Cartzilla news</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Sep 10</span><img src="https://cartzilla.createx.studio/img/blog/featured/01.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Healthy Food - New Way of Living</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>13</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/04.jpg" alt="Olivia Reyes" class="loaded tns-complete"></div>Olivia Reyes</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Lifestyle</a>, <a href="#" class="blog-entry-meta-link">Nutrition</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 27</span><img src="https://cartzilla.createx.studio/img/blog/featured/02.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Online Payment Security Tips for Shoppers</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>9</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/05.jpg" alt="Rafael Marquez" class="loaded tns-complete"></div>Rafael Marquez</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Online shpopping</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 16</span><img src="https://cartzilla.createx.studio/img/blog/featured/03.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">We Launched New Store in San Francisco!</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>23</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/03.jpg" alt="Paul Woodred" class="loaded tns-complete"></div>Paul Woodred</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Cartzilla news</a></div>
                                                                                  </div>
                                                                                </article>
                                                                                <article class="tns-item tns-slide-active" id="tns2-item0"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Sep 10</span><img src="https://cartzilla.createx.studio/img/blog/featured/01.jpg" alt="Featured post" class="tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Healthy Food - New Way of Living</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>13</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/04.jpg" alt="Olivia Reyes" class="loaded tns-complete"></div>Olivia Reyes</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Lifestyle</a>, <a href="#" class="blog-entry-meta-link">Nutrition</a></div>
                                                                                  </div>
                                                                                </article>
                                                                                <article class="tns-item tns-slide-active" id="tns2-item1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 27</span><img src="https://cartzilla.createx.studio/img/blog/featured/02.jpg" alt="Featured post" class="tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Online Payment Security Tips for Shoppers</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>9</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/05.jpg" alt="Rafael Marquez" class="loaded tns-complete"></div>Rafael Marquez</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Online shpopping</a></div>
                                                                                  </div>
                                                                                </article>
                                                                                <article class="tns-item" id="tns2-item2" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 16</span><img src="https://cartzilla.createx.studio/img/blog/featured/03.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">We Launched New Store in San Francisco!</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>23</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/03.jpg" alt="Paul Woodred" class="loaded tns-complete"></div>Paul Woodred</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Cartzilla news</a></div>
                                                                                  </div>
                                                                                </article>
                                                                              <article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Sep 10</span><img src="https://cartzilla.createx.studio/img/blog/featured/01.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Healthy Food - New Way of Living</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>13</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/04.jpg" alt="Olivia Reyes" class="loaded tns-complete"></div>Olivia Reyes</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Lifestyle</a>, <a href="#" class="blog-entry-meta-link">Nutrition</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 27</span><img src="https://cartzilla.createx.studio/img/blog/featured/02.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Online Payment Security Tips for Shoppers</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>9</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/05.jpg" alt="Rafael Marquez" class="loaded tns-complete"></div>Rafael Marquez</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Online shpopping</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Aug 16</span><img src="https://cartzilla.createx.studio/img/blog/featured/03.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">We Launched New Store in San Francisco!</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>23</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/03.jpg" alt="Paul Woodred" class="loaded tns-complete"></div>Paul Woodred</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Cartzilla news</a></div>
                                                                                  </div>
                                                                                </article><article class="tns-item tns-slide-cloned" aria-hidden="true" tabindex="-1"><a class="blog-entry-thumb mb-3" href="blog-single-sidebar.html"><span class="blog-entry-meta-label fs-sm"><i class="ci-time"></i>Sep 10</span><img src="https://cartzilla.createx.studio/img/blog/featured/01.jpg" alt="Featured post" class="loaded tns-complete"></a>
                                                                                  <div class="d-flex justify-content-between mb-2 pt-1">
                                                                                    <h2 class="h5 blog-entry-title mb-0"><a href="blog-single-sidebar.html">Healthy Food - New Way of Living</a></h2><a class="blog-entry-meta-link fs-sm text-nowrap ms-3 pt-1" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>13</a>
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center fs-sm"><a class="blog-entry-meta-link" href="#">
                                                                                      <div class="blog-entry-author-ava"><img src="https://cartzilla.createx.studio/img/blog/meta/04.jpg" alt="Olivia Reyes" class="loaded tns-complete"></div>Olivia Reyes</a><span class="blog-entry-meta-divider"></span>
                                                                                    <div class="fs-sm text-muted">in <a href="#" class="blog-entry-meta-link">Lifestyle</a>, <a href="#" class="blog-entry-meta-link">Nutrition</a></div>
                                                                                  </div>
                                                                                </article></div></div></div></div>
                                                                            </div>
                                                                            <hr class="mt-5">-->
                <div class="row pt-5 mt-md-2">
                    <!-- Entries grid-->
                    <divloading :loading="loading" class="col-lg-8">
                        <div class="masonry-grid shuffle" data-columns="2" style="position: relative; height: 800px; transition: height 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;">
                            <!-- Entry-->
                            <article class="masonry-grid-item" v-for="blog in records[currentPage]">
                                <div class="card">
                                    <router-link v-if="blog.Image" class="blog-entry-thumb" :to="'/blog/'+blog.ID" >
                                        <img class="card-img-top" :src="blog.Image" alt="Post">
                                    </router-link>
                                    <div class="card-body">
                                        <h2 class="h6 blog-entry-title">
                                            <router-link :to="'/blog/'+blog.ID">{{blog.Title}}</router-link>
                                        </h2>
                                        <span v-if="blog.Tags" v-for="tag in blog.Tags.split(',')" class="btn-tag me-2 mb-2" href="#">{{tag}}</span>
                                    </div>
                                    <div class="card-footer d-flex align-items-center fs-xs">
                                        <span class="blog-entry-meta-link" href="#">
                                            <div class="blog-entry-author-ava">
                                                <img :src="blog.Photo?blog.Photo:'/img/user.png'" alt="">
                                            </div>
                                            {{blog.UpdatedByName}}
                                        </span>
                                        <div class="ms-auto text-nowrap">
                                            <span class="blog-entry-meta-link text-nowrap" href="#">{{getFullDate(blog.UpdatedAt)}}</span>
                                            <span class="blog-entry-meta-divider mx-2"></span>
                                            <!--<a class="blog-entry-meta-link text-nowrap" href="blog-single-sidebar.html#comments"><i class="ci-message"></i>19</a>-->
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <!-- Pagination-->
                        <nav class="d-flex justify-content-between pt-2" aria-label="Page navigation">
                            <ul class="pagination">
                                <li class="page-item"><a class="page-link" href="#" @click.prevent="priviouspage"><i class="ci-arrow-left me-2"></i>Prev</a></li>
                            </ul>
                            <ul class="pagination">
                                <li class="page-item d-sm-none"><span class="page-link page-link-static">{{currentPage}} / {{maxPage}}</span></li>

                                <li v-if="currentPage != 1" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="currentPage = 1">1</a>
                                </li>
                                <li v-if="currentPage-2 > 1" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="currentPage = currentPage-2">{{currentPage-2}}</a>
                                </li>
                                <li v-if="currentPage-1 > 1" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="priviouspage">{{currentPage-1}}</a>
                                </li>
                                <li class="page-item d-none d-sm-block active ">
                                    <a class="page-link" href="#">{{currentPage}}<span class="visually-hidden">(current)</span></a>
                                </li>
                                <li v-if="currentPage + 1 < maxPage" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="currentPage = currentPage + 1">{{currentPage + 1}}</a>
                                </li>
                                <li v-if="currentPage + 2 < maxPage" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="currentPage = currentPage + 2">{{currentPage + 2}}</a>
                                </li>
                                <li v-if="currentPage != maxPage" class="page-item d-none d-sm-block">
                                    <a class="page-link" href="#" @click.prevent="currentPage = maxPage">{{maxPage}}</a>
                                </li>
                            </ul>
                            <ul class="pagination">
                                <li class="page-item"><a class="page-link" href="#" aria-label="Next" @click.prevent="nextpage">Next<i class="ci-arrow-right ms-2"></i></a></li>
                            </ul>
                        </nav>
                    </divloading>
                    <aside class="col-lg-4">
                        <!-- Sidebar-->
                        <div class="offcanvas offcanvas-collapse offcanvas-end border-start ms-lg-auto" id="blog-sidebar" style="max-width: 22rem;">
                            <div class="offcanvas-header align-items-center shadow-sm">
                                <h2 class="h5 mb-0">Sidebar</h2>
                                <button class="btn-close ms-auto" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <blogcategories class="offcanvas-body py-grid-gutter py-lg-1 px-lg-4"></blogcategories>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    </template>        
</template>