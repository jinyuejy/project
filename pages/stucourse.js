function table(list) {
    var tbody = $("#stutbody").empty();
    for (i in list) {
        var row = $("<tr>");
        var data = list[i];
        $("<td>").text(data['cno']).appendTo(row);
        $("<td>").text(data['cname']).appendTo(row);
        $("<td>").text(data['credit']).appendTo(row);
        $("<td>").text(data['ptb']).appendTo(row);
        $("<td>").text(data['room']).appendTo(row);
        $("<td>").text(data['day']).appendTo(row);
        $("<td>").text(data['ctime']).appendTo(row);
        row.appendTo(tbody)
    }
};
function postform() {
    var item = {}
    var cno = $('#stu_form input[name="cno"]').val();
    item['cno'] = cno;
    url = '/s/course/' + cno
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(item),
        datatype: 'json'
    })
        .done(function (data) {
            load_table(cno)
        });
    return false
}


function load_table(cno = '') {
    var url = '/s/course/' + cno;
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        datatype: 'json'
    })
        .done(function (data) {
            table(data)
        })

}

$(document).ready(function () {
    load_table();
    $("#stu_form input:submit").on('click', postform);
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