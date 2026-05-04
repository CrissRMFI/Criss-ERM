import { useState } from "react";

export function useToast(duration = 2400) {
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), duration);
  };

  return { toast, showToast };
}
