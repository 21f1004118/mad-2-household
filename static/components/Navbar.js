export default {
    template : `
    <div>
        <router-link to='/'>Home</router-link>
        <router-link to='/login'>Login</router-link>
        <router-link to='/register'>Register</router-link>
        <router-link to='/register_customer'>Customer Register</router-link>
        <router-link to='/register_professional'>Professional Register</router-link>
        <button @click="logout">Logout</button>
    </div>
    `,

methods:{
    logout(){
        localStorage.removeItem('id')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        this.$router.push('/')
    }
}
}