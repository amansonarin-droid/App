import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GemIcon, ShareIcon, XIcon, UploadCloudIcon } from './icons';
import { generateJewelryImage, getEstimatedWeight, getMakingCharge } from '../services/geminiService';
import { useCurrency } from './CurrencyContext';

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 gap-3">
            <div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
             <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-3"></div>
             <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg space-y-3">
                <div className="flex justify-between"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div></div>
                <div className="flex justify-between"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div></div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 mt-2"><div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div><div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/3"></div></div>
            </div>
        </div>
    </div>
);


const AiDesigner: React.FC = () => {
    const goldRate24k = 72850; // Per 10g
    const { currencySymbol } = useCurrency();

    const [prompt, setPrompt] = useState('');
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<{data: string, mimeType: string}[]>([]);
    const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [estimatedWeight, setEstimatedWeight] = useState<number | null>(null);
    const [makingCharge, setMakingCharge] = useState<number | null>(null);
    const [isEstimating, setIsEstimating] = useState(false);
    const [estimationError, setEstimationError] = useState<string | null>(null);

    const [selectedKarat, setSelectedKarat] = useState<'22k' | '18k' | '9k' | 'custom' | null>(null);
    const [customPurity, setCustomPurity] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetGeneratorState = () => {
        setGeneratedImages([]);
        setSelectedImage(null);
        setError(null);
        resetCalculator();
    };
    
    const resetCalculator = () => {
        setSelectedKarat(null);
        setCustomPurity('');
        setEstimatedWeight(null);
        setMakingCharge(null);
        setIsEstimating(false);
        setEstimationError(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setReferenceImage(base64String);
                resetGeneratorState();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !referenceImage) {
            setError('Please enter a description or upload an image.');
            return;
        }
        setIsLoading(true);
        resetGeneratorState();

        try {
            const images = await generateJewelryImage(prompt, referenceImage);
            if (images.length > 0) {
                setGeneratedImages(images);
                setSelectedImage(images[0]);
            } else {
                setError("Sorry, I couldn't generate any designs. Please try a different prompt.");
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const estimate = async () => {
            if (!selectedImage || !selectedKarat) return;
            
            const isCustomValid = selectedKarat === 'custom' && customPurity && parseFloat(customPurity) > 0 && parseFloat(customPurity) <= 100;
            if (selectedKarat === 'custom' && !isCustomValid) {
                 setEstimatedWeight(null);
                 setMakingCharge(null);
                 return;
            }

            setIsEstimating(true);
            setEstimatedWeight(null);
            setMakingCharge(null);
            setEstimationError(null);
            
            try {
                const customPurityValue = isCustomValid ? parseFloat(customPurity) : undefined;

                const [weight, charge] = await Promise.all([
                    getEstimatedWeight(selectedImage, selectedKarat, customPurityValue),
                    getMakingCharge(selectedImage, selectedKarat, customPurityValue)
                ]);
                setEstimatedWeight(weight);
                setMakingCharge(charge);

                if (weight === null || charge === null) {
                    setEstimationError('Failed to get estimates. The design might be too complex.');
                }

            } catch (e) {
                console.error("Error during estimation", e);
                setEstimationError('Failed to get estimates. Please try again.');
            } finally {
                setIsEstimating(false);
            }
        };
        estimate();
    }, [selectedImage, selectedKarat, customPurity]);


    const handleShare = async () => {
        if (!selectedImage) return;
        const blob = await (await fetch(`data:${selectedImage.mimeType};base64,${selectedImage.data}`)).blob()
        if (navigator.share) {
            try {
                const file = new File([blob], 'design.png', { type: 'image/png' });
                await navigator.share({
                    title: 'AI Jewelry Design',
                    text: 'Check out this design from FinGold!',
                    files: [file],
                });
            } catch (error) { console.error('Error sharing:', error); }
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'fingold-design.png';
            link.click();
        }
    };
    
    const purityPercentage = useMemo(() => {
        if (selectedKarat === 'custom') {
            const val = parseFloat(customPurity);
            return (val > 0 && val <= 100) ? val : 0;
        }
        if (selectedKarat === '22k') return 91.6;
        if (selectedKarat === '18k') return 75.0;
        if (selectedKarat === '9k') return 37.5;
        return 0;
    }, [selectedKarat, customPurity]);

    const priceCalculation = useMemo(() => {
        const weight = estimatedWeight;
        const chargePercent = makingCharge;
        const purity = purityPercentage;
        if (!weight || !chargePercent || !purity) return null;

        const goldRatePerGram = goldRate24k / 10;
        const basePrice = weight * goldRatePerGram * (purity / 100);
        const makingChargeAmount = basePrice * (chargePercent / 100);
        const totalPrice = basePrice + makingChargeAmount;

        return {
            basePrice: basePrice.toFixed(2),
            makingChargeAmount: makingChargeAmount.toFixed(2),
            totalPrice: totalPrice.toFixed(2)
        };
    }, [estimatedWeight, makingCharge, purityPercentage, goldRate24k]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Jewelry Design Studio</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Bring your ideas to life. Describe your desired jewelry or upload a reference image to generate unique designs.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Generator & Estimator */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700/50">
                        <h2 className="text-xl font-semibold mb-4">1. Create Your Design</h2>
                        <div className="space-y-4">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A 22k gold necklace with a peacock pendant and ruby inlays..."
                                className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
                                rows={3}
                            />
                            <div 
                                onClick={() => fileInputRef.current?.click()} 
                                className="relative w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-center"
                            >
                                {referenceImage ? (
                                    <div className="flex items-center gap-4">
                                        <img src={`data:image/jpeg;base64,${referenceImage}`} alt="Reference" className="w-16 h-16 rounded-md object-cover"/>
                                        <p className="font-semibold">Reference image selected. Click to change.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <UploadCloudIcon className="h-8 w-8 text-slate-400"/>
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">Upload Reference Image</span>
                                        <span className="text-xs text-slate-500">Optional, but helps guide the AI</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full bg-gold-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gold-600 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Generating...
                                    </>
                                ) : "Generate Design"}
                            </button>
                        </div>
                    </div>
                    {selectedImage && (
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50">
                             <h3 className="text-xl font-semibold mb-4">2. Price Estimator</h3>
                             <div className="flex flex-wrap gap-2 mb-4">
                                {(['22k', '18k', '9k', 'custom'] as const).map(k => (
                                    <button key={k} onClick={() => setSelectedKarat(k)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${selectedKarat === k ? 'bg-gold-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
                                ))}
                            </div>
                            {selectedKarat === 'custom' && (
                                <input type="number" placeholder="Enter purity % (e.g., 85)" value={customPurity} onChange={e => setCustomPurity(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md mb-4"/>
                            )}
                            {selectedKarat && (
                                isEstimating ? (
                                    <SkeletonLoader />
                                ) : estimationError ? (
                                    <div className="text-center p-4 text-red-500">{estimationError}</div>
                                ) : (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">AI-Powered Estimates</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-slate-500 dark:text-slate-400">Est. Weight (grams)</label>
                                                <input type="number" value={estimatedWeight ?? ''} onChange={e => setEstimatedWeight(parseFloat(e.target.value) || null)} className="w-full p-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 dark:text-slate-400">Making Charge (%)</label>
                                                <input type="number" value={makingCharge ?? ''} onChange={e => setMakingCharge(parseFloat(e.target.value) || null)} className="w-full p-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/>
                                            </div>
                                        </div>
                                        {priceCalculation && (
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Cost Breakdown</h4>
                                                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400">Base Price:</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">{currencySymbol}{parseFloat(priceCalculation.basePrice).toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400">Making Charges:</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">+ {currencySymbol}{parseFloat(priceCalculation.makingChargeAmount).toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                                        <span className="text-slate-800 dark:text-slate-200">Total Est. Price:</span>
                                                        <span className="text-gold-600 dark:text-gold-400">{currencySymbol}{parseFloat(priceCalculation.totalPrice).toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700/50 sticky top-6">
                    <h2 className="text-xl font-semibold mb-4">Results</h2>
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 text-white rounded-lg">
                                <GemIcon className="h-16 w-16 text-gold-400 animate-pulse" />
                                <p className="font-semibold text-lg">Our AI is crafting your designs...</p>
                                <p className="text-sm text-white/70">This may take a moment.</p>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm my-4 text-center">{error}</p>}
                        {generatedImages.length > 0 ? (
                            <div className="space-y-4">
                                <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden cursor-pointer group" onClick={() => setFullScreenImage(selectedImage?.data ?? null)}>
                                    {selectedImage && <img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} alt="Selected jewelry design" className="w-full h-full object-contain" />}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to enlarge</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {generatedImages.map((image, index) => (
                                        <div key={index} className={`aspect-square rounded-md overflow-hidden cursor-pointer ring-2 ring-offset-2 dark:ring-offset-slate-800 transition-all hover:scale-105 ${selectedImage?.data === image.data ? 'ring-gold-500' : 'ring-transparent'}`} onClick={() => { setSelectedImage(image); resetCalculator(); }}>
                                            <img src={`data:${image.mimeType};base64,${image.data}`} alt={`Design ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold transition-colors">
                                    <ShareIcon className="h-5 w-5"/> Share / Download
                                </button>
                            </div>
                        ) : (
                             <div className="aspect-square flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700">
                                <GemIcon className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-2"/>
                                <p className="font-semibold text-slate-600 dark:text-slate-400">Your creations will appear here.</p>
                                <p className="text-sm text-slate-500 dark:text-slate-500">Describe your idea and click "Generate"</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>

             {fullScreenImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
                    <div className="relative max-w-full max-h-full">
                         <img src={`data:image/jpeg;base64,${fullScreenImage}`} alt="Full screen design" className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"/>
                         <button onClick={() => setFullScreenImage(null)} className="absolute -top-2 -right-2 text-white bg-slate-800 rounded-full p-1 shadow-lg"><XIcon className="h-6 w-6" /></button>
                    </div>
                </div>
            )}
        </div>
    );
  };
  
  export default AiDesigner;