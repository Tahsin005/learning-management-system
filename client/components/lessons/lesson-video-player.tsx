"use client";

interface LessonVideoPlayerProps {
  videoUrl?: string | null;
  lessonTitle?: string;
}

function getEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("watch?v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export function LessonVideoPlayer({
  videoUrl,
  lessonTitle,
}: LessonVideoPlayerProps) {
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex h-64 sm:h-96 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 text-xs text-muted-foreground">
        No video stream provided for this module.
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-black shadow-lg">
      <iframe
        src={embedUrl}
        title={lessonTitle || "Lesson Video Stream"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
