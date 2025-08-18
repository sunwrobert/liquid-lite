'use client';

import type React from 'react';
import {
  type UseChangeAnimationOptions,
  useChangeAnimation,
} from '@/hooks/use-change-animation';
import { Text } from './text';

export type ChangeAnimationProps = UseChangeAnimationOptions & {
  children: React.ReactNode;
  className?: string;
};

export function ChangeAnimation({
  children,
  className,
  ...rest
}: ChangeAnimationProps) {
  const { animationClassName, rerenderKey } = useChangeAnimation({ ...rest });
  return (
    <Text
      className={`${animationClassName} ${className || ''}`.trim()}
      key={rerenderKey}
    >
      {children}
    </Text>
  );
}
