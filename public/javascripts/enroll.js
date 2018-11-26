$(document).ready(function(){

  $('body').on("click", '#enroll', function(e){
    e.preventDefault();
    let course_id = $(this).attr('data-id'),
        enroll_status = $(this).attr('data-status');

    if (enroll_status == 'Yes') {
      alert('have been enroll!');
      return;
    }

    $.ajax({
      type:'GET',
      url:'./enroll_commit?course_id='+course_id,
      success:function(){
        alert('success');
        location.reload();
      },
      error:function(data){
        alert('failed');
      }
    });
  });


  $('body').on("click", '#quit', function(e) {
    e.preventDefault();
    let course_id = $(this).attr('data-id'),
        enroll_status = $(this).attr('data-status');

    if (enroll_status == 'No') {
      alert('has been not available!');
      return;
    }

    $.ajax({
      type:'GET',
      url:'./quit_commit?course_id='+course_id,
      success:function(){
        alert('success');
        location.reload();
      },
      error:function(data){
        alert('failed');
      }
    });
 
  });

})
