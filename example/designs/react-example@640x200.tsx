import React from "react";
import "../assets/styles.css";

export default function ({ t }: { t: Record<string, any> }) {
  return (
    <div>
      <p>React Example</p>
      <p>{t.translated}</p>
    </div>
  );
}
