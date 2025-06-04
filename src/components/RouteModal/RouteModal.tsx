import { useCallback, useMemo, useRef, type FC } from "react";
import { useSearchRoom } from "../../hooks/useSearchRoom";
import { useRouteStore } from "../store/store";
import { RoomTag } from "../RoomTag/RoomTag";
import type { DirectionStep } from "../../hooks/useMicroRoute";
import { RouteIcon } from "../Room/RouteIcon";
import { lazy } from "react";
import { useSwipeModal } from "../../hooks/useSwipeModal";

const RouteDirection = lazy(() => import("./RouteDirection"));
const ModalQrCode = lazy(() => import("./ModalQrCode"));

interface IRouteModal {
  step: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  microRoute: DirectionStep[];
}

const MOCK_POPULAR_ARR = [
  { name: "Конгрессхол 1 этаж" },
  { name: "Точка кипения" },
  { name: "Коворкинг Гараж" },
  { name: "Медиапарк" },
];

const RouteModal: FC<IRouteModal> = ({
  handleNextStep,
  handlePrevStep,
  microRoute,
  step,
}) => {
  const {
    isOpen,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    toggleModal,
  } = useSwipeModal();

  const { endId, startId, setEndId, setStartId } = useRouteStore();

  const { filteredDots, searchName, setSearchName } = useSearchRoom();

  const inpRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => inpRef.current?.focus(), []);

  const dots: { name: string }[] = useMemo(
    () => (!searchName ? [...MOCK_POPULAR_ARR, ...filteredDots] : filteredDots),
    [filteredDots, searchName]
  );

  return (
    <div
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`route-modal ${
        microRoute && microRoute.length > 0 ? "route" : ""
      } ${isOpen ? "open" : ""}`}
    >
      <div className="route-modal-bef" onClick={toggleModal}></div>
      {isOpen && (
        <div className="modal-content">
          <div className="modalRoute">
            <>
              <div className="modalRoute_route">
                <div className="modalRoute_route_prefix">
                  <div>Откуда: </div>
                  <div
                    onClick={() => {
                      handleFocus();
                      setStartId(null);
                    }}
                    className="roomTag"
                  >
                    {startId}
                  </div>
                </div>
                <RouteIcon />

                <div className="modalRoute_route_prefix">
                  <div>Куда: </div>
                  <div
                    onClick={() => {
                      handleFocus();
                      setEndId(null);
                    }}
                    className="roomTag"
                  >
                    {endId}
                  </div>
                </div>
              </div>

              <ModalQrCode endId={endId} startId={startId} />
            </>
            {microRoute?.length === 0 && (
              <>
                <div className="modalRoute_flex">
                  <input
                    ref={inpRef}
                    className="modalRoute_input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.currentTarget.value)}
                  />
                </div>
                <div className="modalRoute_cards">
                  {dots.map((el, i) => (
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
              <RouteDirection
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
                microRoute={microRoute}
                step={step}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteModal;
