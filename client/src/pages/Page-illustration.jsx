import Illustration from "@/assets/images/blur_line.svg";

function PageIllustration({ multiple = true }) {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/4"
        aria-hidden="true"
      >
        <img className="max-w-none" src={Illustration} alt="" />
        <div className="w-[846px] h-[594px] bg-sky-300 blur-[120px] rounded-full opacity-30" />
      </div>

      {multiple && (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-[400px] -z-10 -mt-20 -translate-x-full opacity-50"
            aria-hidden="true"
          >
            <div className="w-[760px] h-[668px] bg-gray-300 blur-[150px] rounded-full opacity-30" />
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-[440px] -z-10 -translate-x-1/3"
            aria-hidden="true"
          >
            <div className="w-[760px] h-[668px] bg-sky-300 blur-[140px] rounded-full opacity-40" />
          </div>
        </>
      )}
    </>
  );
}
export default PageIllustration;
