const TextField = ({ label, id, variant, ...props }) => {
  return (
    <>
      <label htmlFor={id} className='label p-2 mt-2'>
        <span
          className={`text-base label-text text-slate-300 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)] ${variant}`}
        >
          {label}
        </span>
      </label>
      <input id={id} className='w-full input input-bordered h-10 bg-secondary/30' {...props} />
    </>
  );
};

export default TextField;
