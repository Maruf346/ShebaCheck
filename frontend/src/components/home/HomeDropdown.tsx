import { ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export interface HomeDropdownOption {
  value: string;
  label: string;
}

interface HomeDropdownProps {
  label: string;
  value: string;
  options: HomeDropdownOption[];
  onChange: (value: string) => void;
  icon: LucideIcon;
  className?: string;
  triggerClassName?: string;
}

export function HomeDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  className = "",
  triggerClassName = "",
}: HomeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value)),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const activeOptionId = `${listboxId}-option-${activeIndex}`;
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function dismissOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open]);

  function openAt(index = options.findIndex((option) => option.value === value)) {
    setActiveIndex(Math.max(0, index));
    setOpen(true);
  }

  function selectOption(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openAt();
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + options.length) % options.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      setOpen(true);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) selectOption(activeIndex);
      else openAt();
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`flex w-full min-w-0 items-center gap-2 rounded-full border border-stone-200 bg-white text-left text-stone-800 transition-[border-color,box-shadow,background-color] hover:border-amber-300 hover:bg-amber-50/40 focus-visible:!border-amber-400/60 focus-visible:!outline-none focus-visible:!ring-1 focus-visible:!ring-amber-400/25 ${triggerClassName}`}
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? activeOptionId : undefined}
        onClick={() => (open ? setOpen(false) : openAt())}
        onKeyDown={handleKeyDown}
      >
        <Icon className="h-4 w-4 shrink-0 text-brand-amber" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-xs font-bold">
          {selectedOption?.label ?? value}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-[60] max-h-64 overflow-y-auto rounded-2xl border border-amber-100 bg-white p-1.5 shadow-[0_14px_36px_rgb(17_24_39/16%)] ring-1 ring-black/5"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <button
                id={`${listboxId}-option-${index}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                className={`flex min-h-10 w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-sm transition-colors ${
                  active || selected
                    ? "bg-amber-50 font-bold text-amber-950"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
              >
                <span className="truncate">{option.label}</span>
                {selected && (
                  <span className="ml-3 h-2 w-2 shrink-0 rounded-full bg-brand-amber" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}