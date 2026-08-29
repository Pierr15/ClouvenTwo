"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Circle,
  Copy,
  Maximize2,
  RotateCcw,
  Terminal as TerminalIcon,
} from "lucide-react";

import {
  executeCommand,
  type CommandResult,
} from "@/lib/terminal/commands";

import {
  createInitialFileSystem,
  type DirectoryNode,
} from "@/lib/terminal/filesystem";

type Props = {
  fullName: string;
};

type TerminalLine = {
  id: number;
  type: "output" | "command";
  content: string;
};

/* ==================================================
   UNIQUE LINE ID
================================================== */

let terminalLineId = 0;

function createLineId(): number {
  terminalLineId += 1;

  return (
    Date.now() * 1000 +
    terminalLineId
  );
}

/* ==================================================
   USERNAME
================================================== */

function createUsername(
  fullName: string,
): string {
  const words = fullName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "user";
  }

  return words[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/* ==================================================
   PROMPT
================================================== */

function formatPrompt(
  username: string,
  currentPath: string[],
): string {
  const path =
    currentPath.length === 0
      ? "~"
      : `~/${currentPath.join("/")}`;

  return `${username}@cloev:${path}$`;
}

/* ==================================================
   TERMINAL
================================================== */

export default function Terminal({
  fullName,
}: Props) {
  const username = useMemo(
    () => createUsername(fullName),
    [fullName],
  );

  const [filesystem, setFilesystem] =
    useState<DirectoryNode>(
      createInitialFileSystem,
    );

  const [currentPath, setCurrentPath] =
    useState<string[]>([]);

  const [lines, setLines] = useState<
    TerminalLine[]
  >([
    {
      id: createLineId(),
      type: "output",
      content:
        "CLOEV Linux Simulator v1.0",
    },
    {
      id: createLineId(),
      type: "output",
      content:
        'Type "help" to see available commands.',
    },
    {
      id: createLineId(),
      type: "output",
      content:
        "Simulation mode: filesystem is virtual.",
    },
  ]);

  const [input, setInput] = useState("");

  const [history, setHistory] = useState<
    string[]
  >([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const bodyRef =
    useRef<HTMLDivElement>(null);

  const prompt = formatPrompt(
    username,
    currentPath,
  );

  /* ==================================================
     AUTO FOCUS
  ================================================== */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ==================================================
     AUTO SCROLL
  ================================================== */

  useEffect(() => {
    const element = bodyRef.current;

    if (!element) {
      return;
    }

    element.scrollTop =
      element.scrollHeight;
  }, [lines]);

  /* ==================================================
     ADD OUTPUT
  ================================================== */

  function addLines(
    result: CommandResult,
  ) {
    if (result.clear) {
      setLines([]);
      return;
    }

    if (result.output.length === 0) {
      return;
    }

    setLines((current) => [
      ...current,
      ...result.output.map((content) => ({
        id: createLineId(),
        type: "output" as const,
        content,
      })),
    ]);
  }

  /* ==================================================
     SUBMIT COMMAND
  ================================================== */

  function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const command = input.trim();

    if (!command) {
      return;
    }

    setLines((current) => [
      ...current,
      {
        id: createLineId(),
        type: "command",
        content: `${prompt} ${command}`,
      },
    ]);

    setHistory((current) => [
      ...current,
      command,
    ]);

    setHistoryIndex(-1);

    const result = executeCommand(
      command,
      {
        filesystem,
        currentPath,
        username,
        fullName,
        history,
      },
    );

    if (result.filesystem) {
      setFilesystem(result.filesystem);
    }

    if (result.currentPath) {
      setCurrentPath(
        result.currentPath,
      );
    }

    addLines(result);

    setInput("");
  }

  /* ==================================================
     KEYBOARD
  ================================================== */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (history.length === 0) {
        return;
      }

      const nextIndex =
        historyIndex === -1
          ? history.length - 1
          : Math.max(
              0,
              historyIndex - 1,
            );

      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex === -1) {
        return;
      }

      const nextIndex =
        historyIndex + 1;

      if (
        nextIndex >= history.length
      ) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }

    if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  /* ==================================================
     RESET
  ================================================== */

  function handleReset() {
    setFilesystem(
      createInitialFileSystem(),
    );

    setCurrentPath([]);
    setHistory([]);
    setHistoryIndex(-1);
    setInput("");

    setLines([
      {
        id: createLineId(),
        type: "output",
        content:
          "CLOEV Terminal reset.",
      },
      {
        id: createLineId(),
        type: "output",
        content:
          'Type "help" to see available commands.',
      },
    ]);
  }

  /* ==================================================
     FOCUS
  ================================================== */

  function focusTerminal() {
    inputRef.current?.focus();
  }

  /* ==================================================
     COPY
  ================================================== */

  async function handleCopy() {
    const text = lines
      .map((line) => line.content)
      .join("\n");

    await navigator.clipboard.writeText(text);
  }

  /* ==================================================
     UI
  ================================================== */

  return (
    <section className="flex min-h-[calc(100vh-3rem)] flex-col">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
            <TerminalIcon className="h-4.5 w-4.5 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Terminal
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              CLOEV Linux Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
          <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />

          <span className="text-[10px] font-semibold text-emerald-300">
            Simulation Mode
          </span>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#090e17] shadow-2xl shadow-blue-950/20">
        {/* Title Bar */}
        <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#0d1420] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <TerminalIcon className="h-3.5 w-3.5 text-slate-500" />

            <span className="font-mono text-[11px] text-slate-400">
              {username}@cloev
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset terminal"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy terminal"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              aria-label="Fullscreen"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          onClick={focusTerminal}
          className="min-h-125 flex-1 overflow-y-auto px-4 py-5 font-mono text-[13px] leading-6 sm:px-6 sm:py-6"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={
                line.type === "command"
                  ? "whitespace-pre-wrap text-slate-200"
                  : "whitespace-pre-wrap text-slate-400"
              }
            >
              {line.content}
            </div>
          ))}

          <form
            onSubmit={handleSubmit}
            className="flex items-center"
          >
            <span className="mr-2 shrink-0 text-emerald-400">
              {prompt}
            </span>

            <input
              ref={inputRef}
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              type="text"
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[13px] text-slate-200 outline-none caret-cyan-400"
              aria-label="Terminal command"
            />
          </form>
        </div>

        {/* Status */}
        <div className="flex h-9 shrink-0 items-center justify-between border-t border-white/5 bg-[#0d1420] px-4 text-[9px] font-medium uppercase tracking-wider text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-500/70">
              <Circle className="h-1.5 w-1.5 fill-current" />
              Connected
            </span>

            <span>Virtual FS</span>
          </div>

          <div className="hidden gap-3 sm:flex">
            <span>UTF-8</span>
            <span>LF</span>
            <span>Shell: CLOEV</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-600">
        Terminal simulasi CLOEV. Semua operasi
        filesystem hanya berlaku di lingkungan virtual.
      </p>
    </section>
  );
}