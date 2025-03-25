export default{
    props: {
        ID: {
            default: null
        }
    },
    template:`
    <div>
        BOok service 
        <h4 align="center">Professionals</h4>
    <table class="table table-striped">
        <thead>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Location</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
        </thead>
        <tbody>
            <tr v-for="(professional,index) in professionals" >
                <th scope="row">{{index+1}}</th></a>
                <td>{{professional.Name}}</td>
                <td>{{professional.Location}}</td>
                <td>
                    <div class="mb-3">
                    <input type="text" class="form-control" id="Date" v-model="professional.Date" placeholder="DD-MM-YYYY">
                    </div>
                </td>
                <td><a href="#" @click.prevent="BookService(professional.ID, this.localStorage.getItem('id'),professional.Date)">Book</a></td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>`
    ,
data(){
    return{
    professionals: null,
    professional:{
        Name:"",
        Date:""
    },
    }
},
mounted(){
    this.getprofs(this.ID)
},
methods:{
    getprofs(id){
        fetch(`/api/get_professionals/${id}`,{
            method:'GET',
            headers: {
                'Content-Type' : 'application/json',
                "Authentication-Token": localStorage.getItem('token')
            }, 
    })
        .then(response => response.json())
        .then(data => {
            this.professionals=data
        })
    },
    BookService(pid,uid,date){
        fetch(`/api/create_service_request/${pid}/${uid}`,{
            method : 'POST', 
            headers: {'Content-Type' : 'application/json',
                    "Authentication-Token": localStorage.getItem('token')
            }, 
            body : JSON.stringify(date)
        })
    .then(response => response.json())
    .then(data => { 
        console.log(data)
        this.$router.go(-1)
    })

    }

}
}
