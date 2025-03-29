export default {
    template : `
    <div>
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