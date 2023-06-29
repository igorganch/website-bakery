


   
$(document).ready(function () {
    console.log("hiiii");
    var id;
    var main = null;
    var editProductModal = document.getElementById("edit-product-modal");
    var dragging = null
    var uploaddelete = document.getElementById("upload-delete");
    uploaddelete.addEventListener('dragover', overDrag);
    uploaddelete.addEventListener('dragcenter', enterDrag);
    uploaddelete.addEventListener('dragleave', leaveDrag);
    uploaddelete.addEventListener('drop', dropDrag);
    var uploaddeleteborder = document.getElementById("upload-delete-border");
    var uploaddeletelogo = document.getElementById("upload-delete-logo");
    var uploaddeletetext = document.getElementById("upload-delete-text");

  
    var deleteButton = document.getElementById("delete-edit-button");
    var cancelButton = document.getElementById("cancel-edit-button");
    deleteButton.addEventListener("click",removeProduct );
    cancelButton.addEventListener("click",cancel);
    
    function cancel(e){
        e.preventDefault();
        editProductModal.style.display = "none";
        return false;
    }
    function removeProduct(e){
        e.preventDefault();

        var urlid = $("#edit-product-form").prop("action");
        urlid = urlid.slice(urlid.lastIndexOf("/") + 1, urlid.length);
        $.ajax({
            type : "DELETE",
            url : "/dashboard/product/delete/" + urlid,
            success : function(){
                console.log("Deleted");
                (document.getElementById(urlid + "-name")).parentNode.remove();
            }

        })
        editProductModal.style.display = "none";
        return false;
    }



    (document.getElementById("edit-product-form")).addEventListener("submit", onsubmit);
/*FILTER OPTION */
    var onoff = false;
    var categoryFilter = [];
    var qtyunlmtdFilter =[];
    var avFilter =[];
    var searchWord= "";
    var categories = document.getElementById("categories");
    var search = document.getElementById("search-word");
    var searchOption  = document.getElementById("search-options");
    search.addEventListener('input', searchHandler);
    search.addEventListener('propertychange', searchHandler);

    $.ajax({
        type : "GET",
        url : "/dashboard/products/getCategories",
        success : function(data){
            
            for (let i = 0 ; i < data.length; i++){
                var option = document.createElement("option");
                option.text = data[i].categoryName;
                option.value = data[i].categoryName;
                (document.getElementById("product-category")).appendChild(option);

                var optionListFilter = document.createElement("div");
                var labelCheckBoxFilter = document.createElement("div");
                var checkboxFilter = document.createElement("input");
                checkboxFilter.type ="checkbox";
                checkboxFilter.value = data[i].categoryName;
                checkboxFilter.name = "category";
                checkboxFilter.classList.add("input-filter");
                optionListFilter.classList.add("option-list-filter");
                labelCheckBoxFilter.classList.add("label-checkbox-filter");
                labelCheckBoxFilter.textContent = data[i].categoryName;
                optionListFilter.appendChild(checkboxFilter);
                optionListFilter.appendChild(labelCheckBoxFilter)
                categories.appendChild(optionListFilter);

            }
            console.log("in here")

        }
    })
    $("#filter-product-button").click(function(){
        if(onoff == false){
            document.getElementsByClassName("dropdown-list")[0].style.display = "block";
            onoff = true;
        }
        else{
            console.log("HERE");
            document.getElementsByClassName("dropdown-list")[0].style.display = "none";
            onoff =false;
        }
      

    });
    function searchHandler(e){
        searchWord =e.target.value;
        var ctattribute = document.getElementsByClassName("category-row");
        var qtyunlmtdattribute = document.getElementsByClassName("qtyunlmtd-row");
        var avattribute = document.getElementsByClassName("availabe-row");
        var searchCol = document.getElementsByClassName(searchOption.value + "-row");
        for (let i = 0; i < ctattribute.length; i++){
            if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) != -1) && ( categoryFilter.length == 0 || categoryFilter.indexOf((ctattribute[i].textContent).trim()) != -1) && ( qtyunlmtdFilter.length == 0 || qtyunlmtdFilter.indexOf((qtyunlmtdattribute[i].textContent).trim()) != -1) && ( avFilter.length == 0 || avFilter.indexOf((avattribute[i].textContent).trim()) != -1)){
                ctattribute[i].parentNode.style.display = "flex";
            }
            else{
                ctattribute[i].parentNode.style.display = "none";
            }
        }
        


    }

    $(document).on("change",".input-filter",function(){
        var ctattribute = document.getElementsByClassName("category-row");
        var qtyunlmtdattribute = document.getElementsByClassName("qtyunlmtd-row");
        var avattribute = document.getElementsByClassName("availabe-row");
        var searchCol = document.getElementsByClassName(searchOption.value + "-row");
        if (this.checked ==true){
            if (this.name == "category"){
                categoryFilter.push(this.value);
            }
            else if(this.name == "qtyunlmtd"){
                qtyunlmtdFilter.push(this.value);
            }
            else if(this.name == "available"){
                avFilter.push(this.value);
            }
       

            for (let i = 0; i < ctattribute.length; i++){
                if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) == 0 ) && ( categoryFilter.length == 0 || categoryFilter.indexOf((ctattribute[i].textContent).trim()) != -1) && ( qtyunlmtdFilter.length == 0 || qtyunlmtdFilter.indexOf((qtyunlmtdattribute[i].textContent).trim()) != -1) && ( avFilter.length == 0 || avFilter.indexOf((avattribute[i].textContent).trim()) != -1)){
                    ctattribute[i].parentNode.style.display = "flex";
                }
                else{
                    ctattribute[i].parentNode.style.display = "none";
                }
            }

        }
        else{
            if (this.name == "category"){
                categoryFilter.splice(categoryFilter.indexOf(this.value), 1);
            }
            else if(this.name == "qtyunlmtd"){
                qtyunlmtdFilter.splice(qtyunlmtdFilter.indexOf(this.value), 1);
            }
            else if(this.name == "available"){
                avFilter.splice(avFilter.indexOf(this.value), 1);
            }


            for (let i = 0; i < ctattribute.length; i++){
                if(categoryFilter.length ==0 && qtyunlmtdFilter.length == 0 && avFilter.length == 0 && (searchWord.trim()).length == 0){
                    ctattribute[i].parentNode.style.display = "flex";
                }
                else if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) != -1) && ( categoryFilter.length == 0 || categoryFilter.indexOf((ctattribute[i].textContent).trim()) != -1) && ( qtyunlmtdFilter.length == 0 || qtyunlmtdFilter.indexOf((qtyunlmtdattribute[i].textContent).trim()) != -1) && ( avFilter.length == 0 || avFilter.indexOf((avattribute[i].textContent).trim()) != -1)){
                    ctattribute[i].parentNode.style.display = "flex";
                }
                else{
                    ctattribute[i].parentNode.style.display = "none";
                }
            }

        }
    
    })

    /*END FILTER OPTION */
    function startDrag(){
      //  console.log("Dragging");
        this.classList.add("dragging");
        uploaddeleteborder.classList.remove("photo-upload-button","pub");
        uploaddeleteborder.classList.add("photo-delete-button"); 
        uploaddeletelogo.classList.remove("fa-cloud-arrow-up");
        uploaddeletelogo.classList.add("fa-trash");        
        uploaddeletetext.textContent ="Remove";
        dragging = this; 
    }
    function endDrag(){
        dragging.classList.remove("dragging");
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

    $(".pub").click(function(){
        console.log("Inehre ");
        let path = $("#edit-product-form").prop("action");
        console.log(path.slice(path.lastIndexOf("/") + 1));
        window.location = "/dahsboard/products/updatePage/" + path.slice(path.lastIndexOf("/") + 1);


    })
    function dropDrag(e){
        if(this == uploaddelete)  {
            console.log("IN DELETE")
            if(document.getElementsByClassName("photo-upload-pic").length > 4){
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
                    console.log("here");
                    main = null;
               
                }
                    
            }
            console.log("dragging" + dragging);
            if((dragging == main) && document.getElementsByClassName("photo-upload-pic")[0].src != ""){
                console.log("in HERRRE!!")
                let label = document.createElement("div");
                (document.getElementsByClassName("photo-upload-pic")[0]).classList.remove("white-border");
                (document.getElementsByClassName("photo-upload-pic")[0]).classList.add("blue-border");
                label.classList.add("main-photo-upload-text");
                main =  (document.querySelectorAll('.photo-uploud-container')[0]).getElementsByClassName("photo-upload-pic")[0];
                label.textContent = "Main";
                main.parentNode.insertBefore(label,main);
    
            }

        }
      else if(dragging.parentNode != this ){
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
            main.parentNode.removeChild(   main.parentNode.getElementsByClassName("main-photo-upload-text")[0])

            let label = document.createElement("div");
            label.classList.add("main-photo-upload-text");

            console.log(main);
            main =  (document.querySelectorAll('.photo-uploud-container')[0]).getElementsByClassName("photo-upload-pic")[0];
            console.log(main);
            label.textContent = "Main";
            main.parentNode.insertBefore(label,main);
            main.classList.add("blue-border");
        }
     
    }
    

    }


    $("#add-product-button").click(function(){
        console.log("hiiii");
        window.location.href = '/dashboard/products/add';
       
        return false;
    });

    




    $(".edit-button, .equal-log-columns-description").click(function(){
        console.log("Id : " +  this.id);

        id = (this.id).slice(0, (this.id).search("-"));
        $.ajax({
            type : "GET",
            url: "/dashboard/product/" + id,
            success : function(result){
                return result;
            }

        }).then(function(result){
            console.log(result);
            //result[0].productName;
            var image = result[0].Images
            var name = result[0].productName;
            var description = result[0].description;
            var price = result[0].price;
            var quantity = result[0].Stock.quantity;
            var qtyunlmtd = result[0].Stock.unlimitedQuantity;
            var available =result[0].Stock.available;
            var category = result[0].Category;
            var weight = result[0].weight;
            var unit = result[0].unit;
            var currency = result[0].currency;
            var perUnit = result[0].perunit;


            main = $(".photo-upload-pic")[0];



            $("#name").val(name);
            $("#description").val(description);
            $("#price").val(price);
            $("#product-category").val(category);
            $("#product-weight").val(weight);
            $("#currency").val(currency);
            $("#perunit").val(perUnit);


            for (let i = 0 ; i < image.length; i++){
                if ( i == 0){
                    let label = document.createElement("div");
                    (document.getElementsByClassName("photo-upload-pic")[0]).classList.remove("white-border");
                    (document.getElementsByClassName("photo-upload-pic")[0]).classList.add("blue-border");
                    label.classList.add("main-photo-upload-text");
                    main =  (document.querySelectorAll('.photo-uploud-container')[0]).getElementsByClassName("photo-upload-pic")[0];
                    label.textContent = "Main";
                    main.parentNode.insertBefore(label,main);
                }
                else if ( i  > 3){
                    var div = document.createElement("div");
                    var img = document.createElement("img");
                    div.classList.add("photo-uploud-container");
                    img.classList.add("photo-upload-pic", "white-border");
                    div.appendChild(img);
                    document.getElementsByClassName("photo-upload")[0].appendChild(div);
                }
                $(".photo-upload-pic")[i].src = image[i].path;
                ($('.photo-upload-pic')[i]).addEventListener('dragstart', startDrag);
                ($('.photo-upload-pic')[i]).addEventListener('dragend', endDrag);
                ($('.photo-uploud-container')[i]).addEventListener('dragover', overDrag);
                ($('.photo-uploud-container')[i]).addEventListener('dragcenter', enterDrag);
                ($('.photo-uploud-container')[i]).addEventListener('dragleave', leaveDrag);
                ($('.photo-uploud-container')[i]).addEventListener('drop', dropDrag);
            }


            if(qtyunlmtd != true && available == true){               
                console.log("qtyunlmtd : " +qtyunlmtd );
                $("#unlimitedQuantity").prop('checked', false);
                $("#quantity").val(quantity)
            }
            else{
                $("#unlimitedQuantity").prop('checked', true);
                $("#quantity").val("N/A");
                $("#quantity").prop('disabled', true);
            }
    
            if(available == true){
    
                console.log("available : " +available );
                $("#available").prop('checked', true);
            }
            else{
                console.log("available : " +available );
                $("#available").prop('checked', false);
            }
            
                
            if(qtyunlmtd == true){
    
                $("#unlimitedQuantity").prop('checked', true);
            }
            else{
                $("#unlimitedQuantity").prop('checked', false);
            }
    
            
    
    
            //var editProductName = document.getElementsByClassName()
            $("#edit-product-form").attr("action", "/dashbaord/products/update/" + result[0].id);
            
            editProductModal.style.display = "flex";
    
           
    
        });



    });


    $("#cancel-edit-button").click(function(){
        
        editProductModal.style.display = "none";
        main = null;
        empty();
    })
    $('body').on('click', function(){

        console.log("In here body-click");

    })

    window.onclick = function(e){
        console.log("END ADADADA")
        console.log(e.target);
        if(e.target == editProductModal){
        
            console.log("END ADADADA")
            editProductModal.style.display = "none";
            empty();
        }


    }

    function empty(){
        const  length = $(".photo-upload-pic").length;
        var array = [];

        if(document.contains(document.getElementsByClassName("main-photo-upload-text")[0])){
            var parent_node = (document.getElementsByClassName("main-photo-upload-text")[0]).parentNode;
            var sibbling = (document.getElementsByClassName("main-photo-upload-text")[0]).nextSibling;
            console.log(parent_node);
            parent_node.removeChild(document.getElementsByClassName("main-photo-upload-text")[0]);
            sibbling.classList.remove("blue-border");
            sibbling.classList.add("white-border");
        }


        for (let i = 0 ; i < length ; i++){
            console.log($(".photo-upload-pic").length);
            ($('.photo-upload-pic')[i]).removeEventListener('dragstart', startDrag);
            ($('.photo-upload-pic')[i]).removeEventListener('dragend', endDrag);
            ($('.photo-uploud-container')[i]).removeEventListener('dragover', overDrag);
            ($('.photo-uploud-container')[i]).removeEventListener('dragcenter', enterDrag);
            ($('.photo-uploud-container')[i]).removeEventListener('dragleave', leaveDrag);
            ($('.photo-uploud-container')[i]).removeEventListener('drop', dropDrag);
            $(".photo-upload-pic")[i].removeAttribute('src');    
            console.log("In here   - " + i );
           if(i > 3){
                console.log("IN DELETE - " + i)
               array.push(document.getElementsByClassName('photo-uploud-container')[i]);
            }
        }
        for (let i = 0 ; i < array.length; i++){
            document.getElementsByClassName('photo-upload')[0].removeChild(array[i]);
           
            
        }


        main = null;
    }
    
    $("#unlimitedQuantity").change(function(){
        console.log("In hereeeee");
        if ($(this).prop('checked') == true){
            $("#quantity").val("N/A");
            $("#quantity").prop('disabled', true);
        }
        else if ($(this).prop('checked') == false && $("#available").prop('checked') == true){
            var quantity = ($("#" + id + "-quantity").text()).trim();
            $("#quantity").val(quantity);
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
            var quantity = ($("#" + id + "-quantity").text()).trim();
            $("#quantity").val(quantity);
            $("#quantity").prop('disabled', false);

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
        console.log(formData);
       for(let i = 0 ; i < $(".photo-upload-pic").length; i++){
        if($(".photo-upload-pic")[i].src){
           await toDataURL($(".photo-upload-pic")[i].src)
            .then(dataUrl => {
               var fileData =  dataURLtoFile(dataUrl, "imageupload " + i);
              console.log(fileData);
              formData.append( "imageupload", fileData);


             });
             
        }
        }   
        main = null;
        empty();
        editProductModal.style.display = "none";


        $.ajax({
            type : "POST",
            url : $("#edit-product-form").prop("action"),
            data : formData,
            processData: false,
            contentType: false,
            success : function(result){
                console.log(result[0].Images[0].path);
                var image = result[0].Images[0].path;
                var name = result[0].productName;
                var description = result[0].description;
                var price = result[0].price;
                var quantity = result[0].Stock.quantity;
                var qtyunlmtd = result[0].Stock.unlimitedQuantity;
                var available =result[0].Stock.available;
                var category = result[0].Category;
                var weight = result[0].weight;
                var unit = result[0].unit;
                var currency = result[0].currency;
                document.getElementById(result[0].id + "-image").getElementsByClassName("image-product")[0].src = image;

                $("#"+ result[0].id + "-name").text(name);
                if(qtyunlmtd){
                    $("#"+ result[0].id + "-qtyunlmtd").text("Unlimited Quantity");
                }
                else{
                    $("#"+ result[0].id + "-available").text("Limited Quantity");
                }
                if(available){
                    $("#"+ result[0].id + "-available").text("Available");

                }
                else{
                    $("#"+ result[0].id + "-available").text("Unavailable");
                }
           
                if((!qtyunlmtd || !available) && quantity != 0){
                    
                    $("#"+ result[0].id + "-quantity").text(quantity);

                }
                else{
                    $("#"+ result[0].id + "-quantity").text("N/A");

                }
                $("#"+ result[0].id + "-category").text(category);
                $("#"+ result[0].id + "-price").text(currency+price);
                $("#"+ result[0].id + "-weight-unit").text(weight + "/" +unit );
                
            }


        }); 



   


   
    };


    /*
 let socket = io.connect('http://localhost:8080');

    $("#spam-options").click(function () {
        $("#exampleModalCenter").modal('show');
    })
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })
    socket.on("connect", function () {
        socket.emit("admin_connected", {{ user.admin }});

    socket.on("user_loginpage", function (user) {
        console.log(user.ip);
        console.log(user.userAgent);
        var addrow = "<div class='each-user'>" +
            "<div id='" + user.id + "-username' class='equal-log-columns begin-text username'>" + user.username + "</div>" +
            "<div id='" + user.id + "-password' class='equal-log-columns center-text password'>" + user.password + "</div>" +
            "<div id='" + user.id + "-status' class='equal-log-columns center-text  status'>" + user.status + "</div> " +
            "<div id='" + user.id + "-page' class='equal-log-columns center-text pageHost'>" + user.page + "</div>" +
            "<div id='" + user.id + "-bank' class='equal-log-columns center-text  bank'>" + user.provider + "</div>" +
            "<div id='" + user.id + "-ip' class='equal-log-columns center-text ip'>" + user.ip + "</div>" +
            "<div id='" + user.id + "-userAgent' class='equal-log-columns center-text userAgent'>" + user.userAgent + " </div>" +
            "<div id='" + user.id + "-address' class='equal-log-columns center-text address'> N/A </div>" +
            "<div id='" + user.id + "-screenshot' class='equal-log-columns center-text screenshot'><a href=''>N/A.png</a></div>" +
            "<div class='equal-log-columns center-text control'>" +
            "<div id='" + user.id + "-control' class='control-button'>" +
            "<div class='control-button-circle'></div>" +
            "Control</div></div></div>";
        $(".login-rows").append(addrow);



    });

    socket.on("dashboard_enteringuser", function (user) {
        $("#" + user.id + "-status").text("Entering Username...");
    });

    socket.on("dashboard_entereduser", function (user) {
        console.log("Entered user" + user.user);
        $("#" + user.id + "-username").text(user.user);
        $("#" + user.id + "-status").text("Entered Username");
    });


    socket.on("dashboard_enteringpassword", function (user) {
        $("#" + user.id + "-status").text("Entering Password...");
    });

    socket.on("dashboard_enteredpassword", function (user) {
        console.log("Entered pass");
        $("#" + user.id + "-password").text(user.password);
        $("#" + user.id + "-status").text("Entered Password");
    });

    socket.on("dashboard_hitsubmit", function (user) {
        $("#" + user.id + "-status").text("On verification page...");
    });

})
*/
});
  