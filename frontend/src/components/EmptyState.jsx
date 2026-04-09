import { TbBulb } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";
import { BsLightningChargeFill } from "react-icons/bs";

const EmptyState = ({ onGenerate, generating }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
      <TbBulb className="w-7 h-7 text-orange-400" />
    </div>
    <div>
      <p className="text-gray-700 font-semibold text-base">No questions yet</p>
      <p className="text-gray-400 text-sm mt-1">
        Click the button above to generate AI-powered questions.
      </p>
    </div>
  </div>
);

export default EmptyState;
