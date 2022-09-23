export function doAjax(args) {
  window.ajaxUrl = "https://www.goodcopy.xyz/wp-admin/admin-ajax.php";
  return window.jQuery.ajax(window.ajaxUrl, args);
}
