import { mainRequest } from "./base-request";
export function getMapFilterTree() {
  return mainRequest.sendReuest('get', '/label/tree');
}