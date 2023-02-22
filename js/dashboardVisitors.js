$(document).ready(function () {
    console.log("here");
    
    var counter = document.getElementById("live-counter");
    var count = document.getElementsByClassName('active').length;
    var todayVisitors = document.getElementById("24-hour-visitors");
    var precentage = document.getElementById("precentage");
    var calculation; 
    var todayVisitorsNum; 
    var yesterdayVisitorsNum;
    counter.textContent = count;
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
    setInterval(loadVisitorStats, time  * 1000)



async function loadVisitorStats(){
    $.ajax({
        type: 'GET',
        url : '/users/last24hours',
    }).then(function(data){
        console.log(data);
        todayVisitors.textContent = data.length;
        todayVisitorsNum = data.length
        $.ajax({
            type: 'GET',
            url : '/users/yesterday',
        }).then(function(otData){
            console.log(otData.length);
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
        })
    })

}
    let socket = io.connect('http://localhost:8080');
   


       socket.on("connect", function () {

        socket.emit("admin_connected");

        socket.on("user_on_home_page_admin", function(user){
            console.log("CONNECTED")
            update(user)
        });

        socket.on("user_on_menu_page_admin" , function(user){

            update(user);

        })

        



        socket.on("webuser_disconnect", function(user){
            var users = document.getElementsByClassName("login-rows")[0];
            var status = document.getElementById(user.cookie + "-status");
            status.textContent = "Offline";
            status.classList.remove("active");
            status.classList.add("non-active");
            var userRow = status.parentNode;
            count = document.getElementsByClassName('active').length;
            users.insertBefore( userRow,document.getElementsByClassName("each-user")[count].nextSibling);
            counter.textContent = count;
        })

        function update(user){
            var users = document.getElementsByClassName("login-rows")[0]
            var userRow =  document.getElementById(user.cookie + "-cookie");

            if( userRow != null){
                var status = document.getElementById(user.cookie + "-status");
                status.textContent = "Online";
                status.classList.remove("non-active");
                status.classList.add("active");
                document.getElementById(user.cookie + "-page").textContent = user.page;

                document.getElementById(user.cookie + "-updatedAt").textContent = new Date(user.updatedAt);

              //  userRow.remove();

                users.insertBefore( userRow,users.getElementsByClassName("each-user")[0]);


                count = document.getElementsByClassName('active').length;
                console.log(count);
                counter.textContent = count;
                

            }else{
                var status;
                if (user.status == "true"){
                    status = "Online"
                }
                else{
                    status ="Offline"
                }
                const userContainer = document.createElement("div");
                userContainer.classList.add("each-user");
                userContainer.id = user.cookie + "-cookie";
                
                const emailColumn = document.createElement("div");
                emailColumn.classList.add("equal-log-columns", "center-text");
                emailColumn.id = user.cookie + "-email";
                emailColumn.innerHTML = "N/A";
                
                const passwordColumn = document.createElement("div");
                passwordColumn.classList.add("equal-log-columns", "center-text", "password");
                passwordColumn.id = user.cookie + "-location";
                passwordColumn.innerHTML = user.location;
                
                
                const statusColumn = document.createElement("div");
                statusColumn.classList.add("equal-log-columns", "center-text", "active", "status");
                statusColumn.id = user.cookie + "-status";
                statusColumn.innerHTML = status;
                
                const pageColumn = document.createElement("div");
                pageColumn.classList.add("equal-log-columns", "center-text", "page-loc");
                pageColumn.id = user.cookie + "-page";
                pageColumn.innerHTML = user.page;
                
                const ipColumn = document.createElement("div");
                ipColumn.classList.add("equal-log-columns", "center-text", "address");
                ipColumn.id = user.cookie + "-ip";
                ipColumn.innerHTML = user.ip;
                
                const userAgentColumn = document.createElement("div");
                userAgentColumn.classList.add("center-text", "userAgent");
                userAgentColumn.id = user.cookie + "-userAgent";
                userAgentColumn.innerHTML = user.userAgent;
                console.log(user.userAgent);

                const updatedAt = document.createElement("div");
                updatedAt.classList.add("center-text", "userAgent");
                updatedAt.id = user.cookie + "-updatedAt";
                updatedAt.innerHTML = new Date(user.updatedAt);
                const controlColumn = document.createElement("div");
                controlColumn.classList.add("equal-log-columns-products-start-end", "center-text", "address");
                
                const controlButton = document.createElement("i");
                controlButton.classList.add("edit-button", "fa-solid", "fa-pen-to-square", "changecolor");
                controlButton.id = user.cookie + "-edit";
                controlColumn.appendChild(controlButton);
                
                userContainer.appendChild(emailColumn);
                userContainer.appendChild(passwordColumn);
                userContainer.appendChild(statusColumn);
                userContainer.appendChild(pageColumn);
                userContainer.appendChild(ipColumn);
                userContainer.appendChild(userAgentColumn);
                userContainer.appendChild(updatedAt);
                userContainer.appendChild(controlColumn);
                
                
               
                users.insertBefore( userContainer,users.getElementsByClassName("each-user")[0]);
 
                count = document.getElementsByClassName('active').length;
               
                counter.textContent = count;

                todayVisitorsNum++;
                console.log(yesterdayVisitorsNum);
                calculation =(( todayVisitorsNum / yesterdayVisitorsNum) * 100)
                calculation = parseInt(calculation -100)
                precentage.textContent =  calculation + "%";
                todayVisitors.textContent = todayVisitorsNum;
               
                if (calculation >0){
                    precentage.classList.add("green-percentage");
    
                }
                else if (calculation == 0 ){
                    precentage.classList.add("white-precentage");
                }
                else{
                    precentage.classList.add("red-percentage");
    
    
                }


            }
        }

        





   })
}) 