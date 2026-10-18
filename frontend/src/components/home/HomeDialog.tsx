import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { homeDialogContent, type HomeDialogKind } from "../../data/homeContent";

export function HomeDialog({
  kind,
  onClose,
}: {
  kind: HomeDialogKind;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const content = homeDialogContent[kind];
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog
      className="m-auto max-h-[calc(100dvh-48px)] w-[min(540px,calc(100%-32px))] overflow-auto rounded-[20px] border border-stone-200 bg-white p-0 text-brand-ink shadow-[0_24px_80px_rgb(0_0_0/20%)] backdrop:bg-brand-ink/50 font-sans tracking-normal [&_*]:tracking-normal [&_svg]:shrink-0 motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none [&_:is(button,a,input,select):focus-visible]:outline [&_:is(button,a,input,select):focus-visible]:outline-[3px] [&_:is(button,a,input,select):focus-visible]:outline-offset-4 [&_:is(button,a,input,select):focus-visible]:outline-forest-700 [&_h2]:mt-5 [&_h2]:mb-4 [&_h2]:text-[25px] [&_h2]:leading-8 [&_h2]:font-extrabold [&_p]:mb-3.5 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-stone-600"
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative px-6 py-7 md:p-9">
        <button
          className="shrink-0 place-items-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors duration-[160ms] hover:bg-amber-100 size-9 inline-grid absolute top-4 right-4"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <span className="flex items-center gap-2 text-[11px] leading-4 font-extrabold uppercase text-yellow-700 md:text-[11px] md:leading-[18px] pr-[30px]">
          ShebaCheck &middot; Demo preview
        </span>
        <h2 id={titleId}>{content.title}</h2>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <button
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-bold transition-[background,box-shadow,transform] duration-[160ms] active:scale-[0.98] min-h-11 gap-[7px] px-6 py-3 text-sm leading-5 mt-2 bg-brand-amber text-white shadow-home-button hover:bg-[#ed8f00] hover:shadow-home-button-hover"
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
