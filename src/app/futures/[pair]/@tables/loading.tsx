import LoadingSvg from "@/shared/components/atoms/loadingGif";

const Loading = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-md py-20 h-full">
      <LoadingSvg />
    </div>
  );
};
export default Loading;
