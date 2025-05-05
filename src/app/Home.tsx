import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import AppTopNav from "@/components/app-top-nav";
import EntryListItem from "@/components/EntryListItem";

const demoEntries = Array.from({ length: 25 }, (_, i) => ({
  id: `id-${i}`,
  userId: "uid",
  username: "skipparoo",
  text: `Demo entry #${i} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  timestamp: new Date(Date.now() - i * 86_400_000).toISOString(),
  lastUpdated: new Date().toISOString(),
  locations: [
    {
      latitude: 47.5998,
      longitude: -122.3434,
      displayName: "Seattle, WA",
    },
  ],
  tags: [{ key: "Seattle" }],
  images: [],
}));

const Home: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppTopNav />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full flex flex-col px-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader>
              <CardTitle className="text-2xl">Your Journal</CardTitle>
              <CardDescription>
                {demoEntries.length} total entries
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
              {demoEntries.map((e) => (
                <EntryListItem key={e.id} entry={e} query="" />
              ))}
            </CardContent>

            <CardFooter className="justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>10</PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>

        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6 text-foreground" />
          <span className="sr-only">New entry</span>
        </Button>
      </main>
    </div>
  );
};

export default Home;
