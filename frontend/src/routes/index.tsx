import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: health, isError } = useQuery({
    queryKey: ["api-health"],
    queryFn: () => api<{ status: string }>("/api/health"),
    retry: 1,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-12 py-6">
      <section className="space-y-4 text-center">
        <div className="mx-auto flex flex-col items-center gap-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <Badge
            variant={isError ? "destructive" : health ? "secondary" : "outline"}
            className="text-xs font-normal"
          >
            {isError ? "API offline" : health ? "API connected" : "Checking API…"}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {isAuthenticated
            ? `Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`
            : "Lost & found for your campus"}
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Post what you lost or found, add a photo, and help the campus reunite people with their stuff.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {isAuthenticated ? (
            <Button asChild size="lg">
              <Link to="/items">Browse lost & found</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link to="/register">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/items">Browse lost & found</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-lg">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-foreground">
              <Search className="h-5 w-5" />
            </div>
            <CardTitle>Lost & Found</CardTitle>
            <CardDescription>
              Search listings, post an item, and mark things claimed when they are reunited.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" size="sm">
              <Link to="/items">Open lost & found →</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
