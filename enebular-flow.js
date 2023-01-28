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

	const EndPoint = 'https://enebular.com/api/v1';
	const Headers = {
		authorization: null
	};

	RED.httpAdmin.post("/enebular-flow-plugin/login", async function(req,res) {
		const param = req.body;
		const authData = {
			email: param.email,
			password: param.password
		};
		const authConfig = createConfig('auth', '/auth/login', authData);

		try {
			const result = await callAxios(authConfig);
			Headers.authorization = `Bearer  ${result.token}`;

			if(result.token) {
				const getConfig = createConfig('get', '/flows', {});
				const flowResult = await callAxios(getConfig);

				res.json({ success: true, body: flowResult});
			} else {
				res.json({ success: false, body: "Token acquisition error"});
			}

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.get("/enebular-flow-plugin/getAllFlows", async function(req,res) {
		try {
			const getConfig = createConfig('get', '/flows', {});
			const result = await callAxios(getConfig);

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	RED.httpAdmin.post("/enebular-flow-plugin/getFlowJson", async function(req,res) {
		const param = req.body;
		const path = `/desktop-editor/projects/${param.projectId}/flows/${param.flowId}/open`;

		try {
			const getConfig = createConfig('get', path, {});
			const result = await callAxios(getConfig);

			res.json({ success: true, body: result});

		}catch(err) {
			res.json({ success: false, body: err.toString()});
		}
	});

	const createConfig = (method, path, data) => {
    if (data && typeof data === 'string') {
      data = JSON.parse(data);
    }

    const requestConfig = {
      url: EndPoint + path,
      method: method,
      responseType: 'json'
    };

		if (method === "auth") {
			requestConfig.method = "post";
		} else {
			requestConfig.headers = Headers;
		}

    if (method === "get") {
      requestConfig["params"] = data;
    } else {
      requestConfig["data"] = data;
    }

    return requestConfig;
  }

	const callAxios = async (config) => {
		try {
			const response = await axios(config);
			return response.data;

		} catch(err) {
			const errData = err.response;
			const errMessage = (errData.data.message)? errData.data.message : errData.data;
			const errText = `${errData.status}: ${errMessage}`;
			throw new Error(errText);
		}
	};

	RED.plugins.registerPlugin("enebularFlow", {
		settings: {
			"*": { exportable: true }
		}
	});
}
