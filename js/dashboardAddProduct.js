$(document).ready(function(){


    var result = document.getElementById("image-preview");
    var imagecrop = document.getElementById("image-preview-img");
    const photocropper = document.getElementById("photo-cropper");
    var photoUploadPicDrag = document.querySelectorAll('.photo-upload-pic');
    var form = document.getElementById("form-photo-details");
    var cropper = null;
    var main = null;
    var selected = null;
    var freeIndex = 0;
    var addcategorymodal = document.getElementById("add-category-modal");
    var uploaddelete = document.getElementById("upload-delete");
    uploaddelete.addEventListener('dragover', overDrag);
    uploaddelete.addEventListener('dragcenter', enterDrag);
    uploaddelete.addEventListener('dragleave', leaveDrag);
    uploaddelete.addEventListener('drop', dropDrag);
    var uploaddeleteborder = document.getElementById("upload-delete-border");
    var uploaddeletelogo = document.getElementById("upload-delete-logo");
    var uploaddeletetext = document.getElementById("upload-delete-text");
    
    /* var trashcanlogo = document.createElement("i");
    trashcan.classList.add("cloud-logo", "fa-sharp", "fa-solid", "fa-trash");
    
    var uploadlogo = document.createElement("i");
    uploadlogo.classList.add("cloud-logo", "fa-sharp", "fa-solid", "fa-cloud-arrow-up");
    */


    form.addEventListener("submit",onsubmit);
    /* CATEGORY */
    var categoryList = document.getElementById("product-category")
    //var categoryform = document.getElementById("add-category");
    //categoryform.addEventListener("submit",submitCategory);
    const $form = $('#add-category')

    $form.on('submit', submitCategory)
 
  
     function submitCategory(e){
        e.preventDefault();
        
        $.ajax({
            type : 'POST',
            url : "/dashboard/add/category",
            data : $form.serialize(),
            success : function(data){
                return data;
            }

        }).then(function(data){
            console.log(data);
            var option = document.createElement("option");
            option.text = data.categoryName;
            option.value = data.categoryName;
            categoryList.insertBefore(option, categoryList.options[0]);
            categoryList.value = data.categoryName;
            addcategorymodal.style.display = "none";
        })


    }

    $.ajax({
        type : "GET",
        url : "/dashboard/products/getCategories",
        success : function(data){
            
            for (let i = 0 ; i < data.length; i++){

                var option = document.createElement("option");
                option.text = data[i].categoryName;
                option.value = data[i].categoryName;
                if ( i == 0 ){
                    option.selected = true;   
                }
                categoryList.appendChild(option);
            }
            var option = document.createElement("option");
            option.text = "Add category";
            option.value = "addcategory";
            option.id = "add-category";
            categoryList.appendChild(option);
            categoryList.addEventListener('change',addcategory)
                        

        }

    


    })
    function addcategory(e){
        console.log("In here PRODUCT CATEG")
        if (e.target.value == "addcategory"){
            console.log("In here PRODUCT CATEG")
            addcategorymodal.style.display = "flex";
        }
    }
    $("#cancel-category-button").click(function(){
        addcategorymodal.style.display = "none";
        categoryList.value = categoryList.options[0].value
        
    })
    window.onclick = function(e){
        if(e.target == addcategorymodal){
            addcategorymodal.style.display = "none";
            categoryList.value =  categoryList.options[0].value;
        }
       

    }

    /* CATEGORY */

    if($("#unlimitedQuantity").prop('checked') == true || $("#available").prop('checked') == false) {
        console.log("In here");
        $("#quantity").val("N/A");
        $("#quantity").prop('disabled', true);
      



    }

 


    $("#unlimitedQuantity").change(function(){
        console.log("In hereeeee");
        if ($(this).prop('checked') == true){
            $("#quantity").val("N/A");
            $("#quantity").prop('disabled', true);
        }
        else if ($(this).prop('checked') == false && $("#available").prop('checked') == true){
            $("#quantity").val("0");
            $("#quantity").prop('disabled', false);

        } 


    });

    
    $("#available").change(function(){
        console.log("In hereeeee");
        if ($(this).prop('checked') == false ){
            $("#quantity").val("N/A");
            $("#quantity").prop('disabled', true);
        }
        else if ($(this).prop('checked') == true && $("#unlimitedQuantity").prop('checked') == false){
            $("#quantity").val("0");
            $("#quantity").prop('disabled', false);

        } 


    });

    $(".pub").click(function(){
        $("#image-upload").trigger("click");

    });
    
    $("#image-preview").click(function(){
        var cropped = cropper.getCroppedCanvas().toDataURL("image/png");
        selected.src = cropped;
    })

    $("div").on("click",".photo-upload-pic",function(){
        console.log("clicked")
        if(this.src != "" && selected != this){
            if (selected != null){
                selected.classList.remove("black-border");
                selected.classList.add("white-border");
            }
            selected = this;
        if(main != this && this.src != ""){
            console.log("in here")
            this.classList.add("black-border");
        }


        cropper.destroy();
        imagecrop.src = this.src;

      

        cropper = new Cropper(imagecrop, {aspectRatio : 1, center : true});

        }

    });

    function startDrag(){
       
        this.classList.add("dragging");

        uploaddeleteborder.classList.remove("photo-upload-button","pub");
        uploaddeleteborder.classList.add("photo-delete-button"); 
        uploaddeletelogo.classList.remove("fa-cloud-arrow-up");
        uploaddeletelogo.classList.add("fa-trash");        
        uploaddeletetext.textContent ="Remove";

        dragging = this; 
    }
    function endDrag(){

  
        this.classList.remove("dragging");
        uploaddeleteborder.classList.remove("photo-delete-button");
        uploaddeleteborder.classList.add("photo-upload-button","pub"); 
        uploaddeletelogo.classList.remove("fa-trash");
        uploaddeletelogo.classList.add("fa-cloud-arrow-up");        
        uploaddeletetext.textContent ="Upload";
        dragging = null; 
    }
    
    function enterDrag(e){
        e.preventDefault();

    }
    function overDrag(e){
        e.preventDefault();
    }
    function leaveDrag(e){
       
    }
    function dropDrag(e){

      if(this == uploaddelete)  {
        if(document.getElementsByClassName("photo-upload-pic").length > 3){
            this.parentNode.removeChild(dragging.parentNode);
            
        }
        else{
            console.log("in ELSE ");
            this.parentNode.removeChild(dragging.parentNode);
            var photoUploadContainer = document.createElement("div");
            var photoUploadPic = document.createElement("img");
            photoUploadContainer.classList.add("photo-uploud-container");
            photoUploadPic.classList.add("photo-upload-pic","white-border");
            photoUploadPic.draggable = true;
            photoUploadContainer.appendChild(photoUploadPic);
            document.getElementsByClassName("photo-upload")[0].appendChild(photoUploadContainer);
            
            
            if(document.getElementsByClassName("photo-upload-pic")[0].src == ""){
                cropper.destroy();
                imagecrop.src = null;
                cropper=null;
                $("#photo-cropper").css({"display" : "flex"});
                $("#image-preview").css({"display" : "none"});
                main = null;
                selected=null;
                
                
            }


        }
       
        if((dragging == main) && document.getElementsByClassName("photo-upload-pic")[0].src != ""){
            console.log("in HERRRE!!")
            let label = document.createElement("div");
            (document.getElementsByClassName("photo-upload-pic")[0]).classList.remove("white-border");
            (document.getElementsByClassName("photo-upload-pic")[0]).classList.add("blue-border");
            label.classList.add("main-photo-upload-text");
            main =  (document.querySelectorAll('.photo-uploud-container')[0]).getElementsByClassName("photo-upload-pic")[0];
            label.textContent = "Main";
            main.parentNode.insertBefore(label,main);
            if (selected == main){
                main.classList.remove("black-border");
                main.classList.add("blue-border");
            }
            if(selected == dragging){
                cropper.destroy();
                imagecrop.src = main.src;
                cropper = new Cropper(imagecrop, {aspectRatio : 1, center : true});
                selected = main;

            }

        }
    
        if (dragging == selected){
            cropper.destroy();
            imagecrop.src = main.src;
            cropper = new Cropper(imagecrop, {aspectRatio : 1, center : true});
            selected = main;

        }


        freeIndex--;
      }
      else if(dragging.parentNode != this){
        const dragger = dragging;
        const parent = dragging.parentNode;
        var temp = this;
        var indexThis =null;
        var indexDrag = null;

        for( let i = 0 ; i < (document.querySelectorAll('.photo-uploud-container')).length; i++){
            if(document.querySelectorAll('.photo-uploud-container')[i] == this){
                indexThis = i;

            }
            if(document.querySelectorAll('.photo-uploud-container')[i] == parent){

                indexDrag =i;
            }


        }


        console.log("indexThis - " + indexThis)
        console.log("indexDrag - " + indexDrag)
        this.parentNode.removeChild(dragging.parentNode);


        if(indexThis < indexDrag){
            this.parentNode.insertBefore(parent, this);
        }
        else if (indexDrag < indexThis){
            console.log(this.nextElementSibling );
            this.parentNode.insertBefore(parent, this.nextElementSibling);
        }
        
        if (document.querySelectorAll('.photo-uploud-container')[0] != main){
            main.classList.remove("blue-border");
            main.classList.add("white-border");
            main.parentNode.removeChild(main.parentNode.getElementsByClassName("main-photo-upload-text")[0])

            let label = document.createElement("div");
            label.classList.add("main-photo-upload-text");

            
            main =  (document.querySelectorAll('.photo-uploud-container')[0]).getElementsByClassName("photo-upload-pic")[0];
            label.textContent = "Main";
            main.parentNode.insertBefore(label,main);
            if (main == selected){
                main.classList.remove("black-border");

            }
            else{
                selected.classList.add("black-border");
            }
            main.classList.add("blue-border");
        }
    }

    }

   
    $("#image-upload").change(function(){
        console.log("In ImageUPload")
        var file = $(this).prop('files');
        
        /*
        if(cropper != null){

            cropper.destroy();
            cropper = null;
        }
        */

        if(file[0]){
            console.log("file.length" + file.length);
            for(let i = 0 ; i < file.length; i++ ){
                let reader = new FileReader();
                reader.onload = function(event){
                
            
                    $("#photo-cropper").css({"display" : "none"});
                    $("#image-preview").css({"display" : "block"});
                    
                    console.log("freeIndex sdfg- " + freeIndex);
                    console.log("length - " + (document.querySelectorAll('.photo-upload-pic')).length);
                    
                    if ((document.querySelectorAll('.photo-upload-pic')).length == freeIndex){
                        var photoUploadContainer = document.createElement("div");
                        var photoUploadPic = document.createElement("img");
                        photoUploadContainer.classList.add("photo-uploud-container");
                        photoUploadPic.classList.add("photo-upload-pic","white-border");
                        photoUploadPic.draggable = true;
                        photoUploadContainer.appendChild(photoUploadPic);
                        document.getElementsByClassName("photo-upload")[0].appendChild(photoUploadContainer);
                        //photoUploadContainer.appendChild(label);
                     
                        

                    }

                    console.log("(document.querySelectorAll('.photo-upload-pic')).length - " + (document.querySelectorAll('.photo-upload-pic')).length);

                    document.querySelectorAll('.photo-upload-pic')[freeIndex].src = event.target.result;
                   ($('.photo-upload-pic')[freeIndex]).addEventListener('dragstart', startDrag);
                   ($('.photo-upload-pic')[freeIndex]).addEventListener('dragend', endDrag);
                   ($('.photo-uploud-container')[freeIndex]).addEventListener('dragover', overDrag);
                   ($('.photo-uploud-container')[freeIndex]).addEventListener('dragcenter', enterDrag);
                   ($('.photo-uploud-container')[freeIndex]).addEventListener('dragleave', leaveDrag);
                   ($('.photo-uploud-container')[freeIndex]).addEventListener('drop', dropDrag);
                    if(cropper == null){
                    imagecrop.src = event.target.result;
                    cropper = new Cropper(imagecrop, {aspectRatio : 1, center : true});
                    }
                    if(main == null){
                        console.log("freeIndex - " + freeIndex);
                        main = document.querySelectorAll('.photo-upload-pic')[freeIndex];
                        main.classList.add("blue-border");
                        let label = document.createElement("div");
                        label.classList.add("main-photo-upload-text");
                        label.textContent = "Main";
                        (main.parentNode).insertBefore( label,main);
                        selected = main;
                    }
                    freeIndex++;
                }
                reader.readAsDataURL(file[i]);
               
                
                
            }

    
        }

    });


    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
   }))




function dataURLtoFile(dataurl, filename) {
   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
   bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
   while(n--){
   u8arr[n] = bstr.charCodeAt(n);
   }
 return new File([u8arr], filename, {type:mime});
}

async function onsubmit(e){
        e.preventDefault();

        
        const formData = new FormData(this);
        
       for(let i = 0 ; i < $(".photo-upload-pic").length; i++){
      
           await toDataURL($(".photo-upload-pic")[i].src)
            .then(dataUrl => {
               var fileData =  dataURLtoFile(dataUrl, "imageupload" + i);
              console.log(fileData);
              formData.append( 'imageupload', fileData);


             });
             
             
        }       

        $.ajax({
            type : "POST",
            url : "/dashboard/products/add",
            data : formData,
            processData: false,
            contentType: false,
            success : function(data){
                window.location = "/dashboard/products"
            }

        }); 



   


   
    };










});