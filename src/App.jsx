import { useEffect, useState } from "react";
import "./App.css";

const OPTIONS = ["✊", "🖐️", "✌️"];
const calculateWinner = (opt1, opt2) => {
  if (opt1 === opt2) {
    return "Draw";
  } else if (
    (opt1 === "✊" && opt2 === "✌️") ||
    (opt1 === "🖐️" && opt2 === "✊") ||
    (opt1 === "✌️" && opt2 === "🖐️")
  ) {
    return "You won! 🎉";
  } else {
    return "You lose 😔";
  }
};
const getPlaysHistory = () => {
  let localPlaysHistory = localStorage.getItem("playsHistory");
  if (localPlaysHistory === null) {
    localPlaysHistory = `{
      "wins" : 0,
      "loses" : 0,
      "draws" : 0
    }`;

    localStorage.setItem("playsHistory", localPlaysHistory);
  }
  return JSON.parse(localPlaysHistory);
};

function App() {
  const [version, setVersion] = useState("");
  const [userOption, setUserOption] = useState("");
  const [cpuOption, setCpuOption] = useState("");
  const [counter, setCounter] = useState();
  const [playsHistory, setPlaysHistory] = useState(getPlaysHistory());

  useEffect(() => {
    if (counter <= 3 && counter > 0) {
      const timeout = setTimeout(() => {
        console.log("timeout");
        setCounter((actual) => actual - 1);
      }, 1000);
    }
    /* return () => {
      if (counter == 0) {
        clearTimeout(timeout);
        console.log("Limpieza timeout");
      }
    }; */
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      // Update playsHistory state and update the localStorage variable
      if (calculateWinner(userOption, cpuOption) === "You won! 🎉") {
        const history = { ...playsHistory, wins: playsHistory.wins + 1 };
        setPlaysHistory(history);
        localStorage.setItem("playsHistory", JSON.stringify(history));
      } else if (calculateWinner(userOption, cpuOption) === "You lose 😔") {
        const history = { ...playsHistory, loses: playsHistory.loses + 1 };
        localStorage.setItem("playsHistory", JSON.stringify(history));
        setPlaysHistory(history);
      } else {
        const history = { ...playsHistory, draws: playsHistory.draws + 1 };
        localStorage.setItem("playsHistory", JSON.stringify(history));
        setPlaysHistory(history);
      }
      setCounter();
      console.log(playsHistory);
      console.log(JSON.parse(localStorage.getItem("playsHistory")));
    }
  }, [counter, cpuOption, playsHistory, userOption]);

  useEffect(() => {
    const userOpt = userOption;
    if (version === "hacked") {
      switch (userOpt) {
        case "✊":
          setCpuOption("🖐️");
          break;
        case "🖐️":
          setCpuOption("✌️");
          break;
        case "✌️":
          setCpuOption("✊");
          break;
      }
    } else if (version === "normal") {
      const cpuOpt = OPTIONS[Math.floor(Math.random() * 3)];
      setCpuOption(cpuOpt);
    }
  }, [userOption, version]);

  const result = calculateWinner(userOption, cpuOption);

  const resetGame = () => {
    setCpuOption("");
    setUserOption("");
    setCounter();
  };

  return (
    <>
      <h1>Rock Papers Scissor</h1>
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <h3>Statistics:</h3>
        <p>
          Wins: {playsHistory.wins} Loses: {playsHistory.loses} Draws:{" "}
          {playsHistory.draws}
        </p>
      </section>
      {version === "" && (
        <section>
          <h3>Select version of the game</h3>
          <div className="select-version-section">
            <button
              onClick={() => {
                setVersion("hacked");
              }}
            >
              Hacked
            </button>
            <button
              onClick={() => {
                setVersion("normal");
              }}
            >
              Normal
            </button>
          </div>
        </section>
      )}
      {version !== "" && userOption === "" && (
        <section>
          <h3>Select your option</h3>
          <div className="option-selection-section">
            {OPTIONS.map((opt, index) => (
              <OptionButton
                onSelectOption={(opt) => {
                  setUserOption(opt);
                  setCounter(3);
                }}
                key={index}
              >
                {opt}
              </OptionButton>
            ))}
          </div>
        </section>
      )}
      {version !== "" && userOption !== "" && counter > 0 && <h2>{counter}</h2>}
      {version !== "" && userOption !== "" && counter === undefined && (
        <section>
          <h3>{result}</h3>
          <div className="option-container">
            <h5>CPU Option: </h5>
            <div className="option-div">{cpuOption}</div>
          </div>
          <div className="option-container">
            <h5>Your Option: </h5>
            <div className="option-div">{userOption}</div>
          </div>
          <button
            style={{ marginTop: "8px" }}
            onClick={() => {
              resetGame();
            }}
          >
            Play Again?
          </button>
        </section>
      )}
    </>
  );
}

export default App;

function OptionButton({ children, onSelectOption }) {
  return (
    <button
      onClick={() => {
        onSelectOption(children);
      }}
      className="option-button"
    >
      {children}
    </button>
  );
}
