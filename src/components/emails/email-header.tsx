import { Section, Text, Img } from "@react-email/components";
import { env } from "~/utils/env";

export function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src={`${env.HOST_NAME}/logo.png`}
        width="48"
        height="48"
        alt="Automaker"
        style={logo}
      />
      <Text style={brandName}>Automaker</Text>
    </Section>
  );
}

const header = {
  display: "flex" as const,
  alignItems: "center" as const,
  marginBottom: "32px",
  padding: "20px 24px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  border: "1px solid #e1e8ed",
  justifyContent: "center" as const,
};

const logo = {
  borderRadius: "8px",
  marginRight: "12px",
};

const brandName = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0",
};
