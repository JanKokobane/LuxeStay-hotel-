import React from 'react';
import styles from './Text.module.css';

interface TextProps {
  variant: 'h1' | 'h2'| 'h3' | 'p';
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ variant, children, className = '' }: TextProps) => {
  const Component = variant;
  return <Component className={`${styles[variant]} ${className}`}>{children}</Component>;
};
