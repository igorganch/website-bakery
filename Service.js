const { password } = require('pg/lib/defaults');
const Sequelize = require('sequelize');
var fs = require('fs');




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
        name : Sequelize.STRING,
        password : Sequelize.STRING,
        phoneNumber : Sequelize.STRING,
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
    price :  {
        type: Sequelize.DOUBLE(10,2),
        allowNull: false,
        default : 0.00
   
      },
    currency : Sequelize.STRING
    
});

var Category = sequelize.define('Category', {
    categoryName : {
        type : Sequelize.STRING,
        primaryKey : true,
    }


});
var StoreInfo = sequelize.define('StoreInfo',{
    storeLocation : Sequelize.STRING,
    maximumDeliveryDistance : Sequelize.DOUBLE,
    unit : Sequelize.STRING
})
var StoreHours  = sequelize.define('StoreHours', {
    weekDay : {
        type : Sequelize.STRING,
        primaryKey : true
    },
    startTime : Sequelize.TIME,
    
    endTime : Sequelize.TIME,

})




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
    total :  {
        type: Sequelize.DOUBLE(10,2),
        allowNull: false,
        default : 0.00
   
      },


});
var Order = sequelize.define('Order', {
    
    total : Sequelize.DOUBLE,
    ready :Sequelize.BOOLEAN,
    

});
var Delivery = sequelize.define('Delivery', {
    DeliveryType :{
        type : Sequelize.STRING,
        primaryKey : true,
    },
    DeliveryImage : Sequelize.STRING,
    DeliveryDescription :Sequelize.STRING,
    price : Sequelize.DOUBLE,   

});

var Address = sequelize.define('Address', {
    Address :{
        type : Sequelize.STRING,
    },
    Country : Sequelize.STRING,
    PostalCode : Sequelize.STRING,
    City : Sequelize.STRING,
    state : Sequelize.STRING,


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

Order.hasMany(Item);
Item.belongsTo(Order);

Delivery.hasMany(Cart);
Delivery.hasMany(Order);
Order.belongsTo(Delivery);
Cart.belongsTo(Delivery);

Customer.hasMany(Order,{
    foreignKey: 'CustomerId',
    onDelete: "CASCADE",
});
Order.belongsTo(Customer);
//Order.hasOne(Customer)




//Delivery.belongsTo(Order);
Address.hasOne(Order);
Order.belongsTo(Address);

StoreInfo.hasMany(StoreHours,{
    foreignKey: 'StoreInfoId',
    onDelete: "CASCADE",}
);
StoreHours.belongsTo(StoreInfo, {
    foreignKey: 'StoreInfoId',
    onDelete: "CASCADE",});

Product.hasMany(Image,{
    foreignKey: 'ProductId',
    onDelete: "CASCADE",
});
Image.belongsTo(Product,{
    foreignKey: 'ProductId',
    
    });
    
Category.hasMany(Product,{
    foreignKey : "Category"

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
    Delivery.create({
        DeliveryType : "Pick up",
        DeliveryImage : "fa-solid fa-house fa-3x",
        DeliveryDescription : "150 Market st M2R 2Z2",
        price : 0.00,   
    });
    Delivery.create({
        DeliveryType : "Delivery",
        DeliveryImage : "fa-solid fa-truck fa-3x",
        DeliveryDescription : " Same day delivery (1hr to 1:30 depending on location )",
        price : "10.00",   
    });

             StoreInfo.create({
                    storeLocation : "18 Cedarcroft Blvd",
                    maximumDeliveryDistance : 30,
                    unit : "KM"
                }).then(function(){
                    StoreHours.create({
                        weekDay : "Sunday",
                        startTime : "8:00",
                        endTime : "17:00",
                        StoreInfoId : 1
                    }).then(function(){
                        StoreHours.create({
                            weekDay : "Monday",
                            startTime : "8:00",
                            endTime : "17:00",
                            StoreInfoId : 1
                        }).then(function(){
                            StoreHours.create({
                                weekDay : "Tuesday",
                                startTime : "8:00",
                                endTime : "17:00",
                                StoreInfoId : 1
                            }).then(function(){
                                StoreHours.create({
                                    weekDay : "Wednesday",
                                    startTime : "8:00",
                                    endTime : "17:00",
                                    StoreInfoId : 1
                                }).then(function(){
                                    StoreHours.create({
                                        weekDay : "Thursday",
                                        startTime : "8:00",
                                        endTime : "17:00",
                                        StoreInfoId : 1
                                    }).then(function(){
                                        StoreHours.create({
                                            weekDay : "Friday",
                                            startTime : "8:00",
                                            endTime : "17:00",
                                            StoreInfoId : 1
                                        }).then(function(){
                                            StoreHours.create({
                                                weekDay : "Saturday",
                                                startTime : "8:00",
                                                endTime : "17:00",
                                                StoreInfoId : 1
                                            })
                                        })
                    
                                    })
                
                                })
            
                            })
        
                        })
    
                    })

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


module.exports.getStoreInfo = function(){
    return new Promise( function(resolve,reject){
        StoreInfo.findOne(
            {
                where : {
                    id : 1
                },
                include:[{
                   
                    model : StoreHours,
                    attributes: [
                        [sequelize.literal("to_char(\"startTime\", 'HH24:MI')"), 'startTime'],
                        [sequelize.literal("to_char(\"endTime\", 'HH24:MI')"), 'endTime'],
                        ["weekDay" , 'weekDay'],
                        ["createdAt" , 'createdAt']
                      ],

                    required: true,
                  
                }],
                order: [[
                'StoreHours','createdAt', 'ASC'

               ] ],
                nest : true
            
                
        }).then(function(data){
            resolve(data)


        }).catch(function(err){

            reject(err)
        })



    })


}

module.exports.updateStoreInfo = function(data){
    return new Promise( function(resolve,reject){
        StoreInfo.findOne({
            where : {
                id : 1 
            }
        }).then(async function(store){
            if(store){
              await StoreInfo.update({
                    storeLocation : data.store_address,
                    maximumDeliveryDistance : data.max_delivery_distance,
                    unit : data.unit

                },{
                   where : {
                        id : 1
                   } 
                }).then(async function(){
                    await StoreHours.update({

                        startTime : data.Sunday_from,
                        endTime : data.Sunday_to
                    },
                    {
                        where :{
                            weekDay : "Sunday",
                        }
                    }).then(async function(){
                        await StoreHours.update({
                            startTime : data.Monday_from,
                            endTime : data.Monday_to,
                        },
                        {
                            where:{
                                weekDay : "Monday",
                            }
                        }).then(async function(){
                            await StoreHours.update({
                                
                                startTime : data.Tuesday_from,
                                endTime : data.Tuesday_to,
                            },
                            {
                            where:{
                                weekDay : "Monday",
                                }
                            }
                        ).then(async function(){
                               await StoreHours.update({
                                   
                                    startTime : data.Wednesday_from,
                                    endTime : data.Wednesday_to,
                                }, {
                                    where :{
                                        weekDay : "Wednesday",

                                    }

                                }).then(async function(){
                                  await StoreHours.update({
                                        startTime : data.Thursday_from,
                                        endTime : data.Thursday_to,
                                    }, {
                                        where :{
                                            weekDay : "Thursday",
                                        }
                                    }).then(async function(){
                                       await StoreHours.update({
                                            startTime : data.Friday_from,
                                            endTime : data.Friday_to,
                                        }, {
                                            where :{
                                                weekDay : "Friday",
                                            }
                                        }).then(async function(){
                                            await StoreHours.update({
                                                startTime : data.Saturday_from,
                                                endTime : data.Saturday_to,
                                            },{
                                                where :{
                                                    weekDay : "Saturday",
                                                }
                                            }).then(function(){
                                                resolve();
                                            })
                        
                                        })
                    
                                    })
                
                                })
            
                            })
        
                        })
    
                    })
                    
                
                }).catch(function(err){
                    reject(err);

                })

            }
            else{

                StoreInfo.create({
                    storeLocation : data.store_address,
                    maximumDeliveryDistance : data.max_delivery_distance,
                    unit : data.unit
                }).then(function(){
                    StoreHours.create({
                        weekDay : "Sunday",
                        startTime : data.sunday_from,
                        endTime : data.sunday_to,
                        StoreInfoId : 1
                    }).then(function(){
                        StoreHours.create({
                            weekDay : "Monday",
                            startTime : data.monday_from,
                            endTime : data.monday_to,
                            StoreInfoId : 1
                        }).then(function(){
                            StoreHours.create({
                                weekDay : "Tuesday",
                                startTime : data.tuesday_from,
                                endTime : data.tuesday_to,
                                StoreInfoId : 1
                            }).then(function(){
                                StoreHours.create({
                                    weekDay : "Wednesday",
                                    startTime : data.wednesday_from,
                                    endTime : data.wednesday_to,
                                    StoreInfoId : 1
                                }).then(function(){
                                    StoreHours.create({
                                        weekDay : "Thursday",
                                        startTime : data.thursday_from,
                                        endTime : data.thursday_to,
                                        StoreInfoId : 1
                                    }).then(function(){
                                        StoreHours.create({
                                            weekDay : "Friday",
                                            startTime : data.friday_from,
                                            endTime : data.friday_to,
                                            StoreInfoId : 1
                                        }).then(function(){
                                            StoreHours.create({
                                                weekDay : "Saturday",
                                                startTime : data.saturday_from,
                                                endTime : data.saturday_to,
                                                StoreInfoId : 1
                                            }).then(function(){
                                                resolve();
                                            })
                        
                                        })
                    
                                    })
                
                                })
            
                            })
        
                        })
    
                    })

                })
            }

        })
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
//ORDERS


module.exports.updateDeliveryStatusOrder = function(value,id){
    return new Promise(function(resolve, reject){
        Order.update(
        {
            ready : value
        },

        {
            where: {
                id : id
            }

        })


    }).then(function(){

        resolve();
    }).catch(function(err){

        reject();

    })

}

module.exports.getOrderById = function(id){
    return new Promise(function(resolve, reject){
        Order.findAll({
            include :[{
                model : Customer,
                required : true,


            },
            {
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
                
            },
            {
                model : Delivery,
                required : true,
            },
            {
                model : Address,
                required : true,
            }],
            where :{
                id : id
            },
            nest : true
        
        }).then(function(data){

            resolve(data[0]);

        }).catch(function(err){
            console.log(err);
            reject(err);
        })





    })

    
}


module.exports.getOrders = function(){
    return new Promise(function(resolve, reject){
        Order.findAll({
            include :[{
                model : Customer,
                required : true,


            },
            {
                model : Address,
                required : true,
            },
            {
                model : Delivery,
                required : true
            }],
            order:[
                ['ready', 'ASC'],
                ['createdAt', 'DESC']
            ],

            nest : true
        
        }).then(function(data){

            console.log(data);
            console.log(data[0]);
            resolve(data);

        }).catch(function(err){
            console.log(err);
            reject(err);
        })





    })


}


module.exports.createOrder = function(cookie,data){
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
            
    

        }).then(function(cart){

            Customer.update({
                name : data.shipping.name,
                phoneNumber : data.shipping.phone
            

            }, {
                where: {
                    CartCookie : cookie 
                }
            }).then(function(){
             //   console.log(" #@$@!%$@#%@#%% " + shippingAddress)
                Address.create({
                    Address : data.shipping.address.line1 , 
                    Country : data.shipping.address.country,
                    PostalCode : data.shipping.address.postal_code,
                    City : data.shipping.address.city,
                    state : data.shipping.address.state,
                }).then(function(address){
                    Customer.findAll({
                        where:{
                            CartCookie : cookie
                        }
                   
                    }).then(function(customer){
    
                        Order.create({
                            CustomerId : customer[0].id,
                            total : cart[0].total,
                            AddressId : address.id,
                            ready : false,
                            DeliveryDeliveryType : cart[0].DeliveryDeliveryType,
                        }).then(function(order){
                    
                            Item.update({
                                OrderId: order.id
                            }, {
                                where: {
                                    CartCookie : cookie
    
                                }
    
                            }).then(function(){
                                resolve(order);
    
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



    



        }).catch(function(err){

            console.log(err);
            reject();
        })


    })





}


module.exports.getOrdersYesterday = function(){
    
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
        
        Order.findAll({

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

module.exports.getOrdersLast24hours = function(){
    
    return new Promise(function(resolve, reject){
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        
        Order.findAll({

            where :{
                createdAt: {
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
            include:[{
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
            {
                model : Delivery,
                required : true
            }] ,
                
             nest : true
            
    

        }).then(function(data){
            console.log(data)
            resolve(data[0]);
        }).catch(function(err){

            console.log("In here fail " + err);

        })

    })
}



module.exports.addItemToCart = async function(cookie,id){
    return new Promise(function(resolve,reject){
    
        Item.findAll({
            where : {
                   CartCookie : cookie,
                   ProductId : id

               },
               include:{
                model : Product,
                required: true,
            },
            nest : true
           }).then(function(obj){
               if(obj[0]){
                   Item.update(
                       {
                           quantity: sequelize.literal('quantity + 1')
                       },
                       {where : {
                           CartCookie : cookie,
                           ProductId : id
   
                       }              
                    }).then(async function(result){
                          await Cart.increment({
                               total : (1* obj[0].Product.price).toFixed(2)
                           },{
                               where :{
                                   cookie : cookie
                               }
                           }).then(function(){
                                resolve()
                           }).catch(function(err){
                            console.log(err)
                            reject(err);
                         })
   
                       }).catch(function(err){
                           console.log(err)
                           reject(err);
                       })
               }
               else{
                   Item.create({
                       ProductId : id,
                       quantity : 1,
                       CartCookie : cookie

                   }).then(function(result){

                        Product.findAll({
                            where : {
                                id :  result.ProductId
                            }
                        }).then(function(product){
                            Cart.increment({
                                total : (1 * product[0].price).toFixed(2)
                            },{
                                where :{
                                    cookie : cookie
                                }
                            }).then(function(){
                                resolve()
                            }).catch(function(err){
                                console.log(err)
                                reject(err);
                            })




                        }).catch(function(err){
                            console.log(err);
                            reject(err);
                        })



                   }).catch(function(err){
                       console.log(err)
                       reject(err);
                   }
                       
                   )
                   
               }
    
    
    })
})
}

module.exports.updateItemQuantity = function(cookie,id, value){
    return new Promise(function(resolve, reject){
        Item.findAll({
            where :{
                ProductId : id,
                CartCookie : cookie
            },
            include:{
                model : Product,
                required: true,
            },
            nest : true
        }).then(function(data){
            Item.update({
                quantity : value
            },{
                where :{
                    ProductId : id,
                    CartCookie : cookie
                }
            }).then(function(){

                if ((value - data[0].quantity) > 0)
                Cart.increment({
                    total : (data[0].Product.price * (value - data[0].quantity)).toFixed(2)
                },{
                where: {
                    cookie : cookie
                }}).then(function(){
                    resolve()
                }).catch(function(err){
                    console.log(err);
                    reject();
                })
                else{
                    console.log("In decrement");
                    console.log("data[0].Product.price * (value - data[0].quantity)" )
                    console.log(data[0].Product.price + " * (" +  value + " - " + data[0].quantity +  ")");
                    Cart.decrement({
                        total : (data[0].Product.price * (data[0].quantity - value)).toFixed(2)
                    },{
                    where: {
                        cookie : cookie
                    }}).then(function(){
                        resolve()
                    }).catch(function(err){
                        console.log(err);
                        reject();
                    })  
                }
            }).catch(function(err){
                console.log(err);
                reject();
            })

        }).catch(function(err){
            console.log(err);
            reject()
        })
        
    
    })


}

module.exports.removeItemFromCart = function(cookie, id){
    return new Promise(function(resolve,reject){
            Item.findAll({

            where : {
                   CartCookie : cookie,
                   ProductId : id

               },
               include:{
                model : Product,
                required: true,
            },
            nest : true
            }).then(function(item){

                Item.destroy({
                    where : {
                        ProductId : id,
                        CartCookie : cookie
                    }, 
                }).then(function(){
                    console.log();
                    Cart.decrement({
                        total : (item[0].quantity * item[0].Product.price).toFixed(2)
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
            })
            



    })
}


/*
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
*/
/*
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
                                total : (item[0].quantity * result[0].price)
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
*/

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
            total : 0, 
            DeliveryDeliveryType : 'Pick up'
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

//Delivery

module.exports.updateDeliveryMethod = function(cookie, method){
    return new Promise(function(resolve,reject){
        Cart.update({
            DeliveryDeliveryType : method
        },{
            where : {
                cookie :cookie
            }
        }).then(function(data){

            resolve(data);
        }).catch(function(err){

            reject(err);
        })


    })
}
module.exports.getAllDelivery = function(){
    return new Promise(function(resolve,reject){
        Delivery.findAll().then(function(data){

            resolve(data);
        }).catch(function(err){

            reject(err);
        })


    })

}

module.exports.getStoreLocation= function(){
    return new Promise(function(resolve,reject){
        StoreInfo.findAll().then(function(data){

            resolve(data);
        }).catch(function(err){

            reject(err);
        })


    })
}



