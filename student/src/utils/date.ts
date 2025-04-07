// 获取常用时间
import dayjs from 'dayjs';

export const LAST_7_DAYS = [
  dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
];

export const LAST_30_DAYS = [
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
];

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url?: string): Record<string, string> {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj: Record<string, string> = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs: string, $1: string, $2: string) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str: string): number {
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray<T>(actual: T[]): T[] {
  const newArray: T[] = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json: Record<string, any>): string {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    }),
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: string): Record<string, string> {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ')}"}`,
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val: string): string {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element: HTMLElement, className: string): void {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += ` ${className}`;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type: string): Date {
  if (type === 'start') {
    return new Date(new Date().getTime() - 3600 * 1000 * 24 * 90);
  }
  return new Date(new Date().toDateString());
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string): boolean {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string): void {
  if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string): void {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
    ele.className = ele.className.replace(reg, ' ');
  }
}

export function formatSeconds(theTime: number): string {
  let theTime1 = 0;
  let theTime2 = 0;
  if (theTime > 60) {
    theTime1 = parseInt((theTime / 60).toString(), 10);
    theTime = parseInt((theTime % 60).toString(), 10);
    if (theTime1 > 60) {
      theTime2 = parseInt((theTime1 / 60).toString(), 10);
      theTime1 = parseInt((theTime1 % 60).toString(), 10);
    }
  }
  let result = `${parseInt(theTime.toString(), 10)}秒`;
  if (theTime1 > 0) {
    result = `${parseInt(theTime1.toString(), 10)}分${result}`;
  }
  if (theTime2 > 0) {
    result = `${parseInt(theTime2.toString(), 10)}小时${result}`;
  }
  return result;
}
