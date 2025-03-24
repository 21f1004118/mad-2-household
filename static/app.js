import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"

const app = new Vue({
    el : '#app',router,
    template : `
        <div> 
            <Navbar></Navbar>
            <div>
             Hello from {{check}}
            </div>
            <router-view> </router-view>
        </div>
    `,
    data:{
        check : "Frontend"
    },
    components:{
        Navbar,
    }
})
