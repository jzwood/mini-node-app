/*
router takes urls, post data, resource requests, and the handler hash map.
if the hash map contains instructions the data is sent to handler,
otherwise it is rejected
*/

function route(handle, pathname, response, postData) {
  if (typeof handle[pathname] === 'function'){
    handle[pathname](response, postData);
  }else{
    handle["load-resource"](response, pathname);
  }
}

exports.route = route;
