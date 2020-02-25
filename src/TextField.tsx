import React, { useState } from "react";

type Props = {
  text: string;
  ok: boolean;
  i: number;
};

interface TextNode {
  text: string;
}
const someText: string = "string";

export const TextFeild: React.FC<Props> = () => {
  const [count, setCount] = useState<{ text: string }>({ text: "hello" });

  return (
    <div>
      <input />
    </div>
  );
};
