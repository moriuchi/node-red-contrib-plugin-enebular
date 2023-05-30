let Plugin;
const init = (plugin) => {
  Plugin = plugin;
}

const notifyErrorMessages = (errData) => {
  const errMessage = (errData.data.message)? errData.data.message : errData.data;
  const errText = `${errData.status}: ${errMessage}`;
  notifyMessage(errText, 'error');
}

const notifyMessage = (message, status) => {
  RED.notify('<p>' + message + '</p>', status);
}

export {
  Plugin,
  init,
  notifyErrorMessages,
  notifyMessage
}
