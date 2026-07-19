import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-medium tracking-wide text-accent uppercase">
        Coming soon
      </p>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Thanos E-Shop
      </h1>
      <p className="max-w-md text-muted-foreground">
        Premium game top-ups, gift cards, and digital products — built for
        Bangladeshi gamers.
      </p>
      <Button size="lg">Browse Products</Button>
    </div>
  );
}
