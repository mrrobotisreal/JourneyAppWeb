import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Tag } from "lucide-react";

export interface Entry {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  lastUpdated: string;
  locations: { displayName?: string }[];
  tags: { key: string; value?: string }[];
  images: string[];
}

interface Props {
  entry: Entry;
  query: string;
}

/* ------------------------- util date helpers ------------------------ */
const weekday = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: "short" });
const fulldate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
const timeStr = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

/* ------------------------- highlight helper ------------------------- */
const highlight = (text: string, query: string) => {
  if (!query) return text;
  const re = new RegExp(`(${query})`, "gi");
  return text.split(re).map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-300 dark:bg-yellow-600">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

/* ------------------- resilient async image thumbnail --------------- */
const ResilientImage: React.FC<{ url: string }> = ({ url }) => {
  const [state, setState] = useState<"idle" | "loading" | "error" | "ok">(
    "loading"
  );

  return (
    <>
      {state === "loading" && <Skeleton className="h-28 w-28 rounded" />}
      <img
        src={url}
        alt=""
        className="h-32 w-32 rounded object-cover shadow"
        onLoad={() => setState("ok")}
        onError={() => setState("error")}
        style={{ display: state === "ok" ? "block" : "none" }}
      />
      {state === "error" && (
        <div className="h-32 w-32 rounded bg-gray-400 grid place-items-center text-sm text-white">
          Err
        </div>
      )}
    </>
  );
};

/* --------------------------- component ------------------------------ */
const EntryListItem: React.FC<Props> = ({ entry, query }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImgs, setLoadingImgs] = useState(false);

  /* fake presigned-URL fetch */
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!entry.images.length) return;
      setLoadingImgs(true);
      const urls = entry.images.map(
        (key) =>
          `https://winapps-myjourney.s3.us-west-2.amazonaws.com/images/${encodeURIComponent(
            key
          )}?signed=fake`
      );
      await new Promise((r) => setTimeout(r, 400)); // mock latency
      // eslint-disable-next-line
      mounted && setImageUrls(urls);
      setLoadingImgs(false);
    })();
    return () => {
      mounted = false;
    };
  }, [entry.images]);

  const firstImages = imageUrls.slice(0, 3);

  return (
    <Card className="bg-blue-semi-light dark:bg-blue-semi-dark text-white shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span>{weekday(entry.timestamp)}</span>
          <span>{fulldate(entry.timestamp)}</span>
          <span>{timeStr(entry.timestamp)}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {entry.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {loadingImgs && <Skeleton className="h-32 w-32 rounded" />}
            {firstImages.map((u) => (
              <ResilientImage key={u} url={u} />
            ))}
            {entry.images.length > 3 && (
              <div className="h-32 w-20 grid place-items-center font-semibold bg-blue-700/60 rounded">
                +{entry.images.length - 3}
              </div>
            )}
          </div>
        )}

        <p className="line-clamp-3 text-sm leading-5">
          {highlight(entry.text, query)}
        </p>

        <div className="flex justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {entry.locations.slice(0, 3).map((l, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {l.displayName ?? "Unknown"}
              </Badge>
            ))}
            {entry.locations.length > 3 && (
              <Badge variant="secondary">
                +{entry.locations.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {entry.tags.slice(0, 3).map((t, i) => (
              <Badge key={i} variant="outline" className="gap-1 bg-white/20">
                <Tag className="h-3 w-3" />
                {t.key}
                {t.value && <span className="opacity-70">({t.value})</span>}
              </Badge>
            ))}
            {entry.tags.length > 3 && (
              <Badge variant="outline" className="bg-white/20">
                +{entry.tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntryListItem;
