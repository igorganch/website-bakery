const express = require("express");
const path = require("path");
const service = require("./Service.js");

const clientSessions = require("client-sessions");
const exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var socket = require('socket.io');
const multer = require("multer");
const fs = require('fs');
const { Console } = require("console");
const { user } = require("pg/lib/defaults.js");
const geoip = require('geoip-lite');



var HTTP_port = process.env.PORT || 8080;



var app = express();
var server = app.listen(HTTP_port, function(){
    console.log('listening for requests on port 4000,');
});

const io = socket(server);

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        console.log("#@$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@- " +file)
        cb(null, './images');
    },
    filename: function(req,file,cb){
        console.log("#@$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@- " + file)
        cb(null, file.originalname +  Date.now() + ".jpg");
    }

});

const upload = multer({storage: storage});


io.on("connection", function(socket){
    console.log("LISTENING~~~~~~~~~~~~~@@#!#@!#@!");

    socket.on("user_on_home_page", function(user){
        user.status = "true";
        console.log("User connected: ");
        console.log(user);
        const today = new Date();
        user.updatedAt = today;
        console.log(today);
        user.page = 'Home';
        io.sockets.emit('user_on_home_page_admin',user);
        service.updateStatusCustomer(user).then(function(){
            console.log("here");
        }).catch(function(err){
            console.log(err);
        });    
        
                    
    
    });
    
    socket.on("user_on_menu_page", function(user){
        user.status = "true";
        const today = new Date();
        user.updatedAt = today;
        user.page = 'Menu';
        io.sockets.emit('user_on_menu_page_admin',user);
        service.updateStatusCustomer(user).then(function(){
            console.log("here");
        }).catch(function(err){
            console.log(err);
        });    
        
                    
    
    });

    
      
    socket.on('admin_connected',function(){
        console.log("Admin Connected")
    })
    socket.on('disconnect', function(){
        let cookie = decodeURIComponent(socket.handshake.headers.cookie);
        console.log(cookie);
        if (cookie.indexOf("user") != - 1){
            cookie = cookie.slice(cookie.indexOf("user") + 1,cookie.length);
            cookie = cookie.slice(cookie.indexOf("{") + 1,cookie.length);
            cookie = cookie.slice(cookie.indexOf("{") + 1,cookie.length);
            cookie = cookie.slice(0,cookie.indexOf("}}") + 1);
            console.log("before - " + cookie);
            var regex =  /[}]/g        
            cookie = cookie.replace(regex, "");
            console.log(cookie);
            
            let user = {};
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
            console.log(user)
            user.status = "false";
            io.sockets.emit("webuser_disconnect", user);
            console.log("User Disconnected")
        
            service.updateStatusCustomer(user).then(function(){
                console.log("here");
            }).catch(function(err){
                console.log(err);
            });    
        }

    })

});




app.use('/static', express.static(__dirname + '/styles'));
app.use('/static', express.static(__dirname + '/images'));
app.use('/static', express.static(__dirname + '/js'));
app.use('/static', express.static(__dirname + '/node_modules'));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: true }));

 
app.use(cookieParser());


function uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
}

app.use(clientSessions({
    cookieName: "session", 
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 30 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 * 2 // the session will be extended by this many ms each request (1 minute)
  }));


  

function onStart(){

    console.log("Listening on port " + HTTP_port);

}

app.use(express.urlencoded({
    extended: true
  }))






app.get("/", function(req, res){

    var products = [];
    var length = 6; 
    if(!req.cookies.user){
        console.log(" in here" + req.cookies.length)
    var cookie = uuidv4();


    var ipAddr = req.headers["x-forwarded-for"];
    var userAgent = req.headers["user-agent"];
    

    if (ipAddr){
        var list = ipAddr.split(",");
        ipAddr = list[list.length-1];
    } 
    else {
        ipAddr = req.socket.remoteAddress;
    }
    var geo = geoip.lookup("99.241.17.150");
    console.log(geo);

    var data = {
        cookie : cookie,
        ip: ipAddr,
        userAgent : userAgent,
        page : "Home",
        status: "true",
        location : geo.country + ", " + geo.city,
        updatedAt :""
    }
    service.addCustomer(data).then(function(datat){
        console.log(datat);
        data.updatedAt = datat.updatedAt;
    service.getAllStock().then(function(product){
        if (product.length < 6){
            length = product.length
        }
        for (var i = 0 ; i < length; i++){
            products.push(product[i]);
        }
        res.cookie('user', { user : data}).render('home', { product : products, layout: false, });

    })

    }).catch(function(err){
        console.log(err);
    })
    }
    else{
        req.cookies.user.user.page = 'Home'
        service.getAllStock().then(function(product){
            
            if (product.length < 6){
                length = product.length
            }
            for (var i = 0 ; i < length; i++){
                products.push(product[i]);
            }
            res.cookie('user', { user : req.cookies.user.user}).render('home', { product : products, layout: false, });
    
        }).catch(function(err){
            console.log(err);
        })
    }


    

    

});



app.get("/menu", function(req, res){

    if(!req.cookies.user){
        console.log(" in here" + req.cookies.length)
        var cookie = uuidv4();
        var ipAddr = req.headers["x-forwarded-for"];
        var userAgent = req.headers["user-agent"];
        if (ipAddr){
            var list = ipAddr.split(",");
            ipAddr = list[list.length-1];
        } 
        else {
            ipAddr = req.socket.remoteAddress;
        }
        var geo = geoip.lookup("99.241.17.150");
        console.log(geo);

        var data = {
            cookie : cookie,
            ip: ipAddr,
            userAgent : userAgent,
            page : "home",
            status: "true",
            location : geo.country + ", " + geo.city,
            updatedAt :""
        }
        service.addCustomer(data).then(function(datat){
            console.log(datat);
            data.updatedAt = datat.updatedAt;
            service.getAllStock().then(function(products){
                service.getAllCategories().then(function(categories){
                    res.cookie('user', { user : data}).render('menu', { product : products, category : categories, layout: false, });
        
                }).catch(function(err){
                    console.log(err);
                })
            })

        }).catch(function(err){
            console.log(err);
        })
    }
    else{
        req.cookies.user.user.page = 'Menu'
        service.getAllStock().then(function(products){

            service.getAllCategories().then(function(categories){
                service.getCart(req.cookies.user.user.cookie).then(function(cart){
                    
                    res.cookie('user', { user : req.cookies.user.user}).render('menu', { product : products, category : categories, cart : cart, layout: false, });

                }).catch(function(err){

                    console.log(err);
                })
               

            }).catch(function(err){
                console.log(err);
            })

            
    
        }).catch(function(err){
            console.log(err);
        })
    }


    

    

});

app.get("/cart",function(req,res){
    console.log(req.cookies.user.user.cookie);
    if(req.cookies.user){
    service.getCart(req.cookies.user.user.cookie).then(function(cart){
        console.log("SUCCES!#@!#$!@#");            
        res.json(cart);

    }).catch(function(err){

        console.log(err);
    })
    }
    else{
        var data = [];
        res.json(data);

    }
})


app.get("/adminlogin", function(req,res){
    res.render('adminlogin', {layout: false});
})

app.get("/users/last24hours", function(req,res){
    service.getCustomersLast24hours().then(function(data){
        console.log("/users/last24hours");
        console.log(data);
        res.json(data);

    })

})
app.get("/users/yesterday", function(req,res){
    service.getCustomersYesterday().then(function(data){
        console.log(data);
        res.json(data);

    })

})
app.post("/adminlogin" , function(req,res){
    service.getAdminByUser(req.body.username).then(function(data){
        if (data[0].password == req.body.password){
            req.session.user = {
                username : req.body.username
            }

            res.redirect("/adminpannel")

        }


    })



});
app.get("/adminpannel",ensureLogin, function(req,res){
   res.render('dashboard', {layout : false} ); 



});

app.get("/dashboard/visitors",ensureLogin,function(req,res){
    service.getAllCustomers().then(function(data){
        console.log(data);
        res.render('dashboardVisitors', {user : data, layout:false});
    }).catch(function(err){
        console.log(err);
    })


})



app.get("/dashboard/products", ensureLogin, function(req,res){
    service.getAllStock().then(function(result){
        console.log(result);
        res.render('dashboardProducts', { product : result, layout:false});

    }).catch(function(err){
        console.log("ERRRRRRRR : " + err);
    });

    

});


app.get("/dahsboard/products/updatePage/:id", ensureLogin, function(req,res){
    service.getOneStock(req.params.id).then(function(data){
        console.log(data);
        console.log(data[0]);
        res.render("dashboardUpdateProduct", {product: data[0], layout : false});

    }).catch(function(err){
        console.log(err);

    });


});



app.get('/add/cart/:productId', function(req,res){
    if(!req.cookies.user){
        console.log(" in here" + req.cookies.length)
        var cookie = uuidv4();
        var ipAddr = req.headers["x-forwarded-for"];
        var userAgent = req.headers["user-agent"];
        if (ipAddr){
            var list = ipAddr.split(",");
            ipAddr = list[list.length-1];
        } 
        else {
            ipAddr = req.socket.remoteAddress;
        }
        var geo = geoip.lookup("99.241.17.150");
        console.log(geo);

        var data = {
            cookie : cookie,
            ip: ipAddr,
            userAgent : userAgent,
            page : "home",
            status: "true",
            location : geo.country + ", " + geo.city,
            updatedAt :""
        }
        service.addCustomer(data).then(function(datat){
            service.addItemToCart(datat.cookie,req.params.id).then(function(){
                res.cookie('user', { user : data}).json({success: "Deleted" , status : 200});
            }).catch(function(err){
                console.log(err);

            })
        }).catch(function(err){
            console.log(err);
        })
    }
    else{
        service.addItemToCart(req.cookies.user.user.cookie ,req.params.productId).then(function(){
            res.json({success: "Added" , status : 200});
        }).catch(function(err){
            console.log(err);

        })
    
    }
})

app.delete("/delete/cart/:id", function(req,res){
    if(req.cookies.user){
        service.removeItemFromCart(req.cookies.user.user.cookie, req.params.id).then(function(){
            res.json({success: "Deleted" , status : 200});
        }).catch(function(err){
            console.log(err);
        })
    }

})

app.post("/dashbaord/products/update/:id",upload.array('imageupload'), ensureLogin, async function(req,res){
    console.log(req.files);
    await service.getOneStock(req.params.id).then(async function(data){
        for (let i = 0; i < data[0].dataValues.Images.length; i++){
            let path = data[0].dataValues.Images[i].path;
            let fileName = path.slice(path.lastIndexOf("/") + 1);
       
            fs.unlinkSync("./images/" +   fileName);
           console.log("Unlink - " + path);

        }
        if(req.body.unlimitedQuantity == 'on'){
            req.body.unlimitedQuantity = true;
            req.body.quantity = 0;
        }
        else{
            req.body.unlimitedQuantity = false;
           
        }
        if(req.body.available == 'on'){
            req.body.available = true;
            
        }
        else{
            req.body.available = false;
            req.body.quantity = 0;
        }
        await service.updateOneStock(req.params.id, req.body, req.files).then(function(){
            
            res.redirect("/dashboard/product/" + req.params.id);
         

        }).catch(function(err){
            console.log("IN HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRROERRRR");
            console.log(err);
        })  



    }).catch(function(err){

        console.log(err);

    })

})
app.get("/dashboard/products/getCategories", ensureLogin, function(req,res){
    service.getAllCategories().then(function(data){
        console.log(data);
        res.json(data);
    }).catch(function(err){

        console.log(err);
    })


})
app.post("/dashboard/add/category", ensureLogin, function(req,res){
    console.log(req.body);
    service.addCategory(req.body).then(function(data){
        console.log(data);
        res.json(data);
    }).catch(function(err){
        console.log(err);
    })

})

app.delete("/dashboard/product/delete/:id", ensureLogin, function(req,res){
    service.removeStock(req.params.id).then(function(){
        res.json({success: "Deleted" , status : 200});
    }).catch(function(err){
        console.log(err);

    })

})

app.get("/dashboard/product/:id", ensureLogin, function(req,res){
    service.getOneStock(req.params.id).then(function(data){
  
        for (let i = 0; i < data[0].dataValues.Images.length; i++){
            let path = data[0].dataValues.Images[i].path;
            let fileName = path.slice(path.lastIndexOf("/") + 1);
    
           console.log("Files - " + path);

        }
        
        res.json(data);

    }).catch(function(err){

        res.json(err);
    })



})

app.get("/dashboard/products/add", ensureLogin, function(req,res){

    res.render("dashboardAddProduct", {layout:false});


})

app.post("/dashboard/products/add",upload.array('imageupload'), ensureLogin, function(req,res){
    console.log(req.files);
    console.log((req.files).length);

   

    if(req.body.unlimitedQuantity == 'on'){
        req.body.unlimitedQuantity = true;
        req.body.quantity = 0; 

    }
    else{
        req.body.unlimitedQuantity = false;
        
    }
    if(req.body.available == 'on'){
        req.body.available = true;

    }
    else{
        req.body.available = false;
        req.body.quantity = 0; 

    }
    service.addStock(req.body, req.files).then(function(){

        res.redirect("/dashboard/products");

    }).catch(function(err){

        console.log(err);

    })


   


});


app.get("/dashboard", ensureLogin, function(req,res){
    service.searchadminlogs(req.session.user.id).then(function(data){
        console.log(data);
        data.url =  req.session.user.specialurl;
        data.admin = req.session.user.id;
        console.log("data.admin--------------------------" + req.session.user.id);
        res.render('dashboard', {  user : data, layout: false, });

    }).catch(function(){



    });

});



app.post("/", function(req, res){
    console.log(req.body.username);
    service.searchadmin(req.body.username).then(function(data){
            console.log(data[0].password);
            console.log(req.body.password);
            if (data[0].password == req.body.password){
                var newspamurl=  data[0].id + uuidv4();
                service.updateUrlAdmin(data[0].id,newspamurl);

                req.session.user = {
                    username: req.body.username,
                    id : data[0].id,
                    specialurl : newspamurl
                  };

                  

                res.redirect("/dashboard");
            }
            else{
                res.redirect("/");
            }


    }).catch(function(){
        res.redirect("/");

    });



});









app.get("/login", function(req,res){
    var ipAddr = req.headers["x-forwarded-for"];
    var userAgent = req.headers["user-agent"];

    console.log(req.query.data);
    

    if (ipAddr){
        var list = ipAddr.split(",");
        ipAddr = list[list.length-1];
    } 
    else {
        ipAddr = req.socket.remoteAddress;
    }

        res.cookie('user', { user : person}).render('userlogin', {  user : person, layout: false, });

    



 

});

app.post("/login", function(req,res){

    main(req.body.username,req.body.password); 

    console.log(req.cookies.user.user);




    var formdata = "<form action='/verify' method = 'post'>" +
    "<label for='username'>Pin</label> <input type='text' id='username' value = '' name='username'><br><br>" +
       "<input type='submit' value='Submit'> </form>";

    res.send(formdata);
});

app.post("/verify", function(req,res){

    

    var formdata = "<h1>hello</h1>";

   main1(req.body.username);

    res.send(formdata);
});








    function ensureLogin(req, res, next) {
        if (!req.session.user) {
          res.redirect("/");
        } else {
          next();
        }
      }





