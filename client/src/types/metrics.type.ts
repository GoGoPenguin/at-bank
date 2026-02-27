export type MetricsType = "RPE" | "heart_rate" | "weight";

export interface Metrics {
  name: MetricsType;
  value: number;
  unit: string;
  notes?: string;
  metadata?: Record<string, string | number>;
}

export type CreateMetricsRequestBody = Metrics[];

export type GetMetricsResponseBody = Metrics[];
