import { Html } from "@react-three/drei";
import { type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../Icons/CloseIcon";

interface IModal {
  renderProp: (handleClose: () => void) => ReactNode;
  children: ReactNode;
  isOpen: boolean;
  setOpenModalName: (val: string | null) => void;
  setModalName: (val: string) => void;
}

export const Modal: FC<IModal> = ({
  renderProp,
  children,
  isOpen,
  setOpenModalName,
  setModalName,
}) => {
  return (
    <mesh>
      <mesh onClick={setModalName}>{children}</mesh>
      {isOpen && (
        <Html>
          {createPortal(
            <div
              onClick={(e) => e.stopPropagation()}
              className="modalBotom modal_content"
            >
              <button
                className="closeIcon"
                onClick={() => setOpenModalName(null)}
              >
                <CloseIcon />
              </button>
              {renderProp(() => setOpenModalName(null))}
            </div>,
            document.body
          )}
        </Html>
      )}
    </mesh>
  );
};
