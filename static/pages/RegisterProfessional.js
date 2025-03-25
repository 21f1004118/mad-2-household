export default {
    template : `
    <div>
        <input placeholder="Username"  v-model="Username"/>  
        <input placeholder="password"  v-model="password"/> 
        <input placeholder="location"  v-model="location"/>
        <select class="custom-select" id="inputGroupSelect01" v-model="serviceid">
            <option v-for="service in services" :key="service.ID" :value="service.ID">
                {{ service.Name }}
            </option>
        </select>
        <button class='btn btn-primary' @click="submitLogin"> Register</button>
    </div>
    `,
data(){
    return {
        Username : null,
        password : null,
        location : null,
        serviceid : null,
        services : " "
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
            console.log('Registered')
            const data = await res.json()
            console.log(data)
            this.$router.push('/login')
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
