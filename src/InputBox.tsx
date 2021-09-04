import { useState } from "react";

export default function InputBox(props: {
  onInput: (input: string) => void;
}): JSX.Element {
  const onInput = props.onInput;
  const [input, setInput] = useState("");

  return (
    <input
      type="text"
      onChange={(e) => setInput(e.target.value)}
      onBlur={(e) => onInput(input)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onInput(input);
        }
      }}
    />
  );
}
