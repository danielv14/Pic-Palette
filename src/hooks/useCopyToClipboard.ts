import { useState } from "react";
import { sleep } from "~/utils/sleep";

export const useCopyToClipboard = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);
      await sleep(1000);
      setCopiedValue(null);
    } catch {
      // clipboard not available
    }
  };

  return { copiedValue, copyToClipboard };
};
