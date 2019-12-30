function grade(list){
    var tbody=$("#grade_tbody").empty()
    for (i in list){
        var grade=list[i];
        var row=$('<tr>')
        $("<td>").text(grade['sno']).appendTo(row);
        $("<td>").text(grade['cno']).appendTo(row);
        $("<td>").text(grade['cname']).appendTo(row);
        $("<td>").text(grade['credit']).appendTo(row);
        $("<td>").text(grade['grade']).appendTo(row);
        var btn_edit = $('<button>')
            .text('修改')
            // .on("click", (function (data) {
            //     return function (event) {
            //         $("#form_change").show()
            //         var cno = data['cno'];
            //         edit_course(cno);
            //     }

        var btn_del = $('<button>')
            .text('删除')
            // .on("click", (function (data) {
            //     return function (event) {
            //         delete_course(data['cno']);
            //     }

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);

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
    var cno = $('#grade_form input[name="cno"]').val();
    var sno = $("#grade_form input[name='sno']").val()
    item['cno'] = cno;
    item['sno'] = sno;
    url = '/s/grade/' + sno+'&'+cno
    $.ajax({
        type: 'GET',
        url: url,
        data: JSON.stringify(item),
        datatype: 'json'
    })
        .done(function (data) {
            load_table(sno,cno)
        });
    return false
}




$(document).ready(function(){
    load_table()
    $("#grade_form input:submit").on('click',search)
});