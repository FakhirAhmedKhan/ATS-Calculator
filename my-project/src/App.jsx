import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Target,
  Brain,
  Zap,
  Moon,
  Sun,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Lightbulb,
} from "lucide-react";

const ATSCalculator = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage?.getItem("ats-results") || "{}");
    if (savedData.cvText) setCvText(savedData.cvText);
    if (savedData.jobDescription) setJobDescription(savedData.jobDescription);
    if (savedData.analysis) setAnalysis(savedData.analysis);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => setCvText(e.target.result);
        reader.readAsText(file);
      } else {
        // For demo purposes, simulate PDF text extraction
        setCvText(
          `Sample CV content extracted from ${file.name}:\n\nJohn Doe\nSoftware Engineer\n\nSkills: JavaScript, React, Node.js, Python, SQL, MongoDB\nExperience: 5 years in web development\nEducation: Bachelor's in Computer Science\n\nPrevious roles:\n- Frontend Developer at Tech Corp (2020-2023)\n- Junior Developer at StartupXYZ (2019-2020)\n\nProjects:\n- E-commerce platform using React and Node.js\n- Data visualization dashboard with D3.js\n- Mobile app development with React Native`
        );
      }
    }
  };

  const extractKeywords = (text) => {
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "must",
      "shall",
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
  };

  const analyzeCV = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const cvKeywords = extractKeywords(cvText);
      const jobKeywords = extractKeywords(jobDescription);

      const cvWordSet = new Set(Object.keys(cvKeywords));
      const jobWordSet = new Set(Object.keys(jobKeywords));

      const matchedKeywords = [...jobWordSet].filter((word) =>
        cvWordSet.has(word)
      );
      const missedKeywords = [...jobWordSet].filter(
        (word) => !cvWordSet.has(word)
      );

      const score = Math.round(
        (matchedKeywords.length / jobWordSet.size) * 100
      );

      const analysisResult = {
        score,
        matchedKeywords: matchedKeywords.slice(0, 10),
        missedKeywords: missedKeywords.slice(0, 10),
        totalJobKeywords: jobWordSet.size,
        improvements: [
          `Add ${missedKeywords
            .slice(0, 3)
            .join(", ")} to better match job requirements`,
          "Include more specific technical skills mentioned in the job description",
          "Quantify achievements with numbers and metrics",
          "Use action verbs to describe your experience",
          "Ensure all required qualifications are clearly mentioned",
        ],
        breakdown: {
          skills: Math.round(Math.random() * 40 + 60),
          experience: Math.round(Math.random() * 30 + 70),
          education: Math.round(Math.random() * 20 + 80),
          keywords: score,
        },
      };

      setAnalysis(analysisResult);
      setCurrentStep(3);
      setIsAnalyzing(false);

      // Save to memory
      const dataToSave = { cvText, jobDescription, analysis: analysisResult };
      localStorage?.setItem("ats-results", JSON.stringify(dataToSave));
    }, 2000);
  };

  const resetTool = () => {
    setCvText("");
    setJobDescription("");
    setAnalysis(null);
    setCvFile(null);
    setCurrentStep(1);
    localStorage?.removeItem("ats-results");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"
              : "bg-gradient-to-br from-purple-100/30 via-blue-100/30 to-cyan-100/30"
          }`}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header
          className={`backdrop-blur-lg border-b transition-all duration-300 ${
            darkMode
              ? "bg-gray-900/80 border-gray-700"
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1
                  className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent`}
                >
                  ATS Calculator
                </h1>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30"
                      : darkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {index < 2 && (
                  <div
                    className={`w-24 h-1 mx-4 rounded transition-all duration-300 ${
                      currentStep > step
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                        : darkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* CV Upload Section */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-purple-400" />
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Upload Your CV/Resume
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                          darkMode
                            ? "border-gray-600 hover:border-purple-500 bg-gray-800/30"
                            : "border-gray-300 hover:border-purple-500 bg-gray-50/50"
                        }`}
                      >
                        <Upload
                          className={`w-12 h-12 mx-auto mb-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`text-lg font-medium mb-2 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cvFile ? cvFile.name : "Drop your CV here"}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          PDF, DOC, or TXT files
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Or paste your CV text:
                      </label>
                      <textarea
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                        placeholder="Paste your CV content here..."
                        className={`w-full h-40 p-4 rounded-lg border transition-all duration-300 ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
                        } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description Section */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-6 h-6 text-cyan-400" />
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Job Description
                    </h2>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className={`w-full h-48 p-4 rounded-lg border transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500"
                    } focus:ring-2 focus:ring-cyan-500/20 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Continue Button */}
              {cvText && jobDescription && (
                <div className="text-center">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                  >
                    Continue to Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Review Section */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Eye className="w-6 h-6 text-purple-400" />
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Review Your Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3
                        className={`font-medium mb-3 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        CV Content Preview:
                      </h3>
                      <div
                        className={`p-4 rounded-lg border h-40 overflow-y-auto ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-300"
                            : "bg-gray-50 border-gray-300 text-gray-700"
                        }`}
                      >
                        {cvText.substring(0, 500)}...
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`font-medium mb-3 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Job Description Preview:
                      </h3>
                      <div
                        className={`p-4 rounded-lg border h-40 overflow-y-auto ${
                          darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-300"
                            : "bg-gray-50 border-gray-300 text-gray-700"
                        }`}
                      >
                        {jobDescription.substring(0, 500)}...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Button */}
              <div className="text-center">
                <button
                  onClick={analyzeCV}
                  disabled={isAnalyzing}
                  className={`px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAnalyzing ? "animate-pulse" : ""
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Analyze ATS Compatibility</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && analysis && (
            <div className="space-y-8">
              {/* Score Display */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8 text-center">
                  <div
                    className={`text-6xl font-bold mb-4 ${getScoreColor(
                      analysis.score
                    )}`}
                  >
                    {analysis.score}%
                  </div>
                  <div
                    className={`text-lg font-medium mb-6 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ATS Compatibility Score
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient(
                        analysis.score
                      )} transition-all duration-1000`}
                      style={{ width: `${analysis.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <h3
                    className={`text-xl font-semibold mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Detailed Analysis
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4
                        className={`font-medium mb-4 flex items-center ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Matched Keywords ({analysis.matchedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.matchedKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4
                        className={`font-medium mb-4 flex items-center ${
                          darkMode ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Missing Keywords ({analysis.missedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missedKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <h3
                    className={`text-xl font-semibold mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Category Breakdown
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(analysis.breakdown).map(
                      ([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-2">
                            <span
                              className={`font-medium capitalize ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {category}
                            </span>
                            <span
                              className={`font-bold ${getScoreColor(score)}`}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(
                                score
                              )} transition-all duration-1000`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div
                className={`backdrop-blur-lg rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/50 border-gray-200"
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    <h3
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Improvement Suggestions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {analysis.improvements.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-4 rounded-lg ${
                          darkMode ? "bg-gray-800/50" : "bg-gray-50/50"
                        }`}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetTool}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    const reportData = `ATS Analysis Report\n\nScore: ${
                      analysis.score
                    }%\n\nMatched Keywords: ${analysis.matchedKeywords.join(
                      ", "
                    )}\n\nMissing Keywords: ${analysis.missedKeywords.join(
                      ", "
                    )}\n\nImprovements:\n${analysis.improvements
                      .map((imp, i) => `${i + 1}. ${imp}`)
                      .join("\n")}`;
                    const blob = new Blob([reportData], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "ats-analysis-report.txt";
                    a.click();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ATSCalculator;
