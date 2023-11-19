import { RefObject } from "react";

export type DataRef<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  refName: string;
};

export const generateObject = <T>(
  typeGuard: (value: unknown) => value is T,
  dataRefs: DataRef[]
): T => {
  const obj: Record<string, unknown> = {};
  dataRefs.forEach((dataRef) => {
    if (!dataRef.ref.current) {
      throw new Error(`Missing ref: ${dataRef.refName}`);
    }
    obj[dataRef.refName] = (dataRef.ref.current as HTMLInputElement).value;
  });
  if (!typeGuard(obj)) {
    throw Error(`generateObject failed typeGuard: ${JSON.stringify(obj)}`);
  }
  return obj as T;
};

export const getDataRef = <T extends HTMLElement = HTMLElement>(
  refName: string,
  dataRefs: DataRef[]
): DataRef<T> => {
  const dataRef = dataRefs.find((e) => e.refName === refName);
  if (!dataRef) {
    throw Error(`No dataRef in dataRefs with refName=${refName}`);
  }
  return dataRef as DataRef<T>;
};
