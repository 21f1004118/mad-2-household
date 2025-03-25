export default {
    template : `
    <div class="container">
        <h1 align="center"> HOUSEHOLD SERVICES</h1>
            <div class="mb-3">
                <label for="Username" class="form-label">Username</label>
                <input type="text" class="form-control" id="Username" v-model="formdata.Username">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="formdata.password">
            </div>
            <button type="submit" class="btn btn-primary" @click="submitLogin">Login</button> 
        </div>
    `,
data(){
    return {
        formdata:{
            Username : null,
            password : null,
        }
    } 
},

methods : {
    submitLogin(){
        fetch(location.origin+'/login',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json'}, 
                body : JSON.stringify(this.formdata)
            })
        .then(response => response.json())
        .then(data => { 
            console.log(data)
            if(Object.keys(data).includes("token")){
                localStorage.setItem("token", data.token)
                localStorage.setItem("id", data.id)
                localStorage.setItem("username", data.Username)
                if(data.role.includes('admin')){
                    this.$router.push('/admin')
                }else if(data.role.includes('customer')){
                    this.$router.push('/customer_dashboard')
                }   
            }
            else{
                this.message = data.message
            }
        }
        )   
    }
}
}