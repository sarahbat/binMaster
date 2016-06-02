headless server for EZ Server
=============================

Installation Instructions
-------------------------
1) Install node.js on your machine: https://nodejs.org/en/download/
2) Unzip into a directory
3) cd into server (where you see package.json) and type: node install

Running EZ Server
-----------------
1) open a command shell/window
2) cd into server (where you see package.json)
type: node .

You should see a server start in the shell with an IP address like:
  7 Dec 2015 9:13:43pm ez server (v1.0.0)
  7 Dec 2015 9:13:43pm server started on: 192.168.1.7:12345
  7 Dec 2015 9:13:43pm server root: ../client
  7 Dec 2015 9:13:43pm Press ^C^C to stop the server        

Open a browser and direct it to 192.168.1.7:12345

Additional Capabilities
-----------------------
You can also run ezServer with a particular directory as the webroot and
port number:

node . C:/rcg/project/game
node . C:/rcg/project/game 545454


