var DEFAULT_ICON = chrome.extension.getURL('icons/icon16.png');
var TITLE_REGEX = /<title>(.*?)<\/title>/;
var PORTS = [
  80,
  443,
  591,
  3000,
  4000,
  8000,
  8008,
  8080,
  8888
];

var listElement = document.querySelector('ul');

var Server = function(port, alwaysDisplay) {
  this.port = port;
  this.url = `http://localhost:${port}/`;
  this.name = null;
  this.online = false;
  this.alwaysDisplay = !!alwaysDisplay;

  this.initialize();
  this.render();
};

Server.prototype.sniff = function() {
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', this.url);
  xhr.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      self.online = true;

      var regexResult = TITLE_REGEX.exec(this.responseText);
      self.name = regexResult ? regexResult[1] : null;
      self.render();
    }
  };
  xhr.onerror = function() {};
  xhr.send();
};

Server.prototype.initialize = function() {
  this.element = document.createElement('li');
  listElement.appendChild(this.element);

  this.link = document.createElement('a');
  this.element.appendChild(this.link);
  this.link.target = '_blank';
  this.link.href = this.url;

  this.img = document.createElement('img');
  this.img.src = DEFAULT_ICON;
  this.img.onerror = function(){
    this.src = DEFAULT_ICON;
  };
  this.link.appendChild(this.img);

  this.title = document.createElement('div');
  this.title.className = 'title';
  this.link.appendChild(this.title);

  this.subtitle = document.createElement('div');
  this.subtitle.className = 'subtitle';
  this.link.appendChild(this.subtitle);
};

Server.prototype.render = function() {
  if (!this.online && !this.alwaysDisplay) {
    this.element.className = 'hidden';
    return;
  }
  this.element.className = '';
  var classList = this.element.classList;

  if (!this.online) {
    classList.add('inactive');
  }

  this.img.src = this.url + 'favicon.ico';

  if (this.name) {
    this.title.innerText = this.name;
    this.subtitle.innerText = this.url;
    classList.add('hasSubtitle');
  } else {
    this.title.innerText = this.url;
    this.subtitle.innerText = '';
  }
};

PORTS.forEach(function(port) {
  var server = new Server(port);
  server.sniff();
});
