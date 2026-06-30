import React from "react";

export default function ({ t }: { t: Record<string, any> }) {
  return (
    <div className="p-4">
      <p className="text-2xl">React Example</p>
      <p>{t.translated}</p>
    </div>
  );
}
