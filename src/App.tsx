import { useState } from "react";
import "./App.css";

type DiffType = "added" | "removed" | "changed";

type DiffResult = {
  path: string;
  type: DiffType;
  before?: unknown;
  after?: unknown;
};

const exampleBefore = `{
  "user": {
    "name": "Soraya",
    "role": "student"
  },
  "active": true,
  "projects": 3
}`;

const exampleAfter = `{
  "user": {
    "name": "Soraya",
    "role": "developer"
  },
  "active": true,
  "projects": 4,
  "verified": true
}`;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareJSON(
  before: unknown,
  after: unknown,
  path = ""
): DiffResult[] {
  const differences: DiffResult[] = [];

  if (isObject(before) && isObject(after)) {
    const keys = new Set([
      ...Object.keys(before),
      ...Object.keys(after),
    ]);

    for (const key of keys) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in before)) {
        differences.push({
          path: currentPath,
          type: "added",
          after: after[key],
        });

        continue;
      }

      if (!(key in after)) {
        differences.push({
          path: currentPath,
          type: "removed",
          before: before[key],
        });

        continue;
      }

      differences.push(
        ...compareJSON(before[key], after[key], currentPath)
      );
    }

    return differences;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    const length = Math.max(before.length, after.length);

    for (let index = 0; index < length; index++) {
      const currentPath = path
        ? `${path}[${index}]`
        : `[${index}]`;

      if (index >= before.length) {
        differences.push({
          path: currentPath,
          type: "added",
          after: after[index],
        });

        continue;
      }

      if (index >= after.length) {
        differences.push({
          path: currentPath,
          type: "removed",
          before: before[index],
        });

        continue;
      }

      differences.push(
        ...compareJSON(
          before[index],
          after[index],
          currentPath
        )
      );
    }

    return differences;
  }

  if (!Object.is(before, after)) {
    differences.push({
      path: path || "root",
      type: "changed",
      before,
      after,
    });
  }

  return differences;
}

function formatValue(value: unknown) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (value === undefined) {
    return "undefined";
  }

  const formatted = JSON.stringify(value);

  return formatted ?? String(value);
}

function App() {
  const [beforeText, setBeforeText] = useState(exampleBefore);
  const [afterText, setAfterText] = useState(exampleAfter);

  const [results, setResults] = useState<DiffResult[]>([]);

  const [error, setError] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  const addedCount = results.filter(
    (result) => result.type === "added"
  ).length;

  const removedCount = results.filter(
    (result) => result.type === "removed"
  ).length;

  const changedCount = results.filter(
    (result) => result.type === "changed"
  ).length;

  function handleCompare() {
    try {
      const before = JSON.parse(beforeText);
      const after = JSON.parse(afterText);

      const differences = compareJSON(before, after);

      setResults(differences);
      setError("");
      setHasCompared(true);
    } catch {
      setResults([]);
      setHasCompared(false);

      setError(
        "One or both inputs contain invalid JSON."
      );
    }
  }

  function handleFormat() {
    try {
      const before = JSON.parse(beforeText);
      const after = JSON.parse(afterText);

      setBeforeText(JSON.stringify(before, null, 2));
      setAfterText(JSON.stringify(after, null, 2));

      setError("");
    } catch {
      setError(
        "Both inputs must contain valid JSON before they can be formatted."
      );
    }
  }

  function handleSwap() {
    const previousBefore = beforeText;

    setBeforeText(afterText);
    setAfterText(previousBefore);

    setResults([]);
    setError("");
    setHasCompared(false);
  }

  function handleClear() {
    setBeforeText("");
    setAfterText("");

    setResults([]);
    setError("");
    setHasCompared(false);
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <div className="brand">
            <span className="brand-mark">
              {"{ }"}
            </span>

            <span>DiffCheck</span>
          </div>

          <h1>See exactly what changed.</h1>

          <p>
            Compare two JSON objects and instantly find
            added, removed, and changed values.
          </p>
        </div>

        <button
          className="clear-button"
          onClick={handleClear}
        >
          Clear
        </button>
      </header>

      <section className="editors">
        <div className="editor-panel">
          <div className="editor-heading">
            <span>Before</span>
            <span className="json-label">JSON</span>
          </div>

          <textarea
            value={beforeText}
            onChange={(event) => {
              setBeforeText(event.target.value);
              setHasCompared(false);
            }}
            spellCheck={false}
            aria-label="Before JSON"
          />
        </div>

        <div className="editor-panel">
          <div className="editor-heading">
            <span>After</span>
            <span className="json-label">JSON</span>
          </div>

          <textarea
            value={afterText}
            onChange={(event) => {
              setAfterText(event.target.value);
              setHasCompared(false);
            }}
            spellCheck={false}
            aria-label="After JSON"
          />
        </div>
      </section>

      <div className="compare-row">
        <button
          className="clear-button"
          onClick={handleFormat}
        >
          Format
        </button>

        <button
          className="clear-button"
          onClick={handleSwap}
        >
          ⇄ Swap
        </button>

        <button
          className="compare-button"
          onClick={handleCompare}
        >
          Compare JSON
          <span>→</span>
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {hasCompared && !error && (
        <section className="results">
          <div className="results-heading">
            <div>
              <span className="eyebrow">
                Comparison
              </span>

              <h2>
                {results.length === 0
                  ? "No differences"
                  : `${results.length} ${
                      results.length === 1
                        ? "difference"
                        : "differences"
                    } found`}
              </h2>

              {results.length > 0 && (
                <p className="result-summary">
                  <span className="summary-added">
                    {addedCount} added
                  </span>

                  <span>·</span>

                  <span className="summary-removed">
                    {removedCount} removed
                  </span>

                  <span>·</span>

                  <span className="summary-changed">
                    {changedCount} changed
                  </span>
                </p>
              )}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="identical">
              These JSON objects are identical.
            </div>
          ) : (
            <div className="diff-list">
              {results.map((result, index) => (
                <article
                  className={`diff-item ${result.type}`}
                  key={`${result.path}-${index}`}
                >
                  <div className="diff-top">
                    <code>{result.path}</code>

                    <span
                      className={`badge ${result.type}`}
                    >
                      {result.type}
                    </span>
                  </div>

                  <div className="values">
                    {result.type !== "added" && (
                      <div>
                        <span className="value-label">
                          Before
                        </span>

                        <code>
                          {formatValue(result.before)}
                        </code>
                      </div>
                    )}

                    {result.type === "changed" && (
                      <span className="arrow">
                        →
                      </span>
                    )}

                    {result.type !== "removed" && (
                      <div>
                        <span className="value-label">
                          After
                        </span>

                        <code>
                          {formatValue(result.after)}
                        </code>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default App;