
    export default {
        props: {
            increment: {
                type: Number,
            default: 1
            },
            rating: {
                type: Number,
            default: 0
            },
            maxRating: {
                type: Number,
            default: 5
            },
        },
        data() {
            return {
                step: 0,
                fillLevel: [],
                currentRating: 0,
                selectedRating: 0,
                ratingSelected: false
            }
        },
        computed: {
            inactivecount() {
                return this.maxRating - this.rating
            },
        },
    
        template: `
    <div class="vue-star-rating vue-star-rating-inline">
            <span v-for="n in rating" :key="'active'+n" class="icon" style="color: green !important;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 100 100">
                    <path d="M95.759,6c0,0-54.111-0.4-73.441,18.93c-17.752,17.756-9.3,36.677,0.741,48.186c11.704-8.812,26.501-20.92,41.101-35.519    c24.715-24.715-16.603,20.143-35.79,40.86C39.854,88.601,58.93,97.33,76.82,79.436C96.163,60.107,95.759,6,95.759,6z" />
                    <path d="M23.059,73.118C9.43,83.375,0,89.151,0,89.151l19.395-1.023c0,0,3.627-3.895,8.975-9.671    c-0.917-0.812-1.8-1.632-2.621-2.454C24.849,75.106,23.948,74.139,23.059,73.118z" />
                </svg>
            </span>
            <span v-for="n in inactivecount" :key="'inactive'+n" class="icon" style="color: gray !important;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 100 100">
                    <path d="M95.759,6c0,0-54.111-0.4-73.441,18.93c-17.752,17.756-9.3,36.677,0.741,48.186c11.704-8.812,26.501-20.92,41.101-35.519    c24.715-24.715-16.603,20.143-35.79,40.86C39.854,88.601,58.93,97.33,76.82,79.436C96.163,60.107,95.759,6,95.759,6z" />
                    <path d="M23.059,73.118C9.43,83.375,0,89.151,0,89.151l19.395-1.023c0,0,3.627-3.895,8.975-9.671    c-0.917-0.812-1.8-1.632-2.621-2.454C24.849,75.106,23.948,74.139,23.059,73.118z" />
                </svg>
            </span>
        </div>        
    `
}    
    