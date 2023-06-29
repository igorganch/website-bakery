$(document).ready(function(){
console.log("Script loaded")
var cartSubTotal = 0; 
var total = 0; 
var totalprice = document.getElementsByClassName("total-price")[0];
//CART MODAL
var modal = document.getElementById("user-cart-modal");
var returnbutton = document.getElementsByClassName("return")[0];
var numberitems = document.getElementById("number-items");
var costitems = document.getElementById("cost-items");
var cartrows = document.getElementsByClassName("cart-rows")[0];
var shippingoptions = document.getElementById("shipping-options");
var totalshippingcost = document.getElementById("total-shipping-cost");
var totalitemcost = document.getElementById("total-item-cost");
var totalcostshippingitems = document.getElementById("total-cost-shipping-items");
//CART MODAL


//var subtotal = document.getElementsByClassName("subtotal")[0];
var cookieId;
/*
let socket = io.connect('http://localhost:8080');



socket.on("connect", function(){
    let cookie = decodeURIComponent(document.cookie);
    console.log(cookie)
    cookie = cookie.slice(cookie.indexOf("{") + 1,cookie.length);
    cookie = cookie.slice(cookie.indexOf("{") + 1,cookie.length);
    var regex =  /[}]/g        
    cookie = cookie.replace(regex, "");
    console.log(cookie)

    var user = {};
    
    do{
        let first = cookie.indexOf('"');
        let second = cookie.indexOf('"', first + 1 );
        let key = cookie.slice(first + 1, second);
        cookie = cookie.slice(second + 1, cookie.length);
        
        first = cookie.indexOf('"');
        second = cookie.indexOf('"', first + 1 );
        let value = cookie.slice(first + 1, second);
        cookie = cookie.slice(second + 1, cookie.length);
        user[key] = value;

    }while(cookie.length !=0);
    

    cookieId  = user[cookie];
    user.status = "Home"
    
    socket.emit("user_on_menu_page", user);
    

})
*/




$(document).on('click','.remove-page',function(){
    
    console.log("In here");
    var regex = /[0-9]/ 
    var item =  this.parentNode.parentNode;
    var id =  (item.id).slice(0, (item.id).indexOf("-cartItem"));
    var quantity = parseInt(item.getElementsByClassName("cart-quantity")[0].textContent);
    var price = item.getElementsByClassName("cart-total")[0].textContent;
    price = parseFloat(price.slice(price.search(regex), price.length));
    totalprice.textContent = (parseFloat(totalprice.textContent) - (price * quantity)).toFixed(2);
    //subtotal.textContent =  totalprice.textContent;
    item.remove();

    $.ajax({
        type: 'DELETE',
        url : '/delete/cart/' + id,
    }).then(function(){
        console.log("success"); 
    })


});


$(".add-to-cart").click(function(){
    console.log("In here");
    var id = (this.id).slice(0, (this.id).indexOf("-product"));
    var name  = document.getElementById(id + "-name").textContent;
    var price  = document.getElementById(id + "-price").textContent;
    console.log(id);


    var regex = /[0-9]/ 


    if (document.getElementById(id + "-cartItem") != null){
        var item = document.getElementById(id + "-cartItem");
        var itemQuantity = item.getElementsByClassName("cart-quantity")[0];
        var price = item.getElementsByClassName("cart-total")[0].textContent;
        price = parseFloat(price.slice(price.search(regex), price.length));
        console.log(price);
        var quantity = itemQuantity.getElementsByClassName("item-quantity-input-page")[0];
        quantity.value = parseInt(quantity.value)  + 1 ;

        totalprice.textContent = (parseFloat(totalprice.textContent) + price).toFixed(2);
        //subtotal.textContent =  totalprice.textContent;

    }else{

    var cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.id = id + "-cartItem";


    const cartQuantityDiv = document.createElement('div');
    cartQuantityDiv.classList.add('cart-quantity');
    const plusIcon = document.createElement('i');
    plusIcon.classList.add('fa-sharp', 'fa-solid', 'fa-plus', 'fa-sm', 'add-page-cart');
    const quantityInput = document.createElement('input');
    quantityInput.classList.add('item-quantity-input-page');
    quantityInput.type = 'number';
    quantityInput.name = 'quantity';
    quantityInput.value = 1;
    const minusIcon = document.createElement('i');
    minusIcon.classList.add('fa-sharp', 'fa-solid', 'fa-minus', 'fa-sm', 'minus-page-cart');
    cartQuantityDiv.appendChild(plusIcon);
    cartQuantityDiv.appendChild(quantityInput);
    cartQuantityDiv.appendChild(minusIcon);

    var cartProduct = document.createElement("div");
    cartProduct.classList.add("cart-product");
    cartProduct.textContent = name;
   
    var cartTotal = document.createElement("div");
    cartTotal.classList.add("cart-total");
    cartTotal.textContent = price;

       
    var cartEdit = document.createElement("div");
    cartEdit.classList.add("cart-edit");

    var iedit = document.createElement("i");
    iedit.classList.add("fa-sharp" ,"fa-solid", "fa-pen-to-square", "changecolor", "fa-sm");

    var idelete = document.createElement("i");
    idelete.classList.add("fa-sharp" ,"fa-solid", "fa-xmark", "changecolor","fa-sm");    

    cartEdit.appendChild(iedit);
    cartEdit.appendChild(idelete);
    cartItem.appendChild(cartQuantityDiv);
    cartItem.appendChild(cartProduct);
    cartItem.appendChild(cartTotal);
    cartItem.appendChild(cartEdit);
   
    document.getElementsByClassName("cart")[0].appendChild(cartItem);
    
    price = parseFloat(price.slice(price.search(regex), price.length));
    totalprice.textContent = (parseFloat(totalprice.textContent) + price).toFixed(2);
    //subtotal.textContent =  totalprice.textContent;

    }

    $.ajax({
        type: 'GET',
        url : '/add/cart/' + id,
    }).then(function(){
        console.log("success"); 
    })
    



});








$(document).on('click','.add-page-cart',function(){
    
    var quantity = this.parentNode.getElementsByClassName("item-quantity-input-page")[0];
    
    quantity.value = parseInt(quantity.value) + 1;
    
    var id = this.parentNode.parentNode.id;
    id = (id).slice(0, (id).indexOf("-cartItem"));

    $.ajax({
        type: 'GET',
        url : '/add/cart/' + id,
    }).then(function(){
        console.log("success"); 
    })
    
    calculatePage();



})

$(document).on('click','.minus-page-cart',function(){
    
    var quantity = this.parentNode.getElementsByClassName("item-quantity-input-page")[0];
    quantity.value = parseInt(quantity.value) - 1;
    var item =  this.parentNode.parentNode;
    var id =  (item.id).slice(0, (item.id).indexOf("-cartItem"));
    if (quantity.value == 0){
        $.ajax({
            type: 'DELETE',
            url : '/delete/cart/' + id,
        }).then(function(){
            console.log("success"); 
        })
        item.remove();
    }
    else{
        $.ajax({
            type: 'GET',
            url :'/update/cart/' + id +'&' +  quantity.value

        }).then(function(){
            console.log("success"); 
        })

    }

    calculatePage();
    



})



  
$(document).on('focusout','.item-quantity-input-page',function(){

    var id = this.parentNode.parentNode.id;
    id = (id).slice(0, (id).indexOf("-cartItem"));
    if(this.value < 0 || !this.value){
        this.value = 1;
        $.ajax({
            type: 'GET',
            url :'/update/cart/' + id +'&' + this.value

        })
    }
    else if (this.value ==0){
        this.parentNode.parentNode.remove();
        $.ajax({
            type: 'DELETE',
            url : '/delete/cart/' + id,
        }).then(function(){
            console.log("success"); 
        })
    }
    else{
        $.ajax({
            type: 'GET',
            url :'/update/cart/' + id +'&' + this.value

        })

    }
  
    calculatePage();
    

})
$(document).on('input propertychange','.item-quantity-input-page',function(){
    

    calculatePage();
    

 
    
});

function calculatePage(){
    var item = document.getElementsByClassName("cart-item");
    var fulltotal = 0.00;

    var regex = /[0-9]/ 
    console.log("item - " + item.length)
    for (let i = 0 ; i < item.length; i++){

        var price = item[i].getElementsByClassName("cart-total")[0].textContent;
        price = parseFloat(price.slice(price.search(regex), price.length));
        var quantity = item[i].getElementsByClassName("item-quantity-input-page")[0].value;
        console.log("In here")
        fulltotal += price * quantity;
    }
        totalprice.textContent = fulltotal.toFixed(2);        

}



//////// CART MODAL LOGIC

$("#shipping-options").change(function(){
    var option = shippingoptions.options[shippingoptions.selectedIndex];
    totalshippingcost.textContent = option.value;
    totalcostshippingitems.textContent = (parseFloat(costitems.textContent) + parseFloat(option.value)).toFixed(2);

    $.ajax({
        url : "/updateDelivery/" + $(shippingoptions.options[shippingoptions.selectedIndex]).attr("name"),
        type : "GET"

    }).then(function(){

        console.log("success")
    })
    
})


$(".fa-cart-shopping").click(function(){

    $.ajax({
        type: 'GET',
        url: '/cart',
    }).then(function(data){
        console.log(data);
        costitems.textContent = (data.total).toFixed(2);
        numberitems.textContent = data.Items.length;
   
        for(let i = 0 ; i < shippingoptions.options.length; i++){
            
            if ($(shippingoptions.options[i]).attr("name") == data.DeliveryDeliveryType){
                shippingoptions.options[i].selected = true;

            }
          
        }
        var option = shippingoptions.options[shippingoptions.selectedIndex];
        totalshippingcost.textContent = option.value;
        totalitemcost.textContent = (data.total).toFixed(2);
        totalcostshippingitems.textContent = (parseFloat(data.total) + parseFloat(option.value)).toFixed(2);
        

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
            
            const plusIcon = document.createElement('i');
            plusIcon.classList.add('fa-sharp', 'fa-solid', 'fa-plus', 'fa-sm', 'add-modal-cart');
            itemQuantity.appendChild(plusIcon);
            
            const input = document.createElement('input');
            input.classList.add('item-quantity-input');
            input.setAttribute('type', 'number');
            input.setAttribute('name', 'quantity');
            input.value =  data.Items[i].quantity
            itemQuantity.appendChild(input);
            
            const minusIcon = document.createElement('i');
            minusIcon.classList.add('fa-sharp', 'fa-solid', 'fa-minus', 'fa-sm', 'minus-modal-cart');
            itemQuantity.appendChild(minusIcon);
            
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
            const removeIcon = document.createElement("i");
             removeIcon.classList.add( 'fa-sharp', 'fa-solid', 'fa-xmark', 'remove-modal' ,  'changecolor' , 'fa-sm');
            removeitem.appendChild(removeIcon);
            // Append all the child elements to the parent element
            cartRow.appendChild(itemImage);
            cartRow.appendChild(itemName);
            cartRow.appendChild(itemQuantity);
            cartRow.appendChild(itemPrice);
            cartRow.appendChild(itemTotal);
            cartRow.appendChild(removeitem);
            cartrows.appendChild(cartRow);

           



        }
        modal.style.display = "flex";
    })









});






$(".checkout-button-cart").click(function(){

    window.location.href = '/checkout';
    return false;
})

$(document).on('click','.add-modal-cart',function(){
    
    var quantity = this.parentNode.getElementsByClassName("item-quantity-input")[0];
    
    quantity.value = parseInt(quantity.value) + 1;
    
    var value = parseInt(quantity.value);
    var price = parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent);
    (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (value * price).toFixed(2);

    var id = this.parentNode.parentNode.id;
    id =  (id).slice(0, (id).indexOf("-cartRow"));

    var item = document.getElementById( id + "-cartItem");
    item.getElementsByClassName("item-quantity-input-page")[0].value = quantity.value;

    calculatePage();
    calculate();

    $.ajax({
        type: 'GET',
        url : '/add/cart/' + id,
    }).then(function(){
        console.log("success"); 
    })
    

})

$(document).on('click','.minus-modal-cart',function(){
    var id;
    id = this.parentNode.parentNode.id;
    id =  (id).slice(0, (id).indexOf("-cartRow"));
    var quantity = this.parentNode.getElementsByClassName("item-quantity-input")[0];
    if(quantity.value > 0){
    quantity.value = parseInt(quantity.value) - 1;
    
    var value = parseInt(quantity.value);
    var price = parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent);
    (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (value * price).toFixed(2);


    var item = document.getElementById( id + "-cartItem");
    item.getElementsByClassName("item-quantity-input-page")[0].value = quantity.value;

    calculatePage();
    calculate();
        if (quantity.value == 0){
        $.ajax({
            type: 'DELETE',
            url : '/delete/cart/' + id,
        }).then(function(){
            console.log("success"); 
        })
        this.parentNode.parentNode.remove();
        item.remove();
        }
        else{
            $.ajax({
                type: 'GET',
                url :'/update/cart/' + id +'&' +  quantity.value
    
            }).then(function(){
                console.log("success"); 
            })
        }
    }




})
$(document).on('input propertychange','.item-quantity-input',function(){
    var id = this.parentNode.parentNode.id;
    id = (id).slice(0, (id).indexOf("-cartRow"));
    var item = document.getElementById(id + "-cartItem");
    var itemQuantity = item.getElementsByClassName("item-quantity-input-page")[0];

    if(this.value > 0){
    var value = parseInt(this.value);
    itemQuantity.value = this.value;
    var price = parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent);
    
    (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (value * price).toFixed(2);

    }
    else{
        itemQuantity.value = 0;
        (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = parseFloat(0.00);
        
    }
    calculatePage();
    calculate();
    
});


$(document).on('focusout','.item-quantity-input',function(){
    var id = this.parentNode.parentNode.id;
    id = (id).slice(0, (id).indexOf("-cartRow"));
    var itemPage = document.getElementById(id + "-cartItem")
    if(this.value < 0 || !this.value){
        this.value = 1;
        (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent) *  this.value).toFixed(2);
        itemPage.getElementsByClassName("item-quantity-input-page")[0].value = this.value;
        $.ajax({
            type: 'GET',
            url :'/update/cart/' + id +'&' + this.value

        })
    }
    else if (this.value ==0){
        itemPage.remove();
        this.parentNode.parentNode.remove();
        $.ajax({
            type: 'DELETE',
            url : '/delete/cart/' + id,
        }).then(function(){
            console.log("success"); 
        })
    }
    else{
        $.ajax({
            type: 'GET',
            url :'/update/cart/' + id +'&' + this.value

        })
    }
    calculate();
    calculatePage();

})

$(".return").click(function(){

    modal.style.display = "none";
    empty();
})
window.onclick = function(e){
    console.log("END ADADADA")
    console.log(e.target);
    if(e.target == modal){
        modal.style.display = "none";
        empty();
    }


}

function calculate(){
    var totals = document.getElementsByClassName("cart-rows-item-total");
    var fulltotal = 0;
    for (let i = 0 ; i < totals.length; i++){
        fulltotal += parseFloat(totals[i].textContent);
    }
    costitems.textContent = (fulltotal).toFixed(2);
    totalitemcost.textContent = (fulltotal).toFixed(2);
    totalcostshippingitems.textContent = (parseFloat(totalshippingcost.textContent) + fulltotal).toFixed(2);
}

function empty(){
    cartrows.innerHTML = '';


}

$(document).on('click','.remove-modal',function(){
    console.log("In here");
    var regex = /[0-9]/ 
    var item =  this.parentNode.parentNode;
    var id =  (item.id).slice(0, (item.id).indexOf("-cartRow"));
    item.remove();
    numberitems.textContent = document.getElementsByClassName("cart-row").length;
    calculate();

    var itemPage = document.getElementById( id + "-cartItem");
    itemPage.remove();
    calculatePage();
    
    $.ajax({
        type: 'DELETE',
        url : '/delete/cart/' + id,
    }).then(function(){
        console.log("success"); 
    })

})







});