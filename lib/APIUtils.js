/* test */
const log = console.log;
const dir = console.dir;
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr/api/crawler';

function post(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  if (header['Content-Type'] == 'application/json') {
    str = JSON.stringify(param);
  } else {
    for (var el in param) str.push(el + '=' + encodeURIComponent(param[el]));
    str = str.join('&');
  }
  a.post(addr, str, header);
  a.ajaxcallback = callback;
}
function get(addr, param, header, callback) {
  var a = new ajaxcallforgeneral(),
    str = [];
  for (var el in param) {
    str.push(el + '=' + param[el]);
  }
  str = str.join('&');
  a.jAjax(addr + '?' + str, header);
  a.ajaxcallback = callback;
}
function ajaxcallforgeneral() {
  this.xmlHttp;
  var j = this;
  var HTTP = {};
  var ADDR;
  var PARAM;
  var HEADER;
  this.jAjax = function (address, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open('GET', address, true);
    if (header) {
      Object.keys(header).forEach(key => {
        var val = header[key];
        j.xmlHttp.setRequestHeader(key, val);
      });
    }
    j.xmlHttp.send(null);
  };
  this.post = function (addr, prm, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.onerror = onError;
    j.xmlHttp.open('POST', addr, true);

    if (header) {
      if (header['Content-Type'])
        Object.keys(header).forEach(key => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      else
        j.xmlHttp.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded',
        );
    } else {
      j.xmlHttp.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded',
      );
    }

    ADDR = addr;
    PARAM = prm;
    HEADER = JSON.stringify(header);

    j.xmlHttp.send(prm);
  };
  this.file = function (addr, prm) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open('POST', addr, true);
    j.xmlHttp.send(prm);
  };
  function onError() {}
  function on_ReadyStateChange() {
    if (j.xmlHttp.readyState == 4) {
      if (j.xmlHttp.status == 200) {
        var data = j.xmlHttp.responseText;
        j.ajaxcallback(data);
      } else {
      }
    }
  }
}
String.prototype.gt = function (num) {
  return this.substring(this.length - num, this.length);
};
String.prototype.gh = function (num) {
  return this.substring(0, num);
};
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};
String.prototype.ch = function (num) {
  return this.substring(num, this.length);
};
String.prototype.addzero = function () {
  if (this.length == 1) return '0' + this;
  return this;
};
String.prototype.inparen = function () {
  const regex = /.+?\((.+)\)/;
  const str = this.toString();
  const result = [];
  regex
    .exec(str)[1]
    .split("'")
    .join('')
    .split(',')
    .forEach(str => {
      result.push(str.trim());
    });
  return result;
};
String.prototype.datify = function (sign) {
  const str = this.toString();
  if (!sign) sign = '-';
  return [str.gh(4), str.ch(4).gh(2), str.gt(2)].join(sign);
};
String.prototype.getFee = function () {
  let str = this.toString();
  str = str.replace(/[^0-9]/g, '');
  return str * 1;
};
String.prototype.daySign = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  let sign;
  if (num == 0) sign = 3;
  else if (num == 6) sign = 2;
  else sign = 1;
  return sign.toString();
};
String.prototype.dayNum = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  return (num + 1).toString();
};
String.prototype.dayKor = function () {
  const str = this.getFee().toString();
  const num = new Date(str.datify()).getDay();
  const week = ['일', '월', '화', '수', '목', '금', '토'];

  return week[num];
};
String.prototype.rm = function (str) {
  return this.split(str).join('');
};
String.prototype.regex = function (regex) {
  return this.replace(regex, '');
};
String.prototype.fillzero = function (sep) {
  const ar = this.split(sep);
  const result = [];
  ar.forEach(el => {
    result.push(el.addzero());
  });

  return result.join('');
};
Array.prototype.byN = function (num) {
  const sonos = [];
  const normal = [];
  const sonofelice = {
    vivaldi_east: true,
    vivaldi_west: true,
    vivaldi_mountain: true,
    delphino: true,
  };
  this.forEach(el => {
    if (sonofelice[el]) sonos.push(el);
    else normal.push(el);
  });
  const res = [];
  let temp = [];
  normal.forEach((el, i) => {
    temp.push(el);
    if (i + 1 == 1) return;
    if ((i + 1) % num == 0) {
      res.push(temp);
      temp = [];
    }
  });
  if (temp.length > 0) {
    if (sonos.length > 0) temp.push(sonos.shift());
    res.push(temp);
  }

  sonos.forEach(el => {
    res.push([el]);
  });
  return res;
};

//{"command":"convertSearchDateClubList","parameter":{"club_list":"vivaldi_east,yongin"}}
const convertSearchDateClubList = param => {
  const { club_list: clubList, number } = param;
  const arr = clubList.split(',');
  const res = {
    command: 'convertSearchDateClubList',
    data: arr.byN(number),
  };
  if (window.BRIDGE && window.BRIDGE.sendResponse) {
    window.BRIDGE.sendResponse(JSON.stringify(res));
  } else if (window.webkit && window.webkit.messageHandlers ) {
    window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(res));
  }
};
const convertSearchTimeClubList = param => {
  const { club_list: clubList, number } = param;
  const arr = clubList.split(',');
  const res = {
    command: 'convertSearchTimeClubList',
    data: arr.byN(number),
  };
  if (window.BRIDGE && window.BRIDGE.sendResponse) {
    window.BRIDGE.sendResponse(JSON.stringify(res));
  } else if (window.webkit && window.webkit.messageHandlers ) {
    window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(res));
  }
};
const convertReservationClubList = param => {
  const { club_list: clubList, number } = param;
  const arr = clubList.split(',');
  const res = {
    command: 'convertReservationClubList',
    data: arr.byN(number),
  };
  if (window.BRIDGE && window.BRIDGE.sendResponse) {
    window.BRIDGE.sendResponse(JSON.stringify(res));
  } else if (window.webkit && window.webkit.messageHandlers ) {
    window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(res));
  }
};
const getClub = param => {
  log(param);
  post(
    OUTER_ADDR_HEADER + '/clubs',
    {},
    { 'Content-Type': 'application/json' },
    data => {
      log(data);
      if (window.BRIDGE && window.BRIDGE.sendResponse) {
        window.BRIDGE.sendResponse(data);
      } else if (window.webkit && window.webkit.messageHandlers ) {
        // TODO data 확인 필요 - ios
        window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(data));
      }
    },
  );
};
const funcCommand = {
  getClub,
  convertSearchDateClubList,
  convertSearchTimeClubList,
  convertReservationClubList,
};
export const sendResponse = data => {
  const { command, parameter: param } = JSON.parse(data);
  log(command);
  log(funcCommand);
  funcCommand[command](param);
};
