$(document).ready(function(){


  var pickup = document.getElementById("Pick up")
  var delivery = document.getElementById("Delivery")
    const stripe = Stripe(stripe_public_key);

    const options = {
        // Fully customizable with appearance API.
        appearance: { 
            theme: 'stripe',
            labels: 'floating'
        },
        variables :{
 

            spacingUnit: '0px',
            borderRadius: '1px',
        }
      };
      
      // Only need to create this if no elements group exist yet.
      // Create a new Elements instance if needed, passing the
      // optional appearance object.
      var secret = clientSecret;
      console.log(clientSecret)
      const elements = stripe.elements({ clientSecret : clientSecret, appearance:{
        theme: 'none',
        labels: 'floating',
        variables : {
            spacingUnit: '3px',
            borderRadius: '20px',
            fontLineHeight : '0px',
            fontSizeBase : '8pt'
        }
        },
      });
      const linkAuthElement = elements.create('linkAuthentication');

      // Create and mount the Address Element in shipping mode
      const addressElement = elements.create("address", {
        mode: "shipping",
        allowedCountries: ['CA'],
        fields: {
            phone: 'always',
    
        },

        autocomplete: {
            mode: "google_maps_api",
            apiKey: "AIzaSyCCV9ElwnaA8bjRVvfd6XTpoLQRALW4rPk",
          },
      });

      const cardElement = elements.create("payment",{
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      })
      cardElement.mount("#card-element")
      
      addressElement.mount("#address-element");

      linkAuthElement.mount('#link-auth-element');
     
      const form = document.getElementById("checkout")
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const addressElement = elements.getElement('address');

        const {complete, value} = await addressElement.getValue();
      
        if (complete) {
          console.log(value)
        }

        /*
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "http://localhost:8080/success",
            
          },
        }); 
        */
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
   /*
        console.log(error.type );
        if (error.type === "card_error" || error.type === "validation_error") {
          //showMessage(error.message);
        } else {
          //showMessage("An unexpected error occurred.")
        }
        
        */
      //  setLoading(false);
      
      })      
      var submitbutton = document.getElementById("submit-button");
      var cartTotal = parseFloat(total);
      $(".shipping-select-radio").on("click", async function(){
        console.log(this.parentNode.parentNode.parentNode)
        if (this.parentNode.parentNode.parentNode.id == "Pick up"){
          console.log(cartTotal)
          cartTotal = cartTotal - 10;
          submitbutton.textContent = "Pay $" + cartTotal.toFixed(2);
          $.ajax({
            type: 'GET',
            url: '/updateamount/' + (cartTotal * 100) + "&" + paymentIntentid + "&"  + this.parentNode.parentNode.parentNode.id
          })
            
        }
        else{
          console.log(cartTotal);
          cartTotal = cartTotal  + 10;
          console.log(cartTotal);
          submitbutton.textContent = "Pay $" + cartTotal.toFixed(2);
          $.ajax({
            type: 'GET',
            url: '/updateamount/' + (cartTotal * 100) + "&" + paymentIntentid + "&"  + this.parentNode.parentNode.parentNode.id
          })
        }

    })
      


        $.ajax({
        type: 'GET',
        url: '/cart',
    }).then(function(data){
        console.log(data);
        var options = document.getElementsByClassName("shipping-row");
        
        for(let i = 0 ; i < options.length; i++){
            console.log("options[i].id - " + options[i].id )
            if (options[i].id == data.DeliveryDeliveryType){
               var delivery =  options[i].getElementsByClassName("shipping-select-radio")[0];
               delivery.checked = true;
               if (data.DeliveryDeliveryType == "Pick up"){
                    console.log("INTERS")
                    deliveryInfo.style.display ="none"
               }

            }
            else{
                console.log("IUnfalese")
            }
          
        }
    })
    
    var timezone = "Asia/Manila";
    $.ajax({
        type: 'GET',
        url : '/checkout/storehours',
    }).then(function(data){
        console.log(data);
        var pickupdesc =   pickup.getElementsByClassName("shipping-desc")[0];
        var deliverydesc=   delivery.getElementsByClassName("shipping-desc")[0];

        pickupdesc.textContent = data.storeLocation;
        maximumDeliveryDistance = data.maximumDeliveryDistance;
        unit = data.unit;

        var today = new Date().toLocaleString("en-US", {timeZone: timezone})
        console.log(today)
        const weekday = new Date(today).toLocaleString("en-US", {weekday: "long"});
        console.log(weekday);
        const time = new Date(today).toLocaleString("en-US", {timeStyle: "short"});
        console.log(time);
        today = new Date(today);

        for(let i = 0; i < data.StoreHours.length; i++){
            if (weekday == data.StoreHours[i].weekDay){
                
                let date =  new Date(today);
                let hours = data.StoreHours[i].startTime.slice(0,2);
                let minutes = data.StoreHours[i].startTime.slice(data.StoreHours[i].startTime.indexOf(":") + 1 ,data.StoreHours[i].startTime.indexOf(":") +3);
                date.setHours(parseInt(hours), parseInt(minutes), 0);
                date.setTime(date.getTime() + minAfterOpening * 60 * 1000);
                let openingTime = new Date(date);
               

                date = new Date(today);
                hours = data.StoreHours[i].endTime.slice(0,2);
                minutes = data.StoreHours[i].endTime.slice(data.StoreHours[i].endTime.indexOf(":") + 1 ,data.StoreHours[i].endTime.indexOf(":") +3);
                date.setHours(parseInt(hours), parseInt(minutes), 0);
                date.setTime(date.getTime() - minBeforeClosing * 60 * 1000);
                let closingTime = new Date(date);

                if( today >= openingTime && today <= closingTime){
                    deliverydesc.textContent ="Same day delivery within " + deliveryLength  + " hour after "  + data.StoreHours[i].startTime  +"! "
                }
                else if(closingTime <= today ){
                    let nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                    const nextDays = new Date(nextDay).toLocaleString("en-US", {weekday: "long"});

                    for(let j = 0; j < data.StoreHours.length; j++){
                        if (nextDays == data.StoreHours[j].weekDay){
                            deliverydesc.textContent ="Next day delivery within " + nextDays + " " + deliveryLength  + " hour after " + data.StoreHours[j].startTime  +"! "
                        }
                    }
                  
                }else if(openingTime >  today){
                    
                    deliverydesc.textContent ="Same day delivery within "+ deliveryLength  + " hour after "  + data.StoreHours[i].startTime  +"! ";

                }
            }

        }
    })




    



});



