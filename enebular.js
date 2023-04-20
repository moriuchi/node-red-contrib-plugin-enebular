/**
 * Copyright 2014 Atsushi Kojo.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  'use strict';

	const axios = require('axios');
	const api = axios.create({
		baseURL: 'https://enebular.com/api/v1',
		responseType: 'json'
	})

	RED.httpAdmin.post("/enebular-plugin/login", async function(req,res) {
		const param = req.body;

		const authData = {
			email: param.email,
			password: param.password
		};

		try {
			const result = await callAxios('post', '/auth/login', authData);

			api.defaults.headers.common['Authorization'] = `Bearer  ${result.token}`;

			if(result.token) {
				const flowResult = await callAxios('get', '/flows', {});

				res.json({ success: true, body: flowResult});
			} else {
				res.json({ success: false, body: "Token acquisition error"});
			}
		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.get("/enebular-plugin/getAllFlows", async function(req,res) {
		try {
			const result = await callAxios('get', '/flows', {});

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.post("/enebular-plugin/getFlowJson", async function(req,res) {
		const param = req.body;
		const path = `/desktop-editor/projects/${param.projectId}/flows/${param.flowId}/open`;

		try {
			const result = await callAxios('get', path, {});

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.post("/enebular-plugin/createFlow", async function(req,res) {
		const param = req.body;
		const path = `/projects/${param.projectId}/flows`;

		try {
			const result = await callAxios('post', path, param);

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.post("/enebular-plugin/updateFlow", async function(req,res) {
		const param = req.body;

		const path = `/projects/${param.projectId}/flows/${param.flowId}/source`;
		const reqParam = {
			flow: JSON.parse(param.flows),
			credentialIds: param.credentialIds,
			packages: {},
			screenshot: param.screenShot,
			rev: param.rev
		};

		try {
			const result = await callAxios('put', path, reqParam);

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}

	});

	RED.httpAdmin.post("/enebular-plugin/updateFlowCredentials", async function(req,res) {
		const param = req.body;
		const path = `/projects/${param.projectId}/flows/${param.flowId}/credentials`;

		const credential = {};
		param.credentials.forEach(cred => {
			const config = RED.nodes.getCredentials(cred.configId);
			if(config) credential[cred.configId] = config;
		});

		const reqParam = [
			credential,
			JSON.parse(param.flows)
		];

		try {
			const result = await callAxios('put', path, reqParam);

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}

	});


	const callAxios = async (method, path, data) => {
		if (data && typeof data === 'string') {
      data = JSON.parse(data);
    }

    const config = {
      url: path,
      method: method
    };

    if (method === "get") {
      config["params"] = data;
    } else {
      config["data"] = data;
    }

		try {
			const response = await api(config);

			return response.data;

		} catch(err) {
			const errData = err.response;
			const errMessage = (errData.data.message)? errData.data.message : errData.data;
			const errText = `${errData.status}: ${errMessage}`;
			throw new Error(errText);
		}
	};


	RED.plugins.registerPlugin("enebular", {
		settings: {
			"*": { exportable: true }
		}
	});
}
