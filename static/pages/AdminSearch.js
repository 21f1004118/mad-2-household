export default{
    template:`
    <div>
        <div class="container-fluid">
        <input class="form-control ms-auto" type="search" placeholder="Search Professionals" v-model="Searchterm">
        <button class="btn btn-outline-success" @click="SearchProf">Search</button>
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
    </div>`
,
data(){
    return {
        professionals:null,
        Searchterm:null
    }
},
methods:{
    SearchProf(){
        fetch(location.origin+'/admin_search',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json',
                    "Authentication-Token": localStorage.getItem("token")
                }, 
                body : JSON.stringify({'Searchterm':this.Searchterm})
            })
        .then(response => response.json())
        .then(data=>this.professionals=data)
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
                this.$router.go(-1)
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
                this.$router.go(-1)
            })
    }
}
}