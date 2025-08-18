import { Stat, StatLabel, StatValue } from '@/components/ui/stat';

export function AssetStats() {
  return (
    <div className="flex shrink-0 items-center gap-8">
      <Stat>
        <StatLabel>Mark</StatLabel>
        <StatValue>43.970</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Oracle</StatLabel>
        <StatValue>43.941</StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Change</StatLabel>
        <StatValue className="text-error">-2.741 / -5.87%</StatValue>
      </Stat>
      <Stat>
        <StatLabel>24h Volume</StatLabel>
        <StatValue>$443,448,410.05</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Open Interest</StatLabel>
        <StatValue>$1,187,822,889.80</StatValue>
      </Stat>
      <Stat>
        <StatLabel>Funding / Countdown</StatLabel>
        <StatValue>0.0013% 00:13:10</StatValue>
      </Stat>
    </div>
  );
}
