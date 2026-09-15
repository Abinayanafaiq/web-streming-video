import type { Metadata } from "next";
import { LoginForm } from "../auth-forms";

export const metadata: Metadata = { title: "Masuk — NontonYuk" };

export default function LoginPage() {
  return <LoginForm />;
}
