import { Plugin, sendAjaxRequest } from "../utils.js";
import { addTreeListItem } from './import.js'
import { createProjectList } from './export.js'


function createLoginDialog() {
  var dialogDiv = $('<div/>', {
                    id: "red-ui-dialog-enebular-login", role: "dialog",
                    class: "ui-dialog red-ui-editor-dialog ui-widget ui-widget-content ui-front ui-dialog-buttons",
                    style: "display: none; height: auto; width: 300px; top: 5px; left: 5px; z-index: 101;"
                  });

  var dialogHeader = $('<div/>', {class: "ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix"}).appendTo(dialogDiv);
  $('<span/>', {class: "ui-dialog-title"}).text(Plugin._("enebular.label.dialogTitle")).appendTo(dialogHeader);

  var dialogBody = $('<div/>', {
                    class: "ui-dialog-content ui-widget-content",
                    style: "margin: 0;padding: 5px;"
                  })
                  .appendTo(dialogDiv);

  var div1 = $('<div/>', {class: "form-row"}).appendTo(dialogBody);
  var div2 = $('<div/>', {class: "form-row"}).appendTo(dialogBody);

  $('<label/>').text(Plugin._("enebular.label.email")).appendTo(div1);
  var emailEl = $('<input/>', {type: "text", id: "node-input-enebular-email"}).appendTo(div1);

  $('<label/>').text(Plugin._("enebular.label.password")).appendTo(div2);
  var passwordEl = $('<input/>', {type: "password", id: "node-input-enebular-password"}).appendTo(div2);

  var dialogFooter = $('<div/>', {class: "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"}).appendTo(dialogDiv);
  var btnSet = $('<div/>', {class: "ui-dialog-buttonset"}).appendTo(dialogFooter);

  $('<button/>', {type: "button", id: "red-ui-enebular-dialog-cancel", class: "ui-button ui-corner-all ui-widget"})
    .text(Plugin._("enebular.label.canselBtn"))
    .appendTo(btnSet)
    .on("click", function() {
      emailEl.val("");
      passwordEl.val("");
      dialogDiv.hide();
    });

  $('<button/>', {type: "button", id: "red-ui-enebular-dialog-ok", class: "ui-button ui-corner-all ui-widget"})
    .text(Plugin._("enebular.label.loginBtn"))
    .appendTo(btnSet)
    .on("click", function() {
      const url = "/enebular-plugin/login";
      const params = {
        email: emailEl.val(),
        password: passwordEl.val()
      };
      const alwaysFunc = () => {
        emailEl.val("");
        passwordEl.val("");
        dialogDiv.hide();
      };

      sendAjaxRequest(url, "POST", params, alwaysFunc, function(result) {
        addTreeListItem(result);
        createProjectList(result);
      });
    });

  return dialogDiv;
}


export {
  createLoginDialog
}
