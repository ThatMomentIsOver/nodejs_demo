$(document).ready(function(){

function updatetable_select(id) {
	let code = "<td><select class=\"custom-select\" id= \'" + id + "\'>" + 
      "<option value=0>...</option><option value=\"-1\">已到</option><option value=\"1\">未到</option></select></td>"
	return code;
}

	$('body').on("click" , '#addAttendUser' , function(e){
		e.preventDefault();
		let id = $('#id').val(),
			name = $('#name').val();

    if (!id) {
      $('#progress_panel').show(1000);
      $('#error').show();
      $('#id').css('background-color', '#F9B9A4'); 
      return;
    }

		$.ajax({
			type:'GET',
			url:'/admin/addAttendUser?id='+id+'&name='+name,
			dataType:'JSON',
			success:function(data){
				if(data['code'] === 200){
					location.href = '/admin/attendlist';
				}
        if(data['code'] === 400) {
          $('#progress_panel').show(1000);
          $('#exist_error').show();
          $('#id').css('background-color', '#F9B9A4'); 
        }
			},
      error:function(data) {
          alert('failed');
					location.href = '/admin/attendlist';
      }
		});
	})

	$('body').on("click" , '.del' , function(e){

		let id = $(this).attr('data-id'),
			raw = this;
		if(confirm('确定删除该项?')){
			$.ajax({
				type:'get',
				url:'./deleteAttendUser?id='+id,
				success:function(){
					alert('success');
					$(raw).parent().parent().fadeOut('slow');
				}
			});
		}else{
			return false;
		}
	});

	$('body').on("click" , '.edit' , function(e){	
      $('#url_back').show();
  
			//console.log($(this));
      let list = [$(this).attr('data-id'), $(this).attr('data-name'), $(this).attr('data-weekA'),
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
					updatetable_select("week0") + updatetable_select("week1") +
					updatetable_select("week2") + updatetable_select("week3") +
					updatetable_select("week4") + updatetable_select("week5") +
					updatetable_select("week6") + updatetable_select("week7") +
					updatetable_select("week8") + updatetable_select("week9") +
				`
							<td><a class='btn btn-success save' data-id="${list[0]}" id='save'>Save</a></td>
				`
							);
  });

	// $('#save').live("click" ,function(){
	$('body').on("click" , '#save' , function(e){	

	$.ajax({
			type:'post',
			url:'./updateAttendUserInfo',
			dataType:'JSON',
			data:{
				id    : $(this).attr('data-id'),
				name  : $('#update_name').val(),
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
				}
			}
		});
	});

	$('body').on("click" , '#search' , function(e){		
		e.preventDefault();
		let id = $('#searchId').val();
		$.ajax({
			type:'GET',
			url:'/admin/query?id='+id,
			success:function(data){
				if (!data['flag']) {
					$('#infoContainer').empty().append(`
							<tr>
							<td>${data[0]['id']}</td>
							<td>${data[0]['name']}</td>
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
							<td>
							<a class='btn btn-danger del' data-id="${data[0]['id']}">删除</a>
							<a class='btn btn-primary edit' data-id="${data[0]['id']}" data-name="${data[0]['name']}" data-weekA="${data[0]['weekA']}", data-weekB="${data[0]['weekB']}", data-weekC="${data[0]['weekC']}",
 data-weekD="${data[0]['weekD']}", data-weekE="${data[0]['weekE']}", data-weekF="${data[0]['weekG']}",
 data-weekH="${data[0]['weekH']}", data-weekI="${data[0]['weekI']}", data-weekJ="${data[0]['weekJ']}",
 data-weekG="${data[0]['weekG']}">编辑</a>
							</td>
							</tr>
							`);
				} else {
					$('#infoContainer').empty().append(`
							<tr><td colspan='13' bgcolor='#F3908A'> NOT FOUND </td></tr>
							`)
				}
			}
		})
	})

});
