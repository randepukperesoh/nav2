import { Html } from "@react-three/drei";
import { useState, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IModal {
  renderProp: (setIsOpen: (value: boolean) => void) => ReactNode;
  children: ReactNode;
}

export const Modal: FC<IModal> = ({ renderProp, children }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <mesh>
      <mesh onClick={() => setIsOpen(true)}>{children}</mesh>
      {open && (
        <Html>
          {createPortal(
            <div
              onClick={(e) => e.stopPropagation()}
              className="modal modal_content"
            >
              {renderProp(setIsOpen)}
            </div>,
            document.body
          )}
        </Html>
      )}
    </mesh>
  );
};
