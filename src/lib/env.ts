import { z } from "zod";
import packageJSON from "../../package.json";

export const version = packageJSON.version;
export const majorVersion = packageJSON.version
  .split(".")
  .slice(0, 2)
  .join(".");

const StatisticsSchema = z.object({
  graphModeView: z.number(),
  tableModeView: z.number(),
  textComparison: z.number(),
  jqExecutions: z.number(),
});

const SubscriptionVariantMapSchema = z.object({
  monthly: z.number(),
  yearly: z.number(),
});

export type Statistics = z.infer<typeof StatisticsSchema>;
export type StatisticsKeys = keyof Statistics;
export type SubscriptionVariantMap = z.infer<
  typeof SubscriptionVariantMapSchema
>;

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
