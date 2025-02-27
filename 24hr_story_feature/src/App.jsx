import { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [history, setHistory] = useState([]);
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [time, setTime] = useState(0);
  const [imgInput, setImgInput] = useState(
    "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [imgPreviewSrc, setImgPreviewSrc] = useState(""); // состояние для превью

  const intervalId = useRef(null);

  function handleShowInput() {
    setShowInput(true);
  }

  const addHistory = useCallback(() => {
    if (imgInput !== "") {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          srcOfImg: imgInput,
        },
      ]);
      setShowInput(false);
    }
  }, [imgInput]);

  function showHistory(index) {
    setCurrentIndex(index);
    if (!isShowHistory) {
      setIsShowHistory(true);
      setImgInput(history[index].srcOfImg);
      intervalId.current = setInterval(() => {
        setTime((prev) => prev + 0.01);
      }, 10);
    }
  }

  function handleNextHistory(e) {
    if (e) e.stopPropagation();
    if (history.length > 0 && currentIndex !== null) {
      const nextIndex = (currentIndex + 1) % history.length;
      clearInterval(intervalId.current);
      setTime(0);
      setCurrentIndex(nextIndex);
      setImgInput(history[nextIndex].srcOfImg);
      intervalId.current = setInterval(() => {
        setTime((prev) => prev + 0.01);
      }, 10);
    }
  }

  function handlePrevHistory(e) {
    if (e) e.stopPropagation();
    if (history.length > 0 && currentIndex !== null) {
      const prevIndex =
        currentIndex === 0 ? history.length - 1 : currentIndex - 1;
      clearInterval(intervalId.current);
      setTime(0);
      setCurrentIndex(prevIndex);
      setImgInput(history[prevIndex].srcOfImg);
      intervalId.current = setInterval(() => {
        setTime((prev) => prev + 0.01);
      }, 10);
    }
  }

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Math.floor(time) >= 10) {
      clearInterval(intervalId.current);
      setTime(0);
      currentIndex < history.length - 1
        ? handleNextHistory()
        : setIsShowHistory(false);
    }
  }, [time]);

  // Обновляем превью изображения при изменении URL
  useEffect(() => {
    if (imgInput) {
      setImgPreviewSrc(imgInput); // Обновляем состояние для превью
    }
  }, [imgInput]);

  return (
    <div className="app">
      {!isShowHistory ? (
        <>
          <header>
            <div onClick={handleShowInput} className="addHistory">
              +
            </div>
            {history.map((el, i) => (
              <div onClick={() => showHistory(i)} key={i}>
                <div
                  style={{
                    backgroundImage: `url(${el.srcOfImg})`, // Используйте el, а не currentIndex
                    backgroundSize: "cover",
                    overflow: "hidden",
                  }}
                  className="history"
                ></div>
              </div>
            ))}
          </header>
          <main>
            {showInput && (
              <>
                <div
                  className="imgPreview"
                  style={{
                    backgroundImage: `url(${imgPreviewSrc})`, // Превью картинки
                    backgroundSize: "cover",
                    width: "500px",
                    height: "500px",
                  }}
                ></div>
                <div className="input">
                  <input
                    placeholder="Enter URL of image"
                    value={imgInput}
                    onChange={(e) => setImgInput(e.target.value)}
                    className="inputSrc"
                  ></input>
                  <button onClick={addHistory}>Add History</button>
                </div>
              </>
            )}
          </main>
        </>
      ) : (
        <div className="historyWindow">
          <div
            className="historyModal"
            style={{
              backgroundImage: `url(${imgInput})`,
              backgroundSize: "cover",
              overflow: "hidden",
            }}
          >
            <div className="progressWrapper">
              <div
                className="progressBar"
                style={{ width: `${(time / 10) * 100}%` }}
              ></div>
            </div>
            <div
              className="historyContent"
              onClick={() => {
                clearInterval(intervalId.current);
                setTime(0);
                setIsShowHistory(false);
              }}
            >
              {currentIndex > 0 && (
                <button className="prev" onClick={(e) => handlePrevHistory(e)}>
                  Previous History
                </button>
              )}
              {currentIndex < history.length - 1 && (
                <button
                  style={{ marginLeft: "auto" }}
                  className="next"
                  onClick={(e) => handleNextHistory(e)}
                >
                  Next History
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
