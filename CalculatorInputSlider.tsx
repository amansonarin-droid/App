import React from 'react';

const CalculatorInputSlider: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    min: number;
    max: number;
    step: number;
    unit?: string;
}> = ({ id, label, value, onChange, min, max, step, unit }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg">
                {unit && <span className="text-sm font-bold pl-3 text-slate-500 dark:text-slate-400">{unit}</span>}
                <input
                    type="number"
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-32 p-2 bg-transparent text-right font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-lg"
                    min={min}
                    max={max}
                />
            </div>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gold-500"
        />
    </div>
);

export default CalculatorInputSlider;
