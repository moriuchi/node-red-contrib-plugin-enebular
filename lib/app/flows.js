import api from './api.js';

const getAllFlows = () => {
  return api.get('/flows')
  .then((result) => {
    return result.data;
  });
}

const getFlowJson = (param) => {
  const path = `/desktop-editor/projects/${param.projectId}/flows/${param.flowId}/open`;

  return api.get(path)
  .then((result) => {
    return result.data;
  });
}

const createFlow = (param) => {
  const path = `/projects/${param.projectId}/flows`;

  return api.post(path, param)
  .then((result) => {
    return result.data;
  });
}

const updateFlow = (param) => {
  const path = `/projects/${param.projectId}/flows/${param.flowId}/source`;
  const reqParam = {
    flow: JSON.parse(param.flows),
    credentialIds: param.credentialIds,
    packages: {},
    screenshot: param.screenShot,
    rev: param.rev
  };

  return api.put(path, reqParam)
  .then((result) => {
    return result.data;
  });
}

const updateFlowCredentials = (param) => {
  const path = `/projects/${param.projectId}/flows/${param.flowId}/credentials`;

  return api.put(path, param.credentials)
  .then((result) => {
    return result.data;
  });
}

export const flows = {
  list: getAllFlows,
  get: getFlowJson,
  create: createFlow,
  update: updateFlow,
  updateCredentials: updateFlowCredentials
}
