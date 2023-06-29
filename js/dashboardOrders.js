
$(document).ready(function(){

    const today = new Date();
    const tomorrow = new Date(new Date().setDate(new Date().getDate() +1));
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    console.log(tomorrow);
    const time = (tomorrow - today) / 1000;  
    console.log("Seconds away from tomorrow : " + time * 1000);
 

    var modal = document.getElementById("edit-product-modal");
    var cartrows = document.getElementsByClassName("cart-rows")[0];
    var orderNo = document.getElementById("orderNo");
    var itemQuantity = document.getElementsByClassName("header-modal-qty")[0];
    var totalItemCost = document.getElementById("total-item-cost");
    var totalCostShippingItems = document.getElementById("total-cost-shipping-items");
    var customername = document.getElementById("customer-name")
    var customeremail = document.getElementById("customer-email")
    var customeraddress = document.getElementById("customer-address")
    var shippingstatus = document.getElementById("shippingstatus")
    var viewOrderForm = document.getElementsByClassName("view-order-form")[0];
    var phoneNumber = document.getElementById("phoneNumber");
    $("#shippingstatus").change(function(){
        var option = shippingstatus.options[shippingstatus.selectedIndex];
        
        console.log(option.value)

        $.ajax({
            type : 'GET',
            url : '/orders/update/shipping/' + option.value + '&' + viewOrderForm.id 
        })
            console.log("hello");
            var status =  document.getElementById(viewOrderForm.id  + "-status")
            if((option.value).localeCompare("true") == 0){
                console.log("IN TRUE")
                status.textContent= "Ready";
                status.classList.remove("yellow");
                status.classList.add("green");
            }else{
                console.log("IN FALSE")
                status.textContent= "Not Ready";
                status.classList.remove("green");
                status.classList.add("yellow");

            }
            
        
       

    })

    $(".link").click(function(){
        modal.style.display = "flex";
        var id = (this.id).slice(0, (this.id).indexOf("-link"));





        $.ajax({
            type : "GET",
            url : "/order/" + id

        }).then(function(data){

            console.log(data);
            viewOrderForm.id = data.id
            orderNo.textContent = "#" + data.id;
            itemQuantity.textContent = "(" +data.Items.length +  " ITEMS)"
            totalItemCost.textContent = data.total;
            totalCostShippingItems.textContent = data.total;
            customername.textContent = data.Customer.name;
            customeremail.textContent = data.Customer.email;
            shippingstatus.value = data.delivery;
            customeraddress.textContent = data.Address.Address + ", " + data.Address.PostalCode +  ", " + data.Address.City + ", " + data.Address.state + ", " + data.Address.Country;
            phoneNumber.textContent = data.Customer.phoneNumber;
            for (let i = 0 ; i < data.Items.length; i++){
                const cartRow = document.createElement("div");
                cartRow.className = "cart-row";
                cartRow.id = data.Items[i].Product.id + "-cartRow";
                
                // Create the image element
                const itemImage = document.createElement("div");
                itemImage.className = "cart-rows-item-image";
                const productImage = document.createElement("img");
                productImage.className = "product-image-cart";
                productImage.src = data.Items[i].Product.Images[0].path ; // Add the image source here
                itemImage.appendChild(productImage);
                
                // Create the name element
                const itemName = document.createElement("div");
                itemName.className = "cart-rows-item-name";
                itemName.textContent = data.Items[i].Product.productName;
                
                // Create the quantity element
                const itemQuantity = document.createElement('div');
                itemQuantity.classList.add('cart-rows-item-quantity');
                itemQuantity.textContent = data.Items[i].quantity;

                
                // Create the price element
                const itemPrice = document.createElement("div");
                itemPrice.className = "cart-rows-item-price";
                itemPrice.textContent = data.Items[i].Product.price;
                
                // Create the total element
                const itemTotal = document.createElement("div");
                itemTotal.className = "cart-rows-item-total";
                itemTotal.textContent =  (data.Items[i].Product.price *  data.Items[i].quantity).toFixed(2);
    
    
                const removeitem = document.createElement("div");
                removeitem.className = "cart-rows-item-remove";

                // Append all the child elements to the parent element
                cartRow.appendChild(itemImage);
                cartRow.appendChild(itemName);
                cartRow.appendChild(itemQuantity);
                cartRow.appendChild(itemPrice);
                cartRow.appendChild(itemTotal);
                cartRow.appendChild(removeitem);
                cartrows.appendChild(cartRow);
    


            }

        })


           



    })

    window.onclick = function(e){
        console.log("END ADADADA")
        
        console.log(e.target);
        if(e.target == modal){
        
            console.log("END ADADADA")
            modal.style.display = "none";
            cartrows.innerHTML ="";

        }


    }


    // START FILTER OPTIONS
    var onoff = false;
    var statusFilter = [];
    var typeFilter =[];
    var searchWord= "";
    var search = document.getElementById("search-word");
    var searchOption  = document.getElementById("search-options");
    search.addEventListener('input', searchHandler);
    search.addEventListener('propertychange', searchHandler);

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
        var statusattribute = document.getElementsByClassName("status-row");
        var typeattribute = document.getElementsByClassName("type-row");
        var searchCol = document.getElementsByClassName(searchOption.value + "-row");
        for (let i = 0; i < statusattribute.length; i++){
            if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) == 0) && ( typeFilter.length == 0 || typeFilter.indexOf((typeattribute[i].textContent).trim()) != -1) && ( statusFilter.length == 0 || statusFilter.indexOf((statusattribute[i].textContent).trim()) != -1)){
                statusattribute[i].parentNode.style.display = "flex";
                console.log("In here")
            }
            else{
                statusattribute[i].parentNode.style.display = "none";
            }
        }
        


    }

    $(document).on("change",".input-filter",function(){
        var statusattribute = document.getElementsByClassName("status-row");
        var typeattribute = document.getElementsByClassName("type-row");
        var searchCol = document.getElementsByClassName(searchOption.value + "-row");
        if (this.checked ==true){
            if (this.name == "type"){
                typeFilter.push(this.value);
            }
            else if(this.name == "status"){
                statusFilter.push(this.value);
            }

            for (let i = 0; i < statusattribute.length; i++){
                if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) != -1) && ( typeFilter.length == 0 || typeFilter.indexOf((typeattribute[i].textContent).trim()) != -1) && ( statusFilter.length == 0 || statusFilter.indexOf((statusattribute[i].textContent).trim()) != -1)){
                    statusattribute[i].parentNode.style.display = "flex";
                }
                else{
                    statusattribute[i].parentNode.style.display = "none";
                }
            }

        }
        else{
            if (this.name == "type"){
                typeFilter.splice(typeFilter.indexOf(this.value), 1);
            }
            else if(this.name == "status"){
                statusFilter.splice(statusFilter.indexOf(this.value), 1);
            }


            for (let i = 0; i < statusattribute.length; i++){
                if(typeFilter.length ==0 && statusFilter.length == 0  && (searchWord.trim()).length == 0){
                    statusattribute[i].parentNode.style.display = "flex";
                }
                else if ( (((searchCol[i].textContent.trim()).toLowerCase()).search((searchWord.trim()).toLowerCase()) != -1) && ( typeFilter.length == 0 || typeFilter.indexOf((typeattribute[i].textContent).trim()) != -1) && ( statusFilter.length == 0 || statusFilter.indexOf((statusattribute[i].textContent).trim()) != -1)){
                    statusattribute[i].parentNode.style.display = "flex";
                }
                else{
                    statusattribute[i].parentNode.style.display = "none";
                }
            }

        }
    
    })


    // END FILTER OPTIONS

});