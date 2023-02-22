const { password } = require('pg/lib/defaults');
const Sequelize = require('sequelize');
var fs = require('fs');
const moment = require('moment')



var sequelize = new Sequelize('d5caduj88ekc4q', 'zjigteybxvtsbo', '4dd5e9b9729fe6c8d5bf9ca20051cc8c79531f530beb83faaa93365ac2eb3d3c', {
    host: 'ec2-44-194-92-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },

   });


sequelize.authenticate().then(function(){

console.log("Connection succesful to postgre");

}).catch(function(){
console.log("Error connection to postgre");

});


var Image = sequelize.define('Image',{
    path : Sequelize.STRING,
    main : Sequelize.BOOLEAN,
    

});



var Admin = sequelize.define('Admin',{
    username : {
        primaryKey : true,
        type : Sequelize.STRING
    },
    password : Sequelize.STRING,

});

var Customer = sequelize.define('Customer', {
       
        email : Sequelize.STRING,
        password : Sequelize.STRING,
        phoneNumber : Sequelize.INTEGER,
        ip : Sequelize.STRING,
        userAgent : Sequelize.STRING,
        status : Sequelize.BOOLEAN,
        page : Sequelize.STRING,
        location : Sequelize.STRING,
});

var Product = sequelize.define('Product', {
    productName : {
        type : Sequelize.STRING
    },
    description : Sequelize.TEXT,
    weight : Sequelize.DOUBLE,
    unit : Sequelize.STRING,
    perunit : Sequelize.INTEGER,
    price : Sequelize.DOUBLE,
    currency : Sequelize.STRING
    
});

var Category = sequelize.define('Category', {
    categoryName : {
        type : Sequelize.STRING,
        primaryKey : true,
    }


});



var Stock = sequelize.define('Stock', {

    available : Sequelize.BOOLEAN,
    unlimitedQuantity : Sequelize.BOOLEAN,
    quantity : Sequelize.INTEGER,

});


var Item = sequelize.define('Item',{

    quantity : Sequelize.INTEGER,

});

var Cart = sequelize.define('Cart', {
    
    cookie :{
        type : Sequelize.STRING,
        primaryKey : true,
    },
    total : Sequelize.DOUBLE,


});
var Order = sequelize.define('Order', {
    
    total : Sequelize.DOUBLE,

});

Product.hasMany(Item);
Item.belongsTo(Product);
Product.belongsTo(Stock, {
    onDelete: "CASCADE"
});
Cart.hasOne(Customer);
Customer.belongsTo(Cart)

Cart.hasMany(Item);
Item.belongsTo(Cart);
Customer.hasMany(Order);

Product.hasMany(Image,{
    foreignKey: 'ProductId',
    onDelete: "CASCADE",
});
Category.hasMany(Product,{
    foreignKey : "Category"

});
Image.belongsTo(Product,{
foreignKey: 'ProductId',

});


sequelize.sync(/*{force : true}*/).then(function(){
    /*
    Admin.create( {

        username : "dudoy",
        password : "1234"
    });
    Category.create({
        categoryName : "Bread"

    })
    Category.create({
        categoryName : "Pastries"

    })
    Category.create({
        categoryName : "Chocolate"

    })

   
    Stock.create( {

        available : true,
        unlimitedQuantity : false,
        quantity : 56,
    }).then(function(result){
        Product.create({
            productName : "Baguette",
            description : "A simple bagguette",
            StockId : result.id,
            Category : "Pastries",
            weight : "1",
            unit :"kg",
            perunit : 1,
            price : "3.57",
            currency : "₱"
            
        }).then(function(data){
            Image.create({
                path : "/static/baguete.jpg",
                main : true,
                ProductId: data.id
            })

        }).catch(function(err){
            console.log("ERRRRRRROR :::::::::::::::::::: " + err );
        })

    }).catch(function(err){
        console.log("ERRRRRRROR : " + err );
    });
    
*/

})
// ADMIN
module.exports.getAdminByUser = function(user){
    return new Promise(function(resolve,reject){
        Admin.findAll({
            where :{
                username : user

            } 
        }).then(function(result){

            resolve(result);
        }).catch(function(err){
            console.log("error : " + err);
            reject();
        })

    })
}





// STOCK

module.exports.getOneStock = async function(id){
    return new Promise(function(resolve, reject){
        console.log("In her213e");
        Product.findAll({
            limit : 1, 
            where : {
                id : id
            },
            include : [{
                model : Stock,
                required : true,

            },{
                model: Image,
                required : true 
            }],
            nest : true

        }
        ).then(function(result){
            console.log("In her213e");
            console.log(result);
            resolve(result);
        }).catch(function(err){
            console.log(err);
            reject(err);

        })



    }



    );



}
module.exports.getAllStock = function(){
    return new Promise(function(resolve,reject){
        
       Product.findAll(
        {
            include:[{
               
                model : Image,
                required: true,
                order: '"createdAt" DESC'
            } ,{
            
                model: Stock,   
                required: true,
            }],
          
            nest : true
        
            
        }
       ).then(function(result){
            //console.log(result[0].dataValues.Images[0].dataValues);
            resolve(result);

       }).catch(function(err){
            console.log("ERRRRRRROR : " + err );
            reject(err);
        })

    });
    }




module.exports.addStock = function(data, files){
        return new Promise(function(resolve,reject){
            
            Stock.create( {

                available : data.available,
                unlimitedQuantity : data.unlimitedQuantity,
                quantity : data.quantity,
            }).then(function(result){
                
                Product.create({
                    productName : data.name,
                    description :data.description,
                    weight: data.productweight,
                    unit : data.productunit,
                    StockId : result.id,
                    Category : data.productcategory,
                    perunit : data.perunit,
                    price : data.price,
                    currency : data.currency
    

                    
                }).then(function(result){
                    console.log("In here");
                    for (let i = 0 ; i < (files).length; i++){
                        console.log("!$#$@!!!!!!!!!!!!!!!!!!!!!#### " + i );
                    if( i == 0 ){
                    Image.create({
                        path : "/static/" + files[i].filename,
                        main : true,
                        ProductId :result.id, 


                    })
                    }
                    else{
                        Image.create({
                            path : "/static/" + files[i].filename,
                            main : false,
                            ProductId :result.id, 
    
    
                        });
                        console.log("not In here");
                    }
                }

                    resolve(result);

                }).catch(function(err){
                    console.log("ERRRRRRROR :::::::::::::::::::: " + err );
                    reject();
                })
        
            }).catch(function(err){
                console.log("ERRRRRRROR : " + err );
                reject();
            });
        });
    }

module.exports.updateOneStock =  async function(id,data,files){
    return new Promise(function(resolve, reject){
        Stock.update({  
            available : data.available,
            unlimitedQuantity : data.unlimitedQuantity,
            quantity : data.quantity,
        }, {
            where : {id : id}
        }).then(function(result){
            Product.update({ 
                productName : data.name,
                description : data.description,
                Category: data.productcategory,
                unit : data.weightunit,
                weight : data.productweight,
                perunit : data.perunit,
                price : data.price,
                currency : data.currency

                },{

                    where : {id :id}
                }


            ).then(async function(result){
                
                await Image.destroy({
                    where : {
                        ProductId : id
                    }
                }).then(async function(){
                    for (let i = 0 ; i < (files).length; i++){
                        console.log("Repition : " + i + ", " + "/static/" + files[i].filename )
                       if( i == 0 ){
                         await  Image.create({
                           path : "/static/" + files[i].filename,
                           main : true,
                           ProductId : id, 
   
   
                       })
                       }
                       else{
                           await Image.create({
                               path : "/static/" + files[i].filename,
                               main : false,
                               ProductId : id, 
   
   
                           });
                   
                       }
                   }
   
                   resolve();
                }).catch(function(err){
                    console.log(err);
                    reject(err);
                })

                
             

            }).catch(function(err){
                console.log(err);
                reject(err);
              

            })

        }).catch(function(err){
            console.log(err);
            reject(err);

        });





    })

}

module.exports.removeStock =  function(id){
    return new Promise( function(resolve,reject){
         Stock.destroy({
            where : {
                id : id
            }
        }).then(function(data){
            resolve();
        }).catch(function(err){
            console.log(err);
            reject(err);
        })


    })

}



// CATEGORIES

module.exports.getAllCategories = function(){
    return new Promise(function(resolve,rejec){
        Category.findAll().then(function(data){

            resolve(data);
        }).catch(function(err){
            console.log("Error : " + err );
            reject(err);
        })




    })


}
module.exports.addCategory = function(data){
    return new Promise(function(resolve,reject){
        Category.create({
            categoryName : data.categoryName 
        }).then(function(data){
            resolve(data);

        }).catch(function(err){
            console.log("Error - " + err);
        })

    })
}

// CART


module.exports.getCart = function(cookie){

    return new Promise(function(resolve,reject){
        Cart.findAll({
            where :{
                cookie : cookie
            }
            ,
            include:{
                model : Item,
                required: true,
                 include:{
                    model : Product,
                    required: true,
                    include:{
           
                        model : Image,
                        required: true,
                        order: '"createdAt" DESC'
                    } 
                }
                
            } ,
                
             nest : true
            
    

        }).then(function(data){
            console.log(data)
            resolve(data[0]);
        }).catch(function(err){

            console.log("In here fail " + err);

        })

    })
}


module.exports.addItemToCart = function(cookie,id){
    return new Promise(function(resolve,reject){
        Cart.findAll({
            where :{
                cookie : cookie
            }

        }).then(function(data){
            console.log("Past Find cart");
            Product.findAll({

                where:{
                    id : id
                }
            }).then(function(result){
                console.log("Past Find Product");
                Item.findAll({
                 where : {
                        CartCookie : data[0].cookie,
                        ProductId : result[0].id

                    }
                }).then(function(obj){
                    if(obj[0]){
                        Item.update(
                            {
                                quantity: sequelize.literal('quantity + 1')
                            },
                            {where : {
                                CartCookie : data[0].cookie,
                                ProductId : result[0].id
        
                            }}).then(function(){
                                Cart.increment({
                                    total : 1* result[0].price
                                },{
                                    where :{
                                        cookie : cookie
                                    }
                                })

                                resolve()
                            }).catch(function(err){
                                console.log(err)
                                reject(err);
                            })
                    }
                    else{
                        Item.create({
                            ProductId : result[0].id,
                            quantity : 1,
                            CartCookie : data[0].cookie
        
                        }).then(function(data){
                            Cart.increment({
                                total : 1 * result[0].price
                            },{
                                where :{
                                    cookie : cookie
                                }
                            })

                            console.log(data);
                            resolve();
    
                        }).catch(function(err){
                            console.log(err)
                            reject(err);
                        }
                            
                        )
                        
                    }
                  
                   
                }).catch(function(err){
                    console.log(err);
                    console.log("Inside Create item");
                    Item.create({
                        ProductId : result[0].id,
                        quantity : 1,
                        CartCookie : data[0].cookie
    
                    }).then(function(data){
                        
                        console.log(data);
                        resolve();

                    }).catch(function(err){
                        console.log(err)
                        reject(err);
                    }
                        
                    )
                })
                
                

            }).catch(function(err){
                console.log(err);
                reject();
    
            })

        }).catch(function(err){
            console.log(err);
            reject();

        })


    })

}
module.exports.removeItemFromCart = function(cookie, id){
    return new Promise(function(resolve,reject){
        Cart.findAll({
            where :{
                cookie : cookie
            }
        }).then(function(data){
            console.log("Past Find cart");
            Product.findAll({
                where:{
                    id : id
                }}).then(function(result){

                
                    Item.findAll({
                        where : {
                            ProductId : id,
                            CartCookie : cookie
                        }
                    }).then(function(item){
                        Item.destroy({
                            where : {
                                ProductId : id,
                                CartCookie : cookie
                            }
                        }).then(function(){
    
                            Cart.decrement({
                                total : item.quantity * result[0].price
                            },{
                                where :{
                                    cookie : cookie
                                }
                            }).then(function(){
                                resolve();
                            }).catch(function(err){
                                console.log(err);
                                reject();
                            })
        
                            
                        }).catch(function(err){
                            console.log(err);
                            reject();
                
                        })

                    }).catch(function(err){
                            console.log(err);
                            reject();
                    })
                    

                }).catch(function(err){
                    console.log(err);
                    reject();
        
                })


        }).catch(function(err){
            console.log(err);
            reject();

        })
    })

}


//CUSTOMER

module.exports.addCustomer = function(data){
    return new Promise(function(resolve,reject){
        var status;
        if (data.status == "true"){
            status = true;
        }else{
            status = false
        }
        Cart.create({
            cookie : data.cookie,
            total : 0
        }).then(function(result){
            
            Customer.create({
                ip : data.ip,
                userAgent : data.userAgent,
                status : status,
                page : data.page,
                CartCookie : result.cookie,
                location : data.location
            }).then(function(result){
                resolve(result);
              
    
            }).catch(function(err){
    
                reject(err);
            })

        }).catch(function(err){
            console.log(err);
        })


    })


}





module.exports.updateStatusCustomer = function(data){
    return new Promise(function(resolve,reject){
        
        var status;
        if (data.status == "true"){
            status = true;
        }else{
            status = false
        }
        console.log("HEWHRTHEWOHROWEH!$#@!$@$4 4 - " + data.page)
        Customer.update({

            status : status,
            page : data.page,

        }, {
            where :{
                CartCookie : data.cookie

            }
        }).then(function(data){
            console.log(data[0])
            resolve();
        }).catch(function(err){
            console.log(err);
            reject(err);
        })


    })
        
}

module.exports.getCustomersYesterday = function(){
    
    return new Promise(function(resolve, reject){
        const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
        oneDayAgo.setHours(0);
        oneDayAgo.setMinutes(0);
        oneDayAgo.setSeconds(0);
        oneDayAgo.setMilliseconds(0);
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        
        Customer.findAll({

            where :{
                createdAt: {
                    [Sequelize.Op.gte]: oneDayAgo,
                    [Sequelize.Op.lte]: today,
                }

            }
        }).then(function(result){
            resolve(result)
        }).catch(function(err){
            reject(err)
        })

    })

}

module.exports.getCustomersLast24hours = function(){
    
    return new Promise(function(resolve, reject){
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        
        Customer.findAll({

            where :{
                updatedAt: {
                    [Sequelize.Op.gte]: today,
                    [Sequelize.Op.lte]: new Date(),
                }

            }
        }).then(function(data){

            resolve(data);
        }).catch(function(err){
            console.log(err);
            reject(err);

        })

    })

}

module.exports.getAllCustomers = function(){
    return new Promise(function(resolve,reject){
    
        Customer.findAll(
            {
                order:[
                    ['status', 'DESC'],
                    ['updatedAt', 'DESC']
                ]

            }
        ).then(function(data){
    
    
            resolve(data);
        }).catch(function(err){
    
            console.log(err);
            reject();
        });
    });
    }



