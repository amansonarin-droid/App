import React, { useState, useMemo } from 'react';
import { useCurrency } from './CurrencyContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import CalculatorInputSlider from '../CalculatorInputSlider';

const EMICalculator: React.FC = () => {
    const { currencySymbol } = useCurrency();
    const [principal, setPrincipal] = useState('100000');
    const [rate, setRate] = useState('1.5');
    const [tenure, setTenure] = useState('60');

    const { result, chartData } = useMemo(() => {
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const n = parseFloat(tenure);

        if (p > 0 && r > 0 && n > 0) {
            const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayable = emi * n;
            const totalInterest = totalPayable - p;
            return {
                result: {
                    emi: emi.toFixed(2),
                    totalInterest: totalInterest.toFixed(2),
                    totalPayable: totalPayable.toFixed(2),
                },
                chartData: [
                    { name: 'Principal', value: p },
                    { name: 'Total Interest', value: totalInterest },
                ]
            };
        }
        return { result: null, chartData: [] };
    }, [principal, rate, tenure]);

    const COLORS = ['#a16207', '#fde047'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg">
                <CalculatorInputSlider id="principal" label="Loan Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} min={1000} max={5000000} step={1000} unit={currencySymbol} />
                <CalculatorInputSlider id="rate" label="Monthly Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} min={0.5} max={5} step={0.01} unit="%" />
                <CalculatorInputSlider id="tenure" label="Loan Tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} min={6} max={360} step={1} unit="Months" />
            </div>
            <div className="space-y-4">
                {result ? (
                    <>
                        <div className="text-center p-6 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                            <span className="text-slate-500 dark:text-slate-400">Monthly EMI</span>
                            <p className="text-4xl lg:text-5xl font-bold text-gold-500 dark:text-gold-400">{currencySymbol} {parseFloat(result.emi).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full sm:w-1/2 h-48">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#8884d8" paddingAngle={5} labelLine={false}>
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                             <div className="w-full sm:w-1/2 text-sm space-y-2 p-3 rounded-lg">
                                 <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#a16207]"></div>Principal Amount:</span>
                                    <span className="font-medium">{currencySymbol} {parseFloat(principal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fde047]"></div>Total Interest:</span>
                                    <span className="font-medium">{currencySymbol} {parseFloat(result.totalInterest).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold border-t border-slate-300 dark:border-slate-600 mt-2 pt-2">
                                    <span>Total Payment:</span>
                                    <span>{currencySymbol} {parseFloat(result.totalPayable).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : <div className="text-center p-8 text-slate-500">Adjust values to see calculation.</div>}
            </div>
        </div>
    );
};

export default EMICalculator;