export function b64encode(buf) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
};

export function b64decode(str) {
  var binary_string = window.atob(str);
  var len = binary_string.length;
  var bytes = new Uint8Array(new ArrayBuffer(len));
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

export function spkiToPEM(key){
  var keydataS = arrayBufferToString(key);
  var keydataB64 = window.btoa(keydataS);
  var keydataB64Pem = formatAsPem(keydataB64);
  return keydataB64Pem;
}

export function PEMTospki(pem) {
  
}

export function arrayBufferToString( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return binary;
}


export function formatAsPem(str) {
  var finalString = '-----BEGIN PUBLIC KEY-----\n';

  while(str.length > 0) {
      finalString += str.substring(0, 64) + '\n';
      str = str.substring(64);
  }

  finalString = finalString + "-----END PUBLIC KEY-----";

  return finalString;
}
