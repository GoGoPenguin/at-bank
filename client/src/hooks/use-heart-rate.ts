import { useCallback, useRef, useState } from "react";

export interface HeartRateResult {
  bpm: number;
  confidence: number;
  waveform: number[];
}

export const useHeartRate = () => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [bpm, setBpm] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  const dataPointsRef = useRef<{ t: number; v: number }[]>([]);

  const stopMeasuring = useCallback(() => {
    setIsMeasuring(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const calculateBPM = useCallback(() => {
    const data = dataPointsRef.current;
    if (data.length < 50) return;

    // Simple peak detection on the signal
    // In a real app, we'd use zero-crossing or autocorrelation for better accuracy
    let peaks = 0;
    const values = data.map(p => p.v);
    
    // Smooth the signal a bit (moving average)
    const smoothed = values.map((v, i, arr) => {
      if (i < 2 || i > arr.length - 3) return v;
      return (arr[i-2] + arr[i-1] + v + arr[i+1] + arr[i+2]) / 5;
    });

    for (let i = 1; i < smoothed.length - 1; i++) {
        if (smoothed[i] > smoothed[i-1] && smoothed[i] > smoothed[i+1]) {
            // Check if it's a significant peak (basic threshold)
            const localMin = Math.min(...smoothed.slice(Math.max(0, i-5), Math.min(smoothed.length, i+5)));
            if (smoothed[i] - localMin > 0.5) { // Arbitrary threshold for green intensity change
                peaks++;
            }
        }
    }

    const durationMin = (data[data.length - 1].t - data[0].t) / 60000;
    const detectedBpm = Math.round(peaks / durationMin);
    
    if (detectedBpm > 40 && detectedBpm < 200) {
        setBpm(detectedBpm);
    }
  }, []);

  const analyzeFrame = useCallback(function frame() {
    if (!videoRef.current || !canvasRef.current || !isMeasuring) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let gSum = 0;
    const count = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      gSum += data[i + 1];
    }

    const avgG = gSum / count;
    // We use the green channel because it provides the best PPG signal
    const now = performance.now();
    dataPointsRef.current.push({ t: now, v: avgG });

    // Keep last 10 seconds of data for analysis (approx 300-600 frames)
    if (dataPointsRef.current.length > 300) {
      dataPointsRef.current.shift();
    }

    // Prepare waveform for visualization (normalized)
    if (dataPointsRef.current.length > 2) {
      const values = dataPointsRef.current.map((p) => p.v);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const normalizedWaveform = values.slice(-50).map((v) => 
        max === min ? 0.5 : (v - min) / (max - min)
      );
      setWaveform(normalizedWaveform);

      // Perform heart rate detection if we have enough data (at least 5 seconds)
      const duration = (now - dataPointsRef.current[0].t) / 1000;
      setProgress(Math.min(100, (duration / 10) * 100));

      if (duration > 5) {
        calculateBPM();
      }
    }

    requestRef.current = requestAnimationFrame(frame);
  }, [isMeasuring, calculateBPM]);

  const startMeasuring = useCallback(async () => {
    setError(null);
    setBpm(0);
    setProgress(0);
    setWaveform([]);
    dataPointsRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        // Try to enable torch if supported (for better light penetration)
        // Note: torch is not standardized and might require advanced constraints
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsMeasuring(true);
      requestRef.current = requestAnimationFrame(analyzeFrame);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to access camera");
      console.error("Camera access error:", err);
    }
  }, [analyzeFrame]);

  return {
    isMeasuring,
    bpm,
    progress,
    waveform,
    error,
    startMeasuring,
    stopMeasuring,
    videoRef,
    canvasRef,
  };
};
