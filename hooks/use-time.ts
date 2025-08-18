import { useQuery } from '@tanstack/react-query';

export function useTime() {
  const { data } = useQuery({
    queryKey: ['time'],
    queryFn: () => new Date(),
    refetchInterval: 1000, // Refetch every 1 second
    initialData: new Date(),
  });

  return data;
}
