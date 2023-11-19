import { RefObject } from "react";

export type DataRef = {
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  refName: string;
};

export const generateObject = <T>(
  typeGuard: (value: unknown) => value is T,
  dataRefs: DataRef[]
): T => {
  const obj: Record<string, unknown> = {};

  dataRefs.forEach((dataRef) => {
    if (dataRef.ref.current) {
      obj[dataRef.refName] = dataRef.ref.current.value;
    } else {
      throw new Error(`Missing ref: ${dataRef.refName}`);
    }
  });

  if (!typeGuard(obj)) {
    throw Error(`generateObject failed typeGuard: ${JSON.stringify(obj)}`);
  }

  return obj as T;
};
