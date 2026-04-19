import Cookies from 'js-cookie';

const REDIRECT_URI = 'redirect_uri_tycho';
const JWT_TOKEN = 'jwt_token_tycho';
const expireDays = 7;

const set = (key: string, value: string) => {
  Cookies.set(key, value, { expires: expireDays });
};

const get = (key: string) => {
  const cookie = Cookies.get(key);
  return cookie === 'undefined' ? '' : cookie;
};

const remove = (key: string) => {
  return Cookies.remove(key);
};

const setJwtToken = (jwtToken: string) => {
  Cookies.set(JWT_TOKEN, jwtToken, { expires: expireDays });
};

const getJwtToken = () => {
  const cookie = Cookies.get(JWT_TOKEN);
  return cookie === 'undefined' ? '' : cookie;
};

const removeJwtToken = () => {
  return Cookies.remove(JWT_TOKEN);
};

function getRedirectUri() {
  return Cookies.get(REDIRECT_URI);
}

function setRedirectUri(uri: string) {
  Cookies.set(REDIRECT_URI, uri);
}

function removeRedirectUri() {
  Cookies.remove(REDIRECT_URI);
}

const CookieStorage = {
  setJwtToken,
  getJwtToken,
  removeJwtToken,
  setRedirectUri,
  getRedirectUri,
  removeRedirectUri,
  set,
  get,
  remove,
};

export default CookieStorage;
