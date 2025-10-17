import React from 'react';
import { UserIcon, UsersIcon, LockIcon } from './icons';

interface RoleSelectionProps {
    onSelectRole: (role: 'customer' | 'service_provider' | 'admin') => void;
}

const RoleCard: React.FC<{ title: string, description: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, onClick: () => void }> = ({ title, description, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-6 bg-slate-800 rounded-xl shadow-lg hover:shadow-gold-500/20 hover:-translate-y-2 transform transition-all duration-300 border border-slate-700 hover:border-gold-500 group"
    >
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gold-500/10 mb-4 border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors">
            <Icon className="h-8 w-8 text-gold-400 group-hover:text-gold-300 transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
    </button>
);


const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-slate-900 text-slate-200">
            <div className="text-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100">Welcome to FinGold</h1>
                <p className="mt-4 text-lg text-slate-400">Please select your role to continue.</p>
            </div>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <RoleCard
                        title="Customer"
                        description="Access your loan details and make new enquiries."
                        icon={UserIcon}
                        onClick={() => onSelectRole('customer')}
                    />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <RoleCard
                        title="Service Provider"
                        description="Manage customer accounts, loans, and billing."
                        icon={UsersIcon}
                        onClick={() => onSelectRole('service_provider')}
                    />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                    <RoleCard
                        title="Admin"
                        description="Full access to all features and administrative tools."
                        icon={LockIcon}
                        onClick={() => onSelectRole('admin')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;