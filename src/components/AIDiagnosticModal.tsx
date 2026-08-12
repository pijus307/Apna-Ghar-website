import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Wrench,
  Zap,
  RotateCcw,
  Loader2,
  Mic,
  MicOff,
} from 'lucide-react';
import { AIDiagnosis } from '../types';

interface AIDiagnosticModalProps {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onBookWithDiagnosis: (category: string, diagnosisSummary: string, costRange: string) => void;
}

const SAMPLE_ISSUES = [
  'Water leaking constantly under kitchen sink',
  'Ceiling fan making loud humming & clicking sound',
  'Main electrical breaker trips every time AC is turned on',
  'Split AC cooling is very weak and blowing warm air',
  'Bathroom flush tank water overflowing continuously',
  'Locked out of front apartment door with key stuck inside',
];

export const AIDiagnosticModal: React.FC<AIDiagnosticModalProps> = ({
  currentCity,
  isOpen,
  onClose,
  onBookWithDiagnosis,
}) => {
  const [issueInput, setIssueInput] = useState('');
  const [urgencyPreference, setUrgencyPreference] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<AIDiagnosis | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  const handleRunDiagnostic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!issueInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueDescription: issueInput,
          city: currentCity,
          urgency: urgencyPreference,
        }),
      });

      const resText = await response.text();
      let data: any = {};
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch (parseErr) {
        console.error('Failed to parse diagnostic JSON response:', resText);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete diagnosis. Please try again.');
      }

      setDiagnosis(data.diagnosis);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          setRecordingStatus('Transcribing voice message with Gemini...');
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
            const data = await response.json();
            if (data.success && data.text) {
              setIssueInput(data.text);
            } else {
              throw new Error(data.error || 'Transcription empty');
            }
          } catch (err: any) {
            console.error('Transcription error:', err);
            setErrorMsg('Voice transcription error: ' + err.message);
          } finally {
            setIsLoading(false);
            setRecordingStatus('');
          }
        };
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingStatus('Recording... Speak your home issue now.');
    } catch (err) {
      console.error('Microphone error:', err);
      setErrorMsg('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSelectSample = (sample: string) => {
    setIssueInput(sample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 font-serif">Ghar AI Diagnostic Assistant</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded uppercase">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Type or speak your home repair problem for an instant cost estimate & safety guide.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!diagnosis ? (
          /* Form Inputs */
          <form onSubmit={handleRunDiagnostic} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  What is happening at your home in {currentCity}?
                </label>
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isRecording ? 'Stop & Transcribe' : 'Voice Input'}</span>
                </button>
              </div>

              {recordingStatus && (
                <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 animate-pulse">
                  {recordingStatus}
                </div>
              )}

              <textarea
                value={issueInput}
                onChange={(e) => setIssueInput(e.target.value)}
                placeholder="Describe what is broken or leaking e.g. 'Water is leaking under the bathroom sink when I turn on the tap'..."
                rows={4}
                className="w-full p-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-medium transition-all"
                required
              />
            </div>

            {/* Quick Sample Chips */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Or click a common issue example:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_ISSUES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-medium transition-colors text-left border border-stone-200/60 cursor-pointer"
                  >
                    💡 {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency preference */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Speed Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgencyPreference('Standard')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    urgencyPreference === 'Standard'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  Standard Booking (Scheduled)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgencyPreference('Urgent Emergency')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    urgencyPreference === 'Urgent Emergency'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  ⚡ Urgent 24/7 Callout
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !issueInput.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Issue with Ghar AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Diagnose & Get Estimate</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Diagnosis Results View */
          <div className="space-y-6 animate-in fade-in">
            
            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ghar AI Diagnostic Report
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-emerald-900 text-[10px] font-bold border border-emerald-200">
                  {diagnosis.urgencyLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-relaxed font-sans">
                {diagnosis.summary}
              </p>
            </div>

            {/* Price & Duration Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Trade Category</span>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900">{diagnosis.recommendedCategory}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Estimated Cost</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-700">{diagnosis.estimatedCostRangeINR}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Repair Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-stone-900">{diagnosis.estimatedTime}</span>
              </div>
            </div>

            {/* Immediate Homeowner Safety Advice */}
            {diagnosis.safetyAdvice && diagnosis.safetyAdvice.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Immediate Homeowner Safety Tips
                </h4>
                <ul className="space-y-1">
                  {diagnosis.safetyAdvice.map((tip, idx) => (
                    <li key={idx} className="text-xs text-amber-950 font-medium flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Possible Causes & Parts */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5">
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-stone-500" />
                  Likely Causes
                </h5>
                <ul className="text-xs text-stone-600 space-y-1 pl-4 list-disc">
                  {diagnosis.possibleCauses.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5">
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Expected Services/Parts
                </h5>
                <ul className="text-xs text-stone-600 space-y-1 pl-4 list-disc">
                  {diagnosis.recommendedPartsOrServices.map((part, i) => (
                    <li key={i}>{part}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDiagnosis(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Diagnose Another Issue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onBookWithDiagnosis(
                    diagnosis.recommendedCategory,
                    diagnosis.summary,
                    diagnosis.estimatedCostRangeINR
                  );
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book {diagnosis.recommendedCategory} Professional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
