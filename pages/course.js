function table(list) {
    var tbody = $("#mytbody").empty();
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
        
        var btn_edit = $('<button class="button">')
            .text('修改')
            .on("click", (function (data) {
                return function (event) {
                    
                    var cno = data['cno'];
                    edit_course(cno);
                }
            })(data));

        var btn_del = $('<button class="button">')
            .text('删除')
            .on("click", (function (data) {
                return function (event) {
                    delete_course(data['cno']);
                }
            })(data));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);

        row.appendTo(tbody)
    }
};


function postform() {
    var item = {}
    var cno = $('#course_form input[name="cno"]').val();
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


function add_courses() {
    // $("#form_change").show()
    $("#change input[name='cno']").val('')
    $("#change input[name='cname']").val('')
    $("#change input[name='ord']").val('')
    $("#change input[name='credit']").val('')
    $("#change input[name='day']").val('')
    $("#change input[name='ctime']").val('')
    $("#change input[name='room']").val('')

    //// 增加前置空添加框
    $("#change").off('submit').on('submit',function () {
        var item = {};
        item['cno'] = $("#change input[name='cno']").val()
        item['cname'] = $("#change input[name='cname']").val()
        item['ordn'] = $("#change input[name='ordn']").val()
        item['credit'] = $("#change input[name='credit']").val()
        item['day'] = $("#change input[name='day']").val()
        item['ctime'] = $("#change input[name='ctime']").val()
        item['room'] = $("#change input[name='room']").val()
        var url = '/s/course/' + item['cno'];
        // alert('url:'+url)
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(item),
            datatype: 'json'
        })
            .done(function () {
                load_table();
                $("#form_change").hide()
            });
        return false
    });

    $('#form_change').show()
}

function edit_course(cno = '') {
    var url = '/s/course/' + cno;
    // correct
    function course_edit() {
        var item = {}
        item['cno'] = $('#change input[name="cno"]').val()
        item['cname'] = $("#change input[name='cname']").val()
        item['ordn'] = $("#change input[name='ordn']").val()
        item['credit'] = $("#change input[name='credit']").val()
        item['day'] = $("#change input[name='day']").val()
        item['ctime'] = $("#change input[name='ctime']").val()
        item['room'] = $("#change input[name='room']").val()
        var jsondata = JSON.stringify(item);
        // 获取输入的内容
        $.ajax({
            type: 'PUT',
            url: url,
            data: jsondata,
            datatype: 'json'
        })
            .done(function () {
                load_table();
                $("#form_change").hide()
            });
        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({
        type: 'GET',
        url: url,
        data:'',
        datatype: 'json'
    })
        .then(function (data) {
            $('#change input[name="cno"]').val(data[0]['cno']);
            $('#change input[name="cname"]').val(data[0]['cname']);
            $('#change input[name="ordn"]').val(data[0]['ordn']);
            $('#change input[name="credit"]').val(data[0]['credit']);
            $('#change input[name="day"]').val(data[0]['day']);
            $('#change input[name="ctime"]').val(data[0]['ctime']);
            $('#change input[name="room"]').val(data[0]['room']);
            $('#change').off('submit').on('submit', course_edit);
            $('#change input:submit').val('修改');
            $("#form_change").show()
        });
}
// 修改块


function delete_course(cno = '') {
    var url = '/s/course/' + cno
    $.ajax({
        type: 'DELETE',
        url: url,
        dataType: 'html'
    })
        .done(function () {
            alert('url:' + url)
            load_table();
        });
}
// 删除块

$(document).ready(function () {
    $("#form_close").on("click", function () {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#change').off('submit').on('submit', function () {
            return false;
        });
        $('#form_change').hide();
    });
    $("#add_course").on('click', add_courses);
    load_table();
    $("#course_form input:submit").on('click', postform);
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