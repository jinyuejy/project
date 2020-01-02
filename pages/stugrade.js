
function grade(list){
    var tbody=$("#stugrade_tbody").empty()
    for (i in list){
        var grade=list[i];
        var row=$('<tr>')
        $("<td>").text(grade['cno']).appendTo(row);
        $("<td>").text(grade['cname']).appendTo(row);
        $("<td>").text(grade['credit']).appendTo(row);
        $("<td>").text(grade['grade']).appendTo(row);
        row.appendTo(tbody)
    };
};


function load_table(sno='',cno ='') {
    // alert('sno:'+sno)
    var url='/s/grade/'+sno+'&'+cno
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        datatype: 'json'
    })
        .done(function (data) {
            // var item=[];
            // for (i in data){
            //     if (data[i]['sno']==sno){
            //         item[i]=data[i];
            //     }
            // };
            grade(data)
        })

}

function get_user(){
    $.ajax({
        type:'GET',
        url:'/s/grade/&',
        data:'',
        datatype:'json',
    })
    .done(function(data){
        var nowuser=data[1]['nowuser']
        load_table(nowuser)
    })
}
function search(sno='') {
    var item = {}
    var cno = $('#stugrade_form input[name="cno"]').val();
    item['cno'] = cno;
    url = '/s/grade/' + sno+'&'+cno
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        datatype: 'json'
    })
        .done(function () {
            load_table(sno,cno)
        });
    return false
}


$(document).ready(function(){
    // load_table()
    get_user();
    $("#stugrade_form input:submit").on('click',search)
});


$(document).ajaxError(function (event, jqxhr, settings, exception) {
    var msg = jqxhr.status + ': ' + jqxhr.statusText + "\n\n";
    if (jqxhr.status == 404 || jqxhr.status == 405) {
        msg += "访问REST资源时，URL错误或该资源的请求方法\n\n"
        msg += settings.type + '  ' + settings.url
    } else {
        msg += jqxhr.responseText;
    }
    alert(msg);
});