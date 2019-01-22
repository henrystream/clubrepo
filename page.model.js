var mongoose =require('mongoose');
var Schema=mongoose.Schema;

var PageSchema=new Schema({
    pagename:String,
    pagelayout:String,
    pagetitle:String
});

// var ManifestSchema=new Schema({
//     pageName:String,
//     template:String,
//     pageTitle:String,
//     text:String,
//     header:String,
//     logo:String,
//     logoimage:String,
//     headerIcons:String,
//     topHeaderMenu:String,
//     nav:String,
//     body:String,
//     breadcrumbsbar:String,
//     carouselslider: String,
//     contentwidget1: String,
//     contentwidget2: String,
//     contentwidget3: String,
//     sidebarwidget1: String,
//     sidebarwidget2: String,
//     sidebarwidget3: String,
//     sidebarwidget4: String,
//     footer: String,
//     partnerlogo1: String,
//     partnerlogo2: String,
//     partnerlogo3:String,
//     partnerlogo4:String,
//     partnerlogo5:String,
//     partnerlogo6:String,
//     editmode:Boolean

// });

module.exports=mongoose.model('Page',PageSchema);
//module.exports=mongoose.model('Manifest',ManifestSchema);