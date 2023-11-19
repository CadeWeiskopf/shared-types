import { RefObject } from "react";

export type DataRef<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  refName: string;
};

const isValueType = <T extends HTMLElement>(
  element: T
): element is T & { value: string } => {
  return "value" in element;
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
    const current: HTMLElement = dataRef.ref;
    if (isValueType(current)) {
      obj[dataRef.refName] = current.value;
    } else {
      console.error(
        `skipped ${dataRef.refName} because "value" property is missing, check html element type`
      );
    }
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
