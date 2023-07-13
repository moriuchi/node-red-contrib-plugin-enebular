import { Plugin, notifyErrorMessages, notifyMessage, notifyConfirmMessage } from "../utils.js";
import { createFlowList } from './export.js';
import { flows } from '../app/flows.js';

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
      notifyConfirmMessage(
        Plugin._("enebular.message.importConfirm", {flowname: item.label}),
        Plugin._("enebular.label.importBtn"),
        function() {
          importFlow(item);
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

var projectId, nodeId;
function importFlow(item) {
  const params = {
    flowId: item.id,
    projectId: item.parent.id
  };

  flows.get(params)
  .then((data) => {
    const flowData = data.flowData;
    projectId = data.projectId;
    nodeId = data.id;
    try {
      RED.view.importNodes(flowData);

      var credData = data.credData;
      RED.nodes.eachConfig(function(config) {
        if (credData.hasOwnProperty(config.id)) {
          config["credentials"] = credData[config.id];
          RED.nodes.add(config);
        }
      });

      toggleDeployFlow(projectId, nodeId);

    }catch(e){
      //notifyMessage(e.toString(), "error");
      const importConfig = e.importConfig;

      const notify = RED.notify('<p>' + Plugin._("enebular.message.importConflict") + '</p>', {
        modal: true,
        fixed: true,
        type: 'info',
        buttons: [{
            text: Plugin._("enebular.label.canselBtn"),
            click: function() {
              notify.close();
            }
          },
          {
            text: Plugin._("enebular.label.viewNodesBtn"),
            click: function() {
              notify.close();
              createConflictTree(importConfig, flowData);
            }
          },
          {
            text: Plugin._("enebular.label.importCopyBtn"),
            click: function() {
              notify.close();
              RED.view.importNodes(flowData, {generateIds: true});
              toggleDeployFlow(projectId, nodeId);
            }
          }]
      });
    }
  })
  .catch((err) => {
    notifyErrorMessages(err.response);
  });

}

function toggleDeployFlow(projectId, nodeId) {
  $("#node-input-enebular-project").val(projectId).attr("disabled", true);
  createFlowList();
  $("#node-input-enebular-flowList").val(nodeId).attr("disabled", true);
  $("#enebular-create-flow-row").css("display", "none");
  $("#enebular-flow-row").css("display", "inline-flex");
  Plugin.createFlow = false;
}

/*
*  copy showImportConflicts from @node-red/editor-client/src/js/ui/clipboard.js
*/
function createConflictTree(importConfig, importFlowData) {
  var id, node;
  var treeData = [];
  var container;
  var addedHeader = false;
  for (id in importConfig.tabs) {
    if (importConfig.tabs.hasOwnProperty(id)) {
      if (!addedHeader) {
        treeData.push({
          gutter: $('<span></span>').text(Plugin._("enebular.label.flows")),
          label: '',
          class: "red-ui-clipboard-dialog-import-conflicts-item-header"
        });
        addedHeader = true;
      }
      node = importConfig.tabs[id];
      var isConflicted = importConfig.conflicted[node.id];
      var isSelected = true;
      var elements = createNodeElement(node, isConflicted, isSelected);
      container = {
        id: node.id,
        gutter: elements.gutter.element,
        element: elements.element,
        icon: "red-ui-icons red-ui-icons-flow",
        deferBuild: true,
        class: isSelected? "" : "disabled",
        children: []
      }
      treeData.push(container);
      if (importConfig.zMap[id]) {
        importConfig.zMap[id].forEach(function(node) {
          var childElements = createNodeElement(node, importConfig.conflicted[node.id], isSelected, elements.gutter.cb);
          container.children.push({
            id: node.id,
            gutter: childElements.gutter.element,
            element: childElements.element,
            class: isSelected? "" : "disabled"
          });
        });
      }
    }
  }
  addedHeader = false;
  for (id in importConfig.subflows) {
    if (importConfig.subflows.hasOwnProperty(id)) {
      if (!addedHeader) {
        treeData.push({
          gutter: $('<span></span>').text(Plugin._("enebular.label.subflows")),
          label: '',
          class: "red-ui-clipboard-dialog-import-conflicts-item-header"
        });
        addedHeader = true;
      }
      node = importConfig.subflows[id];
      var isConflicted = importConfig.conflicted[node.id];
      var isSelected = !isConflicted;
      var elements = createNodeElement(node, isConflicted, isSelected );
      container = {
        id: node.id,
        gutter: elements.gutter.element,
        element: elements.element,
        class: isSelected? "" : "disabled",
        deferBuild: true,
        children: []
      }
      treeData.push(container);
      if (importConfig.zMap[id]) {
        importConfig.zMap[id].forEach(function(node) {
          var childElements = createNodeElement(node, importConfig.conflicted[node.id], isSelected, elements.gutter.cb);
          container.children.push({
            id: node.id,
            gutter: childElements.gutter.element,
            element: childElements.element,
            class: isSelected? "" : "disabled"
          })
        });
      }
    }
  }
  addedHeader = false;
  for (id in importConfig.configs) {
    if (importConfig.configs.hasOwnProperty(id)) {
      if (!addedHeader) {
        treeData.push({
          gutter: $('<span></span>').text(Plugin._("enebular.label.displayConfig")),
          label: '',
          class: "red-ui-clipboard-dialog-import-conflicts-item-header"
        });
        addedHeader = true;
      }
      node = importConfig.configs[id];
      var isConflicted = importConfig.conflicted[node.id];
      var isSelected = !isConflicted || !importConfig.configs[node.id];
      var elements = createNodeElement(node, isConflicted, isSelected);
      container = {
        id: node.id,
        gutter: elements.gutter.element,
        element: elements.element,
        class: isSelected? "" : "disabled"
      }
      treeData.push(container);
    }
  }

  openImportConflictsDialog(treeData, importFlowData);
}

/*
*  copy getNodeElement from @node-red/editor-client/src/js/ui/clipboard.js
*/
function createNodeElement(node, isConflicted, isSelected, parent) {
  var element;
  if (node.type === "tab") {
    element = $('<div>', {class: "red-ui-info-outline-item red-ui-info-outline-item-flow"});
    $('<div>', {class: "red-ui-search-result-description red-ui-info-outline-item-label"}).text(node.label).appendTo(element);

  } else {
    var srcNode = RED.nodes.node(node.id) || RED.nodes.subflow(node.id) || RED.nodes.group(node.id) || RED.nodes.workspace(node.id);
    element = $('<div>', {class: "red-ui-node-list-item"});
    RED.utils.createNodeIcon(srcNode, true).appendTo(element);
  }

  var controls = $('<div>', {class: "red-ui-clipboard-dialog-import-conflicts-controls"}).appendTo(element);
  controls.on("click", function(evt) { evt.stopPropagation(); });
  if (isConflicted && !parent) {
    var cb = $('<label> </label>').appendTo(controls);
    cb.append($('<input ' + (isSelected? '' : 'disabled ') + 'type="checkbox" data-node-id="' + node.id + '">'))
      .append($('<span></span>').text(Plugin._("enebular.label.replace")));
    if (node.type === "tab" || (node.type !== "subflow" && node.hasOwnProperty("x") && node.hasOwnProperty("y"))) {
      cb.hide();
    }
  }

  return {
    element: element,
    gutter: createGutterElement(node, isSelected, parent)
  }
}

/*
*  copy getGutter from @node-red/editor-client/src/js/ui/clipboard.js
*/
function createGutterElement(node, isSelected, parent) {
  var span = $("<label>", {class: "red-ui-clipboard-dialog-import-conflicts-gutter"});
  var cb = $('<input data-node-id="' + node.id + '" type="checkbox" ' + (isSelected? "checked" : "") + '>').appendTo(span);

  if (parent) {
    cb.attr("disabled", true);
    parent.addChild(cb);
  }
  span.on("click", function(evt) {
    evt.stopPropagation();
  })
  cb.on("change", function(evt) {
    var state = this.checked;
    span.parent().toggleClass("disabled", !!!state);
    span.parent().find('.red-ui-clipboard-dialog-import-conflicts-controls  input[type="checkbox"]').attr("disabled", !!!state);
    childItems.forEach(function(c) {
      c.attr("checked",state);
      c.trigger("change");
    });
  })
  var childItems = [];

  var checkbox = {
    addChild: function(c) {
      childItems.push(c);
    }
  }

  return {
    cb: checkbox,
    element: span
  }
}

/*
*  copy from @node-red/editor-client/src/js/ui/clipboard.js
*/
function openImportConflictsDialog(treeData, importFlowData) {
  var dialogBase =
    '<div class="form-row">' +
      '<div class="form-row">' +
        '<p>' + Plugin._("enebular.message.importConflict") + '</p><p>' + Plugin._("enebular.message.importConflictsChoice") + '</p>' +
      '</div>' +
      '<div class="red-ui-clipboard-dialog-import-conflicts-list-container">' +
        '<div id="red-ui-enebular-dialog-import-conflicts-list"></div>' +
      '</div>' +
    '</div>';

  var dialogButtons = [
    {
      id: "red-ui-enebular-dialog-cancel",
      text: Plugin._("enebular.label.canselBtn"),
      click: function() {
        $(this).dialog("close");
        RED.view.focus();
      }
    },
    {
      id: "red-ui-enebular-dialog-conflict",
      class: "primary",
      text: Plugin._("enebular.label.importSelectedBtn"),
      click: function() {
        executeCopyImport(importFlowData);
        $(this).dialog("close");
        RED.view.focus();
      }
    }
  ];

  var enebularDialog = $("#red-ui-enebular-dialog");
  var dialogContainer = enebularDialog.children(".dialog-form");

  dialogContainer.empty();
  dialogContainer.append($(dialogBase));

  $("#red-ui-enebular-dialog-import-conflicts-list")
    .css({position: "absolute", top: 0, right: 0, bottom: 0, left: 0})
    .treeList({
      data: treeData
    });

  enebularDialog.dialog("option", "title", Plugin._("enebular.label.conflictDialogTitle"))
    .dialog("option", "buttons", dialogButtons)
    .dialog("option", "width", 500)
    .dialog("open");
}

/*
*  copy #red-ui-clipboard-dialog-import-conflict click action from @node-red/editor-client/src/js/ui/clipboard.js
*    import mode
*      + skip - don't import
*      + import - import as-is
*      + copy - import with new id
*      + replace - import over the top of existing
*/
function executeCopyImport(importFlowData) {
  var importMap = {};
  $('#red-ui-enebular-dialog-import-conflicts-list input[type="checkbox"]').each(function() {
    importMap[$(this).attr("data-node-id")] = this.checked? "import" : "skip";
  })

  $('.red-ui-clipboard-dialog-import-conflicts-controls input[type="checkbox"]').each(function() {
    if (!$(this).attr("disabled")) {
      importMap[$(this).attr("data-node-id")] = this.checked? "replace" : "copy";
    }
  })

  var newNodes = importFlowData.filter(function(n) {
    if (!importMap[n.id] || importMap[n.z]) {
      importMap[n.id] = importMap[n.z];
    }
    return importMap[n.id] !== "skip"
  })

  RED.view.importNodes(newNodes, {importMap: importMap});
  toggleDeployFlow(projectId, nodeId);
  $(this).dialog("close");
  RED.view.focus();
}

export {
  createImportPalette,
  addTreeListItem
}
