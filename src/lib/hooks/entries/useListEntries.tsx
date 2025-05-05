import { useInfiniteQuery } from "@tanstack/react-query";

export interface LocationData {
  latitude: number;
  longitude: number;
  displayName?: string;
}

export interface TagData {
  key: string;
  value?: string;
}

export interface Entry {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  lastUpdated: string;
  locations: LocationData[];
  tags: TagData[];
  images: string[];
}

interface UseListEntriesProps {
  username: string;
  limit: number;
  page: number;
  sessionOption: string;
}

interface UseListEntriesResults {
  entries: Entry[];
}

// TODO: implement async fetch func here

// TODO: finish inner logic
function useListEntries({
  username,
  limit = 25,
  page = 1,
  sessionOption = "always",
}: UseListEntriesProps): UseListEntriesResults {
  console.log(username, limit, page, sessionOption); // temporary, just don't want to look at the red lines

  const {
    data,
    // isFetchingNextPage,
    // fetchNextPage,
    // hasNextPage,
    // isFetching,
    // isLoading,
  } = useInfiniteQuery({
    queryKey: [username, page],
    queryFn: () => {},
    getNextPageParam: () => {},
    initialPageParam: void 0,
  });

  console.log(data); // temporary, just don't want to look at the red lines

  return {
    entries: [],
  };
}

export default useListEntries;
