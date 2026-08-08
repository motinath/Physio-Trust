import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function SkeletonLoader({ className = '', height = '1.25rem', width = '100%' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/60 rounded ${className}`}
      style={{ height, width }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="panel p-4 flex flex-col gap-3">
      <SkeletonLoader height="1.5rem" width="40%" />
      <SkeletonLoader height="3rem" width="100%" />
      <SkeletonLoader height="1rem" width="70%" />
    </div>
  );
}
