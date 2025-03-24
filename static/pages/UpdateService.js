export default{
    template:`
    <div class="container">
        <h1 align="center">Update service</h1>
            <div class="mb-3">
              <label for="Username" class="form-label">Name</label>
              <input type="text" class="form-control" id="Username" name="Service_name">
            </div>
            <div class="mb-3">
                <label for="Fullname" class="form-label">Base Price</label>
                <input type="text" class="form-control" id="Fullname" name="Base_price">
            </div>
            <div class="mb-3">
                <label for="Timereq" class="form-label">Time Required</label>
                <input type="text" class="form-control" id="Timereq" name="Timereq">
            </div>
            <div class="mb-3">
                <label for="Description" class="form-label">Description</label>
                <input type="text" class="form-control" id="Description" name="Desc">
            </div>
            <button type="submit" class="btn btn-primary">Add service</button>
            `
}