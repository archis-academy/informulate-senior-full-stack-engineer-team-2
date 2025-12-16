import { useState, useRef, useCallback, type JSX } from "react";
import styles from "./video-player.module.scss";

type VideoSourceType = "self-hosted" | "youtube" | "vimeo";

interface VideoSource {
  src: string;
  type: string;
}

interface CaptionTrack {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

interface VideoPlayerProps {
  src: string;
  sourceType?: VideoSourceType;
  sources?: VideoSource[];
  poster?: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "21:9" | "1:1";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  allowFullScreen?: boolean;
  captions?: CaptionTrack[];
  fallbackMessage?: string;
  fallbackImage?: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function getVimeoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /^(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function detectSourceType(src: string): VideoSourceType {
  if (!src) return "self-hosted";

  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    return "youtube";
  }
  if (src.includes("vimeo.com")) {
    return "vimeo";
  }
  return "self-hosted";
}

export default function VideoPlayer({
  src,
  sourceType,
  sources,
  poster,
  title = "Video player",
  aspectRatio = "16:9",
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  allowFullScreen = true,
  captions = [],
  fallbackMessage = "Sorry, your browser doesn't support embedded videos.",
  fallbackImage,
  className = "",
  onPlay,
  onPause,
  onEnded,
  onError,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const detectedSourceType: VideoSourceType =
    sourceType || detectSourceType(src);

  const aspectRatioClasses: Record<VideoPlayerProps["aspectRatio"], string> = {
    "16:9": styles.aspectRatio16x9,
    "4:3": styles.aspectRatio4x3,
    "21:9": styles.aspectRatio21x9,
    "1:1": styles.aspectRatio1x1,
  };

  const aspectRatioClass = aspectRatioClasses[aspectRatio] || "";

  const handleLoadedData = useCallback((): void => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback((): void => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const handlePlay = useCallback((): void => {
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback((): void => {
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback((): void => {
    onEnded?.();
  }, [onEnded]);

  const handleIframeLoad = useCallback((): void => {
    setIsLoading(false);
  }, []);

  const renderFallback = (): JSX.Element => (
    <div className={styles.fallbackContainer}>
      {fallbackImage ? (
        <img
          src={fallbackImage}
          alt="Video unavailable"
          className={styles.fallbackImage}
        />
      ) : (
        <div className={styles.fallbackContent}>
          <svg
            className={styles.fallbackIcon}
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          <p className={styles.fallbackMessage}>{fallbackMessage}</p>
        </div>
      )}
    </div>
  );

  const renderLoading = (): JSX.Element => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} aria-label="Loading video">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    </div>
  );

  const renderSelfHostedVideo = (): JSX.Element => (
    <video
      ref={videoRef}
      className={styles.video}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted || autoPlay}
      loop={loop}
      controls={controls}
      playsInline
      preload="metadata"
      onLoadedData={handleLoadedData}
      onError={handleError}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
      aria-label={title}
    >
      {sources && sources.length > 0 ? (
        sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))
      ) : (
        <source src={src} type="video/mp4" />
      )}

      {captions.map((track, index) => (
        <track
          key={index}
          kind="captions"
          src={track.src}
          srcLang={track.srcLang}
          label={track.label}
          default={track.default}
        />
      ))}

      {fallbackMessage}
    </video>
  );

  const renderYouTubeEmbed = (): JSX.Element => {
    const videoId = getYouTubeId(src);

    if (!videoId) {
      return renderFallback();
    }

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      autoplay: autoPlay ? "1" : "0",
      mute: muted || autoPlay ? "1" : "0",
      loop: loop ? "1" : "0",
      controls: controls ? "1" : "0",
      cc_load_policy: captions.length > 0 ? "1" : "0",
    });

    return (
      <iframe
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={allowFullScreen}
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleError}
      />
    );
  };

  const renderVimeoEmbed = (): JSX.Element => {
    const videoId = getVimeoId(src);

    if (!videoId) {
      return renderFallback();
    }

    const params = new URLSearchParams({
      autoplay: autoPlay ? "1" : "0",
      muted: muted || autoPlay ? "1" : "0",
      loop: loop ? "1" : "0",
      controls: controls ? "1" : "0",
      title: "0",
      byline: "0",
      portrait: "0",
    });

    return (
      <iframe
        className={styles.iframe}
        src={`https://player.vimeo.com/video/${videoId}?${params.toString()}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen={allowFullScreen}
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleError}
      />
    );
  };

  const renderVideo = (): JSX.Element => {
    if (hasError) {
      return renderFallback();
    }

    switch (detectedSourceType) {
      case "youtube":
        return renderYouTubeEmbed();
      case "vimeo":
        return renderVimeoEmbed();
      default:
        return renderSelfHostedVideo();
    }
  };

  return (
    <div
      className={`${styles.videoPlayer} ${aspectRatioClass} ${className}`.trim()}
      role="region"
      aria-label={title}
    >
      <div className={styles.videoWrapper}>
        {isLoading && renderLoading()}
        {renderVideo()}
      </div>
    </div>
  );
}
