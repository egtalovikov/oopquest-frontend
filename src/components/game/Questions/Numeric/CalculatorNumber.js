const CalculatorNumber = ({ number, addNumber }) => {
  return (
    <button
      className="w-[54px] h-[54px] m-1 bg-yellow-400 hover:bg-yellow-200 rounded-md text-stroke-black text-stroke-2 text-white drop-shadow-md text-4xl border-white/40 border-4
                 transition-all font-extrabold ease-out"
      onClick={() => {
        addNumber(number);
      }}
    >
      {number}
    </button>
  );
};

export default CalculatorNumber;
