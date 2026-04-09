import { ImSpinner8 } from "react-icons/im";
import { BsLightningChargeFill } from "react-icons/bs";

const GenerateButton = ({ onClick, generating, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={generating || loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition shadow-sm"
    >
      {generating ? (
        <>
          <ImSpinner8 className="animate-spin w-4 h-4" /> Generating…
        </>
      ) : (
        <>
          <BsLightningChargeFill className="w-4 h-4" /> Generate Questions
        </>
      )}
    </button>
  );
};

export default GenerateButton;
