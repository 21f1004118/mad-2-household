export default{
    template:`
    <div>
        <div>
        <h1 align="center"> Customer Page </h1>
        </div>
    <div> <router-link to='/customer_search'>Search Professionals</router-link>
    </div>
    <h4 align="center">Services</h4>
        <table class="table table-striped">
            <thead>
                <th scope="col">ID</th>
                <th scope="col">Service</th>
                <th scope="col">Base Price</th>
                <th scope="col">Action</th>
            </thead>
            <tbody>
                <tr v-for="(service,index) in services" >
                <th scope="row">{{ index+1 }}</th>
                <td>{{service.Name}}</td>
                <td>{{service.BasePrice}}</td>
                <td>
                <router-link :to="'/book_service/'+ service.ID">book</router-link>
                </td>
        </tr>
    </tbody>
    </table><br>
    <h4 align="center">Service History</h4>
    <table class="table table-striped">
        <thead>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Service</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
        </thead>
        <tbody>
            <tr v-for="(req,index) in servicehist">
                <th scope="row">{{index+1}}</th>
                <td>{{req.ProfName}}</td>
                <td>{{req.ServiceName}}</td>
                <td>{{req.Date}}</td>
                <td>{{req.Status}}</td>
                <td><a href=# @click.prevent="CloseService(req.ID)">Close</td>
            </tr>
        </tbody>
    </table>
    </div>`
    ,

data(){
    return{
        service:{
            ID:this.ID,
            Name: "",
            BasePrice: "",
            TimeReq: "",
            Desc: ""
        },
        services: null,
        servicehist: null
}
},
mounted(){
    this.getservices()
    this.getservicehist(localStorage.getItem('id'))
},
methods:{
    getservices(){
        fetch('/api/getservices', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.services=data
        })
    },
    getservicehist(id){
        fetch(`/api/servicereqscus/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.servicehist=data
        })
    },
    CloseService(id){  
        fetch(`/api/close_req/${id}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.$router.go(0)

        })

    }
}
}



