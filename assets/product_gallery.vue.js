export default {
        props: {
            product: {
                type: Object,
                default: function () {
                    return {
                        cost: 50,
                        price: 60,
                        logo: "",
                        images: "",
                        name: "Product Name",
                        account_name: "Shop Name",
                        max_cost: 70,
                        max_price: 82,
                        image_by_vareation : "",
                    }
                }
            },
        },
        data() {
            return {
                images: [],
                selected_image: "",
            }
        },
        watch: {
            product(newValue, oldValue) {
                this.set_product_gallery()
            },
        },
        computed: {
            ...Vuex.mapState(['user', 'locations']),
            extraimages: function () {
                return 'categories'
            },
        },
        methods: {
            set_product_gallery() {
                this.images = []
                if (this.product) {
                    if (this.product.logo) this.images.push(this.product.logo)
                    if (this.product.images) {
                        try {
                            var images = JSON.parse(this.product.images)
                            images.forEach(element => {
                                if(this.product.image_by_vareation ){
                                    if(!element.Variant || element.Variant == this.product.image_by_vareation){
                                        this.images.push(element.Image)
                                    }
                                }else{
                                    this.images.push(element.Image)
                                }
                            });
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
                if (this.images && this.images.length) {
                    this.selected_image = this.images[0]
                }
            }
        },
        mounted: function () {
            this.set_product_gallery()
            new Drift(this.$refs.imagezoom, {
                paneContainer: this.$refs.imagezoompane
            });
        },
    template: `<div class="product-gallery">
        <div class="product-gallery-preview order-sm-2">
            <div class="product-gallery-preview-item active" style="max-height: 80vh; min-height: 500px; overflow: hidden;">
                <img ref="imagezoom" class="image-zoom" :src="selected_image" :data-zoom="selected_image" alt="Product image">
                <div ref="imagezoompane" class="image-zoom-pane"></div>
            </div>
        </div>
        <div class="product-gallery-thumblist order-sm-1">
            <a v-if="images.length > 1" v-for="image in images" class="product-gallery-thumblist-item"
                href="#" @click.prevent="selected_image = image" :class="{ 'active': selected_image == image }">
                <img :src="image" alt="Product thumb">
            </a>
        </div>
    </div>`
                }