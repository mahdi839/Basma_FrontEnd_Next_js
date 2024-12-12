import React from "react";

export default function ProductUpload() {
  return (
    <div className="card upload_product">
      <div className="card-header">Upload Product</div>
      <div className="card-body">
        <form action="/action_page.php">
          <div class="form-group">
           
            <input type="text" class="form-control" name="title" placeholder="Title"/>
          </div>
          <div class="form-group">
         
            <input type="text" class="form-control" name="sub_title" placeholder="Subtitle" />
          </div>
          <div class="form-group">
       
            <input type="text" class="form-control" name="description" placeholder="Description" />
          </div>
          <div class="form-group">
           
            <input type="text" class="form-control" name="video_url"  placeholder="Video Url"/>
          </div>

          <div class="form-group">
     
            <input type="text" class="form-control" name="discount"  placeholder="discount"/>
          </div>

          <div class="form-group">
     
            <input type="text" class="form-control" name="question" placeholder="Question" />
          </div>

          <div class="form-group">
          
            <textarea class="form-control" rows="2" name="answer" placeholder="Answer"></textarea>
          </div>
        
          <select class="form-select">
            <option>Size</option>
            <option>sm</option>
            <option>md</option>
            <option>xl</option>
            <option>xxl</option>
          </select>
          <div class="form-group mt-2">
        
            <input type="file"  class="form-control" name="image" />
          </div>
          <button type="submit" class="btn btn-default">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
