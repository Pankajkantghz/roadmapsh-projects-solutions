import { useState } from "react";
import API from "./services/api";

import { FiRefreshCw } from "react-icons/fi";

import { BsArrowLeftRight } from "react-icons/bs";



function App() {
  const [type, setType] = useState("length");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [conversionData, setConversionData] = useState(null);

  const tabs = ["length", "weight", "temperature"];

  const [formData, setFormData] = useState({
    value: "",
    from: "",
    to: "",
  });

  const units = {
    length: [
      "millimeter",
      "centimeter",
      "meter",
      "kilometer",
      "inch",
      "foot",
      "yard",
      "mile",
    ],

    weight: [
      "milligram",
      "gram",
      "kilogram",
      "tonne",
      "ounce",
      "pound",
      "stone",
    ],

    temperature: ["celsius", "fahrenheit", "kelvin"],
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleConvert = async () => {
    if (!formData.value || !formData.from || !formData.to) {
      alert("Please fill all fields");

      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/convert", {
        type,

        value: Number(formData.value),

        from: formData.from,

        to: formData.to,
      });

      setResult(response.data.result);

      setConversionData({
        value: formData.value,

        from: formData.from,

        to: formData.to,
      });
    } catch (error) {
      alert(error.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);

    setConversionData(null);

    setFormData({
      value: "",
      from: "",
      to: "",
    });
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-gray-100
      to-slate-200
      flex
      items-start
      md:items-center
      justify-center
      p-5
      pt-10
      md:pt-0
      "
    >
      <div
        className="
        w-full
        max-w-md
        rounded-[36px]
        bg-white
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        border
        border-slate-200
        p-8
        transition-all
        duration-300
        "
      >
        {/* Header */}
        <div className="mb-8">
          <h1
            className="
            text-4xl
            font-black
            tracking-tight
            text-slate-900
            "
          >
            Unit Converter
          </h1>

          <p
            className="
            text-gray-500
            mt-2
            "
          >
            Convert units instantly
          </p>
        </div>

        {/* Tabs */}
        <div
          className="
          flex
          bg-slate-100
          rounded-2xl
          p-1
          mb-8
          "
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setType(tab);

                handleReset();
              }}
              className={`
                flex-1
                py-3
                rounded-xl
                capitalize
                font-semibold
                transition-all
                duration-300
                ${
                  type === tab
                    ? `
                    bg-white
                    text-black
                    shadow-md
                    `
                    : `
                    text-gray-500
                    hover:text-black
                    `
                }
                `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FORM VIEW */}
        {result === null ? (
          <div
            className="
            space-y-4
            animate-[fadeIn_.3s_ease]
            "
          >
            <h2
              className="
              text-xl
              font-bold
              capitalize
              text-slate-800
              "
            >
              {type} Converter
            </h2>

            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder={`Enter ${type}`}
              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              outline-none
              text-lg
              transition
              focus:ring-4
              focus:ring-slate-200
              focus:border-slate-400
              "
            />

            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              capitalize
              outline-none
              "
            >
              <option value="">Convert From</option>

              {units[type].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              capitalize
              outline-none
              "
            >
              <option value="">Convert To</option>

              {units[type].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            <button
              onClick={handleConvert}
              className="
              w-full
              rounded-2xl
              bg-black
              text-white
              py-4
              text-lg
              font-bold
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              flex
              items-center
              justify-center
              gap-2
              "
            >
              <BsArrowLeftRight />

              {loading ? "Converting..." : "Convert"}
            </button>
          </div>
        ) : (
          /* RESULT VIEW */
          <div
            className="
            py-2
            animate-[fadeIn_.3s_ease]
            "
          >
            <h2
              className="
              text-lg
              text-gray-500
              font-medium
              mb-5
              "
            >
              Result of your calculation
            </h2>

            <div
              className="
              rounded-3xl
              bg-gradient-to-br
              from-slate-900
              to-black
              p-8
              text-white
              mb-8
              shadow-xl
              "
            >
              <p
                className="
                text-sm
                uppercase
                tracking-widest
                text-gray-400
                "
              >
                Converted Value
              </p>

              <h1
                className="
                text-3xl
                font-black
                mt-3
                break-words
                "
              >
                {conversionData?.value} {conversionData?.from}
              </h1>

              <div
                className="
                text-3xl
                font-bold
                my-4
                "
              >
                =
              </div>

              <h1
                className="
                text-5xl
                font-black
                break-words
                "
              >
                {Number(result).toFixed(2).replace(/\.00$/, "")}{" "}
                {conversionData?.to}
              </h1>
            </div>

            <button
              onClick={handleReset}
              className="
              w-full
              rounded-2xl
              border-2
              border-black
              py-4
              font-bold
              text-lg
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
              flex
              items-center
              justify-center
              gap-2
              "
            >
              <FiRefreshCw />
              Reset
            </button>
          </div>
        )}

        {/* Footer */}
        <div
          className="
  mt-8
  pt-5
  border-t
  border-slate-200
  text-center
  "
        >
          <p
            className="
    text-sm
    text-gray-400
    "
          >
            Built with ❤️ by{" "}
            <span
              className="
      font-semibold
      text-slate-600
      "
            >
              Darth
            </span>
          </p>

          <p
            className="
    text-xs
    text-gray-300
    mt-1
    "
          >
            React • Express • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
