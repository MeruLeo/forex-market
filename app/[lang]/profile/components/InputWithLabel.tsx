import React from 'react';


interface InputWithLabelProps {
  label: string;
  value: string | number;
  type?: string;
  disabled?: boolean;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ label, value, type = "text", disabled = true }) => {
  return (
    <div className="flex gap-2 items-center justify-between">
      <div className='w-1/2 font-light text-[12px] sm:text-sm lg:text-base text-nowrap'>{label}: </div>
      <div className='w-1/2'>
      { type == 'text' ? 
      (
        <textarea
        rows={1}
        wrap="off"
        value={value !== null ? String(value) : ''}
        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base" style={{overflowY: 'hidden', minHeight: '38px'}}  disabled={disabled}>{value}</textarea>
      )
      :(
        <input
        type={type}
        value={value !== null ? value : ''}
        disabled={disabled}
        className="w-full rounded border-[1.5px] border-stroke bg-white px-4 py-1.5 font-light text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-zinc-800 dark:text-white dark:focus:border-primary text-sm xl:text-base"
      />
      ) }
      
       
      </div>
    </div>
  );
};

export default InputWithLabel;
