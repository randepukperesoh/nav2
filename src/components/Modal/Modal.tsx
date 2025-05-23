import { useState, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IModal {
  renderProp: (setIsOpen: (value: boolean) => void) => ReactNode;
  children: ReactNode;
}

export const Modal: FC<IModal> = ({ renderProp, children }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {open && (
        <>
          {createPortal(
            <div onClick={(e) => e.stopPropagation()} className="modal ">
              {renderProp(setIsOpen)}
            </div>,
            document.body
          )}
        </>
      )}
    </>
  );
};
