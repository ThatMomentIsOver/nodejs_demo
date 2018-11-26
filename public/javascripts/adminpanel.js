$(document).ready(function(){

  function updateattend_select(id) {
    let code = "<td><select class=\"custom-select\" id= \'" + id + "\'>" + 
      "<option value=0>...</option><option value=\"-1\">已到</option><option value=\"1\">未到</option></select></td>"
      return code;
  }

  $('body').on("click", '#manage', function(e) {
    e.preventDefault();

    let course_id = $(this).attr('data-id'),
    course_name = $(this).attr('data-name');
    location.href = './courseInfo?course_id='+course_id+'&course_name='+course_name;

  });

  $('body').on("click", '#addcourse_submit', function(e) {
    e.preventDefault();
    let course_id = $('#id').val(),
    course_name = $('#name').val();

    if (!course_id) {
      $('#progress_panel').show(1000);
      $('#error').show();
      $('#id').css('background-color', '#F9B9A4'); 
      return;
    }

    $.ajax({
      type:'GET',
      url:'/admin/appendcourse?course_id='+course_id+'&course_name='+course_name,
      dataType:'JSON',
      success:function(data){
        if(data['code'] === 200){
          location.href = '/admin/courselist';
        }
        if(data['code'] === 400) {
          $('#progress_panel').show(1000);
          $('#exist_error').show();
          $('#id').css('background-color', '#F9B9A4'); 
        }
      },
      error:function(data) {
        alert('failed');
        location.href = '/admin/courselist';
      }
    });

  });


  $('body').on("click" , '#del' , function(e){
    e.preventDefault();
    let id = $(this).attr('data-id'),
    raw = this;

    if(confirm('确定删除该项?')){
      $.ajax({
        type:'GET',
        url:'./deleteCourse?course_id='+id,
        success:function(){
          alert('success');
          $(raw).parent().parent().fadeOut('slow');
        }
      });
    }else{
      return false;
    }
  });

  $('body').on("click", '#stulist', function(e) {
    let course_id = $(this).attr('data-id');
    location.href = './enrollList?course_id='+course_id;
  });

  $('body').on("click", '#quitbyadmin', function(e) {
    e.preventDefault()
      let user_id = $(this).attr('data-id'),
    course_id = window.location.search;
    raw = this;

    $.ajax({
      type:'GET',
      url:'./quit_enroll'+ course_id + '&user_id=' + user_id,
      success:function(){
        alert('success');
        $(raw).parent().parent().fadeOut('slow');
      },
      error:function(data){
        alert('failed');
      }
    });

  });


  $('body').on("click", '#addenrollbyadmin', function(e) {
    e.preventDefault();
    let course_id = window.location.search;
    location.href = './addEnroll'+course_id;
  });


  $('body').on("click", '#addstuenroll_submit', function(e) {
    e.preventDefault();
    let user_id = $('#id').val(),
    course_id = window.location.search;

    if (!user_id) {
      $('#error').show();
      return;
    }

    $.ajax({
      type:'POST',
      url:'./addEnroll'+ course_id + '&user_id=' + user_id,
      success:function(data) {
        if(data['code'] === 501) {
          alert(data['msg']);
          location.href='./addEnroll'+course_id;
        }
        else{
          alert('success!');
          location.href='./enrollList'+course_id;
        }
      },
      error:function(data) {
        location.href='./enrollList'+course_id;
      }
    });
  });

	$('body').on("click" , '#search' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;

		$.ajax({
			type:'GET',
			url:'./queryEnroll'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>
							<a id="quitbyadmin" class='btn btn-danger' data-id="${data[0]['stu_id']}">删除</a>
							</td>
							</tr>
							`);
				} else {
          alert('error!');
        }
      }
		})
	});

  $('body').on("click", '#attendlist', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './attendList?course_id='+course_id;
  });

  $('body').on("click", '#homework', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './homeworkList?course_id='+course_id;
  });

 
  $('body').on("click", '#edithomework', function(e) {
    e.preventDefault();
    let user_id = $(this).attr('data-id'),
        name = $(this).attr('data-name');

    var raw_data_list = [];
    var name_list = ['homeworkA', 'homeworkB', 'homeworkC', 'homeworkD', 'homeworkE'];
    for (var i=0; i < 5; i++) {
      raw_data_list[i] = $(this).attr(name_list[i]);
    };


    $('#infoContainer').empty().append(`
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td bgcolor='#F3908A'><del>${raw_data_list[0]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[1]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[2]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[3]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[4]}</del></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td><input class="form-control form-control-sm" type="text" id='update-homeworkA'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-homeworkB'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-homeworkC'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-homeworkD'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-homeworkE'></td>
        <td></td>
        <td><a class='btn btn-success' data-id="${user_id}" id='updatehomework_commit'>Save</a></td>
        `
        );
    });


  $('body').on("click", '#updatehomework_commit', function(e) {
    let course_id = window.location.search,
        id = $(this).attr('data-id');

    var data = {};
    var name_list = ['#update-homeworkA', '#update-homeworkB', '#update-homeworkC', '#update-homeworkD', '#update-homeworkE'];
    var qname_list = ['homeworkA', 'homeworkB', 'homeworkC', 'homeworkD', 'homeworkE'];

    
    for(var i=0; i<5; i++){
      val = $(name_list[i]).val();
      if (val.length) {
        data[qname_list[i]] = val;
      }
    }

    if (Object.keys(data).length === 0) {
      alert('nothing change......nothing fails, no more fears......');
      return;
    }

       $.ajax({
       type:'GET',
       url:'./updatehomework'+ course_id + '&user_id=' + id,
       dataType:'JSON',
       data: data,
       success:function(data){
          if(data['flag'] === 200) {
            location.reload(); 
          }
        }
       });
  });


	$('body').on("click" , '#homeworksearch' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;

		$.ajax({
			type:'GET',
			url:'./queryhomework'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['homeworkA']}</td>
							<td>${data[0]['homeworkB']}</td>
							<td>${data[0]['homeworkC']}</td>
							<td>${data[0]['homeworkD']}</td>
							<td>${data[0]['homeworkE']}</td>
							<td>${data[0]['score']}</td>
							<td><a id="edithomework" class='btn btn-primary' data-id=${data[0]['stu_id']} data-name=${data[0]['username']} homeworkA=${data[0]['homeworkA']} homeworkB=${data[0]['homeworkB']} homeworkC=${data[0]['homeworkC']} homeworkD=${data[0]['homeworkD']} homeworkE=${data[0]['homeworkE']} score=${data[0]['score']} >edit</a></td>
							</tr>
							`);
				} else {
          alert('error!');
        }
      }
		})
	});


  $('body').on("click", '#labs', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './labsList?course_id='+course_id;
  });
  
  $('body').on("click", '#editlabs', function(e) {
    e.preventDefault();
    let user_id = $(this).attr('data-id'),
        name = $(this).attr('data-name');

    var raw_data_list = [];
    var name_list = ['labA', 'labB', 'labC', 'labD', 'labE'];
    for (var i=0; i < 5; i++) {
      raw_data_list[i] = $(this).attr(name_list[i]);
    };


    $('#infoContainer').empty().append(`
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td bgcolor='#F3908A'><del>${raw_data_list[0]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[1]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[2]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[3]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[4]}</del></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td><input class="form-control form-control-sm" type="text" id='update-labA'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-labB'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-labC'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-labD'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-labE'></td>
        <td></td>
        <td><a class='btn btn-success' data-id="${user_id}" id='updatelabs_commit'>Save</a></td>
        `
        );
    });

  $('body').on("click", '#updatelabs_commit', function(e) {
    let course_id = window.location.search,
        id = $(this).attr('data-id');

    var data = {};
    var name_list = ['#update-labA', '#update-labB', '#update-labC', '#update-labD', '#update-labE'];
    var qname_list = ['labA', 'labB', 'labC', 'labD', 'labE'];

    
    for(var i=0; i<5; i++){
      val = $(name_list[i]).val();
      if (val.length) {
        data[qname_list[i]] = val;
      }
    }

    if (Object.keys(data).length === 0) {
      alert('nothing change......nothing fails, no more fears......');
      return;
    }

       $.ajax({
       type:'GET',
       url:'./updateLabs'+ course_id + '&user_id=' + id,
       dataType:'JSON',
       data: data,
       success:function(data){
          if(data['flag'] === 200) {
            location.reload(); 
          }
        }
       });

  });


	$('body').on("click" , '#labssearch' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;


		$.ajax({
			type:'GET',
			url:'./querylabs'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['labA']}</td>
							<td>${data[0]['labB']}</td>
							<td>${data[0]['labC']}</td>
							<td>${data[0]['labD']}</td>
							<td>${data[0]['labE']}</td>
							<td>${data[0]['score']}</td>
							<td><a id="editlabs" class='btn btn-primary' data-id=${data[0]['stu_id']} data-name=${data[0]['username']} labA=${data[0]['labA']} labB=${data[0]['labB']} labC=${data[0]['labC']} labD=${data[0]['labD']} labE=${data[0]['labE']} score=${data[0]['score']} >edit</a></td>
							</tr>
							`);
				} else {
          alert('error!');
        }
      }
		})
	});


  $('body').on("click", '#final', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './finalList?course_id='+course_id;
  });

 
  $('body').on("click", '#editfinal', function(e) {
    e.preventDefault();
    let user_id = $(this).attr('data-id'),
        name = $(this).attr('data-name');

    var raw_data_list = [];
    var name_list = ['qA', 'qB', 'qC', 'qD', 'qE'];
    for (var i=0; i < 5; i++) {
      raw_data_list[i] = $(this).attr(name_list[i]);
    };


    $('#infoContainer').empty().append(`
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td bgcolor='#F3908A'><del>${raw_data_list[0]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[1]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[2]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[3]}</del></td>
        <td bgcolor='#F3908A'><del>${raw_data_list[4]}</del></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td>${user_id}</td>
        <td>${name}</td>
        <td><input class="form-control form-control-sm" type="text" id='update-qA'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-qB'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-qC'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-qD'></td>
        <td><input class="form-control form-control-sm" type="text" id='update-qE'></td>
        <td></td>
        <td><a class='btn btn-success' data-id="${user_id}" id='updatefinal_commit'>Save</a></td>
        `
        );
    });


  $('body').on("click", '#updatefinal_commit', function(e) {
    let course_id = window.location.search,
        id = $(this).attr('data-id');

    var data = {};
    var name_list = ['#update-qA', '#update-qB', '#update-qC', '#update-qD', '#update-qE'];
    var qname_list = ['qA', 'qB', 'qC', 'qD', 'qE'];

    
    for(var i=0; i<5; i++){
      val = $(name_list[i]).val();
      if (val.length) {
        data[qname_list[i]] = val;
      }
    }

    if (Object.keys(data).length === 0) {
      alert('nothing change......nothing fails, no more fears......');
      return;
    }

       $.ajax({
       type:'GET',
       url:'./updateFinal'+ course_id + '&user_id=' + id,
       dataType:'JSON',
       data: data,
       success:function(data){
         location.reload(); 
        }
       });
  });


	$('body').on("click" , '#finalsearch' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;


		$.ajax({
			type:'GET',
			url:'./queryfinal'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['qA']}</td>
							<td>${data[0]['qB']}</td>
							<td>${data[0]['qC']}</td>
							<td>${data[0]['qD']}</td>
							<td>${data[0]['qE']}</td>
							<td>${data[0]['score']}</td>
							<td><a id="editfinal" class='btn btn-primary' data-id=${data[0]['stu_id']} data-name=${data[0]['username']} qA=${data[0]['qA']} qB=${data[0]['qB']} qC=${data[0]['qC']} qD=${data[0]['qD']} qE=${data[0]['qE']} score=${data[0]['score']} >edit</a></td>
							</tr>
							`);
				} else {
          alert('error!');
        }
      }
		})
	});

  $('body').on("click", '#editallfinal', function(e) {
    e.preventDefault();
    let course_id = window.location.search;
    location.href = './updateAllFinalMiddle'+course_id;
  });

  $('body').on("click", '#savefinal', function(e) {
    e.preventDefault();
    let course_id = window.location.search;
    var t = [];

    $('#infoContainer tr').each(function() {
      var row = [];

      $(this).find('td').each(function() {
        if (this.childNodes.length <= 1 && this.childNodes[0].nodeName === '#text') {
          row.push($(this).text());
        } else if (this.childNodes[0].nodeName === 'INPUT'){
          row.push(this.childNodes[0].value);
        } else {
          row.push(this.childNodes[1].value);
        }
      });
      t.push(row);
    });

    var change_list = {};

    var qname_list = ['qA', 'qB', 'qC', 'qD', 'qE'];
    for (var i = 0, len = t.length; i < len; i++) {
      okey = t[i][0];
      change_list[okey] = {};
      for (var inner = 2, inner_len = t[i].length, qname_key = 0;
          inner < inner_len; inner++, qname_key++ ) {
        change_list[okey][qname_list[qname_key]] = t[i][inner];
      }
    }

    $.ajax({
      type:'POST',
      url:'./updateAllFinal'+ course_id,
      data: change_list,
      success:function(){
        location.href = './finalList' + course_id;
      },
      error:function(data){
        alert('failed');
      }
    });
  });

  $('body').on("click", '#editattend', function(e) {
      let list = [$(this).attr('data-id'), $(this).attr('data-username'), $(this).attr('data-weekA'),
        $(this).attr('data-weekB'), $(this).attr('data-weekC'), $(this).attr('data-weekD'),  
        $(this).attr('data-weekE'), $(this).attr('data-weekF'),  $(this).attr('data-weekG'),  
        $(this).attr('data-weekH'), $(this).attr('data-weekI'), $(this).attr('data-weekJ')]


  				$('#infoContainer').empty().append(`
					<tr>
						<td>${list[0]}</td>
						<td>${list[1]}</td>
						<td bgcolor='#F3908A'><del>${list[2]}</del></td>
						<td bgcolor='#F3908A'><del>${list[3]}</del></td>
						<td bgcolor='#F3908A'><del>${list[4]}</del></td>
						<td bgcolor='#F3908A'><del>${list[5]}</del></td>
						<td bgcolor='#F3908A'><del>${list[6]}</del></td>
						<td bgcolor='#F3908A'><del>${list[7]}</del></td>
						<td bgcolor='#F3908A'><del>${list[8]}</del></td>
						<td bgcolor='#F3908A'><del>${list[9]}</del></td>
						<td bgcolor='#F3908A'><del>${list[10]}</del></td>
						<td bgcolor='#F3908A'><del>${list[11]}</del></td>
						<td></td>
					</tr>
          <tr>
						<td>${list[0]}</td>
            <td>${list[1]}</td>
				` + 
					updateattend_select("week0") + updateattend_select("week1") +
					updateattend_select("week2") + updateattend_select("week3") +
					updateattend_select("week4") + updateattend_select("week5") +
					updateattend_select("week6") + updateattend_select("week7") +
					updateattend_select("week8") + updateattend_select("week9") +
				`
							<td><a class='btn btn-success' data-id="${list[0]}" id='saveattend'>Save</a></td>
				`
							);
 
  });


	$('body').on("click" , '#saveattend' , function(e){	
    e.preventDefault();
    let course_id = window.location.search;
	$.ajax({
			type:'post',
			url:'./updateAttend' + course_id,
			dataType:'JSON',
			data:{
				stu_id    : $(this).attr('data-id'),
				weekA : $('#week0 option:selected').val(),
				weekB : $('#week1 option:selected').val(),
				weekC : $('#week2 option:selected').val(),
				weekD : $('#week3 option:selected').val(),
				weekE : $('#week4 option:selected').val(),
				weekF : $('#week5 option:selected').val(),
				weekG : $('#week6 option:selected').val(),
				weekH : $('#week7 option:selected').val(),
				weekI : $('#week8 option:selected').val(),
				weekJ : $('#week9 option:selected').val()
			},
			success:function(data){
				if(data['affectedRows']){
					location.reload();
				} else {
          alert('update list empty');
        }
			}
		});
	});


	$('body').on("click" , '#attendsearch' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;

		$.ajax({
			type:'GET',
			url:'./queryattend'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['weekA']}</td>
							<td>${data[0]['weekB']}</td>
							<td>${data[0]['weekC']}</td>
							<td>${data[0]['weekD']}</td>
							<td>${data[0]['weekE']}</td>
							<td>${data[0]['weekF']}</td>
							<td>${data[0]['weekG']}</td>
							<td>${data[0]['weekH']}</td>
							<td>${data[0]['weekI']}</td>
							<td>${data[0]['weekJ']}</td>
							<td><a id="editattend" class='btn btn-primary' data-id=${data[0]['stu_id']} data-username=${data[0]['username']} data-weekA=${data[0]['weekA']} data-weekB=${data[0]['weekB']} data-weekC=${data[0]['weekC']} data-weekD=${data[0]['weekD']} data-weekE=${data[0]['weekE']} data-weekF=${data[0]['weekF']} data-weekG=${data[0]['weekG']} data-weekH=${data[0]['weekH']} data-weekI=${data[0]['weekI']}  data-weekJ=${data[0]['weekJ']} } >edit</a></td>
							</tr>
							`);
				} else {
          alert('error!');
        }
      }
		})
	});

  $('body').on("click", '#infolist', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './infoList?course_id='+course_id;
  });

  $('body').on("click", '#tracelist', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
    location.href = './traceList?course_id='+course_id;
  });

  $('body').on("click", '#set_trace', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id');
  });

  $('body').on("click", '#set_attend_op', function(e) {
    e.preventDefault();
    let course_id = window.location.search;
    location.href = './setAttendOpMiddle'+course_id;
  });

  $('body').on("click", '#set_attend_op_submit', function(e) {
    e.preventDefault();
    let course_id = window.location.search,
      co_score =  $('#attend_op_score').val();

    if (!co_score) {
      $('#error').show();
      return;
    }

    $.ajax({
      type:'GET',
      url:'./setAttendOp'+ course_id + '&co_score=' + co_score,
      dataType:'JSON',
      success:function(data){
        if (data['flag'] === 200) {
          alert('success');
          location.href = './traceList'+course_id;
        }
      },
      error:function(data){
        alert('failed');
      }
    });
  });

  $('body').on("click", '#tracesearch', function(e) {
    e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;

		$.ajax({
			type:'GET',
			url:'./queryTrace'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['attendance_score']}</td>
							<td>${data[0]['homework_score']}</td>
							<td>${data[0]['labs']}</td>
							</tr>
							`);
				} else {
          alert(data['msg']);
        }
      }
		})
  });

  $('body').on("click", '#infosearch', function(e) {
    e.preventDefault();
		let id = $('#searchId').val(),
    course_id = window.location.search;
    
		$.ajax({
			type:'GET',
			url:'./queryInfo'+ course_id + '&user_id=' + id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['stu_id']}</td>
							<td>${data[0]['username']}</td>
							<td>${data[0]['as_score']}</td>
							<td>${data[0]['final_score']}</td>
							<td>${data[0]['grade']}</td>
							</tr>
							`);
				} else {
          alert(data['msg']);
        }
      }
		})
  });

  $('body').on("click", '#inforeload', function(e) {
    e.preventDefault();
    let course_id = window.location.search;

    $.ajax({
      type:'GET',  
      url:'./infoReload' + course_id,
      success:function() {
        location.reload(); 
      }
    });
  });


  $('body').on("click", '#set_per', function(e) {
    e.preventDefault();
    let course_id = window.location.search;
    location.href='./setPerMiddle'+course_id;
  });

  $('body').on("click", '#save_per', function(e) {
    e.preventDefault();
    let course_id = window.location.search,
        as_score_per = $('#as_score_per').val(),
        final_score_per = $('#final_score_per').val();
  
    if (!as_score_per || !final_score_per){
      $('#error').show();
      return;
    }

    var tmp = (+as_score_per) + (+final_score_per);

    if ( tmp != 1) {
      $('#valueerror').show();
      return;
    }

    $.ajax({
      type:'GET',  
      url:'./setPer' + course_id,
      dataType:'JSON',
      data: {
        as_score_per: as_score_per,
        final_score_per: final_score_per
      },
      success:function(data) {
        //
      }
    });
  });

  $('body').on("click", '#confirmUser', function(e) {
    e.preventDefault();
    let id = $(this).attr('data-id');

    $.ajax({
      type:'POST',  
      url:'./confirmUser',
      dataType: 'JSON',
      data: {
        id: id
      },
      success:function() {
        location.reload();
      }
    });

  }); 


});
