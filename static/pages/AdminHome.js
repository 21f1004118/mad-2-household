export default {
    template : `
    <div>
        <div>
        <button @click="CreateCSV"> List of Services Data </button>
        </div>
        <div>
            <router-link to='/admin_search'>Search</router-link>
        </div>
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
                    <td> <a href="#" @click.prevent="deleteService(service.ID)">Delete</a>
                    <router-link :to="'/update_service/'+ service.ID">update</router-link>
                    </td>
                </tr>
            </tbody>
        </table><br>
        <router-link to='/add_service'>add service</router-link>
        </div>
    <div>
    <h4 align="center">Professionals</h4>
    <table class="table table-striped">
        <thead>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Service</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
        </thead>
        <tbody>
            <tr v-for="(professional,index) in professionals" >
                <th scope="row">{{index+1}}</th></a>
                <td>{{professional.name}}</td>
                <td>{{professional.Service}}</td>
                <td>{{professional.Status}}</td>
                <td><a href="#" @click.prevent="ApproveProf(professional.ID)">Approve</a></td>
                <td><a href="#" @click.prevent="BlockProf(professional.ID)">Block</a></td>
            </tr>
        </tbody>
    </table>
    </div>
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
    },
    ApproveProf(id){
        fetch(`professional/approve/${id}`, {
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
    },
    BlockProf(id){
        fetch(`professional/block/${id}`, {
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
    },
    async CreateCSV(){
        const res = await fetch('/create-csv')
        const task_id = (await res.json()).task_id
        const interval = setInterval(async() => {
            const res = await fetch(`${location.origin}/get-csv/${task_id}` )
            if (res.ok){
                window.open(`${location.origin}/get-csv/${task_id}`)
                clearInterval(interval)
            }

        }, 100)
    }
        
}
}

