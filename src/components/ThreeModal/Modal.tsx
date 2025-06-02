import { Html } from "@react-three/drei";
import { type FC, type ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../Icons/CloseIcon";
import { animated, useSpring } from "@react-spring/web";

interface IModal {
  renderProp: (handleClose: () => void) => ReactNode;
  children: ReactNode;
  isOpen: boolean;
  setOpenModalName: (val: string | null) => void;
  setModalName: (val: string) => void;
  currentRoom: string;
}

export const Modal: FC<IModal> = ({
  renderProp,
  children,
  isOpen,
  setOpenModalName,
  setModalName,
  currentRoom,
}) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  // Анимация появления/исчезновения
  const fadeAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(20%)",
    config: { tension: 300, friction: 30 },
    onRest: () => {
      if (!isOpen) {
        setVisible(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setContent(renderProp(() => setOpenModalName(null)));
    }
  }, [isOpen, currentRoom]); // Добавляем currentRoom в зависимости

  if (!visible) return <mesh onClick={setModalName}>{children}</mesh>;

  return (
    <mesh>
      <mesh onClick={setModalName}>{children}</mesh>
      <Html>
        {createPortal(
          <animated.div
            style={{
              ...fadeAnimation,
              position: "fixed",
              width: "30%",
              height: "10%",
              display: "flex",
              backgroundColor: "#fff",
              flexDirection: "column",
              alignItems: "center",
              bottom: 0,
              left: "50%",
              translateX: '-50%',
              borderRadius: "0.5rem",
              zIndex: 1001,
              padding: "1rem",
              color: "#80889d",
              fontSize: "1.5rem",
              boxShadow: "0 0 7px 2px#1370b9",
            }}
            onClick={(e) => e.stopPropagation()}
            className="modalBotom"
          >
            <div className="modal_content">
              <button
                className="closeIcon"
                onClick={() => setOpenModalName(null)}
              >
                <CloseIcon />
              </button>
              {content}
            </div>
          </animated.div>,
          document.body
        )}
      </Html>
    </mesh>
  );
};
