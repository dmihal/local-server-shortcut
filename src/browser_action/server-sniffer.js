(function(){
  var list = document.querySelector('ul');
  var PORTS = [
    80,
    8000,
    8080
  ];
  var titleRegex = /<title>(.*?)<\/title>/;
  PORTS.forEach(function (port) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:' + port + '/');
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var regexResult = titleRegex.exec(this.responseText);
        var title = regexResult ? regexResult[1] : this.responseURL;
        var li = document.createElement('li');
        li.innerHTML = '<a href="' + this.responseURL + '" target="_blank">' +
            title + '</a>';
        list.appendChild(li);
      }
    };
    xhr.send();
  });
})();
