export const rootMarker = "$";

export function escape(key: string | number): string {
  return String(key)
    .replace(/~/g, "~0")
    .replace(/\//g, "~1")
    .replace(/["%\s&$]/g, encodeURIComponent);
}

export function unescape(key: string): string {
  return key
    .replace(/~1/g, "/")
    .replace(/~0/g, "~")
    .replace(/%[0-9A-F]{2}/g, decodeURIComponent);
}

export function toPath(pointer: string): string[] {
  if (pointer === rootMarker) {
    return [];
  } else {
    return pointer.substring(2).split("/").map(unescape);
  }
}

export function toPointer(path: (string | number)[]): string {
  if (path.length === 0) {
    return rootMarker;
  } else {
    return rootMarker + "/" + path.map(escape).join("/");
  }
}

export function join(parentPointer: string, ...childrenKeys: string[]): string {
  return [parentPointer, ...childrenKeys.map(escape)].join("/");
}

export function splitParentPointer(pointer: string) {
  const pp = pointer.split("/");
  const parent = pp.slice(0, -1).join("/");
  const lastKey = unescape(pp[pp.length - 1]);
  return { parent: parent || undefined, lastKey };
}

export function getParentId(id: string) {
  const { parent } = splitParentPointer(id);
  return parent;
}

export function isDescendant(parentPointer: string, childPointer: string) {
  return (
    childPointer === parentPointer ||
    childPointer.startsWith(parentPointer + "/")
  );
}

export function lastKey(pointer: string) {
  const { lastKey } = splitParentPointer(pointer);
  return lastKey;
}
