"use client";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { use, useActionState, useState } from "react";

import { login, type LoginState } from "@/app/admin/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = use(searchParams);
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  const [visible, setVisible] = useState(false);

  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />
      <FieldGroup>
        <Field data-invalid={state.error ? true : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup className="h-11">
            <InputGroupInput
              id="password"
              name="password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              required
              autoFocus
              aria-invalid={state.error ? true : undefined}
              className="text-base md:text-sm"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                aria-controls="password"
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        {state.error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
