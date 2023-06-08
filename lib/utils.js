let Plugin;
const init = (plugin) => {
  Plugin = {
    ...plugin,
    enebularFlows: [],
    createFlow: true
  }
}

const notifyErrorMessages = (errData) => {
  const errMessage = (errData.data.message)? errData.data.message : errData.data;
  const errText = `${errData.status}: ${errMessage}`;
  notifyMessage(errText, 'error');
}

const notifyMessage = (message, status) => {
  RED.notify('<p>' + message + '</p>', status);
}

const notifyConfirmMessage = (message, btnName, okFunc) => {
  const confirmNotify = RED.notify('<p>' + message + '</p>', {
    modal: true,
    fixed: true,
    type: 'warning',
    buttons: [{
        text: Plugin._("enebular.label.canselBtn"),
        click: function(e) {
          confirmNotify.close();
        }
      },
      {
        text: btnName,
        class:"primary",
        click: function(e) {
          confirmNotify.close();
          okFunc();
        }
      }]
  });
}

export {
  Plugin,
  init,
  notifyErrorMessages,
  notifyMessage,
  notifyConfirmMessage
}
