export default {
    template : `
    <div>
        <input placeholder="Username"  v-model="Username"/>  
        <input placeholder="password"  v-model="password"/> 
        <input placeholder="location"  v-model="location"/>
        <input placeholder="serviceid"  v-model="serviceid"/>
        <button class='btn btn-primary' @click="submitLogin"> Register</button>
    </div>
    `,
data(){
    return {
        Username : null,
        password : null,
        location : null,
        serviceid : null
    } 
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
        }
    }
}
}
