import { Plugin, sendAjaxRequest } from "../utils.js";

function createImportPalette() {
  var importPalette = $('<div/>', {id: "red-ui-enebular-import", class: "red-ui-palette-category"});
  var sidebarHeight = $("#red-ui-sidebar-content").height();
  var importBody = $('<div/>').appendTo(importPalette);
  importBody.css("height", (sidebarHeight - (40*2)) + "px");

  var flowTree = $('<div/>', {id: "red-ui-sidebar-enebular-flow-tree"})
                .css({width: "100%", height: "100%"}).treeList({})
                .appendTo(importBody);

  flowTree.on("treelistselect", function(event, item) {
    if (item.parent) {
      const url = "/enebular-plugin/getFlowJson";
      const params = {
        flowId: item.id,
        projectId: item.parent.id
      };
      sendAjaxRequest(url, "POST", params, function(result) {
        RED.view.importNodes(result.flowData);

        var credData = result.credData;
        RED.nodes.eachConfig(function(config) {
          if (credData.hasOwnProperty(config.id)) {
            config["credentials"] = credData[config.id];
            RED.nodes.add(config);
          }
        });
      });
    }
  });

  return importPalette;
}

function addTreeListItem(flows){
  var treeDiv = $("#red-ui-sidebar-enebular-flow-tree");
  var projects = [];
  var treeData = [];

  flows.forEach(function(data, idx) {
    var pIndex = projects.indexOf(data.projectId);
    var children = {
      id: data.id,
      label: data.title
    };

    if (pIndex === -1) {
      var project = {
        id: data.projectId,
        label: data.projectName,
        expanded: (idx === 0),
        selected: (idx === 0),
        children: [children]
      };
      treeData.push(project);
      projects.push(data.projectId);

    }else{
      treeData[pIndex].children.push(children);
    }
  });

  treeDiv.treeList('empty');
  treeDiv.treeList('data', treeData);
}


export {
  createImportPalette,
  addTreeListItem
}
