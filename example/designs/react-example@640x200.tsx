import React from "react";

export default function ({ t }: { t: Record<string, any> }) {
  return (
    <div>
      <p>React Example</p>
      <p>{t.translated}</p>
    </div>
  );
}
