import type { Metadata } from "next";
import ClaimPanel from "../components/ClaimPanel";

export const metadata: Metadata = {
  title: "Claim — MS6900",
  description: "Select your stocks, set the split, and claim your allocation.",
};

export default function ClaimPage() {
  return <ClaimPanel />;
}
