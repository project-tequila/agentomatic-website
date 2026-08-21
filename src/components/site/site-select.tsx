"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type SiteSelectProps = {
  id: string;
  name: string;
  options: readonly string[];
  placeholder: string;
  defaultValue?: string;
  invalid?: boolean;
  describedBy?: string;
  onBlurField?: (name: string, value: string) => void;
};

/**
 * Cream/ink listbox used where native `<option>` popups paint unreadable text
 * (Windows Chrome on a dark page). A hidden native select keeps FormData/name.
 */
export function SiteSelect({
  id,
  name,
  options,
  placeholder,
  defaultValue = "",
  invalid = false,
  describedBy,
  onBlurField,
}: SiteSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option === defaultValue)),
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function commit(next: string) {
    setValue(next);
    setOpen(false);
    onBlurField?.(name, next);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      commit(options[activeIndex] ?? "");
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  const display = value || placeholder;

  return (
    <div ref={rootRef} className="site-select-wrap">
      <select
        name={name}
        value={value}
        tabIndex={-1}
        aria-hidden="true"
        className="site-select-native"
        onChange={(event) => setValue(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        id={id}
        type="button"
        className={cn("site-select", "site-select--trigger", !value && "site-select--placeholder")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => setOpen((next) => !next)}
        onKeyDown={onTriggerKeyDown}
        onBlur={(event) => {
          if (rootRef.current?.contains(event.relatedTarget as Node)) return;
          setOpen(false);
          onBlurField?.(name, value);
        }}
      >
        {display}
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="site-select-list"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option === value}
              data-active={index === activeIndex ? "true" : undefined}
              className="site-select-option"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
