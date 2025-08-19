'use client';

import type React from 'react';
import { Text } from '@/components/ui/text';
import {
  type UseChangeAnimationOptions,
  useChangeAnimation,
} from '@/hooks/use-change-animation';
import { cn } from '@/lib/utils';

type ChangeAnimationProps = UseChangeAnimationOptions & {
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
    <Text className={cn(animationClassName, className)} key={rerenderKey}>
      {children}
    </Text>
  );
}
