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
    var url='/s/grade/'+sno+'&'+cno
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        datatype: 'json'
    })
        .done(function (data) {
            grade(data)
        })

}

function search() {
    var item = {}
    var cno = $('#stugrade_form input[name="cno"]').val();
    var sno = $("#stugrade_form input[name='sno']").val()
    item['cno'] = cno;
    item['sno'] = sno;
    url = '/s/grade/' + sno+'&'+cno
    $.ajax({
        type: 'GET',
        url: url,
        data: JSON.stringify(item),
        datatype: 'json'
    })
        .done(function () {
            load_table(sno,cno)
        });
    return false
}


$(document).ready(function(){
    load_table()
    $("#stugrade_form input:submit").on('click',search)
});