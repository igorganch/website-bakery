$(document).ready(function () {
var modal = document.getElementById("user-cart-modal");
var returnbutton = document.getElementsByClassName("return")[0];
var numberitems = document.getElementById("number-items");
var costitems = document.getElementById("cost-items");
var cartrows = document.getElementsByClassName("cart-rows")[0];
var shippingoptions = document.getElementById("shipping-options");
var totalshippingcost = document.getElementById("total-shipping-cost");
var totalitemcost = document.getElementById("total-item-cost");
var totalcostshippingitems = document.getElementById("total-cost-shipping-items");





$(".add-to-cart").click(function(){
    console.log("In here");
    var id = (this.id).slice(0, (this.id).indexOf("-add-to-cart"));

    $.ajax({
        type: 'GET',
        url : '/add/cart/' + id,
    }).then(function(){
        console.log("success"); 

        $.ajax({
            type: 'GET',
            url: '/cart',
        }).then(function(data){
            console.log(data);
            costitems.textContent = (data.total).toFixed(2);
            numberitems.textContent = data.Items.length;
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
    })



    



});

$("#shipping-options").change(function(){
    var option = shippingoptions.options[shippingoptions.selectedIndex];
    totalshippingcost.textContent = option.value;
    totalcostshippingitems.textContent = (parseFloat(costitems.textContent) + parseFloat(option.value)).toFixed(2);
})


$(".fa-cart-shopping").click(function(){

    $.ajax({
        type: 'GET',
        url: '/cart',
    }).then(function(data){
        console.log(data);
        costitems.textContent = (data.total).toFixed(2);
        numberitems.textContent = data.Items.length;
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

    if(this.value > 0){
    var value = parseInt(this.value);
    var price = parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent);
    
    (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (value * price).toFixed(2);

    }
    else{
        (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = parseFloat(0.00);
        
    }
    calculate();
    
});


$(document).on('focusout','.item-quantity-input',function(){
    var id = this.parentNode.parentNode.id;
    id = (id).slice(0, (id).indexOf("-cartRow"));
    
    if(this.value < 0 || !this.value){
        this.value = 1;
        (this.parentNode).parentNode.getElementsByClassName("cart-rows-item-total")[0].textContent = (parseFloat((this.parentNode).parentNode.getElementsByClassName("cart-rows-item-price")[0].textContent) *  this.value).toFixed(2);

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
    calculate();

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


$(".product-small-image").click(function(){
    var selected = document.getElementsByClassName("blue-border")[0];
    selected.classList.remove("blue-border");
    this.classList.add("blue-border")

    var imagePreview = document.getElementsByClassName("product-image")[0];
    imagePreview.src = this.src;


})

})