$(document).ready(function(){
    console.log("hello");
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
        
        user.status = "Home"
        
        socket.emit("user_on_home_page", user);
        

    })

    */
})