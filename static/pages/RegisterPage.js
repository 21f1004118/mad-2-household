export default {
    template : `
    <div>
        <input placeholder="Username"  v-model="Username"/>  
        <input placeholder="password"  v-model="password"/> 
        <input placeholder="role"  v-model="role"/>  
        <button class='btn btn-primary' @click="submitLogin"> Register</button>
    </div>
    `,
data(){
    return {
        Username : null,
        password : null,
        role : null,
    } 
},

methods : {
    async submitLogin(){
        const res = await fetch(location.origin+'/register',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json'}, 
                body : JSON.stringify({'Username': this.Username,'password': this.password, 'role' : this.role})
            })
        if (res.ok){
            console.log('Registered')
            const data = await res.json()
            console.log(data)
        }
    }
}
}
