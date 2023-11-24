import { RefObject, createRef } from "react";

export type DataRef<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  refName: string;
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

export class Form {
  private dataRefs: DataRef[] = [];
  getDataRefs = (): DataRef[] => this.dataRefs;

  ref = <T extends HTMLElement = HTMLElement>(
    refName: string
  ): RefObject<T> => {
    const ref = createRef<T>();
    this.dataRefs.push({
      ref,
      refName,
    });
    return ref;
  };

  data = <T>(typeGuard: (value: unknown) => value is T): T => {
    const obj: Record<string, unknown> = {};
    this.dataRefs.forEach((dataRef) => {
      if (!dataRef.ref.current) {
        throw new Error(`Missing ref: ${dataRef.refName}`);
      }
      const current: HTMLElement = dataRef.ref.current;
      if (isValueType(current)) {
        if (
          !isCheckType(current) ||
          (isCheckType(current) && current.checked)
        ) {
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
}
