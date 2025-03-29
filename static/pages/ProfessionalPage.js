export default{
    template:`
    <div>
        Hello Professional
        <h4 align="center">Service Requests</h4>
        <table class="table table-striped">
            <thead>
                <th scope="col">ID</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
            </thead>
            <tbody>
                    <tr v-for="(req,index) in assigned">
                        <th scope="row">{{index+1}}</th>
                        <td>{{req.CustName}}</td>
                        <td>{{req.Date}}</td>
                        <td><a href=# @click.prevent="AcceptService(req.ID)">Accept</td>
                        <td><a href=# @click.prevent="RejectService(req.ID)">Reject</td>
                    </tr>
            </tbody>
        </table><br>
        <h4 align="center">Accepted Requests</h4>
        <table class="table table-striped">
            <thead>
                <th scope="col">ID</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
            </thead>
            <tbody>
                    <tr v-for="(req,index) in accepted">
                        <th scope="row">{{index+1}}</th>
                        <td>{{req.CustName}}</td>
                        <td>{{req.Date}}</td>
                        <td><a href=# @click.prevent="CloseService(req.ID)">Close</td>
                    </tr>
            </tbody>
        </table><br>
        <h4 align="center">Closed Requests</h4>
        <table class="table table-striped">
            <thead>
                <th scope="col">ID</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
            </thead>
            <tbody>
                    <tr v-for="(req,index) in closed">
                        <th scope="row">{{index+1}}</th>
                        <td>{{req.CustName}}</td>
                        <td>{{req.Date}}</td>
                    </tr>
            </tbody>
        </table><br>
    </div>
    `
    ,
data(){
    return{
        assigned: null,
        accepted: null,
        closed: null
    }
},
mounted(){
    this.getassigned(localStorage.getItem('id'))
    this.getaccepted(localStorage.getItem('id'))
    this.getclosed(localStorage.getItem('id'))
},
methods:{
    getassigned(id){
        fetch(`/api/getassigned_serv/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.assigned=data
    })
},
    getaccepted(id){
        fetch(`/api/getaccepted_serv/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.accepted=data
    })
},
    getclosed(id){
        fetch(`/api/getclosed_serv/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
        console.log(data)
        this.closed=data
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

},
    AcceptService(id){  
        fetch(`/api/accept_req/${id}`,{
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
    RejectService(id){  
        fetch(`/api/reject_req/${id}`,{
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
}}