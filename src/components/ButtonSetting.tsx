import { cls } from "@/lib/utils";
import { FaPlus } from "react-icons/fa6";

export const PlusIcon = () => {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded bg-violet02 text-violet01">
      <FaPlus />
    </span>
  );
};

export const BaseBtn = (props: any) => {
  return (
    <button type="button" className={cls("overflow-hidden rounded-lg border border-gray03 bg-white", props.extra)}>
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
