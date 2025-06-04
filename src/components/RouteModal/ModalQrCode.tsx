import { useCallback, useRef, type FC } from "react";
import { QrCodeIcon } from "./QrCode";
import { Modal } from "../Modal/Modal";
import { QRCodeSVG } from "qrcode.react";

interface IModalQrCode {
  startId: string | null;
  endId: string | null;
}

const ModalQrCode: FC<IModalQrCode> = ({ endId, startId }) => {
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQRCode = useCallback(() => {
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
  }, [endId, startId]);

  return (
    <Modal
      renderProp={() => (
        <div className="qrCodeWrapper">
          <QRCodeSVG
            ref={qrRef}
            bgColor={"#ffffff"}
            fgColor={"#1370b9"}
            imageSettings={{
              src: "/logo.png",
              x: undefined,
              y: undefined,
              height: 32,
              width: 32,
              opacity: 1,
              excavate: true,
            }}
            value={`https://nav.donstu.ru?start=${startId}&end=${endId}`}
            size={256}
          />

          <button className="downloadBtn" onClick={downloadQRCode}>
            Скачать
          </button>
        </div>
      )}
    >
      <div className="romm_btn">
        Создать QR-CODE <QrCodeIcon />
      </div>
    </Modal>
  );
};

export default ModalQrCode;
