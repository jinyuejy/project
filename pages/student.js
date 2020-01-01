
function render_list(list) {
    var tbody = $("#list-tbody").empty();
    for (i in list) {
        var student = list[i];
        var row = $('<tr>');
        $('<td>').text(student['sno']).appendTo(row);
        $('<td>').text(student['sname']).appendTo(row);
        $('<td>').text(student['ssex']).appendTo(row);
        $('<td>').text(student['rd']).appendTo(row);

        var btn_edit = $('<button>')
            .text('修改')
            .on("click", (function (student) {
                return function (event) {
                    var sn = student['sno'];
                    edit_student(sn);
                }
            })(student));

        var btn_del = $('<button>')
            .text('删除')
            .on("click", (function (item) {
                return function (event) {
                    delete_student(item['sno']);
                }
            })(student));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);


        row.appendTo(tbody);
    }
}

function load_list() {
    $.ajax({
        type: 'GET',
        url: "/s/student/",
        data: '',
        dataType: 'json'
    })
        .done(function (data) {
            render_list(data);
        });

}

function get_details(sno) {
    $.ajax({
        type: 'get',
        url: '/subscriptions/' + id,
        data: "subscription[title]=" + encodeURI(value),
        dataType: 'script'
    });

    $.ajax({
        type: 'PUT',
        url: '/subscriptions/' + id,
        data: "subscription[title]=" + encodeURI(value),
        dataType: 'script'
    });

}

function edit_student(sno) {
    function put_student() {
        var item = {};
        // var sno = $('#frm-student input[name="sno"]').val();
        // item['sn'] = sno;
        item['sno'] = $('#frm-student input[name="sno"]').val();
        item['sname'] = $('#frm-student input[name="sname"]').val();
        item['ssex'] = $('#frm-student input[name="ssex"]').val();
        item['PASSWORD'] = $('#frm-student input[name="PASSWORD"]').val()
        item['rd'] = $('#frm-student input[name="rd"]').val();
        var jsondata = JSON.stringify(item);
        $.ajax({
            type: 'PUT',
            url: '/s/student/' + sno,
            data: jsondata,
            dataType: 'json'
        })
            .done(function () {
                load_list();
                $('#dlg-student-form').hide()
            });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({
        type: 'GET',
        url: '/s/student/' + sno,
        dataType: 'json'
    })
        .then(function (item) {
            // $('#frm-student input[name="sn"]').val(item['sn']);
            $('#frm-student input[name="sno"]').val(item['sno']);
            $('#frm-student input[name="sname"]').val(item['sname']);
            $('#frm-student input[name="ssxe"]').val(item['ssex']);
            $('#frm-student input[name="PASSWORD"]').val(item['PASSWORD']);
            $('#frm-student input[name="rd"]').val(item['rd']);

            $('#frm-student').off('submit').on('submit', put_student);
            $('#frm-student input:submit').val('修改');
            $('#dlg-student-form').show()
        });

}


function register_student() {
    // 因为新添和修改都使用和这个表单，因此需要置空这个表单
    // $('#frm-student input[name="sn"]').val('');
    $('#frm-student input[name="sno"]').val('');
    $('#frm-student input[name="sname"]').val('');
    $('#frm-student input[name="ssex"]').val('');
    $('#frm-student input[name="PASSWORD"]').val('')
    $('#frm-student input[name="rd"]').val('');



    $('#frm-student input:submit').val('新增')
    // 要先把前面事件处理取消掉，避免累积重复事件处理
    $('#frm-student').off('submit').on('submit', function () {
        var item = {};
        item['sno'] = $('#frm-student input[name="sno"]').val();
        item['sname'] = $('#frm-student input[name="sname"]').val();
        item['ssex'] = $('#frm-student input[name="ssex"]').val();
        item['PASSWORD'] = $('#frm-student input[name="PASSWORD"]').val()
        item['rd'] = $('#frm-student input[name="rd"]').val();
        $.ajax({
            type: 'POST',
            url: '/s/student/',
            data: JSON.stringify(item),
            dataType: 'json'
        })
            .done(function () {
                load_list();
                $('#dlg-student-form').hide()
            });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    });
    $('#dlg-student-form').show()
}


function delete_student(sno) {
    $.ajax({
        type: 'DELETE',
        url: '/s/student/' + sno,
        dataType: 'html'
    })
        .done(function () {
            load_list();
        });
}

//----------------------------------------------------
$(document).ready(function () {

    $("#btn-refresh").on("click", load_list);
    $("#btn-new").on("click", register_student);
    $("#btn-student-frm-close").on("click", function () {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#frm-student').off('submit').on('submit', function () {
            return false;
        });
        $('#dlg-student-form').hide();
    });

    load_list();
});

//---设置AJAX缺省的错误处理方式
//---有时需要禁止全局错误处理时，可以在调用ajax时增添{global: false}禁止
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


