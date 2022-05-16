<script>
export default {
        props: {
            values: {
                type: Array,
                default: function () {
                    return []
                },
            },
            filter_column : {
                type : String,
                default : "",
            },
            display_column : {
                type : String,
                default : "",
            },
            show_default:{
                type : Boolean,
                default : false,
            },
        },
        data() {
            return {
                search_text: "",
            }
        },
        computed: {
            ...Vuex.mapState(['user', "device_type"]),
            filtered_values: function () {
                if(this.search_text){
                    var values
                    if (this.filter_column){
                        values = this.values.filter(item => item[this.filter_column].toLowerCase().includes(this.search_text.toLowerCase()));
                    }else{
                        values = this.values.filter(item => item.toLowerCase().includes(this.search_text.toLowerCase()));
                    }
                    return values
                }else{
                    return this.values
                }
            },
        },
        mounted: function () {},
}    
</script>
<template>
<div class="widget widget-links widget-filter">
        <div class="input-group input-group-sm mb-2">
            <input class="widget-filter-search form-control rounded-end" type="text" placeholder="Search" v-model="search_text"><i class="ci-search position-absolute top-50 end-0 translate-middle-y fs-sm me-3"></i>
        </div>
        <ul class="widget-list widget-filter-list pt-1" style="max-height: 12rem; overflow: auto">
            <li v-if="show_default" class="widget-list-item widget-filter-item">
                <slot name="defaultcard">
                    <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="$emit('input', false)">
                        <span class="widget-filter-item-text">View all</span>
                    </a>
                </slot>
            </li>
            <li v-for="(item, index) in filtered_values" class="widget-list-item widget-filter-item">
                <slot name="itemcard" v-bind:item="item" v-bind:index="index">
                    <a class="widget-list-link d-flex justify-content-between align-items-center" href="#" @click.prevent="$emit('input', item)">
                        <span v-if="display_column" class="widget-filter-item-text">{{item[display_column]}}</span>
                        <span v-else class="widget-filter-item-text">{{item}}</span>
                    </a>
                </slot>
            </li>
        </ul>
    </div>        
</template>