import { JishoResult } from "./Types";

export default function ResultsDisplay(props: {
  result: JishoResult;
}): JSX.Element {
  const result = props.result;

  return (
    <>
      <a href={result.url}>Add to Anki</a>
      <hr />
      <h2>{result.word}</h2>
      <h4>{result.reading}</h4>
      {result.meaning}
    </>
  );
}
