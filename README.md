node-red-contrib-plugin-enebular
========================

[**Japanese**](./README_ja.md)

This module is a <a href="http://nodered.org" target="_new">Node-RED</a> plugin to be coupled with <a href="https://www.enebular.com/ja" target="_new">enebular</a>.

[![NPM](https://nodei.co/npm/node-red-contrib-plugin-enebular.png?downloads=true)](https://nodei.co/npm/node-red-contrib-plugin-enebular/)

Pre-requisites
-------

The node-red-contrib-plugin-enebular requires <a href="http://nodered.org" target="_new">Node-RED</a> <b>1.3 or later</b> to be installed.


Install
-------

Run the following command in the root directory of your Node-RED install.

    npm install node-red-contrib-plugin-enebular

Restart your Node-RED instance, the enebular tab appears in the sidebar and ready for use.

Usage
-------

1. View the enebular tab in the sidebar.
1. Click the Sign In button to log in to enebular.

Click the refresh button will reacquire the enebular flow.

### import

Click on the flow displayed after login to import.

### deploy

Open the Deploy accordion, enter the following items and click the Deploy button to save the flow in enebular.
- Project
- Flow Name
- Description
- Default Role


Acknowledgements
-------

The node-red-contrib-plugin-enebular uses the following open source software:

- [axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js


License
-------

See [license](https://github.com/joeartsea/node-red-contrib-plugin-enebular/blob/master/LICENSE) (Apache License Version 2.0).


Contributing
-------

Both submitting issues to [GitHub issues](https://github.com/joeartsea/node-red-contrib-plugin-enebular/issues) and Pull requests are welcome to contribute.


Developers
-------

If the developer wants to modify the source of node-red-contrib-plugin-enebular, run the following code to create a clone.

```
cd ~\.node-red\node_modules
git clone https://github.com/joeartsea/node-red-contrib-plugin-enebular.git
cd node-red-contrib-plugin-enebular
npm install
```
