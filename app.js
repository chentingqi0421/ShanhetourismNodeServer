/* 引入express框架 */
const express = require('express');
const app = express();

var fs = require("fs");
const path = require('path')
// 引入路径

app.use(express.static(path.join('static')))


/* 引入cors */
const cors = require('cors');
app.use(cors());
var jwt = require('jsonwebtoken')

/* 引入body-parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

const tinify = require("tinify");
tinify.key = "9nwCrY58BSJHylYDrsSX5GvlYY1tzLZC";



/* 引入mysql */
const mysql = require('mysql');
const { isBuffer } = require('util');
const { Console } = require('console');
var conn;
function handleError() {
    conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3309',
        database: 'tingqichen',
        multipleStatements: true
    })

    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError, 2000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}

handleError();

/* 监听端口 */
app.listen(2020, () => {
    console.log('——————————陈廷奇的服务已启动——————————');
})
//设置请求操作保持数据活跃

app.get('/', (req, res) => {
    res.send('<img style="width:100%;height:450px" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3658379912,845864056&fm=26&gp=0.jpg"><h1 style="color:red;margin-left:40%" >陈廷奇的服务正在运行</h1>');
})
//设置跨域访问  
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



//获取顶部广告图片列表数据
app.get('/api/imgurl', (req, res) => {
    const sqlStr = 'SELECT * FROM topimages'
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        res.json({ code: 10000, list: results })
        return 
    })
}),
    //获取首页游记列表数据
    app.get('/api/homeimages', (req, res) => {
        const sqlStr = 'SELECT * FROM homeimages'
        conn.query(sqlStr, (error, results) => {
            if (error) return 
            return  res.json({ code: 10000, list: results })
            
        })
    })
// 商品点赞和获取
app.get('/api/recinfo', (req, res) => {
    let index = req.body.index
    console.log(index)
    const sqlStr = 'SELECT * FROM recinfo'
    conn.query(sqlStr, (error, results) => {
        var change = JSON.parse(JSON.stringify(results));
        if (error) return 
       
        var change = JSON.parse(JSON.stringify(results));
        return  res.json({ code: 10000, list: change, message: '成功了', id: change[0].id, index: index })
        

    })
})
//获取热门游记广州列表数据
app.get('/api/guangzhou', (req, res) => {


    const sqlStr = 'SELECT * FROM guangzhou'
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return  res.json({ code: 10000, list: results })
    })


})
//获取收藏信息
app.get('/api/getcollect', (req, res) => {
    let phonename=req.query.phonename
    let onlyid=req.query.onlyid
    let action=req.query.action
    const sqlStr = "SELECT * FROM collect where tel = '" + phonename + "' and onlyid='" + onlyid + "'"
    const sqlStrget = "SELECT * FROM collect where tel = '" + phonename + "'"
    if(action==="getcollect"){
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        res.json({ code: 200, list: results })
        return  
    })
}else{
    conn.query(sqlStrget, (err, results2) => {
        if (err) return 
        res.json({ code: 200, list: results2 })
        return  
})
}


})
//收藏商品
app.get('/api/collectgoods', (req, res) => {
    let phonename=req.query.phonename
    let onlyid=req.query.onlyid
    let title=req.query.title
    let price=req.query.price
    let img=req.query.img
    let action=req.query.action
    
    const deletegoods = " DELETE from collect where tel = '" + phonename + "' and onlyid='" + onlyid + "'";
 if(action=="like"){
    conn.query('INSERT INTO collect SET  ?', { tel: phonename, onlyid: onlyid, title: title,price:price,img:img }, function (err, results) {
        if (err) return 
        return  res.json({ code: 100})
        
    })
}else{
conn.query(deletegoods,(error,results)=>{
    if (error) return 
        return  res.json({ code: 200})
        
    })

}
})
//取消收藏
app.get('/api/delecollect', (req, res) => {
    let phonename=req.query.phonename
    let onlyid=req.query.onlyid
    const deletegoods = " DELETE from collect where tel = '" + phonename + "' and onlyid='" + onlyid + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return res.json({ code: 0, message: err })
            
        } else {

          
                return res.json({ code: 200, message: "取消成功" })
                
            

        }
    })

})
//获取商品列表1数据
app.get('/api/goodsinfo', (req, res) => {

    const sqlStr = 'SELECT * FROM goodsinfo'
    conn.query(sqlStr, (error, results) => {
        if (error) return 

        return  res.json({ code: 10000, list: results })
    })


})
//获取商品列表2数据
app.get('/api/goodsinfo1', (req, res) => {

    const sqlStr = 'SELECT * FROM goodsinfo2'
    conn.query(sqlStr, (error, results) => {
        if (error) return 

        return   res.json({ code: 10000, list: results })
    })


})
//获取商品列表3数据
app.get('/api/goodsinfo2', (req, res) => {
    const sqlStr = 'SELECT * FROM goodsinfo3'
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return res.json({ code: 10000, list: results })
    })


})

// 账号操作
//注册接口
app.post('/api/regist', (req, res) => {
    //获取前端传值
    let phone = req.body.username
    let pwd = req.body.password
    let pwd2 = req.body.password2
    let telphone = req.body.phone
//判断用户密码是否一致
    if (pwd == pwd2) {
        // 执行sql语句查询是否存在注册用户信息
        const sqlStr = "SELECT tel from userinfo WHERE tel = '" + telphone + "'";
        conn.query(sqlStr, (err, results) => {
            console.log(results + "----")
            let uName = results[0]
            if (uName == undefined) {
//设置SQL语句将用户信息插入用户表
                conn.query('INSERT INTO userinfo SET  ?', { username: phone, password: pwd, tel: telphone }, function (err, results) {
                    if (err) {
                        console.log('err')
                        return res.json({ code: 0, message: '注册失败，请重试' })


                    }
                    //返回执行结果给前端
                     else {
                        err
                        return res.json({ code: 200, message: '注册成功，请登录' })

                    }
                })
            }

            else {
                return res.json({ code: 100, message: '账号已存在快去登陆吧' })

            }

        })
    } else {
        res.json({ code: 300, message: '密码不一致！请重新输入' })
    }

})

//登陆接口
app.post('/api/login', (req, res) => {
      //获取前端传值
    let name = req.body.phone
    let pwd = req.body.password
    //sql语句先查询登陆账号是否为会员
    const sqlStr = "SELECT tel from userinfo WHERE tel = '" + name + "'";
    conn.query(sqlStr, (err, results) => {
        console.log(results + "----")
        let uName = results[0]
        if (uName == undefined) {
            return   res.json({ code: 100, message: '您还没有账号！请先注册' })
            
        }
        else {
            //通过账号和密码作为sql查询条件判断用户名密码是否正确
            const sqlStr = "select * from userinfo where tel = '" + name + "' and password = '" + pwd + "'";
            conn.query(sqlStr, function (err, results) {
                if (err) {
                    console.log('err', err);
                    return
                }

                if (results == '') {

                    return  res.json({ code: 201, message: '密码错误' })
                    
                }

                // 3. 生成token
                const payload = {
                    name: 'boom',
                    exp: 60 * 60 * 2
                }
                const secret = 'CTQA'
                const token = jwt.sign(payload, secret) // 签发用户Token凭证
                console.log(results)
                console.log(token)
                console.log('密码正确');
                var change = JSON.parse(JSON.stringify(results));
                //返回前端信息
                return res.json({ code: 200, message: '登录成功', tel: change[0].tel, user: change[0].username, userimg: change[0].userimg, motto: change[0].motto, email: change[0].email, token })
                var propertys = Object.getOwnPropertyNames(results)

            })
        }



    })

})
// 修改用户信息
app.post('/api/modifyUserInfo', (req, res) => {
    let name = req.body.phone
    let motto = req.body.motto
    let email = req.body.email
    let nickname = req.body.username
    console.log('用户值===》' + req.body)
    console.log('用户账号===》' + req.body.phone)
    console.log('用户输入===》' + req.body.motto, req.body.username)
    const updata = "UPDATE userinfo SET motto='" + motto + "' , username = '" + nickname + "', email = '" + email + "' where tel ='" + name + "'";
    const returndata = "select * from userinfo where tel = '" + name + "' ";
    conn.query(updata, (err, results) => {
        if (err) {
            console.log('err', err);
            return res.json({ code: 0, message: err })
            
        } else {

            conn.query(returndata, (err, newresults) => {
                var change = JSON.parse(JSON.stringify(newresults));
                if (err) {
                    console.log('err', err);
                    return  res.json({ code: 0, message: err })
                    
                } else {
                    console.log('change==》', change[0])
                    return  res.json({ code: 200, message: '修改成功', email: change[0].email, nickname: change[0].username, motto: change[0].motto, })
                    
                }
            })



        }

    })



})
// 修改手机
app.post('/api/changephone', (req, res) => {
    let username = req.body.currenphone
    let phone = req.body.newphone
    let pwd = req.body.password
    const updata = "UPDATE userinfo SET tel='" + phone + "'  where tel = '" + username + "' and password = '" + pwd + "'";
    const check = "SELECT tel from userinfo WHERE tel = '" + phone + "'";
    console.log('用户新账号===》' + phone)
    conn.query(check, (err, results) => {
        if (results != "") {
            return  res.json({ code: 0, message: "存在的手机号，请更换！" })
            
            console.log('不能修改一样的手机号')
        }
        else {

            conn.query(updata, (err, results2) => {
                if (err) {
                    console.log('err', err);
                    return  res.json({ code: 404, message: err })
                    
                }
                return res.json({ code: 200, message: "更换成功！新账号为：" + phone, newphone: phone })
                
            })
        }
    })
})
//忘记支付密码
app.post('/api/forgetpayword', (req, res) => {
    let phonename = req.body.phonename
    let name = req.body.name
    let identitycard = req.body.identitycard
    let password = req.body.payword2
    console.log("输入结果",name,identitycard,password)
    const check = "SELECT name,identitycard from userinfo WHERE tel = '" + phonename + "'";
    const updata = "UPDATE userinfo SET password='" + payword + "'  where tel = '" + phonename + "'";
    
        conn.query(check, (err, results) => {
            console.log("查询结果",results[0].name,results[0].identitycard)
  if(results[0].name==name&&results[0].identitycard==identitycard){
    conn.query(updata, (err, result) => {
        return res.json({ code: 200, message: "重置成功！" })
    })

  }else{
    return res.json({ code: 100, message: "验证错误！请重试" })
  }
        })
   
})


//忘记登陆密码
app.post('/api/forgetpassword', (req, res) => {
    let phonename = req.body.phonename
    let name = req.body.name
    let identitycard = req.body.identitycard
    let password = req.body.password2
    console.log("输入结果",name,identitycard,password)
    const check = "SELECT name,identitycard from userinfo WHERE tel = '" + phonename + "'";
    const updata = "UPDATE userinfo SET password='" + password + "'  where tel = '" + phonename + "'";
    
        conn.query(check, (err, results) => {
            console.log("查询结果",results[0].name,results[0].identitycard)
  if(results[0].name==name&&results[0].identitycard==identitycard){
    conn.query(updata, (err, result) => {
        return res.json({ code: 200, message: "重置成功！" })
    })

  }else{
    return res.json({ code: 100, message: "验证错误！请重试" })
  }
        })
   
})

//修改密码
app.post('/api/changepassword', (req, res) => {
    let phonename = req.body.phonename
    let payword = req.body.password
    let password1 = req.body.password1
    let password2 = req.body.password2

    const check = "SELECT password from userinfo WHERE tel = '" + phonename + "'and password='" + payword + "'";
    const updata = "UPDATE userinfo SET password='" + password1 + "'  where tel = '" + phonename + "'";
    if (password1 == password2) {
        conn.query(check, (err, results) => {
            if (results == "") {
                return res.json({ code: 100, message: "密码验证错误！" })
                
            }
            conn.query(updata, (err, results2) => {
                if (err) {
                    return   res.json({ code: 404, message: err })
                    
                   
                }
                return  res.json({ code: 200, message: "密码更新成功！请重新登陆" })
                
            })
        })
    } else {
        res.json({ code: 0, message: "密码不一致！" })
        return
    }
})

//检测有没有密码
app.post('/api/havepayword', (req, res) => {
    let phonename = req.body.phonename
    console.log("====>" ,phonename)
    const updata = "SELECT payword from userinfo WHERE tel = '" + phonename + "'";
    conn.query(updata, (err, results) => {
        console.log('===>results' + results[0].payword)

        if (results[0].payword == null) {
            return  res.json({ code: 100, message: "您还没有设置支付密码！", payword: 0 })
            
        }
        return res.json({ code: 200, message: "有支付密码！", payword: 1 })
        

    })

})
// 设置密码
app.post('/api/setpayword', (req, res) => {
    let phonename = req.body.phonename
    let payword1 = req.body.payword1
    let payword2 = req.body.payword1
    const updata = "UPDATE userinfo SET payword='" + payword1 + "'  where tel = '" + phonename + "'";
    if (payword1 == payword2) {
        conn.query(updata, (err, results) => {
            if (err) {
                console.log('err', err);
                return  res.json({ code: 404, message: err })
                
            }
            return  res.json({ code: 200, message: "设置成功！" })
            
        })

    }
    else {
        return   res.json({ code: 100, message: "密码不一致！" })
        
    }
})

// 支付密码
app.post('/api/changepayword', (req, res) => {
    let phonename = req.body.phonename
    let payword = req.body.payword
    let payword1 = req.body.payword1
    let payword2 = req.body.payword2
    const check = "SELECT payword from userinfo WHERE tel = '" + phonename + "'and payword='" + payword + "'";
    const updata = "UPDATE userinfo SET payword='" + payword2 + "'  where tel = '" + phonename + "'";
    if (payword1 == payword2) {
        conn.query(check, (err, results) => {
            if (results == "") {
                return  res.json({ code: 100, message: "密码验证错误！" })
                
            }
            conn.query(updata, (err, results2) => {
                if (err) {
                    return  res.json({ code: 404, message: err })
                    

                }
                return   res.json({ code: 200, message: "密码更新成功！" })
                
            })
        })
    } else {
        return  res.json({ code: 0, message: "密码不一致！" })
        console.log('密码不一致')
        
    }
})
//验证支付密码
app.get('/api/checkpayword', (req, res) => {

    let phonename = req.query.phonename
    let payword = req.query.payword
    let goodsinfo=req.query.goodsInfo
    console.log("xinxi",req.query.goodsInfo)
    const check = "SELECT * from userinfo WHERE tel = '" + phonename + "'and payword='" + payword + "'";
    conn.query(check, (err, results) => {
        console.log(results)
        if (results[0] == undefined) {
            return  res.json({ code: 100, message: "密码错误！" })
            
        }
        return  res.json({ code: 200, message: "支付成功！" })
        
    })

})
// 验证密码成功后保存订单
app.post('/api/saveorder', (req, res) => {
    let goodsInfo = req.body.goodsInfo[0]
    let username=req.body.username
    let onlyid = goodsInfo.onlyid
    let price = goodsInfo.price
    let goodsplace = goodsInfo.goodsplace
    let title = goodsInfo.title
    let date = goodsInfo.date
    let people = goodsInfo.people
    let peopleinfo = req.body.peopleInfo
    let payprice = req.body.payprice
    let paytime=req.body.paytime
    let noteinfo=req.body.noteInfo
    let phonename=req.body.phonename
    let goodsimg=goodsInfo.imgurl
    let payflag=req.body.payflag
    let orderid=req.body.orderid
    var str=JSON.stringify(peopleinfo);

    console.log("订单信息",str)
    conn.query('INSERT INTO orderinfo SET  ?', { onlyid: onlyid,orderid:orderid,status:payflag,tel:phonename, price:price,goodsimg:goodsimg, place:goodsplace,title:title,date:date,people:people,payprice:payprice,username:username,time:paytime,noteinfo:noteinfo,peopleinfo:str}, function (err, results) {
    if(err){
        console.log(err)
    }
    console.log(results)
    
    })
})
//获订单返回值
app.get('/api/orderform', (req, res) => {
    
    let phonename=req.query.phonename
    const sqlStr = "SELECT * FROM orderinfo where  tel = '" +phonename + "' "
    conn.query(sqlStr, (error, results) => {
        if (error){
            return  res.json({ code: 0, error})
        } else{
            
                return  res.json({ code: 200, list: results })
             
        }
       
        
    })
})

//完成订单
app.get('/api/doneorder', (req, res) => {
    let phonename=req.query.phonename
    let onlyid=req.query.onlyid
    let orderid=req.query.orderid
    const updata = "UPDATE orderinfo SET status='done'  where tel = '" + phonename + "'and orderid = '" + orderid + "'";
    
        conn.query(updata, (err, results) => {
            if (err) {
                console.log('err', err);
                return  res.json({ code: 404, message: err })
                
            }
            return  res.json({ code: 200, message: "收货成功！" })
            
        })

})

//删除订单
app.get('/api/deleorder', (req, res) => {
    let phonename=req.query.phonename
    let orderid=req.query.orderid
    const deletegoods = " DELETE from orderinfo where tel = '" + phonename + "' and orderid='" + orderid + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return res.json({ code: 0, message: err })
            
        } else {

          
                return res.json({ code: 200, message: "删除成功" })
                
            

        }
    })

})
//实名验证
app.post('/api/confirmation', (req, res) => {
    let phonename = req.body.phonename
    let name = req.body.name
    let  identitycard = req.body. identitycard
    const sqlStr = "SELECT name FROM userinfo where  name = '" +name + "' "
    const updata = "UPDATE userinfo SET name='" + name + "',identitycard='" +identitycard + "'  where tel = '" + phonename + "'";
    conn.query(sqlStr, (err, result) => {
        console.log(name,result[0])
if(result[0]!==undefined){
console.log("有数据")
    return  res.json({ code: 100, message:"已存在实名账号！" })
}
else{
            conn.query(updata, (err, results) => {
            if (err) {
                console.log('err', err);
                return  res.json({ code: 404, message:"设置失败！" })
                
            }
            return  res.json({ code: 200, message: "设置成功！" })
            
        })
}    

    })   
    
   
})
//验证实名信息
app.get('/api/getconfirmation', (req, res) => {
    
    let phonename=req.query.phonename
    const sqlStr = "SELECT name FROM userinfo where  tel = '" +phonename + "' "
    conn.query(sqlStr, (error, results) => {
        if (error){
            return  res.json({ code: 0, error})
        } else{
            // if( results[0].likeimg!=''){
             
                return  res.json({ code: 200, list: results[0] })
            // }
           
           
            
        }
       
        
    })
})

//删除注销用户
app.post('/api/clean', (req, res) => {
    let password = req.body.password
    let phonename = req.body.currenphone
    console.log('===>phone' + phonename)
    console.log('===>phone2' + password)
    const check = "SELECT * from userinfo WHERE password= '" + password + "' and tel= '" + phonename + "'";
    const deleteuser = " DELETE from userinfo where tel = '" + phonename + "'";
    conn.query(check, (err, results1) => {
        console.log('===>密码查询' + results1[0])
        if (results1[0] == undefined) {
            return res.json({ code: 0, message: "密码错误！" })
            
        } else {
            conn.query(deleteuser, (err, results2) => {
                if (err) {
                    return   res.json({ code: 404, message: err })
                    
                }
                return  res.json({ code: 200, message: '山水有相逢，下次再见' })
                

            })
        }
    })

})
//修改用户的头像
app.post('/api/updateAvatar', urlencodedParser, (req, res) => {
    let name = req.body.phone

    let getimg = req.body.serverBase64Img;
    var dataimg = getimg.replace(/^data:image\/\w+;base64,/, '')
    var path = './static/img/images' + Date.now() + '.png';
    var datenew = Date.now();
    var dataBuffer = Buffer.from(dataimg, 'base64');
    const img = 'images' + datenew + '.png';
    const databaseimg = 'http://119.29.36.88:2020/img/' + img;
    console.log('databases====>' + databaseimg)
    const updata = "UPDATE userinfo SET userimg = '" + databaseimg + "' where tel ='" + name + "'";
    fs.writeFile(path, dataBuffer, function (err) {
        if (err) return
        conn.query(updata, (err, newresults) => {
            if (err) {
                return res.json({ code: 0, message: '头像更换失败请重试' })
                console.log('更新的图片===》' + databaseimg)
            }
            console.log('图片保存成功')
            return  res.json({ code: 200, message: '头像更换成功', img })
            




        })
    })
})
//上传图片发表旅游
app.post('/api/share', urlencodedParser, (req, res) => {
    //获取前台传值
    let tel = req.body.phone
    let sharetoken = req.body.sharetoken
    let getimg = req.body.fileList;
    let userimg = req.body.userimg;
    let username = req.body.username;
    let title = req.body.title;
    let text = req.body.text;
    let time = req.body.time;
    let place = req.body.place;
    let topimg = req.body.topimg;
    console.log(tel, sharetoken, time, title, text, place)
    // 设置Sql语句操作数据库
    const updata = "UPDATE shareinfo SET  userimg = '" + userimg + "', title = '" + title + "',time = '" + time + "',text = '" + text + "',place = '" + place + "',username = '" + username + "' where tel ='" + tel + "' and sharetoken = '" + sharetoken + "'";
//设置图片生成名字
    var datenew = Date.now();
    const img = 'images' + datenew + '.png';
    const databaseimg = 'http://119.29.36.88:2020/share/' + img;
    var path = './static/share/images' + Date.now() + '.png';
    console.log('imgurl====>' + databaseimg)
    
    if (getimg != undefined) {
        //base64解码
        var dataimg = getimg.replace(/^data:image\/\w+;base64,/, '')
        var dataBuffer = Buffer.from(dataimg, 'base64');
        fs.writeFile(path, dataBuffer, function (err) {
           //压缩图片大小方便前段加载
           
           const source = tinify.fromFile(path);
            source.toFile(path);
            //存储状态信息sql语句插入数据库
            conn.query('INSERT INTO  shareinfo SET  ?', { tel: tel, topimg: topimg, imgurl: databaseimg, sharetoken: sharetoken }, function (errs, results) {
                
                console.log('图片保存成功')
                
                

            })


        })

    }
    conn.query(updata, (err, updateres) => {
        if (err) {
            console.log(err)
            return res.json({ code: 00, message: '发布失败！' })
            
        }
        console.log('发布成功', updateres)
        return  res.json({ code: 200, message: '发布成功！' })
        
    })


})
//评论商品
app.post('/api/commentgoods', urlencodedParser, (req, res) => {
    let tel = req.body.phone
    let onlyid = req.body.onlyid
    let orderid = req.body.orderid
    let username = req.body.username;
    let userimg = req.body.userimg;
    let title = req.body.goods;
    let text = req.body.text;
    let time = req.body.time;
   let  value=req.body. value
    let getimg= req.body.fileList
    console.log(tel, value, time, title, text, username,orderid)
    const updata = "UPDATE goodscommts SET  value = '" + value + "',goods = '" + title + "',time = '" + time + "',text = '" + text + "',orderid = '" + orderid + "' where tel ='" + tel + "' and orderid= '" + orderid+ "'";
//设置图片生成名字
const selectsql= "SELECT goodsimg FROM goodscommts where orderid ='"+orderid+ "'";
    var datenew = Date.now();
    const img = 'images' + datenew + '.png';
    const databaseimg = 'http://119.29.36.88:2020/comment/' + img;
    const databasejson="+databaseimg+"
    var path = './static/comment/images' + Date.now() + '.png';
    console.log('imgurl====>' + databaseimg)
    
    if (getimg !==undefined) {
        //base64解码
        var dataimg = getimg.replace(/^data:image\/\w+;base64,/, '')
        var dataBuffer = Buffer.from(dataimg, 'base64');
        fs.writeFile(path, dataBuffer, function (err) {
           //压缩
           
           const source = tinify.fromFile(path);
            source.toFile(path);
            
conn.query(selectsql,(error,checkresults)=>{
if(error){
    console.log(error)
}else{
    console.log("ssasdasd",checkresults[0])
    
    if(checkresults[0]===undefined){
        conn.query('INSERT INTO  goodscommts SET  ?', { tel: tel, userimg:userimg,goodsimg:databaseimg, username,username,onlyid: onlyid ,orderid,orderid}, function (errs, results) {
            if(errs){
console.log(errs)
            }
            console.log('图片保存成功')
        
        })
        
    }else{
        var str=[]
        var datas=checkresults[0].goodsimg
        str.push(datas )
        str.push(databaseimg) 
        // JSON.stringify(str)
        console.log(str)
        const updata = "UPDATE goodscommts SET  goodsimg='"+str+"' where orderid ='"+orderid+ "'";
        conn.query(updata , function (errs, results) {
            if(errs){
    console.log(errs)
            }
            console.log('图片2保存成功')
        })
            
    }  
               
}

})
        })

    }else{
    conn.query(updata, (err, updateres) => {
        if (err) {
            console.log(err)
            return res.json({ code: 00, message: '评论失败！' })
            
        }
        const updatacomment = "UPDATE orderinfo SET comment='"+onlyid+"' where orderid ='"+orderid+ "'";
        conn.query(updatacomment, function (errs, results) {
        })
        console.log('发布成功', updateres)
        return  res.json({ code: 200, message: '评论成功！' })

        
    })
}


})
//获取评论
app.get('/api/getgoodscomment', (req, res) => {
    let onlyid=req.query.onlyid
    console.log(onlyid)
    const sqlStr = "SELECT * FROM goodscommts where onlyid ='" + onlyid + "' "
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return  res.json({ code: 200, list: results })
        
    })
})
//获取分享的游记
app.get('/api/getshareinfo', (req, res) => {
    const sqlStr = 'SELECT * FROM shareinfo'
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return  res.json({ code: 200, list: results })
        
    })
})
//获取个人游记
app.get('/api/getmyshareinfo', (req, res) => {
    let phonename=req.query.phonename
    const sqlStr = "SELECT * FROM shareinfo where tel = '" + phonename + "' "
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return  res.json({ code: 200, list: results })
        
    })
})
//删除个人游记
app.get('/api/delenote', (req, res) => {
    let sharetoken=req.query.sharetoken
    const sqlStr = "DELETE FROM shareinfo where  sharetoken = '" +sharetoken + "' "
    conn.query(sqlStr, (error, results) => {
        if (error) return 
        return  res.json({ code: 200, message: "删除成功" })
        
    })
})
//根据id获取游记数据
app.get('/api/getshareinfobytoken', (req, res) => {
    let tel=req.query.tel
    let sharetoken=req.query.sharetoken
    const sqlStr = "SELECT * FROM shareinfo where tel = '" + tel + "'and sharetoken = '" +sharetoken + "' "
    conn.query(sqlStr, (error, results) => {
        if (error){
            return  res.json({ code: 0, error})
        } else{
            return  res.json({ code: 200, list: results })
            console.log(results,"sssss")
        }
       
        
    })
})
//获取点赞照片
app.get('/api/getlikeimg', (req, res) => {
    
    let sharetoken=req.query.sharetoken
    const sqlStr = "SELECT likeimg FROM shareinfo where  sharetoken = '" +sharetoken + "' "
    conn.query(sqlStr, (error, results) => {
        if (error){
            return  res.json({ code: 0, error})
        } else{
            if( results[0]!=''){
             
                return  res.json({ code: 200, list: results[0] })
            }
           
           
            
        }
       
        
    })
})
//点赞共能
app.post ('/api/likeshareinfo', (req, res) => {
    let userimg=req.body.userimg
    let sharetoken=req.body.sharetoken
    let likecount=req.body.like
    let likecount2= Number(likecount) + 1
    console.log(userimg,likecount,likecount2,sharetoken)
    const sqlStr = "SELECT likeimg,likecount FROM shareinfo where sharetoken ='"+sharetoken+ "'";
   
    const updata = "UPDATE shareinfo SET  likecount='"+likecount2+"' where sharetoken ='"+sharetoken+ "'";
    conn.query(updata, (error, results) => {
        if (error){
            return  res.json({ code: 0, error})
        } else{
            conn.query(sqlStr, (err, results2) => {
                
                var str=[]
                if(results2[0].likeimg==""){
                  
                    str.push(userimg) 
                    console.log("kong!!")
                    return  res.json({ code: 2000, results2s})
                }else{
                    str.push(results2[0].likeimg )
                    str.push(userimg) 
                }
               
                const insert = "UPDATE shareinfo SET  likeimg = '" +str+ "' where sharetoken ='"+sharetoken+ "'";
                
                conn.query(insert, (err, res2) => {
                    if (err){
                        
                        console.log(error)
                    } else{
                        console.log(res2)
                         return  res.json({ code: 200, list:res2,results2})
                    }
                })
               
            })
           
        }
       
        
    })
})
//评论
app.get('/api/savecomment', (req, res) => {
    let username=req.query.username
    let tousername=req.query.tousername
    let sharetoken=req.query.sharetoken
    let message=req.query.message
    let userimg=req.query.userimg
    console.log(username,tousername,message,sharetoken)
    conn.query('INSERT INTO  comment SET  ?', { username: username,tousername: tousername, message: message, sharetoken: sharetoken,usernameimg:userimg }, function (errs, results) {
        
        if (errs){
            return  res.json({ code: 0, errs})
        } else{
            return  res.json({ code: 200, message:"回复成功"})
        }
       
        
    })
}) 
//获取评论
app.get('/api/getcomment', (req, res) => {
    let sharetoken=req.query.sharetoken
    const sqlStr = "SELECT * FROM comment where  sharetoken = '" +sharetoken + "' "
    conn.query( sqlStr,(errs, results)=> {
        
        if (errs){
            return  res.json({ code: 0, error})
        } else{
            return  res.json({ code: 200, data:results})
        }
       
        
    })
})            

// 商品操作
// 商品详情
app.get('/api/goodsbag', (req, res) => {
    let goodsid = req.query.goodsid

    const getdata = "SELECT * from goodsinfo WHERE id = '" + goodsid + "'";

    conn.query(getdata, (err, results) => {
        if (err) {
            res.json({ code: 0, message: err })
            return;
        }
        // results = JSON.parse(results);


        var arr = results[0].goodsimg.split(',');
        var arr1 = results[0].topimages.split(',');
        res.json({ code: 200, images: arr, data: results[0], images2: arr1 })
        return;
    })

})

app.get('/api/goodsbag2', (req, res) => {
    let goodsid = req.query.goodsid
    const getdata = "SELECT * from goodsinfo2 WHERE id = '" + goodsid + "'";

    conn.query(getdata, (err, results) => {
        if (err) {
            return res.json({ code: 0, message: err })
            
        }
        // results = JSON.parse(results);


        var arr = results[0].goodsimg.split(',');
        var arr1 = results[0].topimages.split(',');
        return  res.json({ code: 200, images: arr, data: results[0], images2: arr1 })
        
    })

})
app.get('/api/goodsbag3', (req, res) => {
    let goodsid = req.query.goodsid

    const getdata = "SELECT * from goodsinfo3 WHERE id = '" + goodsid + "'";

    conn.query(getdata, (err, results) => {
        if (err) {
            return  res.json({ code: 0, message: err })
            
        }
        // results = JSON.parse(results);


        var arr = results[0].goodsimg.split(',');
        var arr1 = results[0].topimages.split(',');
        return  res.json({ code: 200, images: arr, data: results[0], images2: arr1 })
        
    })

})


//添加购物车
app.post('/api/addshopbag', (req, res) => {
    // 获取前端传值
    let onlyid = req.body.onlyid
    let phonename = req.body.phonename
    let price = req.body.price
    let title = req.body.title
    let imgurl = req.body.imgurl
    let date = req.body.date
    let valueArea = req.body.valueArea
    let nowpeople = req.body.people
// 根据账号设置sql语句获取相应购物车信息
    const getpeople = "SELECT * from shopbag WHERE onlyid = '" + onlyid + "'and tel='" + phonename + "'";

    conn.query(getpeople, (err, result1) => {
        if (result1 != "") {
            let people = result1[0].people
            let addpeople = people + nowpeople
            //sql语句添加商品信息
            conn.query("UPDATE shopbag SET people='" + addpeople + "'  where onlyid = '" + onlyid + "'")
            return  res.json({ code: 200, message: "加入成功" })
        } else {
            let people = 0
            let addpeople = people + nowpeople

            conn.query('INSERT INTO shopbag SET  ?', { onlyid: onlyid, tel: phonename, price: price, title: title, imgurl: imgurl, date: date, people: addpeople, goodsplace: valueArea }, function (err, results) {
                if (err) {
                    return res.json({ code: 0, message: err })
                    
                }
                //返回状态信息给前端
                return  res.json({ code: 200, message: "加入成功" })
                
            })
        }

    })

})

//获取购物车
app.get('/api/getgoods', (req, res) => {
    let phonename = req.query.phonename
    console.log('phonae=====>' + phonename)

    const getdata = "SELECT onlyid,price,goodsid,goodsplace,title,imgurl,date,people,isChecked,peopleinfo from shopbag WHERE tel= '" + phonename + "'";

    conn.query(getdata, (err, results) => {
        if (err) {
            return  res.json({ code: 0, message: err })
           
        }
        var str = !!'';
        var results1 = []
        for (let i = 0; i < results.length; i++) {

            results[i].isChecked = !!results[i].isChecked

        }

        return  res.json({ code: 200, message: results })
        
    })

})

//删除商品
app.get('/api/deletegoods', (req, res) => {
    let phonename = req.query.phonename
    let onlyid = req.query.onlyid
    console.log(onlyid + '=====' + phonename)
    const getdata = "SELECT * from shopbag ";
    const deletegoods = " DELETE from shopbag where onlyid = '" + onlyid + "' and tel='" + phonename + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return res.json({ code: 0, message: err })
            
        } else {

            conn.query(getdata, (err, results1) => {
                if (results1[0] == undefined) {
                    return res.json({ code: 100, message: "空空如也" })
                    console.log('nulllllll')
                   
                }
                return res.json({ code: 200, message: "删除成功" })
                
            })

        }
    })

})


//更改数量
app.get('/api/changegoods', (req, res) => {
    let onlyid = req.query.onlyid
    let people = req.query.people
    let phonename = req.query.phonename
    console.log("===onlyid" + onlyid)
    console.log("===people" + people)
    console.log("===phonename" + phonename)
    const deletegoods = " UPDATE shopbag SET people = '" + people + "' where onlyid = '" + onlyid + "'and tel='" + phonename + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return  res.json({ code: 0, message: err })
            
        } else {


            return  res.json({ code: 200, message: "更新成功" })
            
        }

    })


})

//常用出游人员

app.get('/api/getpeopleinfo', (req, res) => {
    let phonename = req.query.phonename
    console.log('phonae=====>' + phonename)

    const getdata = "SELECT * from people_info WHERE username= '" + phonename + "'";

    conn.query(getdata, (err, results) => {
        if (err) {
            return  res.json({ code: 0, message: err })
            
        }


        return res.json({ code: 200, message: results })
        
    })

})
//添加人员信息
app.get('/api/addpeopleinfo', (req, res) => {
    let phonename = req.query.phonename
    let name = req.query.name
    let tel = req.query.tel
    let str={name:name,tel:tel}
    conn.query('INSERT INTO people_info SET  ?', { username: phonename, tel, name }, function (err, results) {


        if (err) {
            return  res.json({ code: 0, message: err })
            
        }


        return res.json({ code: 200, message: "添加成功", data: str })
        
    })

})
//编辑信息      
app.get('/api/changepeople', (req, res) => {
    let onlyid = req.query.id
    let name = req.query.name
    let phonename = req.query.phonename
    let tel = req.query.tel

    const deletegoods = " UPDATE people_info SET name = '" + name + "',tel = '" + tel + "' where id = '" + onlyid + "'and username='" + phonename + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return res.json({ code: 0, message: err })
            
        } else {


            return  res.json({ code: 200, message: "更新成功" })
            
        }

    })
})
//删除人员
app.get('/api/deletepeople', (req, res) => {
    let onlyid = req.query.id
    let phonename = req.query.phonename
    const deletegoods = " DELETE from people_info where id = '" + onlyid + "' and username='" + phonename + "'";

    conn.query(deletegoods, (err, results) => {
        if (err) {
            return   res.json({ code: 0, message: err })
            
        } else {


            return  res.json({ code: 200, message: "删除成功" })
           
        }

    })
})
