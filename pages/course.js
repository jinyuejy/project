function table(list){
    var tbody=$("#mytbody").empty();
    for(i in list){
        var row=$("<tr>");
        var data=list[i];
        $("<td>").text(data['cno']).appendTo(row);
        $("<td>").text(data['cname']).appendTo(row);
        // $("<td>").text(data['credit']).appendTo(row);
        // $("<td>").text(data['ptb']).appendTo(row);
        // $("<td>").text(data['room']).appendTo(row);
        // $("<td>").text(data['day']).appendTo(row);
        // $("<td>").text(data['ctime']).appendTo(row);
        row.appendTo(tbody)
    }
};

function load_table(cno=""){
   $.ajax({
       type:'GET',
       url: "/s/course/"+cno,
       data:'',
       datatype:'json'
   })
   .done(function(data){
        table(data)
   })
   
}

// function postform(cno='10610482'){
//     var item={}
//     item['cname']=$("#course_form input[name='cname']").val()
//     $.ajax({
//         type:'POST',
//         url:'/s/course/'+cname,
//         data:JSON.stringify(item),
//         datatype:'json'
//     })
//     .done(function(data){
//         load_table(data['cname'])
//     });
// }


// function ceshi(){
//     var need=$("input:text").val()
//     alert(need)
// }

$(document).ready(function(){
    load_table();
    // $("#search_cname").on('click',postform);
    
});