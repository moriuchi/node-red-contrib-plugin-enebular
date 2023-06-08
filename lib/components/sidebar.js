import { Plugin, notifyErrorMessages } from "../utils.js";
import { createImportPalette, addTreeListItem } from './import.js'
import { createExportPalette, createProjectList, createFlowList } from './export.js'
import { flows } from '../app/flows.js';


function createSidebar() {
  var sidebarDiv = $('<div/>', {style: "position: relative; height: 100%"});
  var sidebarHeader = $('<div/>', {id: "red-ui-sidebar-enebular-header", class: "red-ui-sidebar-header"}).appendTo(sidebarDiv);
  var sidebarBody = $('<div/>', {id: "red-ui-sidebar-enebular-body"})
                    .appendTo(sidebarDiv);

  var btnGroup1 = $('<span/>', {class: "button-group"}).appendTo(sidebarHeader);
  var btnGroup2 = $('<span/>', {class: "button-group"}).appendTo(sidebarHeader);

  $('<button/>', {type: "button", id: "red-ui-sidebar-enebular-login", class: "red-ui-sidebar-header-button"})
    .append('<span/>').text(Plugin._("enebular.label.signinBtn"))
    .appendTo(btnGroup1)
    .on("click", function() {
      $("#red-ui-dialog-enebular-login").show();
      $("#red-ui-enebular-dialog-ok").removeClass("disabled");
    });

  $('<button/>', {type: "button", id: "red-ui-sidebar-enebular-refresh", class: "red-ui-sidebar-header-button"})
    .append('<i class="fa fa-refresh" />')
    .appendTo(btnGroup2)
    .on("click", function() {
      flows.list()
      .then((result) => {
        Plugin.enebularFlows = result;
        addTreeListItem(result);
        createProjectList(result);
        createFlowList();
      })
      .catch((err) => {
        notifyErrorMessages(err.response);
      })
    });

  $('<div/>').append(createImportPalette()).appendTo(sidebarBody);
  $('<div/>').append(createExportPalette()).appendTo(sidebarBody);

  return sidebarDiv;
}


export {
  createSidebar
}
