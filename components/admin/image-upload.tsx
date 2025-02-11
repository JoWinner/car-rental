"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Video } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxFiles?: number;
  onVideoChange?: (value: string) => void;
  videoUrl?: string;
}

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

export function MediaUpload({
  disabled,
  onChange,
  onRemove,
  value,
  maxFiles = 8,
  onVideoChange,
  videoUrl,
}: MediaUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "video">("images");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          type="button"
          variant={activeTab === "images" ? "default" : "outline"}
          onClick={() => setActiveTab("images")}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Images
        </Button>
        <Button
          type="button"
          variant={activeTab === "video" ? "default" : "outline"}
          onClick={() => setActiveTab("video")}
        >
          <Video className="h-4 w-4 mr-2" />
          Video
        </Button>
      </div>

      {activeTab === "images" && (
        <div>
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            {value.map((url) => (
              <div
                key={url}
                className="relative w-[200px] h-[200px] rounded-lg overflow-hidden"
              >
                <div className="z-10 absolute top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onRemove(url)}
                    variant="destructive"
                    size="icon"
                    disabled={disabled}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Image
                  fill
                  className="object-cover"
                  alt="Image"
                  src={url}
                  sizes="200px"
                />
              </div>
            ))}
          </div>
          {value.length < maxFiles && (
            <UploadDropzone
              endpoint="carImage"
              onClientUploadComplete={(res) => {
                const urls = res?.map((file) => file.url) || [];
                onChange([...value, ...urls]);
                toast.success("Images uploaded successfully");
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              config={{
                mode: "auto",
              }}
            />
          )}
        </div>
      )}

      {activeTab === "video" && (
        <div className="space-y-4">
          {videoUrl && (
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <video
                src={videoUrl}
                controls
                className="w-full"
                poster={value[0]}
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onVideoChange?.("")}
                  variant="destructive"
                  size="icon"
                  disabled={disabled}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {!videoUrl && (
            <UploadDropzone
              endpoint="carVideo"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (url) {
                  onVideoChange?.(url);
                  toast.success("Video uploaded successfully");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              config={{
                mode: "auto",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
