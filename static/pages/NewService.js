export default{
    template:`
    <div class="container">
        <h1 align="center">New service</h1>
            <div class="mb-3">
              <label for="Username" class="form-label">Name</label>
              <input type="text" class="form-control" id="Username" v-model="formdata.Name">
            </div>
            <div class="mb-3">
                <label for="Base_price" class="form-label">Base Price</label>
                <input type="text" class="form-control" id="Fullname" v-model="formdata.BasePrice">
            </div>
            <div class="mb-3">
                <label for="Timereq" class="form-label">Time Required</label>
                <input type="text" class="form-control" id="Timereq" v-model="formdata.Timereq">
            </div>
            <div class="mb-3">
                <label for="Description" class="form-label">Description</label>
                <input type="text" class="form-control" id="Description" v-model="formdata.Desc">
            </div>
            <button type="submit" class="btn btn-primary" @click="createService">Add service</button>
    </div>
        `,
data(){
    return {
        formdata:{
            Name : null,
            BasePrice : null,
            Timereq : null,
            Desc : null,

        }
    } 

},

methods : {
    createService(){
        fetch(location.origin+'/api/create',
            {
                method : 'POST', 
                headers: {'Content-Type' : 'application/json',
                        "Authentication-Token": localStorage.getItem("token")
                }, 
                body : JSON.stringify(this.formdata)
            })
        .then(response => response.json())
        .then(data => {
            this.$router.go(-1)
        })

    
    }
}
}
