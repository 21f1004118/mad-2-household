const Home = {
    template : `<h1> this is home </h1>`
}

import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import RegisterCustomerPage from "../pages/RegisterCustomer.js";
import RegisterProfessionalPage from "../pages/RegisterProfessional.js";
import AdminHome from "../pages/AdminHome.js";
import AddService from "../pages/NewService.js";
import UpdateService from "../pages/UpdateService.js";
import CustomerPage from "../pages/CustomerPage.js"
import BookService from "../pages/BookService.js";
import ProfessionalPage from "../pages/ProfessionalPage.js"


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/register_customer', component : RegisterCustomerPage},
    {path : '/register_professional', component : RegisterProfessionalPage},
    {path : '/admin', component : AdminHome},
    {path : '/add_service', component : AddService},
    {path : '/update_service/:ID', component : UpdateService, props: route =>({ID:route.params.ID})},
    {path : '/customer_dashboard', component: CustomerPage},
    {path : '/book_service/:ID', component: BookService, props: route =>({ID:route.params.ID}) },
    {path : '/professional_dashboard', component : ProfessionalPage}
]

const router = new VueRouter({
    routes
})

export default router;
