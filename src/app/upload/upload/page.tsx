import Image from 'next/image';

export default function Upload() {
  return (
    <div className="min-h-screen bg-[#f1eee5] relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Image 
          src="/landingbg1.png" 
          alt="landing-page-bg"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 py-6">
        {/* Header */}
        <header className="flex items-center justify-start mb-8">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Image 
              src="/spot icon.svg" 
              alt="spot-icon"
              width={500}
              height={500}
              className="w-12 h-12 md:w-14 md:h-14"
            />
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-[#5a7a3c]">
              SPOT
            </h1>
          </div>

          {/* Back to Home */}
          <button className="font-poppins text-[15px] font-bold text-[#316138] gap-1 ml-[100px]">
            &lt; Back to Home
          </button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button className="font-poppins text-[15px] font-bold text-[#246540]">
              Log In
            </button>
            <button className="font-poppins text-[15px] font-bold text-[#26451f] bg-[#d0e690]/50 px-6 py-2 rounded-[43px]">
              Sign Up
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex gap-8 items-center ml-[30px]">
          {/* Left Side - Image Upload Area */}
          <div className="flex-1">
            <div className="bg-[#d0e690]/30 border-2 border-dashed border-[#150e0e] rounded-[76px] w-[650px] h-[500px] flex items-center justify-center">
              {/* Image upload placeholder */}
            </div>
          </div>

          {/* Right Side - AI Response */}
          <div className="flex-1 flex flex-col gap-6 top-20 w-[527px] mt-8">
            <div className="bg-white/80 rounded-lg p-8 min-h-[350px]">
              <h2 className="font-poppins text-[15px] font-bold text-black mb-4">
                AI Response
              </h2>
              {/* AI response content goes here */}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <p className="font-poppins text-[15px] text-black mb-4 italic">
                Want to ask more questions and save your sightings?<br />
                Create your free account and join the SPOT community today!
              </p><br />
              
              <button className="relative inline-block">
                <div className="absolute inset-0 bg-black rounded-[29px] translate-x-1 translate-y-1" />
                <div className="relative bg-[#3a4216] rounded-[29px] px-12 py-3 border-2 border-black">
                  <span className="font-poppins text-[20px] font-bold tracking-[0.05em] text-[#c6e54d]">
                    Be an Explorer!
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}