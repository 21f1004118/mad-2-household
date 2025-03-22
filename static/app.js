import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"

const app = new Vue({
    el : '#app',router,
    template : `
        <div> 
            <Navbar></Navbar>
            <router-view> </router-view>
        </div>
    `,
    components:{
        Navbar,
    }
})
