node-red-contrib-plugin-enebular
========================
このモジュールは、<a href="https://www.enebular.com/ja" target="_new">enebular</a> のフローを読み込む <a href="http://nodered.org" target="_new">Node-RED</a> プラグインです。

[![NPM](https://nodei.co/npm/node-red-contrib-plugin-enebular.png?downloads=true)](https://nodei.co/npm/node-red-contrib-plugin-enebular/)

前提条件
-------

node-red-contrib-plugin-enebularは、<a href="http://nodered.org" target="_new">Node-RED</a> <b>1.3 以降</b>のインストールが必要です。


インストール
-------

Node-REDをインストールしたルートディレクトリで以下のコマンドを実行します。

    npm install node-red-contrib-plugin-enebular

Node-REDインスタンスを再起動すると、サイドバーに enebular flow import が表示されて使用可能になります。

使い方
-------

1. サイドバーの enebular flow import を表示します。
1. サインインボタンをクリックして enebular にログインします。
1. 表示されたフローをクリックするとインポートされます。

更新ボタンをクリックするとenebular のフローを再取得します。


謝辞
-------

node-red-contrib-plugin-enebularは、次のオープンソースソフトウェアを使用しています。

- [axios](https://github.com/axios/axios): ブラウザーおよび node.js 用の Promise ベースの HTTP クライアント。


ライセンス
-------

こちらを参照してください。[license](https://github.com/joeartsea/node-red-contrib-plugin-enebular/blob/master/LICENSE) (Apache License Version 2.0).


貢献
-------

[GitHub issues](https://github.com/joeartsea/node-red-contrib-plugin-enebular/issues)への問題提起、Pull requestsのどちらもあなたの貢献を歓迎します。


開発者
-------

開発者がnode-red-contrib-plugin-enebularのソースを改変する場合、以下のコードを実行してクローンを作成します。

```
cd ~\.node-red\node_modules
git clone https://github.com/joeartsea/node-red-contrib-plugin-enebular.git
cd node-red-contrib-plugin-enebular
npm install
```
