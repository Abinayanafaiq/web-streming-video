import type { Metadata } from "next";
import { RegisterForm } from "../auth-forms";

export const metadata: Metadata = { title: "Daftar — NontonYuk" };

export default function RegisterPage() {
  return <RegisterForm />;
}
