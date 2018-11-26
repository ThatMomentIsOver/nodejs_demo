$(document).ready(function(){ 
  
  $('body').on("click" , '#updateprofile' , function(e){
    e.preventDefault();
    $('#id').prop('readonly', false);
    $('#name').prop('readonly', false);
    $('#submit').show();
  });

  $('body').on("click", '#submit', function(e){
    e.preventDefault();
    let id = $('#id').val(),
			name = $('#name').val(),
      raw_id = $(this).attr('raw_id');

    if (!id) {
      $('#progress_panel').show(1000);
      $('#error').show();
      $('#id').css('background-color', '#F9B9A4'); 
    } 

		$.ajax({
			type:'POST',
			url:'/users/profile?id='+id+'&username='+name+'&rawid='+raw_id,
			dataType:'JSON',
			success:function(data){
				if(data['code'] === 200){
          alert('success! pls login again');
          location.href='/users/logout_nolayout'
				}
			},
      error:function(data) {
          alert('failed');
      }
		});
  });

});
