import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Search,
  MapPin,
  Mic,
  MicOff,
  Bot,
  User,
  Loader2,
  ExternalLink,
  ShieldCheck,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
}

interface GharChatbotModalProps {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onBookServiceRequest?: (categoryName: string, subservice: string) => void;
}

export const GharChatbotModal: React.FC<GharChatbotModalProps> = ({
  currentCity,
  isOpen,
  onClose,
  onBookServiceRequest,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Namaste! I'm **Ghar AI Assistant**, your smart home maintenance & troubleshooting guide in ${currentCity}.\n\nHow can I assist you today? You can ask me:\n- *"Why is my AC leaking water?"*\n- *"What is the standard price of Havells 32A MCB in India?"*\n- *"Find hardware stores near me."*\n- Or press the **Mic** button to speak your issue!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'search' | 'maps'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      if (mode === 'search') {
        const response = await fetch('/api/ai-search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, city: currentCity }),
        });
        const resText = await response.text();
        let data: any = {};
        try { data = resText ? JSON.parse(resText) : {}; } catch (_) {}

        if (data.success) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.summary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: data.groundingSources,
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error(data.error || 'Failed to fetch search grounding');
        }
      } else if (mode === 'maps') {
        const response = await fetch('/api/ai-maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery: query, city: currentCity }),
        });
        const resText = await response.text();
        let data: any = {};
        try { data = resText ? JSON.parse(resText) : {}; } catch (_) {}

        if (data.success) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.summary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error(data.error || 'Failed to fetch maps grounding');
        }
      } else {
        // Multi-turn chat
        const updatedHistory = [...messages, userMsg];
        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
            city: currentCity,
          }),
        });
        const resText = await response.text();
        let data: any = {};
        try { data = resText ? JSON.parse(resText) : {}; } catch (_) {}

        if (data.success) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error(data.error || 'Failed to get chat response');
        }
      }
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recording handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setRecordingStatus('Transcribing voice message...');
          setIsLoading(true);

          try {
            const response = await fetch('/api/ai-transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: 'audio/webm',
              }),
            });
            const resText = await response.text();
            let data: any = {};
            try { data = resText ? JSON.parse(resText) : {}; } catch (_) {}
            if (data.success && data.text) {
              handleSendMessage(data.text);
            } else {
              throw new Error(data.error || 'Transcription empty');
            }
          } catch (err: any) {
            console.error('Transcription error:', err);
            alert('Could not transcribe audio: ' + err.message);
            setIsLoading(false);
          } finally {
            setRecordingStatus('');
          }
        };
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingStatus('Listening... Speak your home issue now.');
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // stop tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[88vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold font-serif">Ghar AI Maintenance Assistant</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Live Chat, Spare Part Pricing & Local Hardware Store Finder in {currentCity}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-stone-100 p-2 border-b border-stone-200 flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('chat')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'chat'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              General AI Chat
            </button>

            <button
              onClick={() => setMode('search')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'search'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-500/30'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              Live Part Rates (Search)
            </button>

            <button
              onClick={() => setMode('maps')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'maps'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-500/30'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Nearby Hardware Stores
            </button>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'reset-1',
                  role: 'assistant',
                  content: `Chat history reset. How can I assist you with your home in ${currentCity}?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            title="Clear Chat History"
            className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-900 text-emerald-400 shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-white text-stone-800 border border-stone-200 shadow-xs rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                      <span className="font-bold block text-stone-700">Search Grounding Sources:</span>
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-700 hover:underline truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{src.title || src.uri}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right mt-1 ${
                      isUser ? 'text-emerald-100' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-2xl border border-stone-200 w-fit">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Ghar AI is thinking & retrieving details...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="font-bold text-stone-400 shrink-0 uppercase text-[10px]">Try Asking:</span>
          <button
            onClick={() => handleSendMessage('What is the standard cost of kitchen pipe leak repair in Mumbai?')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-medium shrink-0 cursor-pointer border border-stone-200"
          >
            💧 Leak repair costs
          </button>
          <button
            onClick={() => {
              setMode('search');
              handleSendMessage('Current price of Asian Paints Royale Luxury Emulsion 20L in India 2026');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-medium shrink-0 cursor-pointer border border-stone-200"
          >
            🎨 Paint price search
          </button>
          <button
            onClick={() => {
              setMode('maps');
              handleSendMessage('Jaquar plumbing showroom near me');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-medium shrink-0 cursor-pointer border border-stone-200"
          >
            📍 Find plumbing shops
          </button>
        </div>

        {/* Footer Input Area */}
        <div className="p-3 bg-white border-t border-stone-200">
          {recordingStatus && (
            <div className="mb-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl flex items-center justify-between font-bold animate-pulse">
              <span>{recordingStatus}</span>
              <button
                onClick={stopRecording}
                className="text-xs bg-amber-600 text-white px-2 py-1 rounded-lg"
              >
                Stop & Process
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Voice Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-bounce shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title={isRecording ? 'Stop Recording' : 'Record Voice Issue'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-700" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                mode === 'search'
                  ? 'Search live market prices (e.g. Havells 16A switch price)...'
                  : mode === 'maps'
                  ? 'Find hardware or sanitary stores in your area...'
                  : `Ask Ghar AI about repairs in ${currentCity}...`
              }
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-medium"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
