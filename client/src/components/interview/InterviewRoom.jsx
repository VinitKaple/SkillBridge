import { useState, useEffect, useRef, useCallback } from "react";

const QUESTION_BANK = {
  "core-cs": [
    "Tell me about yourself and your technical background.",
    "Explain the difference between a process and a thread.",
    "What is a deadlock? How can you prevent it?",
    "Explain ACID properties in databases.",
    "What is normalization? Explain up to 3NF.",
    "What is the difference between TCP and UDP?",
    "Explain the four pillars of Object Oriented Programming.",
    "What is virtual memory and how does it work?",
    "Explain indexing in DBMS and why it is important.",
    "What is the OSI model? Name all 7 layers.",
  ],
  dsa: [
    "Tell me about yourself and your problem solving approach.",
    "Explain the time complexity of binary search.",
    "How does merge sort work? What is its space complexity?",
    "What is a hash table? How are collisions handled?",
    "Explain the difference between BFS and DFS.",
    "What is dynamic programming? Give a real example.",
    "Explain the two pointer technique with an example.",
    "What is the difference between a stack and a queue?",
    "How would you detect a cycle in a linked list?",
    "Explain the concept of memoization.",
  ],
  hr: [
    "Tell me about yourself.",
    "What is your greatest technical strength?",
    "Describe a challenging project and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Why do you want to join this company?",
    "Tell me about a time you worked in a team.",
    "What do you do when you get stuck on a problem?",
    "Describe a time you failed and what you learned.",
    "How do you stay updated with new technology?",
    "What makes you a good fit for this role?",
  ],
  "full-loop": [
    "Tell me about yourself.",
    "Explain the difference between a process and a thread.",
    "What are ACID properties in a database?",
    "Explain time complexity of binary search.",
    "What is dynamic programming? Give an example.",
    "Design a URL shortening service like bit.ly.",
    "How would you handle 1 million concurrent users?",
    "Tell me about a challenging project you built.",
    "How do you handle disagreements in a team?",
    "Why do you want to join our company?",
  ],
};

const COMPANY_PERSONAS = {
  Google: { name: "SkillBridge AI", title: "Google Interview Simulator", initials: "AI", color: "from-blue-500 to-blue-700" },
  Microsoft: { name: "SkillBridge AI", title: "Microsoft Interview Simulator", initials: "AI", color: "from-indigo-500 to-indigo-700" },
  Amazon: { name: "SkillBridge AI", title: "Amazon Interview Simulator", initials: "AI", color: "from-amber-500 to-orange-600" },
  Razorpay: { name: "SkillBridge AI", title: "Razorpay Interview Simulator", initials: "AI", color: "from-blue-600 to-cyan-600" },
  Swiggy: { name: "SkillBridge AI", title: "Swiggy Interview Simulator", initials: "AI", color: "from-orange-500 to-red-500" },
  Flipkart: { name: "SkillBridge AI", title: "Flipkart Interview Simulator", initials: "AI", color: "from-yellow-500 to-orange-500" },
  Infosys: { name: "SkillBridge AI", title: "Infosys Interview Simulator", initials: "AI", color: "from-teal-500 to-teal-700" },
  TCS: { name: "SkillBridge AI", title: "TCS Interview Simulator", initials: "AI", color: "from-purple-500 to-purple-700" },
};

export default function InterviewRoom({ config, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [phase, setPhase] = useState("speaking");
  const [timeLeft, setTimeLeft] = useState(90);
  const [interimText, setInterimText] = useState("");
  const [showStopModal, setShowStopModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [speakWave, setSpeakWave] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const timerRef = useRef(null);

  const questions = QUESTION_BANK[config.round] || QUESTION_BANK["core-cs"];
  const persona = COMPANY_PERSONAS[config.company] || COMPANY_PERSONAS["Google"];
  const totalQuestions = 10;
  const progress = Math.round((currentQ / totalQuestions) * 100);
  const timerPct = (timeLeft / 90) * 100;
  const timerColor = timeLeft > 30 ? "#16A34A" : timeLeft > 10 ? "#D97706" : "#DC2626";

  const speakQuestion = useCallback((text) => {
    synthRef.current.cancel();
    setIsSpeaking(true);
    setSpeakWave(true);
    setPhase("speaking");

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.0;
    utter.volume = 1;

    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) => v.lang === "en-IN" || v.lang === "en-US" || v.lang.startsWith("en")
    );
    if (preferred) utter.voice = preferred;

    utter.onend = () => {
      setIsSpeaking(false);
      setSpeakWave(false);
      setPhase("listening");
      startListening();
      startTimer();
    };

    synthRef.current.speak(utter);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) setTranscript((prev) => prev + " " + final);
      setInterimText(interim);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  }, []);

  const startTimer = useCallback(() => {
    setTimeLeft(90);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  const handleNext = useCallback(() => {
    stopListening();
    clearInterval(timerRef.current);
    synthRef.current.cancel();
    setSpeakWave(false);

    const finalAnswer = transcript.trim() || "(No answer given)";
    const newAnswers = [...answers, { question: currentQuestion, answer: finalAnswer }];
    setAnswers(newAnswers);
    setTranscript("");
    setInterimText("");

    if (currentQ + 1 >= totalQuestions) {
      onComplete(newAnswers);
      return;
    }

    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/interview/next-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        previousAnswer: finalAnswer,
        questionNumber: nextQ,
        company: config.company,
        round: config.round,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        const q = data.question || questions[nextQ] || "Tell me more about your projects.";
        setCurrentQuestion(q);
        speakQuestion(q);
      })
      .catch(() => {
        setIsLoading(false);
        const q = questions[nextQ] || "Tell me about your background.";
        setCurrentQuestion(q);
        speakQuestion(q);
      });
  }, [transcript, answers, currentQ, totalQuestions, onComplete, stopListening, sessionId, config, questions, speakQuestion, currentQuestion]);

  const handleForceStop = useCallback(() => {
    stopListening();
    clearInterval(timerRef.current);
    synthRef.current.cancel();
    const finalAnswer = transcript.trim() || "(No answer given)";
    const newAnswers = [...answers, { question: currentQuestion, answer: finalAnswer }];
    onComplete(newAnswers);
  }, [transcript, answers, currentQuestion, onComplete, stopListening]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/interview/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: config.company,
        round: config.round,
        difficulty: config.difficulty,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        setSessionId(data.sessionId);
        const q = data.firstQuestion || questions[0];
        setCurrentQuestion(q);
        setTimeout(() => speakQuestion(q), 800);
      })
      .catch(() => {
        setIsLoading(false);
        const q = questions[0];
        setCurrentQuestion(q);
        setTimeout(() => speakQuestion(q), 800);
      });
  }, []);

  useEffect(() => {
    return () => {
      synthRef.current.cancel();
      stopListening();
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{config.company} · AI Mock Interview</p>
            <p className="text-xs text-gray-400 capitalize">{config.round.replace("-", " ")} · {config.difficulty}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-gray-400">Q{currentQ + 1} / {totalQuestions}</span>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-blue-600">{progress}%</span>
        </div>

        <button
          onClick={() => setShowStopModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          Stop Interview
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-5">

        {/* AI Interviewer Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">

            {/* Dark header with avatar */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 flex items-center gap-4">
              <div className="relative shrink-0">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center shadow-lg`}>
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.121m-1.5-2.121c.251.023.501.05.75.082M15 3.104v5.714c0 .682.277 1.337.77 1.823L19 14.5M3 18.5l3.75-3.996m0 0A2.25 2.25 0 018 13.25h8a2.25 2.25 0 011.25.254M6.75 14.504L12 20l5.25-5.496"/>
  </svg>
</div>
                {speakWave && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-white font-semibold">{persona.name}</p>
                <p className="text-gray-400 text-xs mb-1.5">{persona.title} · {config.company}</p>
                {isSpeaking ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Speaking
                  </span>
                ) : phase === "listening" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Listening
                  </span>
                ) : isLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /> Thinking
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">Ready</span>
                )}
              </div>

              {/* Circular timer */}
              <div className="shrink-0 flex flex-col items-center gap-1">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#374151" strokeWidth="3" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke={timerColor} strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(timerPct / 100) * 150.8} 150.8`}
                      style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{timeLeft}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">secs</span>
              </div>
            </div>

            {/* Sound wave bar */}
            {speakWave && (
              <div className="bg-gray-900 px-6 py-2 flex items-end justify-center gap-0.5 h-10">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-green-400 rounded-full"
                    style={{
                      height: `${4 + Math.abs(Math.sin(i * 0.6)) * 18}px`,
                      opacity: 0.6 + Math.sin(i * 0.4) * 0.4,
                      animation: `wavebar ${0.3 + (i % 7) * 0.08}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.03}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Question */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Question {currentQ + 1} / {totalQuestions}
                </span>
              </div>
              {isLoading ? (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex gap-1">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">Preparing question...</span>
                </div>
              ) : (
                <p className="text-gray-800 text-base leading-relaxed font-medium">{currentQuestion}</p>
              )}
            </div>
          </div>
        </div>

        {/* Answer Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">Your Answer</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={phase === "speaking" || isLoading}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isListening
                      ? "bg-red-500 text-white shadow-md scale-105"
                      : phase === "speaking" || isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:scale-105 active:scale-95"
                  }`}
                >
                  {isListening && (
                    <>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    </>
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? "Stop Recording" : "Speak Answer"}
                </button>
                {transcript && (
                  <button onClick={() => setTranscript("")} className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className={`min-h-[90px] rounded-2xl p-4 transition-all ${
              isListening ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"
            }`}>
              {transcript || interimText ? (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {transcript}
                  {interimText && <span className="text-gray-400 italic"> {interimText}</span>}
                </p>
              ) : (
                <p className="text-sm text-gray-300 italic">
                  {phase === "speaking" ? "Wait for question to finish..." : isLoading ? "Loading..." : "Click 'Speak Answer' or type below..."}
                </p>
              )}
            </div>

            <textarea
              className="w-full mt-3 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 transition-all"
              rows={2}
              placeholder="Or type your answer here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={phase === "speaking" || isLoading}
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                {transcript.trim().split(/\s+/).filter(Boolean).length} words typed
              </span>
              <button
                onClick={handleNext}
                disabled={phase === "speaking" || isLoading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  phase === "speaking" || isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : currentQ + 1 >= totalQuestions
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-sm active:scale-95"
                    : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm active:scale-95"
                }`}
              >
                {currentQ + 1 >= totalQuestions ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Finish Interview</>
                ) : (
                  <>Next Question <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 py-2">
          {[...Array(totalQuestions)].map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i < currentQ ? "w-2 h-2 bg-blue-600"
              : i === currentQ ? "w-3 h-3 bg-blue-600 ring-2 ring-blue-200"
              : "w-2 h-2 bg-gray-200"
            }`} />
          ))}
        </div>
      </div>

      {/* Stop Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Stop Interview?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">
              You answered {currentQ} of {totalQuestions} questions. Report will be generated from answers so far.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStopModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => { setShowStopModal(false); handleForceStop(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Stop & Get Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wavebar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}