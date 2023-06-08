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

	RED.httpAdmin.post("/enebular-plugin/getCredentials", async function(req,res) {
		const param = req.body;
		const flowObj = JSON.parse(param.flows);

		const credentials = {};
		param.credentials?.forEach(configId => {
			const config = RED.nodes.getCredentials(configId);

			if(config) {
				credentials[configId] = config;
			} else {
				for (var i=0; i<flowObj.length; i++) {
					const flow = flowObj[i];
					if (flow.id === configId && flow.hasOwnProperty("credentials")) {
						credentials[configId] = flow.credentials;
						break;
					}
				}
			}
		});

		res.json({ success: true, body: credentials});
	});

	RED.plugins.registerPlugin("enebular", {
		settings: {
			"*": { exportable: true }
		}
	});
}
