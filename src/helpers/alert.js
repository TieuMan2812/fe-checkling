import swal from 'sweetalert';
class Alert {
  Success({message = '', title = 'Success!'}){
    swal({
      title: title,
      text: message,
      icon: "success",
    });
  }
  Error({message = '', title = 'Error!'}){
    swal({
      title: title,
      text: message,
      icon: "error",
    });
  }
  Confirm({message = '', title = 'Are you sure?', Yes = 'Đồng ý', No = 'Huỷ'}){
    return swal({
      title,
      text: message,
      icon: "warning",
      buttons: {
        cancel: No,
        confirm: {
          text: Yes,
          value: true,
        }
      },
      dangerMode: true,
    })
    .then((result) => result);
  }
}
export default Alert
