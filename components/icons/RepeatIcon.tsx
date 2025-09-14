import React from 'react';

// FIX: Explicitly define props to include `title` and render it as an SVG <title> element.
// This improves accessibility and resolves the TypeScript error in TaskItem.tsx.
interface RepeatIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const RepeatIcon: React.FC<RepeatIconProps> = ({ title, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
    >
    {title && <title>{title}</title>}
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

export default RepeatIcon;
