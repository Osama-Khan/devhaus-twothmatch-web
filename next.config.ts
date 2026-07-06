import type { NextConfig } from "next";

const getApiHostName = () => {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "";
  const parts = url.split("//");
  if (parts.length === 2) {
    return parts[1].split("/")[0];
  }
  if (parts.length === 1) {
    return parts[0].split("/")[0];
  }
  throw new Error(
    "Invalid API URL. Please set NEXT_PUBLIC_API_URL in the env file."
  );
};

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getApiHostName(),
      },
    ],
  },
};

export default nextConfig;
