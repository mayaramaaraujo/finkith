"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { createClient } from "@/shared/lib/supabase/client";
import { createLoginSchema, type LoginFormValues } from "@/features/auth/types";
import { useTranslation } from "@/shared/lib/i18n/context";
import { describeError } from "@/shared/lib/errors";

interface LoginFormProps {
  /** Where to land after signing in (e.g. an invite link). Only a same-origin path is honored. */
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const { dict } = useTranslation();
  const loginSchema = useMemo(() => createLoginSchema(dict), [dict]);
  const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setError("root", { message: describeError(error, dict) });
      return;
    }

    router.replace(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Input
          icon={Mail}
          type="email"
          placeholder={dict.auth.emailPlaceholder}
          invalid={!!errors.email}
          {...register("email")}
        />
        <Input
          icon={Lock}
          type="password"
          placeholder={dict.auth.passwordPlaceholder}
          invalid={!!errors.password}
          {...register("password")}
        />
      </div>

      {errors.root ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.root.message}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={isSubmitting} className="mt-4">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {dict.auth.signIn}
      </Button>

      <p className="mt-4 text-center text-xs text-text-dim">
        {dict.auth.noAccount}{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="font-semibold text-primary-light"
        >
          {dict.auth.signUp}
        </Link>
      </p>
    </form>
  );
}
