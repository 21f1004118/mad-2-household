
export default{
    template:
    `<div>
    <div>service  Search</div>
    <div>
    <label for="search_type">Search Type</label>
    <select v-model="Searchby" id="search_type" class="form-control" required>
        <option value="name">Name</option>
        <option value="location">Location</option>
    </select>
    </div>

    <div>
    <input class="form-control ms-auto" type="search" placeholder="Search Services" v-model="Searchterm">
    </div>
    <button class="btn btn-outline-success" @click="SearchServ">Search</button>
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
    </div>`
    ,
data(){
    return{
        Searchby:null,
        Searchterm:null,
        services:null
    }
},
methods:{
    SearchServ(){
        fetch('/customer_search', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            },
            body :JSON.stringify({'Searchby':this.Searchby, 'Searchterm':this.Searchterm})
            })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           this.services=data
        })
    },
}
}