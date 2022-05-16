<script>
export default {
    components: {
        'v-map': () => import(window.location.href.replace(window.location.pathname, '/vue/components/vmap.js')),
    },
    props: {
        value: {
            type: Object,
            default: function () {
                return {
                    ID: 0,
                };
            },
        },
        SelectBilling:{
            default : false
        },
        SelectDefault:{
            default : false
        },
        wasselected:{
            default : false
        },
    },
    data: () => {
        return {
            loading: false,
            submitted: false,
            error: false,
            message: "",

            Title: "New Address",
            Mobile: "",
            AddressLine1: "",
            AddressLine2: "",
            AddressLine3: "",
            LocationID: "",
            Code: "",
            SubLocality: false,
            Locality: false,
            District: false,
            State: false,
            Country: false,
            location: {
                lat: 0,
                lng: 0,
            },
        };
    },
    watch: {
        value: function (newValue, oldValue) {
            if (newValue) {
                this.SetData();
                this.$emit("onset", this.value);
            }
        },
        loading: function (newValue, oldValue) {
            if (newValue) {
                this.error = false;
                this.message = false;
                this.submitted = false;
            }
        },
        Country: function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue != this.value.Country) {
                    this.District = false;
                }
            }
        },
        District: function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue != this.value.District) {
                    this.Locality = false;
                }
            }
        },
        Locality: function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue != this.value.Locality) {
                    this.SubLocality = false;
                }
            }
        },
        SubLocality: function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue != this.value.SubLocality) {
                    this.LocationID = false;
                }
            }
        },
    },
    computed: {
        ...Vuex.mapState(['user', "device_type", "locations"]),
        TitleError: function () {
            if (!this.submitted) {
                return false;
            }
            if (!this.Title) {
                return "Please enter title";
            }
        },
        MobileError: function () {
            if (!this.submitted) {
                return false;
            }
            if (!this.Mobile) {
                return "Please enter mobile";
            }
        },
        AddressLine1Error: function () {
            if (!this.submitted) {
                return false;
            }
            if (!this.AddressLine1) {
                return "Please enter AddressLine1";
            }
        },
        LatitudeError: function () {
            if (!this.submitted) {
                return false;
            }
            if (!this.location.lat) {
                return "Please enter Latitude, or Select it on map";
            }
        },
        LongitudeError: function () {
            if (!this.submitted) {
                return false;
            }
            if (!this.location.lng) {
                return "Please enter Longitude, or Select it on map";
            }
        },
    },
    methods: {
        Reset() {
            this.SetData();
            this.$emit("input");
        },
        SetData() {
            if (this.value) {
                this.submitted = false;
                this.Title = this.value.Title;
                this.Mobile = this.value.Mobile;
                this.AddressLine1 = this.value.AddressLine1;
                this.AddressLine2 = this.value.AddressLine2;
                this.AddressLine3 = this.value.AddressLine3;
                this.LocationID = this.value.LocationID;
                this.Country = this.value.Country;
                this.State = this.value.State;
                this.District = this.value.District;
                this.Locality = this.value.Locality;
                this.SubLocality = this.value.SubLocality;
                this.Code = this.value.Code;
                this.location.lat = this.value.Latitude;
                this.location.lng = this.value.Longitude;
            }
        },
        submit() {
            this.submitted = true;
            if (this.MobileError || this.AddressLine1Error || this.LatitudeError || this.LongitudeError) {
                return;
            }
            this.value.Mobile = this.Mobile;
            this.value.AddressLine1 = this.AddressLine1;
            this.value.AddressLine2 = this.AddressLine2;
            this.value.AddressLine3 = this.AddressLine3;
            this.value.LocationID = this.LocationID;
            
            this.value.Latitude = this.location.lat.toString()
            this.value.Longitude = this.location.lng.toString()
            
            this.value.Country = this.Country;
            this.value.State = this.State;
            this.value.District = this.District;
            this.value.Locality = this.Locality;
            this.value.SubLocality = this.SubLocality;
            this.value.Code = this.Code;
            
            this.value.Title = this.value.AddressLine1 + ", " + this.value.Locality + ", " + this.value.Code ;
            this.$emit("input", this.value);
        },
        setlocation(data){
            this.Country = "";
            this.State = "";
            this.District = "";
            this.Locality = "";
            this.SubLocality = "";
            this.Code = "";
            for (let index = 0; index < data.address_components.length; index++) {
                const element = data.address_components[index];
                
                if(element.types.includes("sublocality")){
                    this.SubLocality = element.long_name
                }
                if(element.types.includes("locality")){
                    this.Locality = element.long_name
                }
                if(element.types.includes("administrative_area_level_2")){
                    this.District = element.long_name
                }
                if(element.types.includes("administrative_area_level_1")){
                    this.State = element.long_name
                }
                if(element.types.includes("country")){
                    this.Country = element.long_name
                }
                if(element.types.includes("postal_code")){
                    this.Code = element.long_name
                }
                if(element.types.includes("address")){
                    this.AddressLine2 = element.long_name
                }
            }
            if(this.State.includes("District") && !this.District){
                this.District = this.State
                this.State = ""
            }
        }
    },
    mounted: function () {
        this.SetData();
        this.$emit("onload");
    },
}    
</script>
<template>
<form @submit.prevent="submit">
        <div class="row">
            <div class="col">
                <div class="mb-1">
                    <label class="form-label" for="si-AddressLine1">Address Line 1</label>
                    <input class="form-control" id="si-AddressLine1" placeholder="house name & number" v-model="AddressLine1" :class="{'is-invalid': AddressLine1Error }">
                    <div v-if="AddressLine1Error" class="invalid-feedback">
                        {{AddressLine1Error}}
                    </div>
                </div>
                <div class="mb-1">
                    <label class="form-label" for="si-AddressLine2">Address Line 2</label>
                    <input class="form-control" id="si-AddressLine2" placeholder="society / colony / street" v-model="AddressLine2">
                </div>
                <div class="mb-1">
                    <label class="form-label" for="si-SubLocality">SubLocality</label>
                    <input class="form-control" id="si-SubLocality" placeholder="SubLocality" v-model="SubLocality">
                </div>
                <div class="mb-1">
                    <label class="form-label" for="si-Locality">Locality</label>
                    <input class="form-control" id="si-Locality" placeholder="Locality" v-model="Locality">
                </div>
                <div class="d-flex flec-row">
                    <div class="mb-1 me-1">
                        <label class="form-label" for="si-District">District</label>
                        <input class="form-control" id="si-District" placeholder="District" v-model="District">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="si-State">State</label>
                        <input class="form-control" id="si-State" placeholder="State" v-model="State">
                    </div>
                </div>
                <div class="d-flex flec-row">
                    <div class="mb-1 me-1">
                        <label class="form-label" for="si-Country">Country</label>
                        <input class="form-control" id="si-Country" placeholder="Country" v-model="Country">
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="si-Code">Postal Code</label>
                        <input class="form-control" id="si-Code" placeholder="Code" v-model="Code">
                    </div>
                </div>
                <div class="mb-1">
                    <label class="form-label" for="si-Mobile">Mobile</label>
                    <input class="form-control" id="si-Mobile" placeholder="Mobile number" v-model="Mobile" :class="{'is-invalid': MobileError }">
                    <div v-if="MobileError" class="invalid-feedback">
                        {{MobileError}}
                    </div>
                </div>
                <div class="d-flex flec-row">
                    <div class="mb-1 me-1">
                        <label class="form-label" for="si-Latitude">Latitude</label>
                        <input class="form-control" id="si-Latitude" placeholder="Latitude number" v-model="location.lat" :class="{'is-invalid': LatitudeError }">
                        <div v-if="LatitudeError" class="invalid-feedback">
                            {{LatitudeError}}
                        </div>
                    </div>
                    <div class="mb-1">
                        <label class="form-label" for="si-Longitude">Longitude</label>
                        <input class="form-control" id="si-Longitude" placeholder="Longitude number" v-model="location.lng" :class="{'is-invalid': LongitudeError }">
                        <div v-if="LongitudeError" class="invalid-feedback">
                            {{LongitudeError}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <v-map v-model="location" style="height: 100%;" @address="setlocation"></v-map>
            </div>
        </div>
    </form>        
</template>