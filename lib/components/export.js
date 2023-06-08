import { Plugin, notifyMessage, notifyErrorMessages } from "../utils.js";
import { flows } from '../app/flows.js';

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
      $("#red-ui-button-enebular-export").removeClass("disabled");
    }
  });

  var exportBody = $('<div/>', {class: "red-ui-palette-content", style: "display: none;"}).appendTo(exportPalette);

  var div1 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div2 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div3 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);
  var div4 = $('<div/>', {class: "form-row", style: "margin: 5px"}).appendTo(exportBody);

  $('<label/>').text(Plugin._("enebular.label.project")).appendTo(div1);
  var project = $('<select/>', {id: "node-input-enebular-project"}).appendTo(div1)
        .on("change", function() {
          createFlowList();
        });

  $('<label/>').text(Plugin._("enebular.label.flowName")).appendTo(div2);
  var createRow = $('<div/>', {id: "enebular-create-flow-row", style: "width: 90%; display: inline-flex"}).appendTo(div2);
  var flowName = $('<input/>', {type: "text", id: "node-input-enebular-flowName"}).appendTo(createRow);
  $('<button/>', {type: "button", class: "red-ui-button", style: "margin-left: 5px"})
        .append('<i class="fa fa-times" />')
        .appendTo(createRow)
        .on("click", function() {
          toggleFlowRow();
        });
  var nameRow = $('<div/>', {id: "enebular-flow-row", style: "width: 90%; display: none"}).appendTo(div2);
  var flowList = $('<select/>', {id: "node-input-enebular-flowList"}).appendTo(nameRow);
  $('<button/>', {type: "button", class: "red-ui-button", style: "margin-left: 5px"})
        .append('<i class="fa fa-plus" />')
        .appendTo(nameRow)
        .on("click", function() {
          toggleFlowRow();
        });

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

  $('<button/>', {type: "button", id: "red-ui-button-enebular-export", class: "ui-button ui-corner-all ui-widget"})
          .text(Plugin._("enebular.label.exportBtn"))
          .appendTo(btnSet)
          .on("click", function() {
            $(this).addClass("disabled");
            if (Plugin.createFlow) {
              executeFlowCreate();
            } else {
              const param = {
                projectId: project.val(),
                id: flowList.val()
              };
              executeFlowCredentialsUpdate(param);
            }
          });

  return exportPalette;
}

function createProjectList(flows) {
  var projectField = $("#node-input-enebular-project");
  var projects = [];

  projectField.children("option").remove();
  flows.forEach(function(data) {
    var pIndex = projects.indexOf(data.projectId);

    if (pIndex === -1) {
      projectField.append($("<option></option>").val(data.projectId).text(data.projectName));
      projects.push(data.projectId);
    }
  });
}

function createFlowList() {
  var flowField = $("#node-input-enebular-flowList"),
      projectId = $("#node-input-enebular-project").val();

  flowField.children("option").remove();
  Plugin.enebularFlows.forEach(function(data) {
    if (projectId === data.projectId) {
      flowField.append($("<option></option>").val(data.id).text(data.title));
    }
  });
}

function toggleFlowRow() {
  var createRow = $("#enebular-create-flow-row"),
      nameRow = $("#enebular-flow-row"),
      projectList = $("#node-input-enebular-project"),
      flowText = $("#node-input-enebular-flowName"),
      flowList = $("#node-input-enebular-flowList");

  if (Plugin.createFlow) {
    Plugin.createFlow = false;
    createRow.css("display", "none");
    nameRow.css("display", "inline-flex");
  } else {
    Plugin.createFlow = true;
    createRow.css("display", "inline-flex");
    nameRow.css("display", "none");
    projectList.attr("disabled", false);
    flowList.attr("disabled", false);
    flowText.val("");
  }
}

function createScreenShot(e) {
  const screenShot = (
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

    document.querySelector("#enebular-screenshot").remove();

    return screenShot;
}

const executeFlowCreate = () => {
  var projectField = $("#node-input-enebular-project"),
      projectId = projectField.val(),
      flowName = $("#node-input-enebular-flowName").val(),
      description = $("#node-input-enebular-description").val(),
      role = $("#node-input-enebular-role").val();

  var params = {
    projectId: projectId,
    title: flowName,
    description: description,
    role: role
  };

  flows.create(params)
  .then((result) => {
    Plugin.enebularFlows.unshift(result);
    projectField.val(result.projectId).attr("disabled", true);
    createFlowList();
    $("#node-input-enebular-flowList").val(result.id).attr("disabled", true);
    toggleFlowRow();
    executeFlowCredentialsUpdate(result);
  })
  .catch((err) => {
    notifyErrorMessages(err.response);
  });
}

const executeFlowUpdate = (data) => {
  var flowJson = RED.nodes.createCompleteNodeSet();
  var screenShot = createScreenShot();

  flowJson.forEach(flow => {
    if (flow.hasOwnProperty("credentials")) {
      delete flow.credentials;
    }
  });

  var params = {
    projectId: data.projectId,
    flowId: data.id,
    flows: JSON.stringify(flowJson),
    screenShot: screenShot,
    credentialIds: data.credentialIds,
    rev: RED.nodes.version()
  };

  flows.update(params)
  .then((result) => {
    notifyMessage(Plugin._("enebular.message.deploySuccessful"), 'success');
  })
  .catch((err) => {
    notifyErrorMessages(err.response);
  })
  .finally(() => {
    $("#red-ui-button-enebular-export").removeClass("disabled");
  });
}

const executeFlowCredentialsUpdate = (data) => {
  var flowJson = RED.nodes.createCompleteNodeSet();

  var params = {
    flows: JSON.stringify(flowJson),
    credentials: []
  };

  var nextParams = {
    ...data,
    "credentialIds": []
  };

  RED.nodes.eachConfig(function(config) {
    params["credentials"].push(config.id);
    nextParams["credentialIds"].push(config.id);
  });

  $.ajax({
    url: "/enebular-plugin/getCredentials",
    type: "post",
    data: params
  })
  .done((result) => {
    if (Object.keys(result.body).length > 0) {
      const reqParam = {
        projectId: data.projectId,
        flowId: data.id,
        credentials: [
          result.body,
          flowJson
        ]};

      flows.updateCredentials(reqParam)
      .then((result) => {
        executeFlowUpdate(nextParams);
      })
      .catch((err) => {
        notifyErrorMessages(err.response);
      });
    } else {
      executeFlowUpdate(nextParams);
    }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    var message = jqXHR.status + ": " + textStatus;
    notifyMessage(message, 'error');
  })
}


export {
  createExportPalette,
  createProjectList,
  createFlowList
}
