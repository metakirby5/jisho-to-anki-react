import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import InputBox from "./InputBox";
import { lookup } from "./Jisho";
import ResultsDisplay from "./ResultsDisplay";
import { JishoNone, JishoResponse, JishoType } from "./Types";

enum UiState {
  Loading,
}

type UiDisplay = UiState | JishoResponse;

export default function App(): JSX.Element {
  const [query, setQuery] = useState<string>();
  const [result, setResult] = useState<UiDisplay>(JishoNone);

  useAsyncEffect(
    async (mounted) => {
      if (!query) {
        setResult(JishoNone);
        return;
      }

      setResult(UiState.Loading);
      const response = await lookup(query);
      if (!mounted()) {
        return;
      }

      setResult(response);
    },
    [query]
  );

  return (
    <>
      <h1>Jisho to Anki</h1>
      <InputBox onInput={setQuery} />
      {getDisplay(result)}
    </>
  );
}

function getDisplay(display: UiDisplay): JSX.Element {
  switch (display) {
    case UiState.Loading:
      return <>"loading..."</>;
  }

  switch (display.type) {
    case JishoType.None:
      return <></>;
    case JishoType.Error:
      return <>{display.reason.toString()}</>;
    case JishoType.Result:
      return <ResultsDisplay result={display} />;
  }
}
