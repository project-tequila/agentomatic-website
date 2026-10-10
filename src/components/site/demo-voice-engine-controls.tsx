"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { canChangeDemoWebVoiceLanguage } from "@/lib/voice/demo-web-voice-language";
import { cn } from "@/lib/utils";

type DemoVoiceEngineControlsProps = {
  variant: "strip" | "focus";
};

type LanguageOption = { value: string; label: string };

type DemoVoiceLanguageListboxProps = {
  id: string;
  label: string;
  value: string;
  options: readonly LanguageOption[];
  disabled: boolean;
  variant: "strip" | "focus";
  onChange: (value: string) => void;
};

/**
 * In-page language list. A native select popup does not open under a CSS
 * transform (the demo strip) and paints unreadable options on the dark dialog.
 */
function DemoVoiceLanguageListbox({
  id,
  label,
  value,
  options,
  disabled,
  variant,
  onChange,
}: DemoVoiceLanguageListboxProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(
    null,
  );

  const selected = options.find((option) => option.value === value);
  const optionsKey = options.map((option) => option.value).join("\n");
  const [optionsKeySeen, setOptionsKeySeen] = useState(optionsKey);

  if (optionsKey !== optionsKeySeen) {
    setOptionsKeySeen(optionsKey);
    setOpen(false);
  }
  if (disabled && open) {
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    function place() {
      const button = triggerRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const gap = 6;
      const width = Math.max(rect.width, 168);
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(120, Math.min(256, openUp ? spaceAbove : spaceBelow));
      const top = openUp ? Math.max(8, rect.top - gap - maxHeight) : rect.bottom + gap;
      setMenuStyle({ top, left, width, maxHeight });
    }

    function onScroll(event: Event) {
      if (menuRef.current?.contains(event.target as Node)) return;
      place();
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const option = menuRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    option?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, menuStyle]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      const last = Math.max(0, options.length - 1);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex((index) => Math.min(last, index + 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex((index) => Math.max(0, index - 1));
      } else if (event.key === "Home") {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex(last);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        const next = options[activeIndex];
        if (next) {
          onChange(next.value);
          setOpen(false);
          triggerRef.current?.focus();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, options, activeIndex, onChange]);

  function openMenu() {
    if (disabled) return;
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  }

  function commit(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const activeId = `${listId}-option-${activeIndex}`;
  const prefix = variant === "focus" ? "voice-focus" : "demo-web-voice";

  const menu =
    open && menuStyle && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={(node) => {
              menuRef.current = node;
              node?.focus();
            }}
            id={listId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={activeId}
            tabIndex={-1}
            data-testid={`${id}-list`}
            className={cn(
              "demo-voice-language-menu",
              variant === "focus" && "demo-voice-language-menu--focus",
            )}
            style={{
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              maxHeight: menuStyle.maxHeight,
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                data-index={index}
                data-active={index === activeIndex ? "true" : undefined}
                data-testid={`${id}-option-${option.value}`}
                className="demo-voice-language-menu__option"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={`${prefix}__language`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`${prefix}__language-select`}
        data-testid={id}
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (disabled) return;
          if (open) {
            setOpen(false);
            return;
          }
          openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
      >
        {selected?.label ?? "Language"}
      </button>
      {menu}
    </div>
  );
}

/**
 * Speech LLM opens the speech language speaker.
 * Cascaded LLM opens a separate language speaker for the cascade catalog.
 */
export function DemoVoiceEngineControls({ variant }: DemoVoiceEngineControlsProps) {
  const { engine, setEngine, language, setLanguage, languageOptions, status } = useDemoWebVoice();
  const editable = canChangeDemoWebVoiceLanguage(status);
  const speech = engine === "speech_llm";
  const prefix = variant === "focus" ? "voice-focus" : "demo-web-voice";
  const languageId = speech ? `${prefix}-language` : `${prefix}-cascade-language`;
  const languageLabel = speech ? "Speech language" : "Cascaded language";

  return (
    <div className={`${prefix}__pickers`}>
      <div
        className={`${prefix}__engine`}
        role="radiogroup"
        aria-label="Voice model"
        data-testid={variant === "strip" ? "demo-voice-engine" : "voice-focus-engine"}
      >
        <button
          type="button"
          role="radio"
          aria-checked={speech}
          disabled={!editable}
          className={cn(`${prefix}__engine-option`, speech && `${prefix}__engine-option--active`)}
          data-testid={variant === "strip" ? "demo-voice-engine-speech" : "voice-focus-engine-speech"}
          onClick={() => setEngine("speech_llm")}
        >
          Speech LLM
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!speech}
          disabled={!editable}
          className={cn(`${prefix}__engine-option`, !speech && `${prefix}__engine-option--active`)}
          data-testid={variant === "strip" ? "demo-voice-engine-cascade" : "voice-focus-engine-cascade"}
          onClick={() => setEngine("cascade")}
        >
          Cascaded LLM
        </button>
      </div>

      <DemoVoiceLanguageListbox
        id={languageId}
        label={languageLabel}
        value={language}
        options={languageOptions}
        disabled={!editable}
        variant={variant}
        onChange={setLanguage}
      />
    </div>
  );
}
