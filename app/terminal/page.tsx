"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { marked } from "@/lib/marked-terminal";
import Header from "../components/Header";
import { siteConfig } from "@/lib/config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OutputLine {
  type: "output" | "error" | "success" | "info" | "system";
  text: string;
}

interface Message {
  role: "agent" | "user";
  command?: string;
  lines?: OutputLine[];
  markdown?: string;
  timestamp: string;
}

interface ApiHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const { name, education } = siteConfig;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timestamp(): string {
  return new Date().toTimeString().slice(0, 8);
}

const LINE_COLOR: Record<OutputLine["type"], string> = {
  output:  "text-[#a3a3a3]",
  error:   "text-[#ef4444]",
  success: "text-[#22c55e]",
  info:    "text-[#034694]",
  system:  "text-[#737373]",
};

const BOOT: Message = {
  role: "agent",
  lines: [
    { type: "success", text: "Authenticated. AGENT_OS_V1 kernel loaded." },
    { type: "output",  text: `${name} · ${education.institution.split(",")[0]}` },
    { type: "output",  text: "AI systems online. Ask me anything about Tanay." },
  ],
  timestamp: "00:00:00",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgentMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex gap-6 items-start">
      {/* left accent bar */}
      <div className="flex flex-col items-start pt-1 shrink-0 w-[6px]">
        <div className="bg-[#034694] w-[6px] h-10" />
      </div>

      <div className="flex flex-col gap-4 min-w-0">
        <span className="font-[family-name:var(--font-code)] text-[10px] text-[#737373] tracking-[3px] uppercase">
          System Boot / {msg.timestamp}
        </span>

        <div className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-display)] font-bold text-[#034694] text-[18px] tracking-[-0.9px] uppercase leading-7">
            AGENT_TERMINAL_V4:
          </span>
          {msg.markdown != null ? (
            <div
              className="markdown-terminal"
              dangerouslySetInnerHTML={{ __html: marked.parse(msg.markdown) as string }}
            />
          ) : (
            msg.lines?.map((line, i) => (
              <p
                key={i}
                className={`font-[family-name:var(--font-code)] text-sm leading-[1.625] whitespace-pre-wrap break-words ${LINE_COLOR[line.type]}`}
              >
                {line.text}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex gap-6 items-start justify-end">
      <div className="flex flex-col gap-4 items-end min-w-0 max-w-[90%]">
        <span className="font-[family-name:var(--font-code)] text-[10px] text-[#737373] tracking-[3px] uppercase">
          User Command / {msg.timestamp}
        </span>

        <div className="bg-[rgba(3,70,148,0.2)] border-r-4 border-[#034694] pr-7 py-4 pl-4">
          <p className="font-[family-name:var(--font-code)] text-sm">
            <span className="text-[#034694] font-bold">USER_OPR: </span>
            <span className="text-white">{msg.command}</span>
          </p>
        </div>
      </div>

      {/* right accent bar */}
      <div className="flex flex-col items-start pt-1 shrink-0 w-[6px]">
        <div className="bg-white w-[6px] h-10" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TerminalPage() {
  // lazy initializer — runs only on the client, avoiding SSR/client timestamp mismatch
  const [messages, setMessages] = useState<Message[]>(() => [
    { ...BOOT, timestamp: timestamp() },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apiHistory, setApiHistory] = useState<ApiHistoryEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  async function submit(cmd?: string) {
    const raw = cmd ?? input;
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed || isLoading) return;

    const ts = timestamp();

    if (trimmed === "clear") {
      setMessages([{ ...BOOT, timestamp: ts }]);
      setApiHistory([]);
      setInput("");
      setHistory((h) => [raw, ...h]);
      setHistoryIdx(-1);
      return;
    }

    const userMsg: Message = { role: "user", command: raw.trim(), timestamp: ts };
    const thinkingMsg: Message = {
      role: "agent",
      lines: [{ type: "system", text: "> PROCESSING..." }],
      timestamp: timestamp(),
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setHistory((h) => [raw, ...h]);
    setHistoryIdx(-1);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw.trim(), history: apiHistory }),
      });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "agent",
            lines: [{ type: "error", text: "Sorry, I had to rate-limit you! This is because I'm paying for the AI from my pocket, and I'm still a student 😅" }],
            timestamp: timestamp(),
          },
        ]);
        setIsLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text: string = data.response ?? "";

      setApiHistory((h) => [
        ...h,
        { role: "user", content: raw.trim() },
        { role: "assistant", content: text },
      ]);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "agent", markdown: text, timestamp: timestamp() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "agent",
          lines: [{ type: "error", text: "Sorry, that request didn't work — try again!" }],
          timestamp: timestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) { setHistoryIdx(-1); setInput(""); }
      else { setHistoryIdx(next); setInput(history[next] ?? ""); }
    }
  }

  return (
    <>
      <Header />

      {/* ── Everything below the fixed header ───────────────────────────── */}
      {/* top-[68px] matches header: py-4 (32px) + text line-height (32px) + border-b-4 (4px) = 68px */}
      <div className="fixed inset-0 top-[68px] bg-[#f9f9f9] overflow-hidden">

        {/* ── Blurred background ─────────────────────────────────────────── */}
        <div className="absolute inset-0 opacity-20 blur-sm pointer-events-none select-none p-8 grid grid-cols-12 gap-8 content-start">
          <div className="col-span-12 sm:col-span-3">
            <div className="bg-white border-4 border-black p-7 flex flex-col gap-4">
              <span className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-4xl uppercase tracking-[-1.8px]">Status</span>
              <div className="flex flex-col gap-2">
                {[["CPU_LOAD","12.4%"],["MEM_USE","4.2GB"],["NET_UP","ACTIVE"]].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-[family-name:var(--font-code)] text-sm text-[#1a1c1c]">{k}</span>
                    <span className="font-[family-name:var(--font-code)] text-sm text-[#034694]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden sm:grid col-span-9 grid-cols-2 gap-8">
            {[["PROJECT: ZERO_DAY","Security audit for orbital infrastructure."],
              ["PROJECT: HELIOS","Solar energy distribution optimization."]].map(([t,d]) => (
              <div key={t} className="bg-white border-4 border-black h-[400px] relative">
                <div className="absolute inset-x-8 top-8 bottom-24 bg-[#e5e5e5] border-4 border-black" />
                <div className="absolute left-8 right-8 bottom-8">
                  <p className="font-[family-name:var(--font-display)] font-bold text-[#1a1c1c] text-2xl uppercase">{t}</p>
                  <p className="font-sans text-[#1a1c1c] text-sm opacity-70">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dark overlay ───────────────────────────────────────────────── */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[2px] flex items-stretch justify-center p-3 sm:p-6">

          {/* ── Terminal window ──────────────────────────────────────────── */}
          {/* h-full + min-h-0 on child = fixed height, scroll inside messages */}
          <div
            className="bg-black border-4 border-black w-full max-w-[768px] shadow-[8px_8px_0px_0px_black] flex flex-col overflow-hidden"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Window chrome */}
            <div className="bg-black border-b-4 border-black shrink-0 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className="font-[family-name:var(--font-code)] font-bold text-[#034694] text-[10px] tracking-[2px] uppercase shrink-0">
                  ADVISOR_TERMINAL_V4.0.1
                </span>
                <span className="font-[family-name:var(--font-code)] text-[#525252] text-[10px] tracking-[2px] uppercase hidden sm:block">
                  SID: 2026-ACAD-ENG
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-[#404040] rounded-full size-2" />
                  <div className="bg-[#404040] rounded-full size-2" />
                  <div className="bg-[#034694] rounded-full size-2" />
                </div>
                <button
                  onClick={() => setMessages([{ ...BOOT, timestamp: timestamp() }])}
                  className="font-[family-name:var(--font-code)] text-[#737373] text-xs leading-none hover:text-white transition-colors"
                  title="Reset session"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages — only this section scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-black">
              <div className="flex flex-col gap-8 sm:gap-10 p-4 sm:p-8">
                {messages.map((msg, i) =>
                  msg.role === "agent"
                    ? <AgentMessage key={i} msg={msg} />
                    : <UserMessage key={i} msg={msg} />
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#034694] border-t-4 border-black shrink-0">
              <div className="flex items-center gap-3 sm:gap-6 px-4 sm:px-8 py-4 sm:py-8">
                <span className="font-[family-name:var(--font-code)] font-bold text-white text-2xl sm:text-[30px] leading-none select-none shrink-0">
                  $
                </span>
                <div className="flex-1 flex items-center min-w-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="bg-transparent font-[family-name:var(--font-display)] font-bold text-white text-lg sm:text-2xl tracking-[-1.2px] uppercase outline-none w-full placeholder:text-white/30 disabled:opacity-50"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    placeholder="ENTER COMMAND"
                  />
                  <div
                    className="bg-white w-[10px] h-5 shrink-0 ml-1"
                    style={{ opacity: cursorVisible ? 1 : 0 }}
                  />
                </div>
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <span className="font-[family-name:var(--font-code)] text-white/50 text-[9px] tracking-[2.7px] uppercase hidden lg:block">
                    COMMIT::ENTER
                  </span>
                  <button
                    onClick={() => submit()}
                    disabled={isLoading}
                    className="bg-black border-2 border-black px-4 sm:px-10 py-2 sm:py-3 font-[family-name:var(--font-display)] font-bold text-white text-sm sm:text-base tracking-[1.6px] uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                  >
                    SEND
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
