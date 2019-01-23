var fs=require('fs');
var JsonDB = require('node-json-db');
// var async =require('async');
var JFile=require('jfile');
function generatePage(templateName,finalPageName,pageTitle){
  var pt=__dirname+'/views/templates/'+templateName+'.ejs';
  var searchFile=new JFile(pt);

  if (fs.existsSync(__dirname+'/views/templates/'+templateName+'/')) {
            
}
else{
    fs.mkdirSync(__dirname+'/views/templates/'+templateName+'/',()=>{
    });

}

  var stats=new JFile(__dirname+'/views/templates/'+templateName+'/'+finalPageName+'.txt');
  var config ='';

    stats.text=`{\n"pagename":"/views/templates/${templateName}/${finalPageName}",\n"title":"${pageTitle}",\n"layout":"${templateName}",`;
    var rows=0;
    for(var p=1;p<10;p++){
    rows+=breakLayoutRows(`class="1.${p}"`,p,templateName,finalPageName);
    }
    stats.text+=`\n"layoutParts":${rows},`;
    
    
    for(var d=1;d<=rows;d++)
    {
        var cp=0;
        for(var v=1;v<=12;v++)
        {
         cp+=searchFile.grep(`class="1.${d}.${v}"`).length;
    
        }
        stats.text+=`\n"1.${d}":${cp},`;
        
    }
    
    for(var d=1;d<=rows;d++)
    {
        
        for(var v=1;v<=searchFile.grep(`class="1.${d}"`).length;v++)
        {
        var cp=0;
        for(var s=1;s<=12;s++)
        {
         cp+=searchFile.grep(`include 1.${d}.${v}.${s}.ejs`).length;
        }
        stats.text+=`\n"1.${d}.${v}":${cp},`;
       
        }
     
        
    }
    
    //config["1."+q+"."+p]
    
    var cols=0;
    for(var q=1;q<=rows;q++){
    for(var p=1;p<=12;p++){
       breakLayoutColumns(`class="1.${q}.${p}"`,q,p,templateName,finalPageName);
        for(var i=1;i<=12;i++){
            if (fs.existsSync(__dirname+'/views/templates/'+templateName+'/')) {
            
                cols+= breakLayoutIncludes(`include 1.${q}.${p}.${i}.ejs`,q,p,i,templateName,finalPageName);
            }
            else{
                fs.mkdirSync(__dirname+'/views/templates/'+templateName+'/',()=>{
                    cols+= breakLayoutIncludes(`include 1.${q}.${p}.${i}.ejs`,q,p,i,templateName,finalPageName);
                });
            
            }
        
        }     
        }
    }

stats.text+=`\n"otherinfo":""\n}`;

fs.readFile('./views/templates/'+templateName+'/'+finalPageName+'.txt', 'utf8', function(err,data) {
    if(err) throw err;
    config = JSON.parse(data);
    console.log(config);
    buildPage(config,templateName,finalPageName);
});

return config;
        
}//end of generate page



function breakLayoutRows(pattern,c,templateName,finalPageName){
    console.log(templateName);
    var pt=__dirname+'/views/templates/'+templateName+'.ejs';
    var searchFile=new JFile(pt);//__dirname+`/views/templates/${templateName}.ejs`);
    var r=searchFile.grep(pattern);

    //checking for templates directory
    if (fs.existsSync(__dirname+'/views/templates/'+templateName+'/')) {
    }
    else{
        fs.mkdirSync(__dirname+'/views/templates/'+templateName+'/');
    
    }

    //checking for components directory in the template folder
    if (fs.existsSync(__dirname+'/views/templates/'+templateName+'/components/')) {
    }
    else{
        fs.mkdirSync(__dirname+'/views/templates/'+templateName+'/components/');
    } 

//checking for component parts
if (fs.existsSync(__dirname+'/views/templates/'+templateName+'/'+finalPageName+'_dir')) {
}
else{
    fs.mkdirSync(__dirname+'/views/templates/'+templateName+'/'+finalPageName+'_dir');

}



//Loading headers from the extras folder
fs.readFile('./views/extras/1.ejs', 'utf8', function(err,data) {
    if(err) throw err;
    var stream = fs.createWriteStream(`./views/templates/${templateName}/${finalPageName}_dir/1.ejs`);
    stream.once('open', (fd) => {
    stream.write(data);
    stream.end();
});
});
fs.readFile('./views/extras/2.ejs', 'utf8', function(err,data) {
    if(err) throw err;
    var stream = fs.createWriteStream(`./views/templates/${templateName}/${finalPageName}_dir/2.ejs`);
    stream.once('open', (fd) => {
    stream.write(data);
    stream.end();
});
});



r.forEach((row)=>{  

    var stream = fs.createWriteStream(`./views/templates/${templateName}/${finalPageName}_dir/1.${c}.ejs`);

    stream.once('open', (fd) => {
    stream.write(row);
    stream.end();
});
c++;
});
return r.length;
}


function breakLayoutColumns(pattern,q,c,templateName,finalPageName){
  var pt=__dirname+'/views/templates/'+templateName+'.ejs';
  var searchFile=new JFile(pt);
    var r=searchFile.grep(pattern);
    //console.log(r);


r.forEach((row)=>{  

    var stream = fs.createWriteStream(`./views/templates/${templateName}/${finalPageName}_dir/1.${q}.${c}.ejs`);

    stream.once('open', (fd) => {
    stream.write(row);
    stream.end();
});

c++;
});

return r.length;
}


function breakLayoutIncludes(pattern,q,t,i,templateName,finalPageName){
  var pt=__dirname+'/views/templates/'+templateName+'.ejs';
  var stats=new JFile(__dirname+'/views/templates/'+templateName+'/'+finalPageName+'.txt');
  var searchFile=new JFile(pt);
    var r=searchFile.grep(pattern);

   r.forEach((row)=>{  

    var stream = fs.createWriteStream(`./views/templates/${templateName}/${finalPageName}_dir/1.${q}.${t}.${i}.ejs`);
   

    stream.once('open', (fd) => {
    stream.write(row);
    //stream.write(`<% include components/${templateName}/${finalPageName}/1.${q}.${t}.${i}.ejs %>`);
    stream.end();
});

if (fs.existsSync('./views/templates/'+templateName+'/components/'+finalPageName+'/')) {

    if (fs.existsSync('./views/templates/'+templateName+'/components/'+finalPageName+'/data.json'))
    {
        var tdt ='data'//new Date().toLocaleDateString().replace('/','.').replace('/','.');
  
        if (fs.existsSync('./views/templates/'+templateName+'/components/'+finalPageName+'/'+tdt+'.json'))
        {
        }
        else{   
        fs.readFile(__dirname+'/views/templates/'+templateName+'/components/'+finalPageName+'/data.json',(err,data)=>{
                var stream1 = fs.createWriteStream('./views/templates/'+templateName+'/components/'+finalPageName+'/'+tdt+'.json');
               if(data!=undefined){
                stream1.once('open', (fd) => {
                       stream1.write(data);
                       stream1.end();
                     });
                    }
              
               });
            }
        
     
        
    }
    else{
        var dd = new JsonDB(__dirname+'/views/extras/data', true, false);
        var prms0=new Promise(()=>{
        
            console.log('path:'+dd.getData(`/${__dirname}`));
            if (fs.existsSync(dd.getData(`/${__dirname}`)))
            {
            }
            else{
                dd.push('/root_path',__dirname);
                dd.reload();
            }
        });
        var prms1=new Promise(()=>{
            
            fs.readFile(__dirname+'/views/extras/data.json','utf8',(err,data)=>{
                var stream1 = fs.createWriteStream('./views/templates/'+templateName+'/components/'+finalPageName+'/data.json');
               if(data!=undefined){
                stream1.once('open', (fd) => {
                       stream1.write(data);
                       stream1.end();
                     });
                    }
              
               });
        });
        Promise.all([prms0,prms1]).then(console.log('Data steady and okay..')).catch((err)=>{
            console.log(err);
            dd.push('/root_path',__dirname);
            dd.reload();
            fs.readFile(__dirname+'/views/templates/'+templateName+'/components/'+finalPageName+'/data.json',(err,data)=>{
                var stream1 = fs.createWriteStream('./views/templates/'+templateName+'/components/'+finalPageName+'/'+tdt+'.json');
               if(data!=undefined){
                stream1.once('open', (fd) => {
                       stream1.write(data);
                       stream1.end();
                     });
                    }
              
               });
            
        });
       
      
    } 
 
}
else{
    fs.mkdirSync('./views/templates/'+templateName+'/components/'+finalPageName+'/');

}

if (fs.existsSync('./views/templates/'+templateName+'/components/'+finalPageName+'/1.'+q+'.'+t+'.'+i+'.ejs')) {
    // Do something
}
else{
    var stream1 = fs.createWriteStream(`./views/templates/${templateName}/components/${finalPageName}/1.${q}.${t}.${i}.ejs`);
    q-=1;
    var layoutcomponent="<%- include(pageComponents.root_path+pageComponents.layoutcomponents["+q+"].modal) %>"
    stream1.once('open', (fd) => {
           stream1.write(layoutcomponent);
           stream1.end();
         });
}

stats.text+=`\n"1.${q}.${t}.${i}":"components/${finalPageName}/1.${q}.${t}.${i}.ejs",`;

t++;
});



return r.length;
}


function buildPage(config,templateName,finalPageName){

   
  
var stream = fs.createWriteStream(__dirname+config.pagename);

stream.once('open', (fd) => {
        stream.write('');
        stream.end();
        });
        var comp=0;
        var path='/views/templates/'+templateName+'/'+finalPageName+'_dir/';
        var path2='/views/templates/'+templateName+'/';
    
        var pbprom0=new Promise(()=>{
           
            fs.readFile(__dirname+'/views/templates/'+templateName+'/'+finalPageName+'_dir/1.ejs','utf8',(err,data)=>{
                fs.appendFile(__dirname+config.pagename,data,(err)=>{   
                    console.log(err);
                });
               });
        });
  
   
  
     var pbprom1=new Promise(()=>{
      
        for(var rws=1;rws<=config.layoutParts;rws++)
    {
        var n=path+"1."+rws;
        console.log(n);
        fs.readFile(__dirname+n+'.ejs','utf8',(err,data)=>{
            fs.appendFile(__dirname+config.pagename,data,(err)=>{
                console.log(err);
            });
        });

    
     
     
        var cols=config["1."+rws];
        for(var pp=1;pp<=cols;pp++)
         {


                 fs.readFile(__dirname+n+"."+pp+`.ejs`,'utf8',(err,data)=>{
                 fs.appendFile(__dirname+config.pagename,"\n"+data,(err)=>{
                     console.log(err);
                 });
                });
    
                for(var ts=1;ts<=config["1."+rws+".1"];ts++)
                {
                                             
                                var component=config["1."+rws+"."+pp+"."+ts];
                                if(config["1."+rws+"."+pp+"."+ts]===undefined){}
                                else{
                        
                             fs.readFile(__dirname+path2+config["1."+rws+"."+pp+"."+ts],'utf8',(err,data)=>{
                                 fs.appendFile(__dirname+config.pagename,data,(err)=>{    
                                 console.log(err);
                                 });
                                });
                            }
                               // f++;
                }
              
                fs.readFile(__dirname+path+'2.ejs','utf8',(err,data)=>{
                    fs.appendFile(__dirname+config.pagename,"\n</div><!--closing column -->\n",(err)=>{
                        console.log(err);
                    })
                });
              
            }
            fs.readFile(__dirname+path+'2.ejs','utf8',(err,data)=>{
                fs.appendFile(__dirname+config.pagename,"\n</div><!--closing row -->\n",(err)=>{
                    console.log(err);
                })
            });
       
     
       
       }
   
       });
       var pbprom2=new Promise(()=>{
   
    fs.readFile(__dirname+path+'2.ejs','utf8',(err,data)=>{
        fs.appendFile(__dirname+config.pagename,data,(err)=>{
            console.log(err);
        })
    });

});
Promise.all([pbprom0,pbprom1,pbprom2]).then(console.log('Build successfull..')).catch();
}


module.exports={
    generatePage:generatePage
}