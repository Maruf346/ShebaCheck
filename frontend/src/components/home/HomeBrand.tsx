import { Zap } from "lucide-react";

export function HomeBrand({ footer = false }: { footer?: boolean }) {
  return (
    <span
      className="group/brand inline-flex items-center gap-2 whitespace-nowrap text-lg leading-7 font-extrabold data-[footer=true]:text-white md:gap-2.5 md:text-xl"
      data-footer={footer}
    >
      <span className="grid size-[34px] place-items-center rounded-full bg-brand-yellow text-white shadow-home-icon md:size-10 group-data-[footer=true]/brand:size-8 group-data-[footer=true]/brand:[&_svg]:size-[19px]">
        <Zap size={23} fill="currentColor" aria-hidden="true" />
      </span>
      <span>
        Sheba
        <span className="text-brand-amber group-data-[footer=true]/brand:text-brand-yellow">
          Check
        </span>
      </span>
    </span>
  );
}
