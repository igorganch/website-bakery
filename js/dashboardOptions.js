
$(document).ready(function(){
    
    var location = document.getElementsByClassName("location")[0];
    var x; 
    var y;
    var timeinput = document.getElementsByClassName("time-input");
    var time = "";
    var form = document.getElementById("store-options");
    form.addEventListener("submit",onsubmit);
    const $form = $("#store-options");


/*
    for (let i = 0 ; i < timeinput.length; i++){
        timeinput[i].addEventListener('input', inputHandler);
        timeinput[i].addEventListener('propertychange', inputHandler);

    }
*/

    function initialize(){
        new google.maps.places.Autocomplete(location);
    }

    google.maps.event.addDomListener(window, 'load', initialize);



    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        console.log("position.coords.latitude" + position.coords.latitude);

        x = position.coords.latitude;
        y = position.coords.longitude;
        $.ajax({
            type : "GET",
            url : "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyCCV9ElwnaA8bjRVvfd6XTpoLQRALW4rPk"

        }).then(function(data){
            console.log(data)
            console.log(data.results[0].formatted_address);
            location.value = data.results[0].formatted_address
        })
  
    }


    $(".get-current-location").click(function(){
        getLocation();


    })



/*
    function inputHandler(e){
        console.log("time.length - " + time.length);
        console.log("e.target.value.length - " + e.target.value.length);
        if(time.length == e.target.value.length || e.target.value.length > time.length){
        time =e.target.value;    
      //  console.log(time);
        //console.log(time.length);
        if(time.length == 1){
            time= time + ":";
            e.target.value = time;
        }
        else if(time.length == 2){
            if (time.indexOf(":") == -1){
                time = time.slice(0,1) + ":" + time.slice(1,2)
                }
            e.target.value = time;
        }
        else if(time.length == 3){
            if (time.indexOf(":") == -1){
            time = time.slice(0,1) + ":" + time.slice(1,2)
            }
            e.target.value = time;
        }
        else if(time.length == 5){
          //  console.log(time);
            time = time.replace(':','');
            //console.log( time.slice(0,2) );
            //console.log( time.slice(2,4) );
            time = time.slice(0,2) + ":" + time.slice(2,4)
            e.target.value = time;
        }
        }
        else{
            
            time =e.target.value;    
        }
    }

*/


    $(".time-input").focusout(function(){
        console.log(this.value);
        var towhen =  (this.name).slice((this.name).indexOf("_") + 1, this.name.length);
        var day =  (this.name).slice(0, (this.name).indexOf("_"));
        var alert = this.parentNode.getElementsByClassName("alert")[0];
        if(towhen == "from"){
           var to = document.getElementsByName(day + "_to")[0];
           console.log(this.value > to.value );
            if(this.value > to.value && to.value != ""){
                alert.textContent = "*Opening hours are past closing"
                this.parentNode.classList.add("invalid")
            }else{
                alert.textContent = ""
                this.parentNode.classList.remove("invalid")
            }


        }else{
            var from = document.getElementsByName(day + "_from")[0];
            console.log(this.value < from.value );
             if(this.value < from.value && from.value != ""){
                 alert.textContent = "*Opening hours are past closing"
                 this.parentNode.classList.add("invalid")
             }else{
                 alert.textContent = ""
                 this.parentNode.classList.remove("invalid")
             }

        }



    })

    function check(object){
        var day = object.id;
        console.log(day)
        var to = document.getElementsByName(day + "_to")[0];
        var from = document.getElementsByName(day + "_from")[0];
        var alert = object.getElementsByClassName("alert")[0];
        if(from.value > to.value){
            alert.textContent = "*Opening hours are past closing"
            object.classList.add("invalid")
        }else{
            alert.textContent = ""
            object.classList.remove("invalid")
        }
    }
    $form.on('submit', submitCategory)
    function submitCategory(e){
        e.preventDefault();
        console.log("SUBMITE")
        var times = document.getElementsByClassName("container-hours-from");
        for (var i = 0 ; i < times.length; i++){
            check(times[i])
        }
        var invalid = document.getElementsByClassName("invalid");
        if(invalid.length == 0){
            const formData = new FormData(this);
            console.log(formData);
            $.ajax({
                type : 'POST',
                url : "/storeoptions",
                data : $form.serialize(),

            })


        }
        else{
            console.log("FALSE")
        }

    }

})