<script>
    export default {
        props: {
            loading: {
                type: Boolean,
                required: false
            },
            fullpage: {
                type: Boolean,
                required: false
            },
        },
        data: () => {
            return {}
        },
    }    
</script>
<template>
    <div :class="{'position-relative':!fullpage && loading }">
        <slot>

        </slot>
        <div v-if="loading" class="b-overlay fade position-absolute" :class="{'show':loading}">
            <slot name="loader">
                <div class="bg-transparent rounded-sm" style="inset: 0px; opacity: 0.75; backdrop-filter: blur(5px);"
                    :class="{'position-fixed':fullpage && loading, 'position-absolute':!fullpage && loading }"></div>
                <div style="top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);"
                    :class="{'position-fixed':fullpage && loading, 'position-absolute':!fullpage && loading }">
                    <span aria-hidden="true" class="spinner-border">
                        <!---->
                    </span>
                </div>
            </slot>
        </div>
    </div>
</template>