var fs=require('fs');
var async =require('async');
var JFile=require('jfile');
var Page=require('../page.model');
var breaker=require('../breaker');
var bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
var tmp="layout";
var mongoose = require('mongoose');
var fs = require('fs');
var JsonDB = require('node-json-db');
var resolve=require('resolve');
var reload = require('reload');
var cdt="data";
var clientdate;






var urlencodedParser = bodyParser.urlencoded({extended:false});
module.exports = function(app,root_path){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    var pageComponents={};
    var config;
    var login;

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
   
        const prox1=new Promise(()=>{
            setTimeout(()=>{
            var db = new JsonDB(root_path+'/db', true, false);
             var usr=db.getData("/users");
             var arrFound = Object.keys(usr).filter(function(key) {
                 if(usr[key].email === email && usr[key].password === password)
                 {
                    
                    login=usr[key];
                    return done(null, login);
                 }
          // to cast back from an array of keys to the object, with just the passing ones
          })
          },100);//changed from 1000
          
        });
    Promise.all([prox1]).then(
     //console.log(login)
      )
      .catch(error => done(error)); 
    }
  ));
  
  
// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  

  passport.deserializeUser((id, done) => {

    var login;
    const prox=new Promise(()=>{
        setTimeout(()=>{
        var db = new JsonDB(root_path+'/db', true, false);
         var usr=db.getData("/users");
         var arrFound = Object.keys(usr).filter(function(key) {
             if(usr[key].id === id)
             { 
                login=usr[key];
               return done(null, login.id);
             } 
           

      })
      },100);//changed from 1000
      
    });
    Promise.all([prox]).then().catch(error => done(error)); 
  });


// add & configure middleware
app.use(session({
    genid: (req) => {
      return uuid()
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

  

app.get('/admin',(req,res)=>{
    if(req.session.passport!=undefined){
    var text =root_path+'/views/templates/template1/components/custom/pages.ejs';
    var pagejson = new JsonDB(root_path+'/views/extras/pages', true, false);
    var pages=pagejson.getData('/pages');
          var articlesEndpoints=[];
          setTimeout(()=>{
            var fdb = new JsonDB(root_path+'/views/templates/'+tmp+'/pageList', true, false);
            var allpages=fdb.getData('/pages');
         
          },3000);
          var pageComponents={"pageTitle":"home"};
          var config={"title":"title"};
          var wdate;
          if(req.session.passport.wdate==="")
          {
              wdate=new Date().toLocaleDateString();
          }
     
        res.render('templates/template1/index',{data:config,page:text,pages:pages,pageComponents:pageComponents,wdate:wdate});
        }
        else{
            res.redirect('/login');
        }
});

// create the login get and post routes
app.get('/login', (req, res) => {
    //console.log('Inside GET /login callback function')
    console.log(req.sessionID);
    var dd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
    dd.delete("/passport");
    //console.log(req.session.passport); 
    res.render('auth');
    //res.send(`You got the login page!\n`)
  });
  

  app.post('/login', (req, res, next) => {
   
    passport.authenticate('local', (err, user, info) => {
      if(info) {return res.send(info.message)}
      if (err) { return next(err); }
      if (!user) { 
 
          return res.redirect('/login');
         }
      req.login(user, (err) => {
        if (err) { return next(err); }
        var prmm=new Promise(()=>{
            setTimeout(()=>{
                var dsd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
                var dtt=new Date().toLocaleDateString().split('/');
                var fdate=dtt[2]+'-'+dtt[0]+'-'+dtt[1];
                dsd.push('/passport/wdate',fdate);
            },100);//changed from 1000
          
        });
        Promise.all([prmm]).then(console.log('wdate set')).catch((err)=>{console.log(err)});
        return res.redirect('/admin');
     
      })
    })(req, res, next);
  })
  
  app.get('/authrequired', (req, res) => {
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n')
    } else {
      res.redirect('/')
    }
  });

  // create the login get and post routes
app.get('/logout', (req, res) => {
    //console.log('Inside GET /login callback function')
    console.log(req.sessionID);
    var dd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
    dd.delete("/passport");
   // console.log(req.session.passport); 
    res.redirect('/login');
    //res.send(`You got the login page!\n`)
  });


function createRoutes(){
    var articlesEndpoints=[];
    var fdb = new JsonDB(root_path+'/views/templates/'+tmp+'/pageList', true, false);
    var count=0;
    var testProm=new Promise(()=>{   
        fdb.reload();
            articlesEndpoints=fdb.getData('/pages');
            //fdb.getData('/teams').forEach((team)=>{
              //  articlesEndpoints.push(team);
            //});
            fdb.getData('/players').forEach((player)=>{
                articlesEndpoints.push(player.name);
            });
           console.log("eps:"+articlesEndpoints);
    });
  
    Promise.all([testProm]).then(console.log(articlesEndpoints.length)).
    catch((err)=>{console.log("articlesEndpoints:"+err)});
    if(articlesEndpoints.length>0){

    articlesEndpoints.forEach(function(name) {
        var nn=name;
        name="/"+name;
     
        var wdate;
        app.route(name).get((req, res)=>{
          var promise0=new Promise(()=>{
            var dd,edt;
            var dsd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
          
            if(dsd.getData('/passport/wdate')!=undefined){
               // console.log('Wdate Defined');
               // dd=dsd.getData('/passport/wdate').split('-');
             //   edt=dd[1]+'.'+(dd[2]*1)+'.'+dd[0];
             //   cdt=edt;
                cdt='data';
                console.log('dd:'+cdt);
                if (fs.existsSync(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+cdt+'.json'))
                {
                    console.log(cdt+' exists.');
                    config=breaker.generatePage(tmp,nn+'.ejs','page');
                    pageComponents=pageManifest(root_path,nn,cdt);
                  //  console.log('pc:'+JSON.stringify(pageComponents));
                  
                }
                else{
                    console.log(cdt+' does not exist.'); 
                    config=breaker.generatePage(tmp,nn+'.ejs','page');
                    pageComponents=pageManifest(root_path,nn,cdt);
                }
            }
            else{
                console.log('Wdate Undefined');
                 dd=new Date().toLocaleDateString().split('/');
                 edt=dd[1]+'.'+(dd[2]*1)+'.'+dd[0];
                // cdt=edt;
                cdt='data';
            }
             
 
            });

          var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components'+name+'.ejs/'+cdt, true, false);       
            var promise1=new Promise(()=>{

                if(req.session.passport!=undefined){
                   
                    if(req.session.passport.wdate==="" || req.session.passport.wdate===undefined)
                    {
                        var dd=new Date().toLocaleDateString().split('/');
                        wdate=dd[2]+'-'+dd[0]+'-'+dd[1];
                    }
                    else{
                        wdate=req.session.passport.wdate;
                    }
                    console.log('cdt check..'+cdt);
                }
                else{
                    res.redirect('/login'); 
                }   
           setTimeout(()=>{
            pageComponents=reloadpageManifest(root_path,nn,cdt);
            var fdb1 = new JsonDB(root_path+'/views/templates/'+tmp+'/pageList', true, false);
            fdb1.reload();
            var pgs=fdb1.getData('/pages');
           // var teams=fdb1.getData('/teams');
           var teams;
            var players=fdb1.getData('/players');
            console.log(pgs);
            res.render(`templates/${tmp}${name}`,{pageComponents:pageComponents,pageData:db.getData("/"),pageList:pgs,teams:teams,players:players,wdate:wdate,pname:name});
        },1000);//changed from 3000
                 
            
        });
         
            Promise.all([promise0,promise1]).
            then(console.log(`finished loading ${name}`)).
            catch((err)=>{
                console.log(err);
                console.log(req.sessionID);
                var dd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
                dd.delete("/passport");
               // console.log(req.session.passport); 
                res.redirect('/login');
            });
      
      
        }).post((req,res)=>{
          var q= req.body.component,cat= req.body.category,area=req.body.area,color=req.body.color,section=req.body.section,side=req.body.side,editordata=req.body.editordata,widgetindex=req.body.widgetindex,style=req.body.style,action=req.body.action;
          var fdt;
          const promise0=new Promise(()=>{
             if(req.body.wdate===undefined || req.body.wdate===''){
                //var dd = new JsonDB(root_path+'/sessions/', true, false);
                var dd;
               var dsd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
               dsd.reload();
               console.log('Undefined');
               if(dsd.getData('/passport/wdate')!=undefined){
                    dd=dsd.getData('/passport/wdate').split('-');
               }
               else{
                    dd=new Date().toLocaleDateString().split('/');
               }
              // var dd=new Date().toLocaleDateString().split('-');
                var edt=dd[1]+'.'+(dd[2]*1)+'.'+dd[0];
                fdt=edt;
                console.log('edt:'+edt);
                var wdate=dd[0]+'-'+dd[1]+'-'+dd[2];
                console.log('wdate:'+wdate);
                edt='data';
                dsd.push('/passport/wdate',wdate);
                dsd.reload();
                if(req.body.action!=undefined && req.body.action==='delete tab' && req.body.dt===undefined)
                {
                   
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                   if((dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs").length)>0){
                    dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]");
                   }
                   dd.reload();
                  
                }
                if(req.body.pageTitle!=undefined && req.body.action==='editPageTitle')
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                   dd.push("/pageTitle",req.body.pageTitle);
                   dd.reload();
                }
                if(req.body.title!=undefined && req.body.action==='edittabtitle')
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                   dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/title",req.body.title);
                   dd.reload();
                }
                 if(req.body.title!=undefined && req.body.action===undefined)
                 {
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs[]/title",req.body.title);
                    dd.reload(); 
                }
                if(req.body.action!=undefined && req.body.action==='delete tab widget' && req.body.tabs!=undefined)
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                   dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data["+req.body.dt+"]");
                   dd.reload();
                }
                if(req.body.action!=undefined && req.body.action==='delete main tab widget' && req.body.tabs===undefined)
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                   dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]");
                   dd.reload();
                   if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side[0]/type)===undefined){
                    dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side);
                    dd.reload();   
                }
                }
                 if(req.body.action!=undefined && req.body.action==='addwidgettotab' && req.body.tabs!=undefined)
                 {
                     console.log("Widget Side:"+side);
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data[]"+"/type",req.body.component);
                    dd.reload(); 
                }
                 if(req.body.tabs!=undefined && req.body.action===undefined)
                 {
                        var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                        dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data["+req.body.dt+"]"+"/data",editordata);
                        dd.reload(); 
                 }
                  if(action!=undefined && action==='change section')
                 {
           
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                       dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+req.body.section+"]/type",q);
                       dd.reload();
                  
                 } 
                 if(action==='add section'){
                      var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                      dd.push("/layoutcomponents[1]/pageComponents/sections/components[]/type",q);
                      dd.reload();
                    }
    
                 if(action!=undefined && action==='delete section' && q===undefined) 
                 {
                    if(cat==='sections')
                    {
                       //console.log("Section has been deleted...");
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                       dd.delete("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]");
                       dd.reload();
                    }
                 } 
    
                 if(action!=undefined && action==='order' && q===undefined && req.body.order!=undefined)
                 {
                       console.log("Section has been deleted...");
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                       dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/order",req.body.order);
                       dd.reload();
                    }
    
                 if(action!=undefined && action==='delete widget' && q===undefined)
                 {
                    if(cat==='widgets')
                    {
                        var ptr=new Promise(()=>{
                            setTimeout(()=>{
                                var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                                dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]");
                                dd.reload();
                                /*  if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side).length===1)
                                {
                                    if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/type"===undefined))
                                    {
                                     dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side);
                                    }
                                } */
                               
                              },200);//changed from 2000
                        });
    
                        Promise.all([ptr]).
                        then( console.log("Widget has been deleted...")).
                        catch((err)=>{ console.log("Deletion error:"+err);});
                  
                     
                    }
                 } 
                 if(req.body.action1==='promote widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            dd.reload();
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1);
                            dd.reload();
                            if(req.body.widgetindex1>0){
                            arr.move(req.body.widgetindex1,req.body.widgetindex1-1);
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1+"["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Widget promoted')).catch((err)=>{console.log(err)});
                 } 
    
                 if(req.body.action1==='demote widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            dd.reload();
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1);
                            if(req.body.widgetindex1<arr.length-1){
                            arr.move(req.body.widgetindex1,req.body.widgetindex1+1);
                           // arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1+"["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Widget demoted')).catch((err)=>{console.log(err)});
                 } 
    
    
                 if(req.body.actiontab==='promote tab widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                           var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                           dd.reload();
                           var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data");
                            console.log("tab widgets:"+arr);
                            console.log("tab widgets..:"+req.body.dttab);
                            if(req.body.dttab>0){
                            arr.move(req.body.dttab,req.body.dttab-1);
                           // arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data["+p+"]",arr[p]);
                                dd.reload();
                            } 
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Tab Widget promoted...')).catch((err)=>{console.log(err)});
                 } 
    
                 if(req.body.actiontab==='demote tab widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data");
                            if(req.body.dttab<arr.length-1){
                            arr.move(req.body.dttab,req.body.dttab+1);
                            //arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Tab Widget demoted')).catch((err)=>{console.log(err)});
                 } 
             
    
                 if(style!=undefined && style==="true"){
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[0]","background-color:"+req.body.backgroundcolor+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[1]","color:"+req.body.textcolor+";");
    
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[4]","width:"+req.body.width+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[5]","height:"+req.body.height+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[6]","visibility:"+req.body.visibility+";");
                    dd.reload();
                }
                if(cat!=undefined){
                    if(cat==='hero'){
                       var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                       db.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/data",req.body.editordata);
                       db.reload();
                    }
                        
                if(cat==='widgets' && style===undefined){
                          
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/data",editordata);
                    dd.reload();
                }
                }
                
                if(req.body.data==="data" && cat!=undefined  && area!=undefined && req.body.action1===undefined )
                {
                    var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                    db.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/data",req.body.editordata);
                    db.reload();
                }
             if(q!=undefined && cat!=undefined  && area!=undefined && req.body.action1===undefined){
                 setTimeout(()=>{
                     if(area==='header' || area==='footer' || area==='body'){
                         switch(area){
                            case 'header':
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q);             
                            dd.reload();
                            break;
                            case 'body':
                            if(action===undefined){
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            dd.push("/layoutcomponents[1]/pageComponents/sections/components[]/type",q);
                            dd.reload();    
                        }
                            break;
                            case 'footer':
                            //var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/data', true, false);
                            //dd.push("/layoutcomponents[2]/pageComponents/"+cat+"/type",q);
                            break;
                         }
                   
                     }
                     else if(req.body.action1===undefined){
                         if(cat==='sections' && action===undefined)
                         {
                            console.log("Widgets have been updated...");
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                            dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q);
                            dd.reload();
                            if(area==1)
                            {
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                               dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft").length-1)+"]/tabs[0]/title",'Tab1');
                               dd.reload();
                            }
                            }
                            else if(area==2)
                            {
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                                dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright").length-1)+"]/tabs[0]/title",'Tab1');
                                dd.reload();
                            }
                        }
                           else
                            {
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                                dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle").length-1)+"]/tabs[0]/title",'Tab1');
                                dd.reload();
                            }}
                         }
                        
                         else{
                        var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+edt, true, false);
                        dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q); 
                        dd.reload();
                        
                         }
                     }
                 },100);//changed from 1000
    
          }

             }
             if(req.body.wdate!=undefined){
                 console.log('Defined '+req.sessionID);
                 console.log('Defined '+req.body.wdate);
                 var dsd = new JsonDB(root_path+'/sessions/'+req.sessionID, true, false);
                 var dts=req.body.wdate.split('-');
                 var ndt='data';//(dts[1]*1)+'.'+(dts[2]*1)+'.'+dts[0];
                 fdt=ndt;
                 dsd.push('/passport/wdate',req.body.wdate);
                 dsd.reload();
                if(req.body.action!=undefined && req.body.action==='delete tab' && req.body.dt===undefined)
                {
                   
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                   dd.reload();
                   if((dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs").length)>0){
                    dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]");
                    dd.reload();   
                }
                  
                }
                if(req.body.title!=undefined && req.body.action==='edittabtitle')
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                   dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/title",req.body.title);
                   dd.reload();
                }
                 if(req.body.title!=undefined && req.body.action===undefined)
                 {
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs[]/title",req.body.title);
                    dd.reload(); 
                }
                if(req.body.action!=undefined && req.body.action==='delete tab widget' && req.body.tabs!=undefined)
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                   dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data["+req.body.dt+"]");
                   dd.reload();
                }
                if(req.body.action!=undefined && req.body.action==='delete main tab widget' && req.body.tabs===undefined)
                {
                   var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                   dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]");
                   dd.reload();
                   if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side[0]/type)===undefined){
                    dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side);
                    dd.reload();   
                }
                }
                 if(req.body.action!=undefined && req.body.action==='addwidgettotab' && req.body.tabs!=undefined)
                 {
                     console.log("Widget Side:"+side);
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data[]"+"/type",req.body.component);
                    dd.reload();
                }
                 if(req.body.tabs!=undefined && req.body.action===undefined)
                 {
                        var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                        dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/tabs["+req.body.tabs+"]/data["+req.body.dt+"]"+"/data",editordata);
                        dd.reload();
                 }
                  if(action!=undefined && action==='change section')
                 {
           
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                       dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+req.body.section+"]/type",q);
                       dd.reload();
                  
                 } 
                 if(action==='add section'){
                      var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                      dd.push("/layoutcomponents[1]/pageComponents/sections/components[]/type",q);
                      dd.reload();
                 }
    
                 if(action!=undefined && action==='delete section' && q===undefined) 
                 {
                    if(cat==='sections')
                    {
                       //console.log("Section has been deleted...");
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                       dd.delete("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]");
                       dd.reload();
                      
                    }
                 } 
    
                 if(action!=undefined && action==='order' && q===undefined && req.body.order!=undefined)
                 {
                       console.log("Section has been deleted...");
                       var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                       dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/order",req.body.order);
                       dd.reload();
                    }
    
                 if(action!=undefined && action==='delete widget' && q===undefined)
                 {
                    if(cat==='widgets')
                    {
                        var ptr=new Promise(()=>{
                            setTimeout(()=>{
                                var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                                dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]");
                                dd.reload();
                                /*  if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side).length===1)
                                {
                                    if(dd.getData("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]/type"===undefined))
                                    {
                                     dd.delete("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side);
                                    }
                                } */
                               
                              },200);//changed from 2000
                        });
    
                        Promise.all([ptr]).
                        then( console.log("Widget has been deleted...")).
                        catch((err)=>{ console.log("Deletion error:"+err);});
                  
                     
                    }
                 } 
                 if(req.body.action1==='promote widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.reload();
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1);
                            if(req.body.widgetindex1>0){
                            arr.move(req.body.widgetindex1,req.body.widgetindex1-1);
                           // arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1+"["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Widget promoted')).catch((err)=>{console.log(err)});
                 } 
    
                 if(req.body.action1==='demote widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.reload();
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1);
                            if(req.body.widgetindex1<arr.length-1){
                            arr.move(req.body.widgetindex1,req.body.widgetindex1+1);
                          //  arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.area1+"/components["+req.body.section1+"]/"+req.body.side1+"["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Widget demoted')).catch((err)=>{console.log(err)});
                 } 
    
    
                 if(req.body.actiontab==='promote tab widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                           var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                           dd.reload();
                           var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data");
                            console.log("tab widgets:"+arr);
                            console.log("tab widgets..:"+req.body.dttab);
                            if(req.body.dttab>0){
                            arr.move(req.body.dttab,req.body.dttab-1);
                            //arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data["+p+"]",arr[p]);
                                dd.reload();
                            } 
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Tab Widget promoted...')).catch((err)=>{console.log(err)});
                 } 
    
                 if(req.body.actiontab==='demote tab widget')
                 {
                    var prm=new Promise(()=>{
                        setTimeout(()=>{
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.reload();
                            var arr=dd.getData("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data");
                            if(req.body.dttab<arr.length-1){
                            arr.move(req.body.dttab,req.body.dttab+1);
                          //  arr.reload();
                            }
                            //console.log("Working after...:"+arr[0].data);
                            for(var p=0;p<arr.length;p++)
                            {
                                dd.push("/layoutcomponents[1]/pageComponents/"+req.body.areatab+"/components["+req.body.sectiontab+"]/"+req.body.sidetab+"["+req.body.widgetindextab+"]/tabs["+req.body.tabstab+"]/data["+p+"]",arr[p]);
                                dd.reload();
                            }
                        },100);//changed from 1000
                    });
                   Promise.all([prm]).then(console.log('Tab Widget demoted')).catch((err)=>{console.log(err)});
                 } 
             
    
                 if(style!=undefined && style==="true"){
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[0]","background-color:"+req.body.backgroundcolor+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[1]","color:"+req.body.textcolor+";");
    
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[4]","width:"+req.body.width+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[5]","height:"+req.body.height+";");
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/style[6]","visibility:"+req.body.visibility+";");
                    dd.reload();
                }
                if(cat!=undefined){
                    if(cat==='hero'){
                       var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                       db.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/"+ndt,req.body.editordata);
                       db.reload();
                    }
                        
                if(cat==='widgets' && style===undefined){
                          
                    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                    dd.push("/layoutcomponents[1]/pageComponents/"+area+"/components["+section+"]/"+side+"["+widgetindex+"]"+"/"+ndt,editordata);
                    dd.reload(); 
                }
                }
                
                if(req.body.data==="data" && cat!=undefined  && area!=undefined && req.body.action1===undefined )
                {
                    var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                    db.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/"+ndt,req.body.editordata);
                    dd.reload();
                }
             if(q!=undefined && cat!=undefined  && area!=undefined && req.body.action1===undefined){
                 setTimeout(()=>{
                     if(area==='header' || area==='footer' || area==='body'){
                         switch(area){
                            case 'header':
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q);             
                            dd.reload();
                            break;
                            case 'body':
                            if(action===undefined){
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.push("/layoutcomponents[1]/pageComponents/sections/components[]/type",q);
                            dd.reload();    
                        }
                            break;
                            case 'footer':
                            //var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/data', true, false);
                            //dd.push("/layoutcomponents[2]/pageComponents/"+cat+"/type",q);
                            break;
                         }
                   
                     }
                     else if(req.body.action1===undefined){
                         if(cat==='sections' && action===undefined)
                         {
                            console.log("Widgets have been updated...");
                            var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                            dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q);
                            dd.reload();
                            if(area==1)
                            {
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                               dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsleft").length-1)+"]/tabs[0]/title",'Tab1');
                               dd.reload();
                            }
                            }
                            else if(area==2)
                            {
                              
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                                dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsright").length-1)+"]/tabs[0]/title",'Tab1');
                                dd.reload();
                            }
                        }
                           else
                            {
                            dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle[]/type",q);
                            dd.reload();
                            if(req.body.component==="/views/components/widgets/tab.ejs"){
                                dd.push("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle["+(dd.getData("/layoutcomponents[1]/pageComponents/"+cat+"/components["+section+"]/widgetsmiddle").length-1)+"]/tabs[0]/title",'Tab1');
                                dd.reload();
                            }}
                         }
                        
                         else{
                        var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+nn+'.ejs/'+ndt, true, false);
                        dd.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/type",q); 
                        dd.reload();
                        
                         }
                     }
                 },100);//changed from 1000
    
          }

             }
   
         });
              const promise1=new Promise(()=>{
                  var db1 = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/'+fdt,true, false);
                 
                  setTimeout(()=>{
                      if(color!=undefined){ 
                      db1.push("/headers/style/background","background-color:"+color+";");
                      db1.reload();
                      }
              },200);//changed from 2000
               
             });
      
              const promise2=new Promise(()=>{
                  
                setTimeout(()=>{ 
                pageComponents=reloadpageManifest(root_path,nn,cdt);
                res.redirect('back')
            },500);//changed from 3000
        });
      
              Promise.all([promise0,promise1,promise2]).
              then(console.log("Finished posting data"));
      
        });
      });
    
      
      //clients
   
      articlesEndpoints.forEach(function(name) {
          name1='/'+name+'client';
          name2=name+'client';
        
          if(name2==='Homeclient'){
            app.route('/').get((req, res)=>{
                var dd,edt;
                var fdbs= new JsonDB(root_path+'/views/templates/'+tmp+'/pageList', true, false);
                fdbs.reload();
                var fpgs=fdbs.getData('/pages');
                //var teams=fdbs.getData('/teams');
                var teams;
                var players=fdbs.getData('/players');
                console.log('Home List:'+fpgs);
               if(clientdate===undefined || clientdate==='')
               {          
                dd=new Date().toLocaleDateString().split('/');
                clientdate=dd[2]+'-'+dd[0]+'-'+dd[1];
                console.log('clientdate:'+clientdate);
                edt=(dd[0]*1)+'.'+(dd[1]*1)+'.'+dd[2];
               }   
               else{
                dd=clientdate.split('-');
                edt=(dd[1]*1)+'.'+(dd[2]*1)+'.'+dd[0];
               }               
   
               //cdt=edt;
               cdt='data';
               console.log('cdt:..'+cdt);
                //var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/Home.ejs/data', true, false);
                var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/Home.ejs/'+cdt, true, false);
                db.reload();
                const promise0=new Promise(()=>{
                /*   setTimeout(()=>{
                    db.push("/editmode",false);},500); */
              });
            
                 var pageComponents=pageManifest(root_path,name,cdt);
                 
             
                  const promise1=new Promise(()=>{
                      setTimeout(()=>{  
                          if(JSON.stringify(pageComponents)==='{}')
                          {}
                          else{
                              pageComponents=reloadpageManifest(root_path,name,cdt);
                            
                            res.render(`templates/${tmp}/Home`,{pageComponents:pageComponents,pageData:db.getData("/"),pageList:fpgs,teams:teams,players:players,clientdate:clientdate,wdate:undefined,pname:'/Home'});
                          }                  
                     
                      },200);//changed from 2000
                  });
               
                  Promise.all([promise0,promise1]).
                  then(console.log(`finished loading Home`)).
                  catch(err=>console.log(err));
            
            
              }).post((req,res)=>{
                var prm0=new Promise(()=>{
                    console.log("From home:"+req.body.ndate);
                    if(req.body.ndate!=""){
                        clientdate=req.body.ndate;
                        var d=req.body.ndate.split('-');
                        cdt=d[1]+'.'+(d[2]*1)+'.'+d[0];
                        console.log('client cdt:'+cdt);
                        cdt='data';
                        if (fs.existsSync(root_path+'/views/templates/'+tmp+'/components/Home.ejs/'+cdt+'.json')) {
                        }
                        else{
                            cdt='data';
                        }
                    
                
                    }
                });
                var prm1=new Promise(()=>{
                setTimeout(()=>{
                    clientdate=req.body.ndate;
                    res.redirect('back');
                },100);//changed from 1000
            });
            Promise.all([prm0,prm1]).then(console.log('reloading page')).
            catch((err)=>{console.log(err)});
                
              });
          }

          app.route(name1).get((req, res)=>{
            var fdbs= new JsonDB(root_path+'/views/templates/'+tmp+'/pageList', true, false);
            fdbs.reload();
            var fpgs=fdbs.getData('/pages');
            //var teams=fdbs.getData('/teams');
            var teams;
            var players=fdbs.getData('/players');
            var dd,edt;
            console.log('name1 clientdate:'+clientdate);
            if(clientdate===undefined || clientdate==='')
            {          
             dd=new Date().toLocaleDateString().split('/');
             clientdate=dd[2]+'-'+dd[0]+'-'+dd[1];
             console.log('clientdate:'+clientdate);
             edt=(dd[0]*1)+'.'+(dd[1]*1)+'.'+dd[2];
            }   
            else{
             dd=clientdate.split('-');
             edt=(dd[1]*1)+'.'+(dd[2]*1)+'.'+dd[0];
            }               

            cdt=edt;
    
            console.log("name1:"+cdt);
            cdt='data';
            var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt, true, false); 
            db.reload();       
              var pageComponents=pageManifest(root_path,name,cdt);
              const promise0=new Promise(()=>{
                    //var dd,edt;
                    if(clientdate===undefined || clientdate==='')
                    {          
                     dd=new Date().toLocaleDateString().split('/');
                     clientdate=dd[2]+'-'+dd[0]+'-'+dd[1];
                     console.log('clientdate:'+clientdate);
                     edt=(dd[0]*1)+'.'+(dd[1]*1)+'.'+dd[2];
                    }                 
        setTimeout(()=>{
            pageComponents=reloadpageManifest(root_path,name,cdt);
            res.render(`templates/${tmp}/${name}`,{pageComponents:pageComponents,pageData:db.getData("/"),pageList:fpgs,teams:teams,players:players,wdate:undefined,clientdate:clientdate,pname:name});
        },500);//changed from 3000
               
                 
              });
           
              Promise.all([promise0]).
              then(console.log(`finished loading ${name}`)).
              catch(err=>console.log(err));
        
        
          }).post((req,res)=>{
            var prm0=new Promise(()=>{
                console.log("From home:"+req.body.ndate);
                if(req.body.ndate!=""){
                    clientdate=req.body.ndate;
                    var d=req.body.ndate.split('-');
                    cdt=d[1]+'.'+(d[2]*1)+'.'+d[0];
                    cdt='data';
                    if (fs.existsSync( root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt+'.json')) {
                    }
                    else{
                        cdt='data';
                    }
                
            
                }
            });
            var prm1=new Promise(()=>{
            setTimeout(()=>{
                pageComponents=reloadpageManifest(root_path,name,cdt);
                res.redirect('back');
            },100);//changed from 1000
        });
        Promise.all([prm0,prm1]).then(console.log('reloading other page')).
        catch((err)=>{console.log(err)});
            
          });
        });

        

    

        
    }
}


createRoutes();


//Promise.all([prom0,prom1]).
//then(console.log('routes have been loaded..'+articlesEndpoints)).
//catch(err=>console.log(err));

  
  






app.post('/upload',(req,res)=>{

    console.log(req.body.editordata);
    
    var promise0=new Promise(()=>{
    setTimeout(()=>{
     var cat=req.body.category;
     var area=req.body.area;
        var db = new JsonDB(root_path+'/views/templates/'+tmp+'/components/houses.ejs/data', true, false);
        db.push("/layoutcomponents[0]/pageComponents/"+area+"/components/"+cat+"/data",req.body.editordata);
       // db.push(`/${cat}/data`,req.body.editordata);
       // var array = req.body.links.split(',')
       // db.push("/breadcrumbsbar/links",array);
    },500);//changed from 3000
    })
    var promise1=new Promise(()=>{
        setTimeout(()=>{
            res.redirect('back');
        },200);//changed from 2000
    
    })
     Promise.all([promise0,promise1]).
     then(console.log('finished writing data from editor')).
     catch((err)=>console.log(err));       
    });

   app.post('/layoutcomponent',(req,res)=>{
    var q= req.body.area;
    var cat= req.body.category;
    var modal=req.body.modal;
    var layoutcomponent=req.body.layoutcomponent;
   const promise0=new Promise(()=>{
   if(q!=undefined && cat!=undefined && modal!=undefined){
        fs.readFile(root_path+'/views/components/'+cat+'/'+modal,'utf8',(err,data)=>{
        fs.writeFile(root_path+'/views/components/'+layoutcomponent+'/'+q,data,(err)=>{   
            console.log("After read write"+err);
        
        });
       }); 
}
   });


        const promise1=new Promise(()=>{
        /*     if(color!=undefined){
            setTimeout(()=>{
                var db1 = new JsonDB(root_path+'/views/templates/water/components/newpage.ejs/data',true, false);
                db1.push("/headers/style/background","background-color:"+color+";");
                //db.reload();
        },3000);
          } */
          console.log("empty promise..")
       });
    
        //const promise2=Promise.resolve('Finished');
        const promise2=(setTimeout(()=>{res.redirect('back')},3000));

        Promise.all([promise0,promise1,promise2]).
        then(console.log("done"));

});


 app.post('/admin',(req,res)=>{
    req.body.pagename+='.ejs';
    var s=req.body.pagename.split(' ').length;
    var q=req.body.pagename; 
    var promise0=new Promise(()=>{
        for(var c=0;c<s;c++){
            q = q.replace(' ','_');
          }
     /*    setTimeout(()=>{
        Page.findOne({q}).exec((err,page)=>{
            if(err){
                res.send(err);
            }
            else{}
        });},1000); */

    });
  
    var promise1=new Promise(()=>{
        setTimeout(()=>{
            var newPage=new Page();
            newPage.pagename=q;//req.body.pagename.replace(' ','_');
            newPage.pagelayout=req.body.pagelayout;
            newPage.pagetitle=req.body.pagetitle;
            newPage.pagetype=req.body.pagetype;
            var pg=q.split(".");
            var dd = new JsonDB(root_path+'/views/extras/pages', true, false);
            var pgg={
                
                    "name":""+pg,
                    "pagename":""+q,
                    "pagetitle":""+req.body.pagetitle,
                    "pagelayout":""+req.body.pagelayout,
                    "pagetype":""+req.body.pagetype
            };
            dd.push("/pages[]/name",""+pg[0],true);
            var l=dd.getData("/pages").length
            l=l-1;
            dd.push("/pages["+l+"]/pagename",""+q,true);
            dd.push("/pages["+l+"]/pagetitle",""+req.body.pagetitle,true);
            dd.push("/pages["+l+"]/pagelayout",""+req.body.pagelayout,true);
            dd.push("/pages["+l+"]/pagetype",""+req.body.pagetype,true);
           
               config= breaker.generatePage(req.body.pagelayout,q,req.body.pagetitle);
      
        },100);//changed from 1000
    });

    var promise2=new Promise(()=>{
        setTimeout(()=>{
            if(req.body.pagetype==='page'){
            var pg=q.split(".");
            var dd = new JsonDB(root_path+'/views/templates/'+req.body.pagelayout+'/pageList', true, false);
            dd.push("/pages[]",""+pg[0],true);
            }
            else if(req.body.pagetype==='team'){
                var pg=q.split(".");
                var dd = new JsonDB(root_path+'/views/templates/'+req.body.pagelayout+'/pageList', true, false);
               // dd.push("/teams[]",""+pg[0],true);
                }
                else if(req.body.pagetype==='player'){
                    var pg=q.split(".");
                    var dd = new JsonDB(root_path+'/views/templates/'+req.body.pagelayout+'/pageList', true, false);
                    dd.push("/players[]/name",""+pg[0],true);
                    dd.reload();
                   // console.log('Members:'+dd.getData('/players').length);
                    dd.push("/players["+(dd.getData('/players').length-1)+"]/title",""+req.body.pagetitle,true);
                    
                    }
            createRoutes();
            res.redirect('back');
        },1000);//changed from 4000
     
    });

    Promise.all([promise0,promise1,promise2]).
    then(console.log(req.body.pagetype+" was created successfully!!"),createRoutes()).
    catch(err=>console.log(err));
  
    }); 



app.get('/home/layouts',(req,res)=>{
   var pageData={
       pagetitle:"hello",
       editmode:true
   };
   console.log("Modal "+pageComponents);
   res.render(`templates/water/newpage`,{data:config,pageComponents:pageComponents,page:"hello",pageData:pageData});
});

app.get('/home/components',(req,res)=>{
    var text =root_path+'/views/templates/template1/components/custom/components.ejs';
    res.render('templates/template1/index',{data:config,page:text});
});

};

/* function pageManifest(root_path,name){

    var pageComponents={};
  
    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/data', true, false);
    dd.push("/root_path",root_path);
    pageComponents=dd.getData("/");
   
    return pageComponents;
} */
function reloadpageManifest(root_path,name,cdt){

    var pageComponents={};
    console.log('Manifest cdt--'+cdt);
    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt, true, false);
    dd.reload();
    pageComponents=dd.getData("/");
    return pageComponents;
}
function pageManifest(root_path,name,cdt){

    var pageComponents={};
    console.log('Manifest cdt--'+cdt);
    var dd = new JsonDB(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt, true, false);
    dd.reload();
    pageComponents=dd.getData("/");
    var rpath;
      var prm0=new Promise(()=>{
       rpath=dd.getData('/root_path');
       dd.reload();
       if(root_path===rpath)
        {
            pageComponents=reloadpageManifest(root_path,name,cdt);
            console.log("checking pagecomponents1:"+pageComponents['layoutcomponents']);
        }
        else{
            dd.push("/root_path",root_path);
            dd.reload();
            pageComponents=reloadpageManifest(root_path,name,cdt);
            console.log("checking pagecomponents2:"+pageComponents['layoutcomponents']);
        }
    }); 
   Promise.all([prm0]).
    then().catch((err)=>{
        console.log(err)
        dd.push("/root_path",root_path);
        pageComponents=reloadpageManifest(root_path,name,cdt);
        console.log('after push:'+pageComponents);
    }); 
    var pms=new Promise(()=>{
      var g= dd.getData("/layoutcomponents");
    });
    Promise.all([pms]).then().
    catch((err)=>{
        console.log('Data file error..');
        console.log('Repairing Data file..');
        var prm=new Promise(()=>{
            if (fs.existsSync(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/data.json'))
            {
               // var cdt =new Date().toLocaleDateString().replace('/','.').replace('/','.'); 
                fs.readFile(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/data.json',(err,data)=>{
                        var stream1 = fs.createWriteStream('./views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt+'.json');
                       if(data!=undefined){
                        stream1.once('open', (fd) => {
                               stream1.write(data);
                               stream1.end();
                             });
                            }
                      
                       });  
                       dd.reload();
                       pageComponents=dd.getData("/");
                      console.log("Finished loading data file");
            }
            else{
                var pr1=new Promise(()=>{
                    
                    fs.readFile(root_path+'/views/extras/data.json','utf8',(err,data)=>{
                        var stream1 = fs.createWriteStream('./views/templates/'+tmp+'/components/'+name+'.ejs/data.json');
                       if(data!=undefined){
                        stream1.once('open', (fd) => {
                               stream1.write(data);
                               stream1.end();
                             });
                            }
                      
                       });
                });
               
                var pr2=new Promise(()=>{
                   var tdt =new Date().toLocaleDateString().replace('/','.').replace('/','.'); 
                   fs.readFile(root_path+'/views/templates/'+tmp+'/components/'+name+'.ejs/data.json',(err,data)=>{
                           var stream1 = fs.createWriteStream('./views/templates/'+tmp+'/components/'+name+'.ejs/'+cdt+'.json');
                          if(data!=undefined){
                           stream1.once('open', (fd) => {
                                  stream1.write(data);
                                  stream1.end();
                                });
                               }
                         
                          });
                       //   pageComponents=dd.getData("/");  
                          console.log("checking pagecomponents6:"+pageComponents['layoutcomponents']);  
                        });

                        Promise.all([pr1,pr2]).then(console.log('done')).catch((err)=>{console.log(err)});
            } 
           
        });
         
        Promise.all([prm]).then(
        console.log('Data file now ok..')).catch((err)=>{console.log(err)});
      //end of prm
       
    });
 
    return pageComponents;
}

Array.prototype.move = function(from,to){
    this.splice(to,0,this.splice(from,1)[0]);
    return this;
  };

 
     // var arr = [ 'a', 'b', 'c', 'd', 'e'];
             // console.log(arr);
             // arr.move(3,1);//["a", "d", "b", "c", "e"]
             // console.log(arr);
  
