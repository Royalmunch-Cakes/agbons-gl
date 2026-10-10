import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export function generateMetadata() {
  return policyMetadata("returns");
}

export default function Page() {
  return <PolicyPage slug="returns" />;
}
