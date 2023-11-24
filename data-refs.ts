import { RefObject, createRef } from "react";
import AsyncLock from "async-lock";

const asyncLock = new AsyncLock();

export type DataRef<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  refName: string;
  id: string;
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
  private formDataRefsLock = "formDataRefs";
  handleformComponentMounted = (dataRef: DataRef) => {
    asyncLock.acquire(this.formDataRefsLock, () => {
      this.dataRefs = this.dataRefs.filter((dataRef) => dataRef.ref.current);
    });
  };

  private _dataRefs: DataRef[] = [];
  get dataRefs(): DataRef[] {
    return this._dataRefs;
  }
  set dataRefs(value: DataRef[]) {
    this._dataRefs = value;
  }

  ref = <T extends HTMLElement = HTMLElement>(
    id: string,
    refName: string
  ): RefObject<T> => {
    const ref = createRef<T>();
    this.dataRefs.push({
      id,
      ref,
      refName,
    });
    return ref;
  };

  data = <T>(typeGuard: (value: unknown) => value is T): T => {
    const obj: Record<string, unknown> = {};
    this.dataRefs.forEach((dataRef) => {
      if (!dataRef.ref.current) {
        console.log(this.dataRefs);
        throw new Error(
          `Missing ref ${dataRef.refName} in , ${JSON.stringify(
            this.dataRefs.map((e) => e.refName)
          )}`
        );
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
