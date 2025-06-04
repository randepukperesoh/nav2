import type { FC, ReactNode } from "react";
import type { DirectionStep } from "../../hooks/useMicroRoute";
import { RightIcon } from "../Icons/RightIcon";
import { LeftIcon } from "../Icons/LeftIcon";
import { UpIcon } from "../Icons/UpIcon";
import { PointIcon } from "../Icons/Point";
import { Stairs } from "../Icons/Stairs";

const MockDirection: Record<string, ReactNode> = {
  влево: <RightIcon />,
  вправо: <LeftIcon />,
  прямо: <UpIcon />,
  "начало маршрута": <PointIcon />,
  "конец маршрута": <PointIcon />,
  лестница: <Stairs />,
};

interface IRouteDirection {
  step: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  microRoute: DirectionStep[];
}

const RouteDirection: FC<IRouteDirection> = ({
  handleNextStep,
  handlePrevStep,
  microRoute,
  step,
}) => {
  return (
    <div className="flex">
      <button className="romm_btn" onClick={handlePrevStep}>
        Назад
      </button>
      <div>
        <div>{MockDirection[microRoute?.[step]?.direction] || ""}</div>

        <div className="distance">
          {microRoute && microRoute[step] && microRoute[step].distance
            ? microRoute?.[step]?.distance + " метров"
            : ""}
        </div>
      </div>
      <button className="romm_btn" onClick={handleNextStep}>
        Вперед
      </button>
    </div>
  );
};

export default RouteDirection;
