$(document).ready(function(){

  $('form #headerIconsForm1').on('submit', function(){
    //alert("testing");
 
     var category=$('#headerIconsCat1');
     var component=$('#headerIconsComp1');
    // var pagetitle=$('#page-title');
    
     var postData = [{category:category.val()},{component:component.val()}];

     $.ajax({
       type: 'POST',
       url: '/newpage',
       data: postData,
       success: function(data){
         //do something with the data via front-end framework
        // location.reload();
       }
     });

     return false;

 });

/*   $('form').on('submit', function(){
     //alert("testing");
  
      var pagename=$('#page-name');
      var pagelayout=$('#page-layout');
      var pagetitle=$('#page-title');
     
      var page = [{pagename: pagename.val()},{pagelayout:pagelayout.val()},{pagetitle:pagetitle.val()}];

      $.ajax({
        type: 'POST',
        url: '/home',
        data: page,
        success: function(data){
          //do something with the data via front-end framework
         // location.reload();
        }
      }); 

      return false;

  });*/

  $('li').on('click', function(){
    
      var page = $(this).text().replace(/ /g, "-");
      $.ajax({
        type: 'DELETE',
        url: '/pages/' + page,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});
