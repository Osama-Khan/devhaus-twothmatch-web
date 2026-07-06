import type { NextConfig } from "next";
const API_URL_ERR =
  "Invalid API URL. Please set NEXT_PUBLIC_API_URL in the env file in the format https://api.example.com:port.";

const getServerPattern = () => {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "";
  const parts = url.split("://");
  if (parts.length < 1 && parts.length > 2) {
    throw new Error(API_URL_ERR);
  }
  let protocol: "https" | "http" = "https";
  let domainPart = "";
  if (parts.length === 2) {
    protocol = parts[0] as "https" | "http";
    domainPart = parts[1].split("/")[0];
  }
  if (parts.length === 1) {
    domainPart = parts[0].split("/")[0];
  }
  const hostname = domainPart.split(":")[0];
  return {
    protocol,
    hostname,
  };
};

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [getServerPattern()],
  },
};

export default nextConfig;
