import React from 'react';

// Generic Icon Props
type IconProps = React.SVGProps<SVGSVGElement>;

export const DashboardIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);
export const CalculatorIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><line x1="16" x2="12" y1="14" y2="14" /><line x1="12" x2="12" y1="14" y2="18" /><line x1="8" x2="8" y1="10" y2="18" />
  </svg>
);
export const BookIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);
export const BillIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
export const GemIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9Z" /><path d="m12 22 4-13-3-6" /><path d="M12 22 8 9l3-6" />
  </svg>
);
export const LoanIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 8-4 4 4 4" /><path d="M16 8v8" /><path d="M21 12H8" /><path d="M3 4v16" />
  </svg>
);
export const MenuIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
export const SettingsIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
export const HelpIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
  </svg>
);
export const UserIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
export const ShareIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);
export const IdCardIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="M6 12h4m-4-4h2m6 8h4m-4-4h4" />
  </svg>
);
export const AlertTriangleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);
export const GetLoanIcon3D: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><filter id="shadow-1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" in="SourceAlpha" result="shadowBlur"/><feOffset dy="4" in="shadowBlur" result="shadowOffset"/><feMerge><feMergeNode in="shadowOffset"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style={{stopColor: '#fef9c3'}}/><stop offset="100%" style={{stopColor: '#fde047'}}/></radialGradient><linearGradient id="grad-2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#d97706'}}/><stop offset="100%" style={{stopColor: '#92400e'}}/></linearGradient></defs><g filter="url(#shadow-1)"><circle cx="60" cy="60" r="50" fill="url(#grad-1)"/><g transform="translate(30 30) scale(0.6)"><path d="M68.7,42.2c-15.1,0-27.4,12.3-27.4,27.4c0,5.4,1.6,10.5,4.3,14.8l-8,8c-2.3,2.3-2.3,6.1,0,8.5c2.3,2.3,6.1,2.3,8.5,0l8-8c4.3,2.7,9.4,4.3,14.8,4.3c15.1,0,27.4-12.3,27.4-27.4C96,54.5,83.7,42.2,68.7,42.2z M68.7,90c-11.2,0-20.4-9.2-20.4-20.4c0-11.2,9.2-20.4,20.4-20.4s20.4,9.2,20.4,20.4C89,80.8,79.9,90,68.7,90z" fill="#a16207"/><path d="M68.7,56.2c-7.4,0-13.4,6-13.4,13.4s6,13.4,13.4,13.4s13.4-6,13.4-13.4S76,56.2,68.7,56.2z" fill="#a16207"/><path d="M35,66.2H13.8c-2.2,0-4-1.8-4-4V20.8c0-2.2,1.8-4,4-4H53c2.2,0,4,1.8,4,4v8.2h-7V23.8H16.8v35.4H35V66.2z" fill="#ca8a04"/></g></g></svg>
);
export const SaveInGoldIcon3D: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><filter id="shadow-2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" in="SourceAlpha" result="shadowBlur"/><feOffset dy="4" in="shadowBlur" result="shadowOffset"/><feMerge><feMergeNode in="shadowOffset"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="grad-3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style={{stopColor: '#fef08a'}}/><stop offset="100%" style={{stopColor: '#eab308'}}/></radialGradient><linearGradient id="grad-4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#854d0e'}}/><stop offset="100%" style={{stopColor: '#422006'}}/></linearGradient></defs><g filter="url(#shadow-2)"><rect x="10" y="30" width="100" height="60" rx="10" fill="url(#grad-3)"/><rect x="15" y="35" width="90" height="50" rx="5" fill="none" stroke="url(#grad-4)" strokeWidth="3"/><path d="M25 45 H 95 M 25 55 H 95 M 25 65 H 75 M 25 75 H 65" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/><circle cx="85" cy="70" r="10" fill="#facc15" stroke="#854d0e" strokeWidth="2"/><path d="M82,70 l3,3 l6,-6" stroke="#854d0e" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
);
export const JewelAiIcon3D: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="faceGlow" cx="50%" cy="45%" r="50%" fx="50%" fy="40%">
                <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.3"/>
            </radialGradient>
            <linearGradient id="hairShine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#583C0A"/>
                <stop offset="50%" stopColor="#D8A953"/>
                <stop offset="100%" stopColor="#583C0A"/>
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        <g>
            {/* <!-- Body/Bust --> */}
            <path d="M 60 190 Q 100 120 140 190 Z" fill="#422006"/>
            <path d="M 70 190 Q 100 130 130 190 Z" fill="#854d0e"/>

            {/* <!-- Neck --> */}
            <rect x="90" y="105" width="20" height="20" fill="#FDE047"/>
            <rect x="92" y="105" width="16" height="20" fill="#FEF3C7"/>

            {/* <!-- Face --> */}
            <circle cx="100" cy="80" r="50" fill="url(#faceGlow)"/>
            <path d="M50 80 Q 100 140 150 80 Q 100 120 50 80" fill="#FEF9C3"/>
            
            {/* <!-- Hair --> */}
            <path d="M 50 40 Q 100 -20 150 40 Q 170 90 150 110 L 140 100 Q 100 130 60 100 L 50 110 Q 30 90 50 40" fill="#422006"/>
            <path d="M 60 40 Q 100 -10 140 40 Q 150 80 140 95 L 130 90 Q 100 115 70 90 L 60 95 Q 50 80 60 40" fill="#713f12"/>
            <path d="M 80 20 Q 100 10 120 20 L 100 40 Z" fill="url(#hairShine)"/>
            
            {/* <!-- Eyes --> */}
            <ellipse cx="80" cy="80" rx="10" ry="8" fill="#FFF"/>
            <ellipse cx="120" cy="80" rx="10" ry="8" fill="#FFF"/>
            <circle cx="82" cy="80" r="5" fill="#a16207"/>
            <circle cx="118" cy="80" r="5" fill="#a16207"/>
            <circle cx="83" cy="79" r="2" fill="#FFF" fillOpacity="0.8"/>
            <circle cx="117" cy="79" r="2" fill="#FFF" fillOpacity="0.8"/>

            {/* <!-- Mouth --> */}
            <path d="M 95 100 Q 100 105 105 100" stroke="#854d0e" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* <!-- Gold Ornament --> */}
            <circle cx="100" cy="140" r="15" fill="#fde047" stroke="#854d0e" strokeWidth="2"/>
            <circle cx="100" cy="140" r="8" fill="#facc15"/>
            <circle cx="100" cy="140" r="3" fill="#eab308"/>
        </g>
    </svg>
);
export const PlusIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);
export const MicIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);
export const StopCircleIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <rect x="9" y="9" width="6" height="6"></rect>
    </svg>
);
export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
export const XIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);
export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
  </svg>
);
export const UsersIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const ArrowDownLeftIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 7 7 17" /><path d="M17 17H7V7" />
  </svg>
);
export const ArrowUpRightIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17h10V7" /><path d="M7 7 17 17" />
  </svg>
);
export const DownloadIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);
export const PrintIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x="6" y="14" width="12" height="8" rx="1" />
  </svg>
);
export const PaperclipIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
export const UploadCloudIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
    </svg>
);
export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
export const SendIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
export const WalletIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4Z" /><path d="M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><circle cx="16" cy="14" r="2" />
  </svg>
);
export const BellIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
export const BoxIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
);
export const CameraIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
    </svg>
);
export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
  </svg>
);
export const LockIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
export const AiChipIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);
export const ChatIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);