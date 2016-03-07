(function(){
  var list = document.querySelector('ul');
  var PORTS = [
    80,
    8000,
    8080
  ];
  var itemBuilder = function(host, port, titleTxt) {
    var li = document.createElement('li');
    var link = document.createElement('a');
    li.appendChild(link);
    link.href = `http://${host}:${port}/`;
    var img = document.createElement('img');
    img.src = `http://${host}:${port}/favicon.ico`;
    img.onerror = function(){
      this.src = chrome.extension.getURL('icons/icon16.png');
    };
    link.appendChild(img);
    var title = document.createElement('div');
    title.innerText = titleTxt;
    link.appendChild(title);
    return li;
  };

  var titleRegex = /<title>(.*?)<\/title>/;
  PORTS.forEach(function (port) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:' + port + '/');
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var regexResult = titleRegex.exec(this.responseText);
        var title = regexResult ? regexResult[1] : this.responseURL;
        var li = itemBuilder('localhost', port, title);
        list.appendChild(li);
      }
    };
    xhr.send();
  });
})();
