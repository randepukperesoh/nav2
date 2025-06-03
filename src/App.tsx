import { useEffect, useState } from "react";
import "./App.css";
import FloorMap from "./components/FloorMap/FloorMap";

// const LoadingSpinner = () => <span className="loader"></span>;

const App = () => {

    const [isLoadingMock, setIsloadingMock] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setIsloadingMock(false), 1500)
  }, [])

  return (
    <div className="main">
      <FloorMap />
      {isLoadingMock && <div className='loader-container'><span className="loader"></span></div>}
    </div>
  );
};

export default App;
