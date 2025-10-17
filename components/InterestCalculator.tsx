import React, { useState, useMemo } from 'react';
import { useCurrency } from './CurrencyContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import CalculatorInputSlider from '../CalculatorInputSlider';

const InterestCalculator: React.FC<{ type: 'compound' | 'simple' }> = ({ type }) => {
    const { currencySymbol } = useCurrency();
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('1');
    const [tenure, setTenure] = useState('60');

    const { result, chartData } = useMemo(() => {
        const P = parseFloat(principal);
        const r_monthly = parseFloat(rate) / 100;
        const t_months = parseFloat(tenure);
        
        if (P > 0 && r_monthly >= 0 && t_months > 0) {
            let amount = 0;
            if (type === 'compound') {
                amount = P * Math.pow(1 + r_monthly, t_months);
            } else { // Simple interest
                amount = P * (1 + r_monthly * t_months);
            }
            const totalInterest = amount - P;
            return {
                result: {
                    totalAmount: amount.toFixed(2),
                    totalInterest: totalInterest.toFixed(2),
                },
                chartData: [
                    { name: 'Principal', value: P },
                    { name: 'Total Interest', value: totalInterest },
                ]
            };
        }
        return { result: null, chartData: [] };
    }, [principal, rate, tenure, type]);
    
    const COLORS = ['#ca8a04', '#fef08a'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg">
                <CalculatorInputSlider id={`${type}-principal`} label="Principal Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} min={1000} max={1000000} step={1000} unit={currencySymbol} />
                <CalculatorInputSlider id={`${type}-rate`} label="Monthly Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} min={0} max={5} step={0.01} unit="%" />
                <CalculatorInputSlider id={`${type}-tenure`} label="Time Period" value={tenure} onChange={(e) => setTenure(e.target.value)} min={1} max={360} step={1} unit="Months" />
            </div>
            <div className="space-y-4">
                {result ? (
                    <>
                        <div className="text-center p-6 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                            <span className="text-slate-500 dark:text-slate-400">Maturity Value</span>
                            <p className="text-4xl lg:text-5xl font-bold text-gold-500 dark:text-gold-400">{currencySymbol} {parseFloat(result.totalAmount).toLocaleString('en-IN')}</p>
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
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ca8a04]"></div>Principal Amount:</span>
                                    <span className="font-medium">{currencySymbol} {parseFloat(principal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fef08a]"></div>Total Interest:</span>
                                    <span className="font-medium">{currencySymbol} {parseFloat(result.totalInterest).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : <div className="text-center p-8 text-slate-500">Adjust values to see calculation.</div>}
            </div>
        </div>
    );
};

export default InterestCalculator;