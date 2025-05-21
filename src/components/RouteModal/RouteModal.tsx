import { useRef, useState } from "react";
import { RouteIcon } from "../Room/RouteIcon";
import { useSearchRoom } from "../../hooks/useSearchRoom";
import { useRouteStore } from "../store/store";
import { QrCodeIcon } from "./QrCode";
import { Modal } from "../Modal/Modal";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

export const RouteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const qrRef = useRef(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const { endId, startId, setEndId, setStartId } = useRouteStore();

  const { filteredDots, searchName, setSearchName } = useSearchRoom();

  const downloadQRCode = async () => {
    const element = qrRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`route-modal ${isOpen ? "open" : ""}`}>
      <div onClick={toggleModal}>Маршрут </div>
      {isOpen && (
        <div className="modal-content">
          <div className="modalRoute">
            <div className="modalRoute_route">
              <div className="modalRoute_cards_room">{startId}</div>
              <RouteIcon />
              <div className="modalRoute_cards_room">{endId}</div>
            </div>
            <div className="modalRoute_flex">
              <input
                className="modalRoute_input"
                value={searchName}
                onChange={(e) => setSearchName(e.currentTarget.value)}
              />
              <Modal
                renderProp={() => (
                  <div className="qrCodeWrapper">
                    <QRCodeSVG
                      ref={qrRef}
                      value={`https://nav.donstu.ru?start=${startId}&end=${endId}`}
                    />

                    <a onClick={downloadQRCode}>Скачать</a>
                  </div>
                )}
              >
                <QrCodeIcon />
              </Modal>
            </div>

            <div className="modalRoute_cards">
              {filteredDots.map((el, i) => (
                <div
                  key={el.name + "_" + i}
                  className="modalRoute_cards_room"
                  onClick={() =>
                    startId ? setEndId(el.name) : setStartId(el.name)
                  }
                >
                  {el.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
