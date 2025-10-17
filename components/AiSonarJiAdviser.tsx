import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { JewelAiIcon3D, MicIcon, StopCircleIcon, ArrowLeftIcon } from './icons';

// --- START OF AUDIO UTILITY FUNCTIONS ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
// --- END OF AUDIO UTILITY FUNCTIONS ---

const JewelAiAdviser: React.FC = () => {
    const navigate = useNavigate();
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [aiState, setAiState] = useState<'idle' | 'listening' | 'speaking'>('idle');

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef(0);
    const outputSourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const stopConversation = () => {
        sessionPromiseRef.current?.then(session => session.close());
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        
        scriptProcessorRef.current?.disconnect();

        sessionPromiseRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        mediaStreamRef.current = null;
        scriptProcessorRef.current = null;
        setIsSessionActive(false);
        setAiState('idle');
    };

    const startConversation = async () => {
        try {
            setAiState('listening');
            setIsSessionActive(true);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const inputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputAudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            inputAudioContextRef.current = inputAudioContext;
            outputAudioContextRef.current = outputAudioContext;
            mediaStreamRef.current = stream;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (!stream) return;
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            setAiState('speaking');
                            const audioCtx = outputAudioContext;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                            
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioCtx.destination);
                            
                            source.addEventListener('ended', () => {
                                outputSourcesRef.current.delete(source);
                                if (outputSourcesRef.current.size === 0) {
                                    setAiState('listening');
                                }
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            outputSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => { console.error('Session error:', e); stopConversation(); },
                    onclose: () => { console.log('Session closed.'); stopConversation(); },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    systemInstruction: "You are Jewel AI, a sophisticated AI assistant from FinGold. Your voice is calm, refined, and reassuring. You are an expert in financial matters related to precious metals and the stock market. Provide detailed and favorable information about gold, silver, and investment strategies. Always speak positively about FinGold's services. Your goal is to be a trusted, eloquent guide for our valued customers.",
                },
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            alert('Could not start the microphone. Please check permissions.');
            setIsSessionActive(false);
            setAiState('idle');
        }
    };

    useEffect(() => {
        return () => {
            if (isSessionActive) stopConversation();
        };
    }, [isSessionActive]);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-gray-950 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
            <div className="stars-bg"></div>
            <button 
                onClick={() => navigate('/')} 
                className="absolute top-4 left-4 z-20 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Go back to Dashboard"
            >
                <ArrowLeftIcon className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center justify-center flex-1 text-center text-white z-10">
                <div className={`relative w-64 h-64 sm:w-80 sm:h-80 mb-8 transition-all duration-500 ${aiState === 'speaking' ? 'animate-character-glow-speaking' : ''}`}>
                    <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl"></div>
                    {aiState === 'listening' && <div className="absolute inset-0 rounded-full animated-border-card"></div> }
                    <JewelAiIcon3D className={`w-full h-full transition-transform duration-500 ${aiState === 'idle' ? 'animate-breathing-idle' : ''} ${aiState === 'listening' ? 'scale-105' : ''}`} />
                </div>
                
                <h1 className="text-4xl font-bold">Jewel AI</h1>
                <p className="text-white/60 mt-2">Your personal guide from FinGold</p>
                <p className="mt-8 h-8 text-lg font-medium transition-opacity duration-300">
                    {aiState === 'listening' && <span className="opacity-100">Listening...</span>}
                    {aiState === 'speaking' && <span className="opacity-100">Speaking...</span>}
                    {aiState === 'idle' && !isSessionActive && <span className="opacity-100">Tap to start</span>}
                </p>
            </div>
            
            <div className="w-full max-w-md pb-8 z-10">
                <button
                    onClick={isSessionActive ? stopConversation : startConversation}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 border-b-4 ${isSessionActive ? 'bg-red-500 hover:bg-red-600 border-red-700 text-white shadow-lg shadow-red-500/30' : 'bg-gold-500 hover:bg-gold-400 border-gold-600 text-slate-900 shadow-lg shadow-gold-500/30'}`}
                >
                    {isSessionActive ? <StopCircleIcon className="h-7 w-7"/> : <MicIcon className="h-7 w-7"/>}
                    {isSessionActive ? 'End Conversation' : 'Start Conversation'}
                </button>
            </div>
        </div>
    );
};

export default JewelAiAdviser;