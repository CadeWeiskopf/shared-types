import { RefObject } from "react";

export type DataRef<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  refName: string;
};

export const newRef = <T extends HTMLElement = HTMLElement>(
  dataRefs: DataRef[],
  ref: RefObject<T>,
  refName: string
) => {
  const isDuplicate = dataRefs.some((e) => e.refName === refName);
  if (isDuplicate) {
    throw Error(`Cannot have duplicate refName: ${refName}`);
  }
  const dataRef: DataRef = {
    ref,
    refName,
  };
  dataRefs.push(dataRef);
  return ref;
};

const isValueType = <T extends HTMLElement>(
  element: T
): element is T & { value: string } => {
  return "value" in element;
};
const isCheckType = <T extends HTMLElement>(
  element: T
): element is T & { checked: boolean } => {
  return (
    "type" in element &&
    (element.type === "radio" || element.type === "checkbox") &&
    "checked" in element
  );
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
    const current: HTMLElement = dataRef.ref.current;
    if (isValueType(current)) {
      if (!isCheckType(current) || (isCheckType(current) && current.checked)) {
        obj[dataRef.refName] = current.value;
      }
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
