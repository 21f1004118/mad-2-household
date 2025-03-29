export default {
    template : `
    <div class="container">
        <h1 align="center">Register Customer</h1>
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
            <button type="submit" class="btn btn-primary" @click="submitLogin">Register</button> 
            <div>{{errormessage}}</div>
        </div>
    `,
data(){
    return {
        Username : null,
        password : null,
        location : null,
        errormessage : null
    } 
},

methods : {
    async submitLogin(){
        const res = await fetch(location.origin+'/registercustomer',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json'}, 
                body : JSON.stringify({'Username': this.Username,'password': this.password, 'location' : this.location})
            })
        if (res.ok){
            const data = await res.json()
            this.errormessage=data.message
            console.log(this.errormessage)
            if(data.message== "customer created" ){
                this.$router.push('/login')
            }
            
        }
    }
}
}
