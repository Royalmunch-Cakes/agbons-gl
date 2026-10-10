import { PolicyPage, policyMetadata } from "@/components/content/policy-page";

export function generateMetadata() {
  return policyMetadata("shipping");
}

export default function Page() {
  return <PolicyPage slug="shipping" />;
}
