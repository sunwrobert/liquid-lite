'use client';

import { Text } from '@/components/ui/text';
import { useTime } from '@/hooks/use-time';

type CountdownProps = {
  target: Date;
  className?: string;
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
const MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
const PADDING_LENGTH = 2;
const PADDING_CHAR = '0';

export function Countdown({ target, className }: CountdownProps) {
  const now = useTime();

  const msLeft = target.getTime() - now.getTime();

  if (msLeft <= 0) {
    return <span className={className}>00:00:00</span>;
  }

  const hours = Math.floor(msLeft / MS_PER_HOUR);
  const minutes = Math.floor((msLeft % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((msLeft % MS_PER_MINUTE) / MS_PER_SECOND);

  const timeLeft = `${hours.toString().padStart(PADDING_LENGTH, PADDING_CHAR)}:${minutes.toString().padStart(PADDING_LENGTH, PADDING_CHAR)}:${seconds.toString().padStart(PADDING_LENGTH, PADDING_CHAR)}`;

  return <Text className={className}>{timeLeft}</Text>;
}
