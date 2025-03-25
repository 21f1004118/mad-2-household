export default{
    props: {
        ID: {
            type: [String, Number],
            default: null
        }
    },
    template:`
    <div>
    <div class="container"></div>
    <h1 align="center">Update service</h1>
    
        <div class="mb-3">
          <label for="Username" class="form-label">Name</label>
          <input type="text" class="form-control" id="Username" v-model="service.Name" >
        </div>
        <div class="mb-3">
            <label for="Fullname" class="form-label">Base Price</label>
            <input type="text" class="form-control" id="Fullname" v-model="service.BasePrice">
        </div>
        <div class="mb-3">
            <label for="Timereq" class="form-label">Time Required</label>
            <input type="text" class="form-control" id="Timereq" v-model="service.Timereq">
        </div>
        <div class="mb-3">
            <label for="Description" class="form-label">Description</label>
            <input type="text" class="form-control" id="Description" v-model="service.Desc">
        </div>
        <button type="submit" class="btn btn-primary" @click="UpdateService(service.ID)">Update service</button>
    </form><br>
    </div> `
,
data(){
    return{
        service:{
            ID:this.ID,
            Name: "",
            BasePrice: "",
            TimeReq: "",
            Desc: ""

        } ,
        
    }
},

mounted(){
    this.loadService()
   
},

methods:{
    UpdateService(id){
        fetch(`/api/update/${id}`,{
            method : 'PUT', 
            headers: {
                'Content-Type' : 'application/json',
                "Authentication-Token": localStorage.getItem('token')
            }, 
            body : JSON.stringify(this.service)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.$router.go(-1)
        })
        
    },
    loadService(){
        fetch(location.origin+`/api/get_service/${this.ID}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("token")
            }
        })
        .then(response => response.json())
        .then(data => {
           this.service=data
           
    })

}
}
}

