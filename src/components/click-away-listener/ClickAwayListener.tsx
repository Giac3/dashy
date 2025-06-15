import { useRef, useEffect } from "react";

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  onClickAway: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function ClickAwayListener({
  children,
  onClickAway,
}: {
  children: React.ReactNode;
  onClickAway: () => void;
}) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onClickAway);

  return <div ref={wrapperRef}>{children}</div>;
}

export { ClickAwayListener };
