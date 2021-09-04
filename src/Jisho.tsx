import config from "./config.json";
import { jishoError, JishoError, JishoResult, JishoType } from "./Types";
import { renderToString } from "react-dom/server";

const ANKI_URL = "anki://x-callback-url/addnote?";
const CHROME_URL = "googlechrome://";
const JISHO_URL = "https://jisho.org/api/v1/search/words?keyword=";

interface Data {
  readonly japanese: {
    readonly word: string;
    readonly reading: string;
  }[];
  readonly senses: Sense[];
}

interface Sense {
  readonly english_defintions: string[];
  readonly parts_of_speech: string[];
  readonly tags: string[];
}

export async function lookup(query: string): Promise<JishoResult | JishoError> {
  const url = JISHO_URL + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const json = await response.json();
    return parse(json);
  } catch (e) {
    return jishoError(e);
  }
}

function parse(json: any): JishoResult | JishoError {
  const data: Data = json?.data?.[0];
  if (!data) {
    return jishoError("No data!");
  }

  const jp = data.japanese[0];
  const senses: Sense[] = data.senses;

  const reading = jp.reading;
  const word = usesKana(senses) ? reading : jp.word ?? reading;
  const meaning = getMeaning(senses);

  const fields = config.fields;
  const url =
    ANKI_URL +
    new URLSearchParams({
      "x-success": CHROME_URL,
      profile: config.profile,
      type: config.note,
      deck: config.deck,
      tags: config.tags,
      [fields.word]: word,
      [fields.reading]: reading,
      [fields.meaning]: renderToString(meaning),
    }).toString();

  return { type: JishoType.Result, word, reading, meaning, url };
}

function usesKana(senses: Sense[]): boolean {
  return senses[0].tags.some((x) => x.includes("kana alone"));
}

function getMeaning(senses: Sense[]) {
  return (
    <dl>
      {senses.map((sense) => (
        <>
          <dt>{sense.parts_of_speech.join(", ")}</dt>
          <dl>{sense.english_defintions.join(", ")}</dl>
        </>
      ))}
    </dl>
  );
}
