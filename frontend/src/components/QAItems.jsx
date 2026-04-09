import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { TbBulb } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";
import { BsPin, BsPinFill } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const QAItem = ({ item, onPin, onExplain }) => {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExp, setLoadingExp] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const handleExplain = async () => {
    if (explanation) {
      setShowExp(!showExp);
      return;
    }
    setLoadingExp(true);
    const result = await onExplain(item.question);
    if (result) {
      setExplanation(result);
      setShowExp(true);
    }
    setLoadingExp(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all ${
        item.isPinned ? "border-orange-300 shadow-orange-50" : "border-gray-100"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => onPin?.(item._id)}
          className={`shrink-0 transition-colors ${
            item.isPinned ? "text-orange-500" : "text-gray-300 hover:text-orange-400"
          }`}
          title="Toggle Pin"
        >
          {item.isPinned ? <BsPinFill size={16} /> : <BsPin size={16} />}
        </button>

        <h3
          className="font-medium text-gray-800 flex-1 cursor-pointer hover:text-orange-600 transition-colors leading-snug"
          onClick={() => setOpen(!open)}
        >
          {item.question}
        </h3>

        <div className="flex items-center gap-1 shrink-0">
          {onExplain && (
            <button
              onClick={handleExplain}
              disabled={loadingExp}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
              {loadingExp ? (
                <ImSpinner8 className="animate-spin" size={11} />
              ) : (
                <TbBulb size={13} />
              )}
              {loadingExp ? "..." : "Explain"}
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition"
          >
            {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-50 pt-3">
              <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl text-xs my-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {item.answer || "No answer yet."}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExp && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TbBulb className="text-indigo-500" size={15} />
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                  AI Explanation
                </span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QAItem;
