import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* A simple logo: a rounded square with the letter H */}
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            H
          </div>
          <CardTitle className="text-3xl">Harate</CardTitle>
          <CardDescription>
            Your World, Your Conversations. Talk freely, connect privately.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          Frontend foundation is ready. Login and registration come next.
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button className="flex-1">Log in</Button>
          <Button variant="outline" className="flex-1">
            Create account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}