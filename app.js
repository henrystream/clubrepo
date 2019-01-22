var express=require('express');
var app=express();
var router=express.Router();
var exec=require('./bin/usr');
const port = process.env.PORT || 3000;

app.set('view engine','ejs');

app.use(express.static('public'));
exec(app,__dirname);


app.listen(port,()=>{
    
});

