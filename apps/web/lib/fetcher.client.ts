"use client";

import useSWR from "swr";
import { fetcher } from "./fetcher";

export const useFetcher = <T = any>(url: string | undefined) =>
  useSWR<T>(url, fetcher);
