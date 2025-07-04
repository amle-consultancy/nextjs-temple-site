import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 font-sans">
      <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl animate-pulse mx-4 md:mx-0 md:p-8">
        <div className="w-15 h-15 md:w-20 md:h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2 tracking-wide">
          Loading...
        </h2>
        <p className="text-white/80 text-base md:text-lg font-light">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};

export default Loading;
