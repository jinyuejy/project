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
        row.appendTo(tbody)
        var btn_edit = $('<button>')
            .text('修改')
            .on("click", (function (data) {
                return function (event) {
                    $("#form_change").show()
                    var cno = data['cno'];
                    edit_course(cno);
                }
            })(data));

        var btn_del = $('<button>')
            .text('删除')
            .on("click", (function (data) {
                return function (event) {
                    delete_course(data['cno']);
                }
            })(data));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);
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
    $("#change").off('submit').on('submit',function () {
        var item = {};
        item['cno'] = $("#change input[name='cno']").val()
        item['cname'] = $("#change input[name='cname']").val()
        item['ordn'] = $("#change input[name='ordn']").val()
        item['credit'] = $("#change input[name='credit']").val()
        // item['cnature']=$("#change input[name='cnature']").val()
        // item['coption']=$("#change input[name='coption']").val()
        var url = '/s/course/' + item['cno'];
        alert('url:'+url)
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
        data: '',
        datatype: 'json'
    })
        .done(function (data) {
            alert('data:' + data['cno'])
            $('#change input[name="cno"]').val(data['cno']);
            $('#change input[name="cname"]').val(data['cname']);
            $('#change input[name="ordn"]').val(data['ordn']);
            $('#change input[name="credit"]').val(data['credit']);
            $('#change').off('submit').on('submit', course_edit);
            $('#change input:submit').val('修改');

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