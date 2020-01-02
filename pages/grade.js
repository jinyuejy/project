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
        var btn_edit = $('<button class="button">')
            .text('修改')
            .on("click", (function (data) {
                return function (event) {
                    $("#grade_edit").show()
                    var cno = data['cno'];
                    var sno = data['sno']
                    edit_grade(sno,cno);
                }
            })(grade));

        var btn_del = $('<button class="button">')
            .text('删除')
            .on("click", (function (data) {
                return function (event) {
                    delete_grade(data['sno'],data['cno']);
                }
            })(grade));

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

function edit_grade(sno='',cno = '') {
    var url = '/s/grade/' + sno+'&'+cno;
    // correct
    function grade_edit() {
        var item = {}
        item['grade'] = $("#form_edit input[name='grades_edit']").val()
        alert('grade:'+item['grade'])
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
                $("#grade_edit").hide()
            });
        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({
        type: 'GET',
        url: url,
        data:'',
        datatype: 'json'
    })
        .done(function (data) {
            $('#form_edit input[name="grades_edit"]').val(data[0]['grade']);
            $('#form_edit').off('submit').on('submit', grade_edit);
            $('#form_edit input:submit').val('修改');

        });
}


function add_grade() {
    // $("#form_change").show()
    $("#change").off('submit').on('submit',function () {
        var item = {};
        item['sno'] = $("#change input[name='sno']").val()
        item['cno'] = $("#change input[name='cno']").val()
        item['grade'] = $("#change input[name='grade']").val()
        var url = '/s/grade/' +item['sno']+'&' +item['cno'];
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(item),
            datatype: 'json'
        })
            .done(function () {
                load_table();
                $("#grade_change").hide()
            });
        return false
    });

    $('#grade_change').show()
}
function delete_grade(sno='',cno = '') {
    var url = '/s/grade/' + sno+'&'+cno
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

$(document).ready(function(){
    $("#grade_close").on("click", function () {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#change').off('submit').on('submit', function () {
            return false;
        });
        $('#grade_change').hide();
    });
    $("#grade_edit_close").on('click',function(){
        $("#grade_edit").hide()
    })
    load_table()
    $("#grade_form input:submit").on('click',search)
    $("#add_grade").on('click', add_grade);
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