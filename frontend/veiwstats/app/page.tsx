"use client";
import { useState } from "react";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisState, setAnalysisState] = useState(null);

  const handleAnalyze = async () => {
    if (!textInput && !fileInput) {
      alert("Please enter some text or drop a file first!");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      let analysisType = "";

      if (fileInput) {
        analysisType = "file";
        const formData = new FormData();
        formData.append("file", fileInput);

        response = await fetch("http://localhost:8080/api/analyzefile", {
          method: "POST",
          body: formData,
        });
      } else {
        analysisType = "text";
        const formData = new FormData();
        formData.append("text", textInput);

        response = await fetch("http://localhost:8080/api/analyzetext", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        const rawData = await response.json();
        console.log("RAW DATA FROM BACKEND:", rawData);

        // 🚨 BULLETPROOF UNWRAPPING LOGIC 🚨
        // Java might hide the data inside a wrapper object. 
        // We look for common wrapper names and extract the inner data!
        let unwrappedData = rawData;
        if (rawData.analysisResult) {
          unwrappedData = rawData.analysisResult;
        } else if (rawData.fileAnalysisResult) {
          unwrappedData = rawData.fileAnalysisResult;
        } else if (rawData.summary && typeof rawData.summary === 'object') {
          // If the wrapper is named 'summary', unwrap it!
          unwrappedData = rawData.summary;
        }

        console.log("CLEAN UNWRAPPED DATA:", unwrappedData);

        setAnalysisState({ type: analysisType, data: unwrappedData });
      } else {
        alert("The server encountered an error parsing the request.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Failed to connect to the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCsvSentimentColor = (score) => {
    if (score >= 70) return "text-emerald-600";
    if (score >= 40) return "text-amber-500";
    return "text-rose-600";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 sm:p-8 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">

      {/* BACKGROUND DECORATIONS */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]"></div>
      </div>

      {analysisState ? (
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <header className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {analysisState.type === "file" ? "Bulk Analysis Report" : "Deep Text Analysis"}
              </h2>
              <p className="text-slate-500 font-medium mt-1">AI-extracted insights and metrics</p>
            </div>
            <button
              onClick={() => { setAnalysisState(null); setTextInput(""); setFileInput(null); }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-6 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              New Analysis
            </button>
          </header>

          {/* ========================================== */}
          {/* UI FOR BULK FILE ANALYSIS */}
          {/* ========================================== */}
          {analysisState.type === "file" && (
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col justify-center">
                <h3 className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-5 text-center">Overall Sentiment Distribution</h3>
                <div className="flex rounded-full overflow-hidden h-6 bg-slate-200 w-full mb-4 shadow-inner">
                  <div className="bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${analysisState.data?.sentiment?.positive || 0}%` }}></div>
                  <div className="bg-slate-400 transition-all duration-1000 ease-out delay-100" style={{ width: `${analysisState.data?.sentiment?.neutral || 0}%` }}></div>
                  <div className="bg-rose-500 transition-all duration-1000 ease-out delay-200" style={{ width: `${analysisState.data?.sentiment?.negative || 0}%` }}></div>
                </div>
                <div className="flex justify-between text-sm font-semibold px-2">
                  <span className="text-emerald-600">{analysisState.data?.sentiment?.positive || 0}% Positive</span>
                  <span className="text-slate-500">{analysisState.data?.sentiment?.neutral || 0}% Neutral</span>
                  <span className="text-rose-600">{analysisState.data?.sentiment?.negative || 0}% Negative</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900 tracking-wide">Top Pros</h3>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">{analysisState.data?.pros || "No notable pros detected."}</p>
                </div>

                <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-rose-900 tracking-wide">Top Cons</h3>
                  </div>
                  <p className="text-rose-800 leading-relaxed">{analysisState.data?.cons || "No notable cons detected."}</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-6 sm:p-8 rounded-3xl border border-indigo-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-indigo-900 tracking-wide">Executive Summary</h3>
                </div>
                {/* Properly grabbing the text string summary, not the object! */}
                <p className="text-indigo-900/80 text-lg leading-relaxed">"{typeof analysisState.data?.summary === 'string' ? analysisState.data.summary : "No summary available."}"</p>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* UI FOR SINGLE TEXT ANALYSIS */}
          {/* ========================================== */}
          {analysisState.type === "text" && (
            <div className="space-y-8">

              {/* TOP METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                <div className="sm:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                  <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Sentiment Distribution</h3>
                  <div className="flex rounded-full overflow-hidden h-4 bg-slate-200 w-full mb-3 shadow-inner">
                    <div className="bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${analysisState.data?.sentiment?.positive || 0}%` }}></div>
                    <div className="bg-slate-400 transition-all duration-1000 ease-out delay-100" style={{ width: `${analysisState.data?.sentiment?.neutral || 0}%` }}></div>
                    <div className="bg-rose-500 transition-all duration-1000 ease-out delay-200" style={{ width: `${analysisState.data?.sentiment?.negative || 0}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-emerald-600">{analysisState.data?.sentiment?.positive || 0}% Positive</span>
                    <span className="text-slate-500">{analysisState.data?.sentiment?.neutral || 0}% Neutral</span>
                    <span className="text-rose-600">{analysisState.data?.sentiment?.negative || 0}% Negative</span>
                  </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col justify-center items-center text-center">
                  <h3 className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-2">Readability</h3>
                  <span className="text-5xl font-black text-indigo-600 tracking-tighter">{analysisState.data?.readability_score || 0}</span>
                  <span className="text-sm font-medium text-indigo-400 mt-1 capitalize px-3 py-1 bg-white rounded-full shadow-sm">{analysisState.data?.style || "Standard"} Style</span>
                </div>
              </div>

              {/* PROS AND CONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-lg font-bold text-slate-800">Detected Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysisState.data?.pros?.length > 0 ? (
                      Array.isArray(analysisState.data.pros) ? analysisState.data.pros.map((pro, i) => (
                        <li key={i} className="flex items-start text-slate-600 font-medium">
                          <span className="mr-2 text-emerald-500 mt-1">•</span>{pro}
                        </li>
                      )) : <li className="text-slate-600 font-medium">{analysisState.data.pros}</li>
                    ) : <li className="text-slate-400 italic">No strengths identified.</li>}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-lg font-bold text-slate-800">Detected Weaknesses</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysisState.data?.cons?.length > 0 ? (
                      Array.isArray(analysisState.data.cons) ? analysisState.data.cons.map((con, i) => (
                        <li key={i} className="flex items-start text-slate-600 font-medium">
                          <span className="mr-2 text-rose-500 mt-1">•</span>{con}
                        </li>
                      )) : <li className="text-slate-600 font-medium">{analysisState.data.cons}</li>
                    ) : <li className="text-slate-400 italic">No weaknesses identified.</li>}
                  </ul>
                </div>
              </div>

              {/* SUMMARY & ENTITIES */}
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

                <div className="relative z-10">
                  <h3 className="text-sm text-indigo-300 uppercase tracking-widest font-bold mb-3">AI Synthesis</h3>
                  <p className="text-slate-200 text-lg leading-relaxed font-light mb-8">
                    {typeof analysisState.data?.summary === 'string' ? analysisState.data.summary : "No summary was generated for this text."}
                  </p>

                  {analysisState.data?.entities?.length > 0 && (
                    <div>
                      <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">Key Entities</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisState.data.entities.map((entity, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium rounded-lg border border-white/10 backdrop-blur-sm">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      ) : isLoading ? (

        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md bg-white/50 backdrop-blur-sm py-16 rounded-[2rem]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-full h-full border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <svg className="w-8 h-8 text-indigo-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Processing Insights</h2>
            <p className="text-slate-500 font-medium animate-pulse">Running advanced NLP models...</p>
          </div>
        </div>

      ) : (

        <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-indigo-100 mb-6 border border-slate-100 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Review Insight Engine</h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">Upload a bulk CSV or paste a single review to instantly extract sentiment, entities, and actionable metrics.</p>
          </div>

          <div
            className={`bg-white rounded-[2rem] shadow-xl ring-1 ring-slate-900/5 transition-all duration-300 overflow-hidden ${fileInput ? 'ring-2 ring-indigo-500 shadow-indigo-100' : ''}`}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2', 'ring-indigo-400', 'bg-indigo-50/30'); }}
            onDragLeave={(e) => { e.preventDefault(); if (!fileInput) e.currentTarget.classList.remove('ring-2', 'ring-indigo-400', 'bg-indigo-50/30'); }}
            onDrop={(e) => {
              e.preventDefault();
              setFileInput(e.dataTransfer.files[0]);
              e.currentTarget.classList.add('ring-2', 'ring-indigo-500');
            }}
          >
            <div className="p-8 pb-0">
              {fileInput ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mb-6 group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">File attached successfully</p>
                      <span className="text-sm font-medium text-indigo-600/70 truncate max-w-[200px] sm:max-w-xs block">{fileInput.name}</span>
                    </div>
                  </div>
                  <button onClick={() => setFileInput(null)} className="p-2 text-indigo-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center justify-center gap-3 text-sm font-semibold text-slate-400 mb-6">
                  <div className="h-px bg-slate-200 w-16"></div>
                  <span>Drop a CSV file or paste text below</span>
                  <div className="h-px bg-slate-200 w-16"></div>
                </div>
              )}

              <textarea
                className={`w-full h-40 p-0 border-0 focus:ring-0 resize-none text-slate-700 text-lg placeholder:text-slate-300 font-medium bg-transparent ${fileInput ? 'opacity-50 pointer-events-none' : ''}`}
                placeholder={fileInput ? "Bulk analysis mode active." : "Paste customer feedback, product reviews, or app comments here..."}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              ></textarea>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-[2rem]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-4 hidden sm:block">Ready for Analysis</span>
              <button
                onClick={handleAnalyze}
                disabled={!textInput && !fileInput}
                className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl transition-all duration-300 ${(!textInput && !fileInput) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5'}`}
              >
                Generate Report
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}