let Plugin;
const init = (plugin) => {
  Plugin = plugin;
}

const sendAjaxRequest = (url, type, param, alwaysFunc, callback) => {
  if (!callback) {
    callback = alwaysFunc;
    alwaysFunc = () => {};
  }

  $.ajax({
    url: url,
    type: type,
    data: param
  })
  .done((data) => {
    if (data.success) {
      callback(data.body);
    } else {
      notifyMessage(data.body, 'error');
    }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    var message = jqXHR.status + ": " + textStatus;
    notifyMessage(message, 'error');
  })
  .always(alwaysFunc);
}

const notifyMessage = (message, status) => {
  RED.notify('<p>' + message + '</p>', status);
}

export {
  Plugin,
  init,
  sendAjaxRequest,
  notifyMessage
}
