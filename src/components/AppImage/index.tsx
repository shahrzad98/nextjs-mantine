import { Box, createStyles } from "@mantine/core";
import Image, { ImageProps } from "next/image";
import React, { CSSProperties, useEffect, useState } from "react";

export type AppImageProps = {
  width?: number;
  height?: number;
  alt: string;
  src: string;
  loading?: ImageProps["loading"];
  priority?: ImageProps["priority"];
  quality?: ImageProps["quality"];
  noSkeleton?: boolean;
  fill?: boolean;
  sizes?: string | undefined;
  wrapperHeight?: number;
  style?: CSSProperties | undefined;
  backgroundColor?: boolean;
};

export const AppImage: React.FC<AppImageProps> = React.memo(
  ({
    src,
    width,
    height,
    wrapperHeight,
    loading,
    style,
    priority,
    backgroundColor = true,
    alt,
    fill,
    sizes,
    noSkeleton,
    quality,
  }) => {
    const [innerSrc, setInnerSrc] = useState("");
    // State to track if the image has loaded
    const [loaded, setLoaded] = useState(false);

    const useStyles = createStyles(() => ({
      root: {
        height: height,
        width: width,
      },
      mainImage: {
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s",
      },
      imageSkeleton: {
        backgroundColor: backgroundColor ? "#25262B" : "unset",
        width: "100%",
        img: {
          objectFit: "fill",
        },
        top: 0,
        transition: "opacity 0.4s",
        opacity: !loaded ? 1 : 0,
      },
    }));

    const { classes } = useStyles();

    // Reset loaded state when src prop changes
    useEffect(() => {
      setLoaded(false);
      setInnerSrc(src);
    }, [src]);

    const urlRegex = /^(ftp|http|https):\/\/|blob:([^\s"]+)$/;

    return (
      <Box className={classes.root}>
        {/*Check if src is an acceptable url*/}
        {urlRegex.test(src) && (
          <Box
            h={wrapperHeight}
            pos={!loaded && !noSkeleton ? "absolute" : wrapperHeight ? "relative" : undefined}
          >
            <Image
              className={classes.mainImage}
              src={innerSrc}
              width={width}
              height={height}
              alt={alt}
              onLoadingComplete={() => setLoaded(true)}
              loading={priority ? "eager" : loading ?? "lazy"}
              priority={priority}
              quality={quality}
              sizes={sizes}
              fill={fill}
              style={style}
            />
          </Box>
        )}

        {/* Render skeleton placeholder if image is not loaded */}
        {!loaded && !noSkeleton && (
          <Box className={classes.imageSkeleton} h={wrapperHeight}>
            <Image
              src="/img/placeholder/Placeholder.svg"
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              style={style}
            />
          </Box>
        )}
      </Box>
    );
  }
);
