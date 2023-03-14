import { Plugin, sendAjaxRequest, notifyMessage } from "../utils.js";

function createExportPalette() {
  var exportPalette = $('<div/>', {id: "red-ui-enebular-export", class: "red-ui-palette-category"});
  var exportHeader = $('<div/>', {class: "red-ui-palette-header"}).appendTo(exportPalette);
  var exportExpand = $('<i class="fa fa-angle-down"></i>').appendTo(exportHeader);
  $('<span/>').text(Plugin._("enebular.label.exportHeader")).appendTo(exportHeader);

  exportHeader.on("click", function() {
    if (exportExpand.hasClass("expanded")) {
      exportExpand.removeClass("expanded");
      exportBody.hide();
      exportFooter.hide();
    } else {
      exportExpand.addClass("expanded");
      exportBody.show();
      exportFooter.show();
      var offset = $("#red-ui-enebular-export").offset();
      $("#red-ui-sidebar-content").scrollTop(Math.floor(offset.top));
    }
  });

  var exportBody = $('<div/>', {class: "red-ui-palette-content", style: "display: none;"}).appendTo(exportPalette);

  var div1 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div2 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div3 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div4 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);

  $('<label/>').text(Plugin._("enebular.label.project")).appendTo(div1);
  $('<select/>', {id: "node-input-enebular-project"}).appendTo(div1);

  $('<label/>').text(Plugin._("enebular.label.flowName")).appendTo(div2);
  $('<input/>', {type: "text", id: "node-input-enebular-flowName"}).appendTo(div2);

  $('<label/>').text(Plugin._("enebular.label.description")).appendTo(div3);
  $('<textarea/>', {id: "node-input-enebular-description"}).appendTo(div3);

  $('<label/>').text(Plugin._("enebular.label.defaultRole")).appendTo(div4);
  var roleEl = $('<select/>', {id: "node-input-enebular-role"})
              .append($("<option></option>").val("superdev").text("edit, deploy, publish"))
              .append($("<option></option>").val("developer").text("edit"))
              .append($("<option></option>").val("operator").text("deploy"))
              .append($("<option></option>").val("user").text("read"))
              .appendTo(div4);
  roleEl.val("user");

  var exportFooter = $('<div/>', {class: "ui-dialog-buttonpane ui-widget-content", style: "display: none;"}).appendTo(exportPalette);
  var btnSet = $('<div/>', {class: "ui-dialog-buttonset", style: "margin: 5px 0"}).appendTo(exportFooter);   //  ui-helper-clearfix

  $('<button/>', {type: "button", class: "ui-button ui-corner-all ui-widget"})
          .text(Plugin._("enebular.label.exportBtn"))
          .appendTo(btnSet)
          .on("click", function() {
            executeFlowCreate();
          });

  return exportPalette;
}

function createProjectList(flows) {
  var projectField = $("#node-input-enebular-project");
  var projects = [];

  flows.forEach(function(data) {
    var pIndex = projects.indexOf(data.projectId);

    if (pIndex === -1) {
      projectField.append($("<option></option>").val(data.projectId).text(data.projectName));
      projects.push(data.projectId);
    }
  });
}

function createScreenShot(e) {
  return (
    (e = document.querySelector("#enebular-screenshot")) && e.remove(),
    (e = document.querySelector("#red-ui-workspace-chart").cloneNode(!0)).setAttribute("id", "enebular-screenshot"),
    e.setAttribute("style", "display: none"),
    document.body.appendChild(e),
    d3.select("#enebular-screenshot").selectAll("image.red-ui-flow-node-icon").remove(),
    d3.select("#enebular-screenshot > svg").attr("width", "100%").attr("height", "500px"),
    d3.select("#enebular-screenshot > svg > g > g > rect").style({
        width: "100%",
        height: "100%",
        fill: "none"
    }),
    d3.select("#enebular-screenshot > svg > g > g").attr("transform", "scale(0.75)"),
    d3.select("#enebular-screenshot > svg > g > g > g").remove(),
    d3.select("#enebular-screenshot").selectAll("g.red-ui-flow-node-changed").remove(),
    d3.select("#enebular-screenshot").selectAll("g.red-ui-flow-node-error").remove(),
    document.querySelector("#enebular-screenshot").innerHTML
    );
}

const executeFlowCreate = () => {
  var url = "/enebular-plugin/createFlow";
  var projectId = $("#node-input-enebular-project").val(),
      flowName = $("#node-input-enebular-flowName").val(),
      description = $("#node-input-enebular-description").val(),
      role = $("#node-input-enebular-role").val();

  var params = {
    projectId: projectId,
    title: flowName,
    description: description,
    role: role
  };

  sendAjaxRequest(url, "POST", params, function(result) {
    executeFlowCredentialsUpdate(result);
  });
}

const executeFlowUpdate = (data) => {
  var url = "/enebular-plugin/updateFlow";
  var flowJson = RED.nodes.createCompleteNodeSet();
  var screenShot = createScreenShot();

  var params = {
    projectId: data.projectId,
    flowId: data.id,
    flows: JSON.stringify(flowJson),
    screenShot: screenShot,
    credentialIds: data.credentialIds,
    rev: RED.nodes.version()
  };

  sendAjaxRequest(url, "POST", params, function(result) {
    notifyMessage(Plugin._("enebular.message.deploySuccessful"), 'success');
  });
}

const executeFlowCredentialsUpdate = (data) => {
  var url = "/enebular-plugin/updateFlowCredentials";
  var flowJson = RED.nodes.createCompleteNodeSet();

  var params = {
    projectId: data.projectId,
    flowId: data.id,
    flows: JSON.stringify(flowJson),
    credentials: []
  };

  var nextParams = data;
  var credentialIds = [];

  RED.nodes.eachConfig(function(config) {
    var cred = {
      configId: config.id,
      nodeId: config.users[0].id
    };
    params["credentials"].push(cred);
    credentialIds.push(config.id);
  });

  nextParams["credentialIds"] = credentialIds;

  sendAjaxRequest(url, "POST", params, function(result) {
    executeFlowUpdate(nextParams);
  });
}


export {
  createExportPalette,
  createProjectList
}
