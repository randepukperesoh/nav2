import { useRef, useState, type FC, type ReactNode } from "react";
import { RouteIcon } from "../Room/RouteIcon";
import { useSearchRoom } from "../../hooks/useSearchRoom";
import { useRouteStore } from "../store/store";
import { QrCodeIcon } from "./QrCode";
import { Modal } from "../Modal/Modal";
import { QRCodeSVG } from "qrcode.react";
import { RoomTag } from "../RoomTag/RoomTag";
import { LeftIcon } from "../Icons/LeftIcon";
import { RightIcon } from "../Icons/RightIcon";
import { UpIcon } from "../Icons/UpIcon";
import { PointIcon } from "../Icons/Point";
import type { DirectionStep } from "../../hooks/useMicroRoute";
import { Stairs } from "../Icons/Stairs";

interface IRouteModal {
  step: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  microRoute: DirectionStep[]
}

const MockDirection: Record<string, ReactNode> = {
  влево: <RightIcon />,
  вправо: <LeftIcon />,
  прямо: <UpIcon />,
  "начало маршрута": <PointIcon />,
  "конец маршрута": <PointIcon />,
  "лестница": <Stairs/>
};

export const RouteModal: FC<IRouteModal> = ({
  handleNextStep,
  handlePrevStep,
  microRoute,
  step,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const qrRef = useRef<SVGSVGElement>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const { endId, startId, setEndId, setStartId } = useRouteStore();

  const { filteredDots, searchName, setSearchName } = useSearchRoom();

  const downloadQRCode = () => {
    const element = qrRef.current;
    if (!element) {
      console.error("QR-код элемент не найден");
      return;
    }

    try {
      const svgString = new XMLSerializer().serializeToString(element);

      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `qr ${startId} ${endId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      console.error("Ошибка при создании QR-кода:", error);
    }
  };

  return (
    <div className={`route-modal ${isOpen ? "open" : ""}`}>
      <div className="route-modal-bef" onClick={toggleModal}></div>
      {isOpen && (
        <div className="modal-content">
          <div className="modalRoute">
            <div className="modalRoute_route">
              <div onClick={() => setStartId(null)} className="roomTag">
                {startId}
              </div>
              <RouteIcon />
              <div onClick={() => setEndId(null)} className="roomTag">
                {endId}
              </div>

              <Modal
                renderProp={() => (
                  <div className="qrCodeWrapper">
                    <QRCodeSVG
                      ref={qrRef}
                      value={`https://nav.donstu.ru ?start=${startId}&end=${endId}`}
                      size={256}
                    />

                    <button className="downloadBtn" onClick={downloadQRCode}>
                      Скачать
                    </button>
                  </div>
                )}
              >
                <QrCodeIcon />
              </Modal>
            </div>

            {microRoute?.length === 0 && (
              <>
                <div className="modalRoute_flex">
                  <input
                    className="modalRoute_input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.currentTarget.value)}
                  />
                </div>

                <div className="modalRoute_cards">
                  {filteredDots.map((el, i) => (
                    <RoomTag
                      key={el.name + "_" + i}
                      name={el.name}
                      setEndId={setEndId}
                      setStartId={setStartId}
                      endId={endId}
                      startId={startId}
                    />
                  ))}
                </div>
              </>
            )}
            {microRoute?.length !== 0 && (
              <>
                <div>{MockDirection[microRoute?.[step].direction]}</div>

                <div className="distance">
                  {microRoute?.[step].distance !== 0 &&
                    microRoute?.[step].distance + " метров"}
                </div>

                <div className="modal_room_btns">
                  <button className="romm_btn" onClick={handlePrevStep}>
                    Назад
                  </button>
                  <button className="romm_btn" onClick={handleNextStep}>
                    Вперед
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
