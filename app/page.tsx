import { Text } from '@/components/ui/text';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Text asChild size="lg">
        <h1 className="font-bold text-3xl">Trade</h1>
      </Text>
      <Text className="mt-2 text-muted-foreground">
        Trading interface coming soon.
      </Text>
    </div>
  );
}
