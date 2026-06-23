"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Phone } from "lucide-react";
import { useState } from "react";

import { countryById, countryCodes, countryFlagUrl } from "@/lib/country-codes";
import { cn } from "@/lib/utils";

type OutboundUiState = "idle" | "loading" | "success" | "error";

type DemoCallFormProps = {
  layout?: "compact" | "strip" | "bar";
  autoFocus?: boolean;
  showPulse?: boolean;
  animateIn?: boolean;
  className?: string;
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay, ease: [0.22, 0.7, 0.18, 1] as const },
  }),
};

export function DemoCallForm({
  layout = "compact",
  autoFocus = false,
  showPulse = true,
  animateIn = false,
  className,
}: DemoCallFormProps) {
  const reduceMotion = useReducedMotion();
  const [countryId, setCountryId] = useState(countryCodes[0]!.id);
  const [localNumber, setLocalNumber] = useState("");
  const [outboundState, setOutboundState] = useState<OutboundUiState>("idle");
  const [outboundMessage, setOutboundMessage] = useState("");

  const selectedCountry = countryById(countryId);
  const fullPhone = `${selectedCountry.code}${localNumber.replace(/\D/g, "")}`;
  const canSubmit = outboundState !== "loading" && localNumber.replace(/\D/g, "").length >= 6;
  const isBar = layout === "bar";
  const isCompact = layout === "compact";
  const isInlineSubmit = isCompact || isBar;

  const FormTag = animateIn ? motion.form : "form";
  const FieldTag = animateIn ? motion.div : "div";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setOutboundState("loading");
    setOutboundMessage("");

    try {
      const res = await fetch("/api/demo/outbound-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setOutboundState("error");
        setOutboundMessage(data.error || "Call failed.");
        return;
      }
      setOutboundState("success");
      setOutboundMessage(data.message || "Calling now.");
    } catch {
      setOutboundState("error");
      setOutboundMessage("Network error.");
    }
  }

  return (
    <FormTag
      id="call-demo"
      onSubmit={onSubmit}
      className={cn(
        "call-panel-surface__form",
        isBar && "call-panel-surface__form--bar",
        isCompact && "call-panel-surface__form--compact",
        layout === "strip" && "call-panel-surface__form--strip",
        className,
      )}
      {...(animateIn
        ? {
            custom: 0.12,
            initial: "hidden",
            animate: "visible",
            variants: fieldVariants,
          }
        : {})}
    >
      <FieldTag
        className={cn(
          "call-panel-surface__fields",
          isBar && "call-panel-surface__fields--bar",
          isCompact && "call-panel-surface__fields--compact",
        )}
        {...(animateIn ? { custom: 0.14, variants: fieldVariants } : {})}
      >
        <label className="call-panel-surface__country" htmlFor="demo-country-code">
          <span className="call-panel-surface__country-display" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={countryFlagUrl(selectedCountry.id)}
              alt=""
              width={24}
              height={18}
              className="call-panel-surface__country-flag-img"
            />
            <span className="call-panel-surface__country-code">{selectedCountry.code}</span>
          </span>
          <select
            id="demo-country-code"
            value={countryId}
            onChange={(event) => setCountryId(event.target.value)}
            className="call-panel-surface__country-select"
            aria-label="Country code"
          >
            {countryCodes.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.flag} {entry.code} {entry.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sr-only" htmlFor="demo-phone-number">
          Phone number
        </label>
        <div className="call-panel-surface__input-wrap">
          <Phone className="call-panel-surface__phone-icon" strokeWidth={1.75} aria-hidden />
          <input
            id="demo-phone-number"
            name="phone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="Your number"
            value={localNumber}
            onChange={(event) => setLocalNumber(event.target.value)}
            className="call-panel-surface__input"
            autoFocus={autoFocus}
          />
        </div>

        {isInlineSubmit ? (
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "call-panel-surface__submit",
              isBar && "call-panel-surface__submit--bar",
              showPulse && canSubmit && !reduceMotion && "call-panel-surface__submit--pulse",
            )}
          >
            {outboundState === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Call me"}
          </button>
        ) : null}
      </FieldTag>

      {!isInlineSubmit ? (
        <motion.div className="call-panel-surface__cta-wrap" custom={0.18} variants={fieldVariants}>
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "call-panel-surface__phone-btn",
              showPulse && canSubmit && !reduceMotion && "call-panel-surface__phone-btn--pulse",
            )}
            aria-label="Call me"
          >
            <span className="call-panel-surface__phone-btn-rings" aria-hidden>
              <span />
              <span />
            </span>
            {outboundState === "loading" ? (
              <Loader2 className="call-panel-surface__phone-btn-icon animate-spin" aria-hidden />
            ) : (
              <Phone className="call-panel-surface__phone-btn-icon" strokeWidth={2} aria-hidden />
            )}
            <span className="call-panel-surface__phone-btn-label">Call me</span>
          </button>
        </motion.div>
      ) : null}

      {outboundState === "success" || outboundState === "error" ? (
        <p
          className={cn("call-panel-surface__toast", outboundState === "error" && "call-panel-surface__toast--error")}
          role={outboundState === "error" ? "alert" : "status"}
        >
          {outboundMessage}
        </p>
      ) : null}
    </FormTag>
  );
}
