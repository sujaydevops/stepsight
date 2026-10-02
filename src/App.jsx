import { useState } from "react";
import "./App.css";

const wires = [
  {
    id: "red",
    name: "RED",
    color: "#ef4444",
  },
  {
    id: "yellow",
    name: "YELLOW",
    color: "#facc15",
  },
  {
    id: "green",
    name: "GREEN",
    color: "#22c55e",
  },
];

const correctAnswers = {
  red: "C",
  yellow: "A",
  green: "B",
};

function App() {
  const [page, setPage] = useState("home");

  const [selectedWire, setSelectedWire] = useState(null);

  const [connections, setConnections] = useState({});

  const [message, setMessage] = useState(
    "Select a wire, then choose the correct terminal."
  );

  const [status, setStatus] = useState("normal");

  const [mistakes, setMistakes] = useState(0);

  function selectWire(wire) {
    if (connections[wire.id]) {
      return;
    }

    setSelectedWire(wire.id);

    setMessage(
      `${wire.name} selected. Now choose the correct terminal.`
    );

    setStatus("normal");
  }

  function connectWire(terminal) {
    if (!selectedWire) {
      setMessage("Select a wire first.");
      setStatus("warning");
      return;
    }

    const correctTerminal = correctAnswers[selectedWire];

    if (correctTerminal === terminal) {
      setConnections((previous) => ({
        ...previous,
        [selectedWire]: terminal,
      }));

      setMessage(
        `Correct! ${selectedWire.toUpperCase()} connects to Terminal ${terminal}.`
      );

      setStatus("correct");
      setSelectedWire(null);
    } else {
      setMistakes((previous) => previous + 1);

      setMessage(
        `Incorrect. ${selectedWire.toUpperCase()} does not connect to Terminal ${terminal}. Try again.`
      );

      setStatus("wrong");
    }
  }

  function resetTraining() {
    setSelectedWire(null);
    setConnections({});
    setMistakes(0);

    setMessage(
      "Select a wire, then choose the correct terminal."
    );

    setStatus("normal");
  }

  const completed = Object.keys(connections).length;

  function getPath(wire, terminal) {
    const positions = {
      red: {
        start: 95,
      },

      yellow: {
        start: 210,
      },

      green: {
        start: 325,
      },

      A: {
        end: 95,
      },

      B: {
        end: 210,
      },

      C: {
        end: 325,
      },
    };

    const startY = positions[wire].start;
    const endY = positions[terminal].end;

    return `M 250 ${startY}
            C 430 ${startY},
              570 ${endY},
              750 ${endY}`;
  }

  function TrainingPage() {
    return (
      <div className="trainingPage">

        <nav className="navbar">

          <div className="logo">
            <span>⚡</span>
            StepSight
          </div>

          <button
            className="navButton"
            onClick={() => setPage("home")}
          >
            ← Home
          </button>

        </nav>

        <main className="trainingContainer">

          <div className="trainingHeader">

            <div>

              <div className="smallLabel">
                INTERACTIVE TRAINING
              </div>

              <h1>
                Basic Control Panel Wiring
              </h1>

              <p>
                Follow the procedure and connect each wire
                to the correct terminal.
              </p>

            </div>

            <div className="progressBox">

              <strong>
                {completed} / 3
              </strong>

              <span>
                Connections
              </span>

            </div>

          </div>

          <div className="procedure">

            <strong>
              Training Procedure
            </strong>

            <span>
              🔴 Red → C
            </span>

            <span>
              🟡 Yellow → A
            </span>

            <span>
              🟢 Green → B
            </span>

          </div>

          <div className="simulator visualSimulator">

            <svg
              className="wireCanvas"
              viewBox="0 0 1000 420"
              preserveAspectRatio="none"
            >

              {connections.red && (
                <path
                  d={getPath(
                    "red",
                    connections.red
                  )}
                  className="cable cableRed"
                />
              )}

              {connections.yellow && (
                <path
                  d={getPath(
                    "yellow",
                    connections.yellow
                  )}
                  className="cable cableYellow"
                />
              )}

              {connections.green && (
                <path
                  d={getPath(
                    "green",
                    connections.green
                  )}
                  className="cable cableGreen"
                />
              )}

            </svg>

            <section className="visualPanel leftPanel">

              <div className="panelTitle">
                WIRES
              </div>

              {wires.map((wire) => (

                <button
                  key={wire.id}
                  disabled={
                    Boolean(connections[wire.id])
                  }
                  className={
                    `visualWire
                    ${
                      selectedWire === wire.id
                        ? "selected"
                        : ""
                    }
                    ${
                      connections[wire.id]
                        ? "connected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    selectWire(wire)
                  }
                >

                  <span
                    className="wirePlug"
                    style={{
                      backgroundColor:
                        wire.color,

                      boxShadow:
                        `0 0 20px ${wire.color}`,
                    }}
                  />

                  <div>

                    <strong>
                      {wire.name}
                    </strong>

                    <small>

                      {connections[wire.id]
                        ? `Connected to Terminal ${connections[wire.id]}`
                        : "Not connected"}

                    </small>

                  </div>

                  <span
                    className="sourcePort"
                    style={{
                      borderColor:
                        wire.color,
                    }}
                  >

                    {connections[wire.id]
                      ? "✓"
                      : ""}

                  </span>

                </button>

              ))}

            </section>

            <div className="centerStatus">

              <div className="trainingChip">
                LIVE TRAINING
              </div>

              <div className="centerIcon">
                ⚡
              </div>

              <strong>

                {selectedWire
                  ? `${selectedWire.toUpperCase()} selected`
                  : "Choose a wire"}

              </strong>

              <span>
                Then choose its destination terminal.
              </span>

            </div>

            <section className="visualPanel rightPanel">

              <div className="panelTitle">
                TERMINALS
              </div>

              {["A", "B", "C"].map(
                (terminal) => {

                  const usedBy =
                    Object.keys(
                      connections
                    ).find(
                      (wire) =>
                        connections[wire] ===
                        terminal
                    );

                  return (

                    <button
                      key={terminal}
                      className={
                        `visualTerminal ${
                          usedBy
                            ? "terminalUsed"
                            : ""
                        }`
                      }
                      onClick={() =>
                        connectWire(
                          terminal
                        )
                      }
                    >

                      <span className="targetPort">

                        {usedBy
                          ? "✓"
                          : ""}

                      </span>

                      <div>

                        <strong>
                          Terminal {terminal}
                        </strong>

                        <small>

                          {usedBy
                            ? `${usedBy.toUpperCase()} connected`
                            : "Available"}

                        </small>

                      </div>

                    </button>

                  );
                }
              )}

            </section>

          </div>

          <div
            className={`coach ${status}`}
          >

            <div className="coachIcon">
              🤖
            </div>

            <div>

              <strong>
                StepSight AI Coach
              </strong>

              <p>
                {message}
              </p>

            </div>

          </div>

          <div className="stats">

            <span>
              Progress:{" "}
              <strong>
                {completed}/3
              </strong>
            </span>

            <span>
              Mistakes:{" "}
              <strong>
                {mistakes}
              </strong>
            </span>

            <button
              onClick={resetTraining}
            >
              Reset Training
            </button>

          </div>

          {completed === 3 && (

            <div className="complete">

              <div className="completeIcon">
                ✓
              </div>

              <h2>
                Training Complete!
              </h2>

              <p>
                You successfully completed
                all three connections.
              </p>

              <strong>

                {mistakes === 0
                  ? "Perfect run — no mistakes."
                  : `${mistakes} mistake${
                      mistakes > 1
                        ? "s"
                        : ""
                    } corrected.`}

              </strong>

            </div>

          )}

        </main>

      </div>
    );
  }

  function HomePage() {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span>⚡</span>
            StepSight
          </div>

          <button
            className="navButton"
            onClick={() =>
              setPage("training")
            }
          >
            Try Demo
          </button>

        </nav>

        <main className="hero">

          <div className="badge">
            ✦ POWERED BY GEMINI
          </div>

          <h1>
            Learn technical skills
            <span> by doing.</span>
          </h1>

          <p className="subtitle">
            Turn technical procedures into
            interactive AI-powered training.
            Practice tasks, make mistakes,
            get guidance, and improve.
          </p>

          <div className="actions">

            <button className="primary">
              Create Training →
            </button>

            <button
              className="secondary"
              onClick={() =>
                setPage("training")
              }
            >
              Try Wiring Demo
            </button>

          </div>

          <section className="features">

            <div className="card">

              <div className="icon">
                🧠
              </div>

              <h2>
                Understand
              </h2>

              <p>
                Gemini transforms written
                procedures into structured
                interactive training.
              </p>

            </div>

            <div className="card">

              <div className="icon">
                ⚡
              </div>

              <h2>
                Practice
              </h2>

              <p>
                Learn by interacting with
                simulations instead of only
                reading instructions.
              </p>

            </div>

            <div className="card">

              <div className="icon">
                📈
              </div>

              <h2>
                Improve
              </h2>

              <p>
                Get immediate feedback,
                helpful hints, and practice
                recommendations.
              </p>

            </div>

          </section>

        </main>

      </div>
    );
  }

  return page === "training"
    ? <TrainingPage />
    : <HomePage />;
}

export default App;
