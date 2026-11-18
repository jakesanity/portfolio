import { useEffect, useState } from "react";
import { aboutData, experienceData, personalInfo, projectsData, skillsData } from "../data/portfolio";

/* ------------------------------------------------------------------ */
/*  1. Open-Meteo Live Weather API (Davao City: 7.0731 N, 125.6128 E)  */
/* ------------------------------------------------------------------ */

export interface WeatherTelemetry {
  tempC: number;
  humidity: number;
  windKph: number;
  condition: string;
  live: boolean;
  updatedAt: string;
}

const WEATHER_CACHE_KEY = "ajb-weather-v1";

function decodeWmoCode(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Mist / Fog";
  if (code >= 51 && code <= 67) return "Light Rain";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 95) return "Thunderstorm";
  return "Tropical Fair";
}

let weatherMemo: WeatherTelemetry | null = null;

export async function fetchDavaoWeather(): Promise<WeatherTelemetry> {
  if (weatherMemo) return weatherMemo;

  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as WeatherTelemetry;
        weatherMemo = parsed;
        return parsed;
      } catch {
        /* ignore corrupt cache */
      }
    }
  }

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=7.0731&longitude=125.6128&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FManila";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    const c = data.current;
    const result: WeatherTelemetry = {
      tempC: Math.round(Number(c.temperature_2m ?? 29)),
      humidity: Math.round(Number(c.relative_humidity_2m ?? 74)),
      windKph: Math.round(Number(c.wind_speed_10m ?? 11)),
      condition: decodeWmoCode(Number(c.weather_code ?? 1)),
      live: true,
      updatedAt: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Manila" }),
    };
    weatherMemo = result;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(result));
    }
    return result;
  } catch {
    const fallback: WeatherTelemetry = {
      tempC: 29,
      humidity: 74,
      windKph: 11,
      condition: "Partly Cloudy",
      live: false,
      updatedAt: "cached",
    };
    weatherMemo = fallback;
    return fallback;
  }
}

export function useDavaoWeather() {
  const [weather, setWeather] = useState<WeatherTelemetry | null>(weatherMemo);

  useEffect(() => {
    let mounted = true;
    fetchDavaoWeather().then((w) => {
      if (mounted) setWeather(w);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return weather;
}

/* ------------------------------------------------------------------ */
/*  2. GitHub REST API (api.github.com/users/jakesanity)               */
/* ------------------------------------------------------------------ */

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
   homepage?: string | null;
}

export interface GitHubTelemetry {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  avatarUrl: string;
  profileUrl: string;
  repos: GitHubRepo[];
  live: boolean;
}

const GITHUB_USER = "jakesanity";
const GITHUB_CACHE_KEY = "ajb-github-v1";

let githubMemo: GitHubTelemetry | null = null;

export async function fetchGitHubTelemetry(): Promise<GitHubTelemetry> {
  if (githubMemo) return githubMemo;

  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(GITHUB_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as GitHubTelemetry;
        githubMemo = parsed;
        return parsed;
      } catch {
        /* ignore corrupt cache */
      }
    }
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=8`),
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API rate limit or network error");

    const user = await userRes.json();
    const reposData = (await reposRes.json()) as GitHubRepo[];

    const result: GitHubTelemetry = {
      username: user.login || GITHUB_USER,
      publicRepos: Number(user.public_repos ?? reposData.length),
      followers: Number(user.followers ?? 0),
      following: Number(user.following ?? 0),
      avatarUrl: user.avatar_url || "",
      profileUrl: user.html_url || personalInfo.github,
      repos: Array.isArray(reposData) ? reposData.slice(0, 6) : [],
      live: true,
    };

    githubMemo = result;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(result));
    }
    return result;
  } catch {
    const fallback: GitHubTelemetry = {
      username: GITHUB_USER,
      publicRepos: projectsData.length,
      followers: 0,
      following: 0,
      avatarUrl: "",
      profileUrl: personalInfo.github,
      repos: projectsData.map((p, idx) => ({
        id: idx + 1,
        name: p.id,
        description: p.description,
        html_url: p.githubUrl || personalInfo.github,
        language: p.stack[0] || "TypeScript",
        stargazers_count: 1,
        forks_count: 0,
        updated_at: new Date().toISOString(),
      })),
      live: false,
    };
    githubMemo = fallback;
    return fallback;
  }
}

export function useGitHubTelemetry() {
  const [data, setData] = useState<GitHubTelemetry | null>(githubMemo);
  const [loading, setLoading] = useState<boolean>(!githubMemo);

  useEffect(() => {
    let mounted = true;
    fetchGitHubTelemetry().then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}

/* ------------------------------------------------------------------ */
/*  3. AI Portfolio Copilot API (Gemini API + Smart Local RAG)         */
/* ------------------------------------------------------------------ */

export interface CopilotResponse {
  answer: string;
  source: "gemini-api" | "ajb-os-rag";
}

function buildPortfolioContext(): string {
  return [
    `Name: ${personalInfo.name} (${personalInfo.title} — ${personalInfo.subtitle})`,
    `Location: ${personalInfo.location}`,
    `Contact: Email ${personalInfo.email}, Phone ${personalInfo.phone}, GitHub ${personalInfo.github}, LinkedIn ${personalInfo.linkedin}`,
    `Background: ${aboutData.background}`,
    `Mission: ${aboutData.mission}`,
    `Education: ${aboutData.education.map((e) => `${e.degree} at ${e.school} (${e.year})`).join("; ")}`,
    `Certifications: ${aboutData.certifications.join("; ")}`,
    `Technical Skills: ${skillsData.technical.map((s) => `${s.name} (${s.level}%)`).join(", ")}`,
    `Tools: ${skillsData.software.join(", ")}`,
    `Projects: ${projectsData
      .map(
        (p) =>
          `${p.title} (${p.category}, ${p.period}): ${p.description} Stack: ${p.stack.join(", ")}. Problem: ${p.problem} Solution: ${p.solution}`
      )
      .join(" | ")}`,
    `Experience: ${experienceData.map((e) => `${e.role} at ${e.company} (${e.period}): ${e.responsibilities.join(" ")}`).join(" | ")}`,
  ].join("\n");
}

function localRagAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("recheck") || q.includes("ethics") || q.includes("workflow")) {
    const p = projectsData[0];
    return `${p.title} (${p.period}) is an ${p.type} built with ${p.stack.join(", ")}. ${p.solution} Key deliverables: ${p.highlights.join("; ")}.`;
  }
  if (q.includes("elderly") || q.includes("health") || q.includes("care") || q.includes("medical")) {
    const p = projectsData[1];
    return `${p.title} (${p.period}) is a ${p.category} platform built with ${p.stack.join(", ")}. ${p.solution}`;
  }
  if (q.includes("insight") || q.includes("machine learning") || q.includes("ml") || q.includes("ai") || q.includes("python")) {
    const p = projectsData[2];
    return `${p.title} (${p.period}) is an ${p.type} built using ${p.stack.join(", ")}. ${p.solution}`;
  }
  if (q.includes("hire") || q.includes("intern") || q.includes("available") || q.includes("freelance") || q.includes("work")) {
    return `Yes — Aldwin is actively open to IT internships, freelance UI/UX & full-stack web projects, and team collaborations in Davao City or remotely. You can reach him at ${personalInfo.email} or ${personalInfo.phone}.`;
  }
  if (q.includes("stack") || q.includes("skill") || q.includes("tech") || q.includes("language") || q.includes("framework")) {
    return `Aldwin's core stack includes ${skillsData.technical.map((s) => `${s.name} (${s.level}%)`).join(", ")}, plus tools like ${skillsData.software.slice(0, 6).join(", ")}.`;
  }
  if (q.includes("school") || q.includes("university") || q.includes("education") || q.includes("degree") || q.includes("uic")) {
    const edu = aboutData.education[0];
    return `Aldwin is pursuing his ${edu.degree} at ${edu.school} (${edu.year}). ${edu.description}`;
  }
  if (q.includes("cert")) {
    return `Verified certifications: ${aboutData.certifications.join(" · ")}.`;
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach")) {
    return `You can contact Aldwin directly via email at ${personalInfo.email}, phone/SMS at ${personalInfo.phone}, or LinkedIn (${personalInfo.linkedin}).`;
  }

  return `Aldwin James Bucio is a Full-Stack Developer & UI/UX Designer studying BSIT at UIC Davao City. He has engineered RECHECK (ethics workflow platform), ElderlyCare (remote health monitoring), and InsightAi (ML customer segmentation) using React, TypeScript, Laravel, Python, and SQL. Ask about a specific project, skill, or internship availability!`;
}

export async function askPortfolioCopilot(question: string): Promise<CopilotResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `You are the built-in AI system kernel for AJB/OS, the portfolio of Aldwin James Bucio. Answer concisely (2-3 sentences max) in a sharp, helpful engineering tone using ONLY this portfolio data:\n${buildPortfolioContext()}`,
                },
              ],
            },
            contents: [{ role: "user", parts: [{ text: question }] }],
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { answer: text.trim(), source: "gemini-api" };
        }
      }
    } catch {
      /* fall through to local RAG */
    }
  }

  // Simulate brief neural processing latency for tactile UX
  await new Promise((r) => setTimeout(r, 240));
  return {
    answer: localRagAnswer(question),
    source: "ajb-os-rag",
  };
}

/* ------------------------------------------------------------------ */
/*  4. Direct Contact Dispatch API (Web3Forms / Formspree + Fallback)  */
/* ------------------------------------------------------------------ */

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactApi(payload: ContactPayload): Promise<{ delivered: boolean; mode: "api" | "client" }> {
  const web3Key = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

  if (web3Key && web3Key.trim().length > 10) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3Key.trim(),
          name: payload.name,
          email: payload.email,
          subject: `[AJB/OS Portfolio] ${payload.subject}`,
          message: payload.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        return { delivered: true, mode: "api" };
      }
    } catch {
      /* fall through to client mode */
    }
  }

  return { delivered: false, mode: "client" };
}

/* ------------------------------------------------------------------ */
/*  5. Browser Hardware, Network & FPS Diagnostics API                 */
/* ------------------------------------------------------------------ */

export interface SystemDiagnostics {
  cores: number;
  memoryGb: number | string;
  networkType: string;
  downlinkMbps: string;
  rttMs: string;
  batteryPct: string;
  charging: boolean | null;
  userAgentPlatform: string;
}

export async function getSystemDiagnostics(): Promise<SystemDiagnostics> {
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
  }) : null;

  let batteryPct = "AC/Desktop";
  let charging: boolean | null = null;

  if (nav?.getBattery) {
    try {
      const bat = await nav.getBattery();
      batteryPct = `${Math.round(bat.level * 100)}%`;
      charging = bat.charging;
    } catch {
      /* ignore */
    }
  }

  return {
    cores: nav?.hardwareConcurrency ?? 8,
    memoryGb: nav?.deviceMemory ? `${nav.deviceMemory} GB` : "8+ GB",
    networkType: nav?.connection?.effectiveType?.toUpperCase() ?? "WIFI/ETH",
    downlinkMbps: nav?.connection?.downlink ? `${nav.connection.downlink} Mbps` : "100+ Mbps",
    rttMs: nav?.connection?.rtt !== undefined ? `${nav.connection.rtt} ms` : "12 ms",
    batteryPct,
    charging,
    userAgentPlatform: nav?.platform || "WebOS",
  };
}

export function useFpsMonitor(enabled = true) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!enabled) return;
    let frames = 0;
    let last = performance.now();
    let rafId = 0;

    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.min(144, Math.round((frames * 1000) / (now - last))));
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  return fps;
}
