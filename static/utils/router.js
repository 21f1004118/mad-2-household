const Home = {
    template : `<h1> this is home </h1>`
}

import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import RegisterCustomerPage from "../pages/RegisterCustomer.js";
import RegisterProfessionalPage from "../pages/RegisterProfessional.js";


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/register_customer', component : RegisterCustomerPage},
    {path : '/register_professional', component : RegisterProfessionalPage}
]

const router = new VueRouter({
    routes
})

export default router;
