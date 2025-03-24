export default {
    template : `
    <div>
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
                <td>{{service.name}}</td>
                <td>{{service.BasePrice}}</td>
                <td button @click="deleteService(service.ID)" class="btn btn-success">Delete</td>
            </tr>
        </tbody>
    </table><br>
    <router-link to='/add_service'>add service</router-link>
    </div>
    `
,
data(){
    return {
       services: null,
       professionals: null,
       userData:"",
       service: {
        name:" "
       },
       professional: {
        name:" "
       }
    } 
},
mounted(){
    this.loadUser()
    this.loadTrans()
},

methods: {
    loadUser(){
        fetch('/api/home', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => this.userData = data)
    },
    loadTrans(){
        fetch(location.origin+'/api/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.services=data[0].services
           this.professionals=data[1].professionals
        }
        
        
    )
    },
    deleteService(id){
        fetch(`/api/delete/${id}`, {
            method: 'DELETE',
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

