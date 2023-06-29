
$(document).ready(function(){

    loadRevenueOrderStats();
    loadVisitorStats();
    const today = new Date();
    const tomorrow = new Date(new Date().setDate(new Date().getDate() +1));
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    console.log(tomorrow);
    const time = (tomorrow - today) / 1000;  
    console.log("Seconds away from tomorrow : " + time * 1000);
    setInterval(loadRevenueOrderStats, time  * 1000)
    setInterval(loadVisitorStats, time  * 1000)
    var todayVisitors = document.getElementById("todayVisitors");
    var todayVisitorsNum = 0 ;
    var yesterdayVisitorsNum = 0 ; 
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
                status.textContent= "Shipped";
                status.classList.remove("yellow");
                status.classList.add("green");
            }else{
                console.log("IN FALSE")
                status.textContent= "Ordered";
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
            customeraddress.textContent = data.Address.Address + " " + data.Address.PostalCode +  ", Toronto, " +  data.Address.state + ", " + data.Address.Country;
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

    
async function loadVisitorStats(){
    $.ajax({
        type: 'GET',
        url : '/users/last24hours',
    }).then(function(data){
        console.log(data);
        todayVisitors.textContent = data.length;
        todayVisitorsNum = data.length;
        $.ajax({
            type: 'GET',
            url : '/users/yesterday',
        }).then(function(otData){
           /* console.log(otData.length);
            console.log(todayVisitorsNum);
            yesterdayVisitorsNum = otData.length;
            calculation =((todayVisitorsNum/ yesterdayVisitorsNum) * 100)
            calculation = parseInt(calculation -100)
            precentage.textContent =  calculation + "%";
            if (calculation >0){
                precentage.classList.add("green-percentage");

            }
            else if (calculation == 0 ){
                precentage.classList.add("white-precentage");
            }
            else{
                precentage.classList.add("red-percentage");


            }
            */
        })
    })
}

    async function loadRevenueOrderStats(){
        $.ajax({
            type: "GET",
            url : "/orders/today"

        }).then(function(today){
            console.log(today)
            $.ajax({
                type: "GET",
                url : "/orders/yesterday"
            }).then(function(yesterday){
                var order = document.getElementById("orderCount");
                order.textContent = today.length;
                
                var orderPrecentage = document.getElementById("orderPrecentage");
                orderPrecentage.textContent = "+" + (today.length / 1) * 100 + "%"; 
                var total = 0;  
                for(let i = 0 ; i < today.length; i++){
                    total += today[i].total

                }


                var revenue = document.getElementById("revenue");
                revenue.textContent = "$" + total.toFixed(2);
                

            })

        })




    }

});