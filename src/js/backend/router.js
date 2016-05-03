/*
router separates loaded items into page loads (custom pages) and
resources implicity loaded within pages, ie images, css, etc
*/

function route(handle, pathname, request, response, postData) {
  if (typeof handle[pathname] === 'function'){
    handle[pathname](request, response, postData);
  }else{
    handle["load-resource"](response, pathname);
  }
}

exports.route = route;
