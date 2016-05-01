/**
 * Created by xents on 30/04/2016.
 */

$('#machines-part').on('need-to-hide',function(cb){
  console.log('1');
  $(this).slideUp(1000,cb);
});

$('#machines-part').on('need-to-show-up',function(cb){
  console.log('2');
  $(this).slideDown(1000,cb);
});

$('#changeRoom-part').on('need-to-hide',function(cb){
  console.log('3');
  $(this).slideUp(1000,cb);
});

$('#changeRoom-part').on('need-to-show-up',function(cb){
  console.log('4');
  $(this).slideDown(1000,cb);
});