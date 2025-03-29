export default {
    template : `
    <div>
        <h1 align="center">Register Professional</h1>
        <div class="mb-3">
            <label for="Username" class="form-label">Username</label>
            <input type="text" class="form-control" id="Username" v-model="Username">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password">
        </div>
        <div class="mb-3">
            <label for="Location" class="form-label">Location</label>
            <input type="text" class="form-control" id="Username" v-model="location">
        </div>
        <div class="mb-3">
            <label for="Select Service" class="form-label">Select Service</label>
                <select class="custom-select" id="inputGroupSelect01" v-model="serviceid">
                    <option v-for="service in services" :key="service.ID" :value="service.ID">
                        {{ service.Name }}
                    </option>
                </select>
        </div>
        <button class='btn btn-primary' @click="submitLogin"> Register</button>
        <div>{{errormessage}}</div>
    </div>
    `,
data(){
    return {
        Username : null,
        password : null,
        location : null,
        serviceid : null,
        services : " ",
        errormessage: null
    }
    
},
mounted(){
    this.getservices()
},

methods : {
    async submitLogin(){
        const res = await fetch(location.origin+'/registerprofessional',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json'}, 
                body : JSON.stringify({'Username': this.Username, 'password': this.password, 'location' : this.location, 'serviceid': this.serviceid})
            })
        if (res.ok){
            const data = await res.json()
            this.errormessage=data.message
            if(data.message== "professional created" ){
                this.$router.push('/login')
            }
        }
    },
    getservices(){
        fetch('/api/getservices', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.services=data
        })
    }
}
}
