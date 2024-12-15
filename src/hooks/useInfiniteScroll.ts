import { CustomAxiosResponse, isHttpError } from "@/types";
import { errorNotification } from "@/utils";
import { QueryFunction } from "@tanstack/query-core";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef } from "react";

type InfiniteScrollOptions<T> = {
  queryKey: string[];
  queryFn: QueryFunction<T>;
  onIntersect?: () => void;
  intersectionOptions?: Omit<IntersectionObserverInit, "root">;
  enabled?: boolean;
};

export const useInfiniteScroll = <T>({
  queryKey,
  queryFn,
  onIntersect,
  intersectionOptions,
  enabled = true,
}: InfiniteScrollOptions<CustomAxiosResponse<T>>) => {
  const queryClient = useQueryClient();

  const {
    data,
    isFetching,
    isInitialLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(queryKey, queryFn, {
    enabled,
    initialData: queryClient.getQueryData(queryKey),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length * 6 < (lastPage.meta?.total_events || lastPage.meta.total_count)) {
        return allPages.length + 1;
      }
    },
  });

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error as AxiosError);
    }
  }, [error]);

  const observerRef = useRef<IntersectionObserver>();

  const lastElementCallbackRef = useCallback(
    (node: Element | null) => {
      if (!node || isFetching || isFetchingNextPage) return;

      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            hasNextPage && fetchNextPage();
            onIntersect?.();
          }
        },
        {
          threshold: intersectionOptions?.threshold ?? 1,
          rootMargin: intersectionOptions?.rootMargin ?? "50%",
        }
      );
      observerRef.current.observe(node);
    },
    [
      isFetching,
      isFetchingNextPage,
      intersectionOptions?.threshold,
      intersectionOptions?.rootMargin,
      hasNextPage,
      fetchNextPage,
      onIntersect,
    ]
  );

  return {
    lastElementCallbackRef,
    data,
    isFetchingNextPage,
    hasNextPage,
    isInitialLoading,
    error,
  };
};
