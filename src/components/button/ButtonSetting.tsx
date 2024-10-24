import { cls } from "@/lib/utils";
import { FaPlus } from "react-icons/fa6";

export const PlusIcon = () => {
  return (
    <span className="flex size-[22px] items-center justify-center rounded bg-violet02">
      <FaPlus className="size-2.5 text-violet01" />
    </span>
  );
};

export const BaseBtn = (props: any) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={cls("overflow-hidden rounded-lg border border-gray03 bg-white", props.extra)}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export const Content = (props: any) => {
  return (
    <p className={cls("flex items-center justify-center gap-3 border-transparent", props.extra)}>{props.children}</p>
  );
};

export const ContentLeftAlign = (props: any) => {
  return <p className={cls("flex items-center border-transparent pl-5", props.extra)}>{props.children}</p>;
};
