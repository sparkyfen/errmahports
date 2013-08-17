ErrMahPorts
=========
NodeJS Port Scanning Web Server

Version
-------

0.1

Tech
----

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework

Installation
--------------

```sh
git clone [git-repo-url] /PATH/TO/CLONE
cd /PATH/TO/CLONE
sudo npm install
mv settings.js.template settings.js
<Edit settings.js file>
<Create certs for SSL:>
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 356 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
node main.js
```


License
-------

[MIT]


  [node.js]: http://nodejs.org
  [express]: http://expressjs.com
  [MIT]: http://www.tldrlegal.com/license/mit-license