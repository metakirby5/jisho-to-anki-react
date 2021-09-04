export enum JishoType {
  None,
  Result,
  Error,
}

export type JishoResponse = { type: JishoType.None } | JishoResult | JishoError;

export const JishoNone: JishoResponse = { type: JishoType.None };

export interface JishoResult {
  readonly type: JishoType.Result;
  readonly word: string;
  readonly reading: string;
  readonly meaning: JSX.Element;
  readonly url: string;
}

export interface JishoError {
  readonly type: JishoType.Error;
  readonly reason: any;
}

export function jishoError(reason: any): JishoError {
  return {
    type: JishoType.Error,
    reason,
  };
}
