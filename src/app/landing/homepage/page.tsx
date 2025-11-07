'use client';
import React, { useState } from "react";
import Image from 'next/image';

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const leftFAQs = [
    {
      question: "Who is SPOT built for?",
      answer:
        "SPOT is built for individuals passionate about understanding and protecting wildlife — from students and educators to nature enthusiasts, hikers, researchers, and conservation advocates. It serves anyone eager to explore biodiversity, identify species, and contribute to ongoing environmental awareness and protection efforts",
    },
    {
      question: "How does SPOT identify species?",
      answer:
        "Simply upload or snap a photo, and SPOT's AI analyzes the image to suggest possible species, along with a confidence rating and key details about the organism.",
    },
    {
      question: "What happens when the AI isn't certain?",
      answer:
        "If the AI can't confidently identify the species, the sighting is sent to the community's verification hub, where experts and experienced users collaborate to confirm the correct identification.",
    },
    {
      question: "How accurate are SPOT's identifications?",
      answer:
        "SPOT's AI is trained on a large dataset of verified species images. While it achieves high accuracy, community experts double-check uncertain results to ensure reliability.",
    },
    {
      question: "What information does SPOT collect?",
      answer:
        "SPOT securely stores uploaded images, optional location data, user details, and identification activity. These are used only to enhance the system and support biodiversity studies.",
    },
  ];

  const rightFAQs = [
    {
      question: "How is my data protected?",
      answer:
        "All user data is encrypted and handled through trusted cloud services (like Supabase). Privacy and account security are prioritized through authentication safeguards.",
    },
    {
      question: "How can I contribute as part of the community?",
      answer:
        "Members can join verification efforts, share discoveries, and help confirm uncertain findings. Expert contributors play a key role in improving identification reliability.",
    },
    {
      question: "Can users interact with one another?",
      answer:
        "Yes — SPOT encourages collaboration. You can comment on sightings, react to posts, and connect with others who share the same interest in wildlife exploration.",
    },
    {
      question: "How does SPOT support wildlife conservation?",
      answer:
        "SPOT turns everyday observations into meaningful data, helping researchers and conservationists monitor species distribution, raise awareness, and protect at-risk wildlife.",
    },
    {
      question: "What makes SPOT different from other wildlife apps?",
      answer:
        "SPOT combines powerful AI with a passionate community. Instead of just identifying species, it encourages users to verify sightings, share discoveries, and learn together. Through collaboration and conservation awareness, SPOT turns wildlife exploration into a shared experience that connects people with nature and each other.",
    },
  ];

  const faqs = [...leftFAQs, ...rightFAQs];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <main className="bg-white overflow-x-hidden justify-center">

      {/* Centered Navigation Bar */}
      <header className="fixed top-3 left-1/2 transform -translate-x-1/2 w-[1383px] h-[94px] z-50">
        <div className="relative flex justify-center items-center h-full">
          <Image
            src="/topbar.png"
            alt="Navigation Background"
            width={1334}
            height={56}
            className="absolute top-[7px] left-1/2 -translate-x-1/2"
          />

          {/* Logo */}
          <div className="absolute top-[3px] left-[33px]">
            <Image
              src="/spot icon.svg"
              alt="SPOT Icon"
              width={79}
              height={54}
            />
          </div>

          <div className="absolute top-0 left-[110px] text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent"> SPOT </div>

          {/* Navigation Links */}
          <nav className="absolute top-[18px] left-1/2 -translate-x-1/2 flex items-center gap-[75px]">
            <a href="#home" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
              Home
            </a>
            <a href="#about" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
              About
            </a>
            <a href="#explore" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
              Explore
            </a>
            <a href="#faqs" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
              FAQs
            </a>
            <a href="#contact" className="font-bold text-[#306137] text-[15px] hover:text-[#246440] transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="absolute top-[15px] right-[40px] flex items-center gap-4">
            <button className="font-bold text-[#246440] text-[15px] hover:underline transition-all">
              Log In
            </button>
            <button className="w-[108px] h-[33px] bg-[#d1e39b] rounded-[9px] font-bold text-[#25451f] text-[15px] hover:bg-[#c5d78f] transition-all">
              Sign Up
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[743px] m-0 p-0 justify-center-safe">
        <Image
          src="/landingbg1.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Mascot */}
        <div className="absolute top-7 left-0 w-[695px] h-[746px] justify-center-safe">
          <Image
            src="/spotmascotshadow.svg"
            alt="SPOT Mascot Shadow"
            width={584}
            height={617}
            className="absolute top-[71px] left-10"
          />
          <Image
  src="/spotmascot.svg"
  alt="SPOT Mascot"
  width={638}
  height={688}
  className="absolute top-[29px] left-[29px] z-10"
/>
        </div>

        {/* Camera Icon with Focus Frame */}
        <div className="absolute top-[106px] left-[536px] w-[474px] h-[400px] justify-center-safe">
          <div className="absolute top-[31px] left-6 w-[382px] h-[341px] bg-[#b3d060] rounded-[64px] rotate-[-8.25deg]" />
          <div className="absolute top-[29px] left-[65px] w-[382px] h-[341px] bg-[#748348] rounded-[64px] rotate-[9.59deg]" />
          <div className="absolute top-[30px] left-[37px] w-[382px] h-[341px] bg-[#deecb6] rounded-[64px] border-[3px] border-solid border-[#373333]" />
          <Image
            src="/camfocus.svg"
            alt="Focus"
            width={283}
            height={283}
            className="absolute top-[59px] left-[86px]"
          />
          <Image
            src="/camicon.svg"
            alt="Camera Icon"
            width={94}
            height={47}
            className="absolute top-[181px] left-[181px]"
          />
        </div>

       {/* Hero Text with Double Layer */}
<div className="absolute top-[158px] left-[1052px] w-[303.743px] h-[254.525px] flex-shrink-0 justify-center-safe">

  {/* Black Shadow Layer -bottom */}
  <p 
    className="absolute top-[7.26px] left-[3.47px] text-[48px] font-extrabold text-black leading-normal"
    style={{
      WebkitTextStroke: '3px #000000'
    }}
  >
    Not sure<br />
    what snake that is?<br />
    Let SPOT<br />
    find out!
  </p>
  
  {/* White Text Layer with Green Stroke-top */}
  <p 
    className="absolute top-0 left-0 text-[48px] font-extrabold text-white leading-normal justify-center-safe"
    style={{
      WebkitTextStroke: '7px #213E26',
      paintOrder: 'stroke fill',
      WebkitTextFillColor: 'white'
    }}
  >
    Not sure<br />
    what snake that is?<br />
    Let SPOT<br />
    find out!
  </p>
</div>

        {/* Upload Button */}
        <div className="absolute top-[517px] left-[573px] w-[327px] h-[50px] justify-center-safe">
          <div className="relative">
            <Image
              src="/uploadimgshadow.svg"
              alt=""
              width={328}
              height={55}
              className="absolute top-[3px] -left-1"
            />
            <Image
              src="/uploadimgbg.svg"
              alt=""
              width={328}
              height={50}
              className="absolute top-0 left-px"
            />
            <div className="absolute top-1.5 left-[92px] font-extrabold text-[#246440] text-xl justify-center-safe">
              Upload Image
            </div>
          </div>
        </div>

        {/* Sample Images */}
        <div className="absolute top-[601px] left-[573px] w-[628px] h-[91px] justify-center-safe">
          <div className="absolute top-0 left-0 w-[626px] h-[91px] bg-white/85 rounded-[20px] justify-center-safe" />
          <p className="absolute top-[22px] left-[39px] font-bold text-[#1e613b] text-[15px]">
            No image?<br />Try one of these:
          </p>
          <Image src="/sample2.svg" alt="Sample 1" width={96} height={68} className="absolute top-[11px] left-[302px]" />
          <Image src="/sample3.svg" alt="Sample 2" width={85} height={68} className="absolute top-[11px] left-[417px]" />
          <Image src="/sample1.svg" alt="Sample 3" width={74} height={68} className="absolute top-[11px] left-[209px]" />
          <Image src="/sample4.svg" alt="Sample 4" width={74} height={68} className="absolute top-[11px] left-[521px]" />
        </div>
      </section>

      {/* Photo Cards Section */}
      <section className="relative bg-cover bg-no repeat bg-center m-0 p-0 justify-center-safe">
        <Image
          src="/landingbg2.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      <p className="relative top-[200px] left-[150px] text-center text-black text-[32px] font-bold max-w-[668px] mx-auto mb-12 justify-items-center-safe">
  From snakes in your backyard<br />to rare birds in the wild,
</p>

        {/* Card 1 */}
<div className="relative w-[430px] h-[283px] mx-auto mb-8">
  {/* Background Layer */}
  <div className="absolute top-[10px] left-[300px] w-[430px] h-[283px] bg-[#7b6832] rounded-[32px] rotate-[9deg] shadow-lg"></div>

  {/* Foreground Image */}
  <div className="relative w-[430px] h-[283px] left-[275px] rotate-[-1deg] rounded-[32px]">
    <Image
      src="/pic1.svg"
      alt="Wildlife"
      width={430}
      height={283}
      className="object-cover"
    />
  </div>
</div>

        <p className="relative top-[80px] left-[755px] text-center text-[32px] font-medium text-[#36683d] max-w-[600px] mx-auto mb-8">
          SPOT helps you know what you see — <span className="font-extrabold text-[#0d3b13]">instantly</span>.
        </p>

        {/* Card 2 */}
<div className="relative w-[420px] h-[279px] mx-auto mb-8 justify-center-safe">
  {/* Background Layer */}
  <div className="absolute top-[-100px] left-[-300px] w-[429px] h-[282px] bg-[#9e6e50] rounded-[31px] rotate-[-12deg] shadow-lg justify-center-safe"></div>

  {/* Foreground Image */}
  <div className="relative w-[420px] h-[279px] top-[-100px] left-[-275px] rotate-[1deg] rounded-[35px] justify-center-safe">
    <Image
      src="/pic2.svg"
      alt="Wildlife"
      width={420}
      height={279}
      className="object-cover"
    />
  </div>
</div>
      </section>

      {/* What is SPOT */}
      <section className="relative w-full h-auto bg-cover bg-center bg-no-repeat m-0 p-0">
        <Image
          src="/wisbg.svg"
          alt="Background"
          width={1140}
          height={750}
          className="object-cover absolute top-0 left-0"
          priority
        />
        <Image
          src="/wis.svg"
          alt="Decorative"
          width={494}
          height={750}
          className="absolute top-0 right-0"
        />

        <div className="relative z-10 max-w-[800px] mt-[-32] ml-28 pt-20 text-center px-8">
        <h2 className="text-[40px] font-bold italic text-[#f5df9d] [text-shadow:1px_1px_0_#000000] mb-6">
  What is{' '}
  <span 
    className="font-extrabold not-italic text-[48px] leading-normal 
               bg-[linear-gradient(175deg,_#95AB33_51.81%,_#23732F_81.92%,_#082E0D_110.23%)] 
               bg-clip-text text-transparent 
               [-webkit-text-stroke:1px_#000] 
               [text-shadow:none]"
  >
    SPOT
  </span>
  {' '}?
</h2>

          <div className="h-6" />

          <p className="text-2xl font-medium text-[#b1a06b] mb-6">
            SPOT stands for
          </p>
          
          <div className="h-3" />

          <div className="bg-[#f2ffce] rounded-[43px] py-4 px-8 mb-12 inline-flex items-center gap-4 w-[635px] h-[52px]">
            <span className="flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">S</span>
              <span className="text-2xl font-medium relative" style={{ top: "-6px" }}>pecies</span>
            </span>
            <span className="flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">P</span>
              <span className="text-2xl font-medium relative" style={{ top: "-6px" }}>rotection</span>
            </span>
            <span className="text-2xl font-medium mx-2">&</span>
            <span className="flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">O</span>
              <span className="text-2xl font-medium relative" style={{ top: "-6px" }}>nline</span>
            </span>
            <span className="flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold bg-gradient-to-b from-[#95ab33] via-[#23732f] to-[#082e0d] bg-clip-text text-transparent">T</span>
              <span className="text-2xl font-medium relative" style={{ top: "-6px" }}>racking</span>
            </span>
          </div>

        <p className="text-3xl font-medium text-[#ffec84] mb-24">
          SPOT is an AI-powered wildlife identification platform that helps communities recognize species quickly, safely, and accurately.
        </p>

        <div className="h-15" /> 

        <p className="text-3xl font-medium text-[#ffec84]">
          By combining technology and community knowledge, SPOT bridges the gap between humans and wildlife, reducing risks while protecting biodiversity.
        </p>
      </div>
      </section>

{/* How SPOT Works */}
<section className="py-20 mt-48 overflow-hidden">
<h2
  className="text-[64px] font-extrabold text-center mb-32"
  style={{
    background: 'linear-gradient(90deg, #399300 7.59%, #D2005B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  How SPOT works
</h2>
<br />


  {/* Snap or Upload */}
  <div className="relative mb-20 flex justify-end">
    {/* Shadow Layer */}
    <div className="absolute top-6 right-2 w-[1300px] h-[230px] bg-[#000000] rounded-full -mr-[104px]" />
    {/* Main Layer */}
    <div className="relative w-[1300px] h-[230px] bg-[#e3f2fd] rounded-full flex items-center -mr-[104px]">
      <Image
        src="/hiw1.svg"
        alt="Upload"
        width={200}
        height={200}
        className="absolute right-[220px]"
      />
      <div className="absolute left-[250px]">
  <div>
    <h3 className="text-5xl font-extrabold text-[#07224a]">Snap or Upload</h3><br />
  </div>
  <div className="ml-[-80]">
    <p className="text-2xl font-medium text-[#08234b]">Take a photo of wildlife or upload from your gallery.</p>
  </div>
</div>
    </div>
  </div>

  {/* Identify Instantly */}
  <div className="relative mb-20">
    {/* Shadow Layer */}
    <div className="absolute top-6 left-2 w-[1400px] h-[230px] bg-[#000000] rounded-full -ml-[104px]" />
    {/* Main Layer */}
    <div className="relative w-[1400px] h-[230px] bg-[#e8f5e9] rounded-full flex items-center -ml-[104px]">
      <Image
        src="/hiw2.svg"
        alt="Identify"
        width={290}
        height={290}
        className="absolute left-[220px]"
      />
     <div className="absolute right-[160px]">
  <div>
    <h3 className="text-5xl font-extrabold text-[#14462a]">Identify Instantly</h3><br />
  </div>
  <div className="ml-[-110]">
    <p className="text-2xl font-medium text-[#15472a]">Get real-time results with species details and safety tips.</p>
  </div>
</div>
    </div>
  </div>

  {/* Explore & Learn */}
  <div className="relative mb-20 flex justify-end">
    {/* Shadow Layer */}
    <div className="absolute top-6 right-2 w-[1300px] h-[230px] bg-[#000000] rounded-full -mr-[104px]" />
    {/* Main Layer */}
    <div className="relative w-[1300px] h-[230px] bg-[#fff3e0] rounded-full flex items-center -mr-[104px]">
      <Image
        src="/hiw3.svg"
        alt="Explore"
        width={200}
        height={200}
        className="absolute right-[220px]"
      />
      <div className="absolute left-[260px]">
  <div>
    <h3 className="text-5xl font-extrabold text-[#553f1c]">Explore & Learn</h3><br />
  </div>
  <div className="ml-[-80]">
    <p className="text-2xl font-medium text-[#553f1d]">Access maps, sightings, and conversation insights.</p>
  </div>
</div>
    </div>
  </div>

  {/* Join Communities - Extends Right */}
  <div className="relative mb-20">
    {/* Shadow Layer */}
    <div className="absolute top-6 left-2 w-[1550px] h-[230px] bg-[#000000] rounded-full -ml-[104px]" />
    {/* Main Layer */}
    <div className="relative w-[1550px] h-[230px] bg-[#f3e5f5] rounded-full flex items-center -ml-[104px]">
      <Image
        src="/hiw4.svg"
        alt="Community"
        width={270}
        height={270}
        className="absolute left-[200px]"
      />
      <div className="absolute right-[83px]">
  <div>
    <h3 className="text-5xl font-extrabold text-[#48224d]">Join Communities</h3><br />
  </div>
  <div className="ml-[-160]">
    <p className="text-2xl font-medium text-[#48234d]">Share your discoveries, connect with others, and grow your knowledge together.</p>
  </div>
</div>
    </div>
  </div>
</section>

{/* Call to Action banner */}
<section
  className="relative flex flex-col items-center justify-center py-25 mb-20 w-full"
  style={{
    backgroundImage: "url('/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "434px",
  }}
>
<div className="text-center max-w-4xl mx-auto px-8 -mt-30">
  <h2 className="text-4xl font-extrabold text-[#6a3f0a]/80">
    Turn curiosity into discovery.
  </h2><br />
  <p className="text-[22px] font-normal italic text-[#94705E]">
    With SPOT, every photo becomes a chance to learn, share, and protect.
  </p>
</div>

  <Image
    src="/bird.svg"
    alt="Bird"
    width={84}
    height={84}
    className="absolute top-[55px] right-[25%]"
  />
</section>

     {/* Who Can Join */}
<section className="relative py-50 w-[1405px] h-[1178px] mx-auto mr-[1500px]">

  <Image
    src="/bookbg.svg"
    alt="Decorative"
    width={306}
    height={306}
    className="absolute top-[872px] left-[189px]"
  />
  <Image
    src="/binocularsbg.svg"
    alt="Binoculars"
    width={340}
    height={340}
    className="absolute top-[557px] left-[1048px]"
  />
  <Image
    src="/mascot.svg"
    alt="SPOT Mascot"
    width={451}
    height={480}
    className="absolute top-[45px] left-[45px]"
  />

  {/* who can join spot */}
  <h2 className="absolute top-[27px] left-[525px] w-[704px] text-[64px] font-extrabold bg-clip-text text-transparent"
  style={{
    background: 'linear-gradient(270deg, #194B2F 16.81%, #2A7E4E 54.61%, #33975E 78.26%, #3CB16E 96.65%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}>
  Who can join SPOT?
</h2>

  {/* Everyone's Welcome */}
  <div className="absolute top-[179px] left-[482px] w-[395px]">
    <h3 className="text-5xl font-black bg-gradient-to-r from-[#667621] via-[#92a92f] to-[#bfdc3d] bg-clip-text text-transparent">
      EVERYONE&apos;S<br /><br />WELCOME<br /><br />HERE!
    </h3>
  </div>

  {/* Vertical Line */}
  <Image
    src="/line.svg"
    alt="Line"
    width={13}
    height={281}
    className="absolute top-[175px] left-[850px]"
  />

  {/* Description Text */}
  <p className="absolute top-[162px] left-[928px] w-[477px] text-[29px] font-semibold text-center bg-gradient-to-r from-[#586214] to-[#889953] bg-clip-text text-transparent">
    That&apos;s right! Whether you&apos;re just curious about the animals around you or an expert who knows species by heart — there&apos;s a place for you in SPOT&apos;s growing community.
  </p>

  {/* Learn and Discover Card */}
  <div className="absolute top-[599px] left-[174px] w-[846px] h-[249px] bg-[#3a617f]/10 rounded-[40px] shadow-[0px_4px_4px_#00000040]">
    <Image
      src="/landd.svg"
      alt="Learn"
      width={387}
      height={166}
      className="absolute top-[31px] left-[31px]"
    />
    <h3 className="absolute top-[23px] left-[454px] w-[332px] text-[32px] font-black text-[#0d2232]/90">
      Learn and Discover
    </h3>
    <p className="absolute top-[82px] left-[476px] w-[289px] text-sm font-medium text-[#103a5b]/90 text-center">
      Learn about wildlife around you<br /><br />
      Stay safe with easy-to-follow guides<br /><br />
      Discover new species and habitats
    </p>
    <p className="absolute top-[208px] left-[38px] w-[695px] text-sm font-light italic text-[#103a5b]/50">
      For those who love observing wildlife, staying safe outdoors, and gaining new knowledge.
    </p>
  </div>

  <Image
    src="/binoculars.svg"
    alt="Decorative"
    width={361}
    height={361}
    className="absolute top-[557px] left-[1008px]"
  />

  {/* Share and Guide Card */}
  <div className="absolute top-[890px] left-[523px] w-[846px] h-[251px] bg-[#511e1f]/10 rounded-[40px] shadow-[0px_4px_4px_#00000040]">
    <Image
      src="/sandg.svg"
      alt="Share"
      width={388}
      height={166}
      className="absolute top-[32px] left-[426px]"
    />
    <h3 className="absolute top-[28px] left-[88px] w-[284px] text-[32px] font-black text-[#2d0505]/90">
      Share and Guide
    </h3>
    <p className="absolute top-[81px] left-[56px] w-[337px] text-sm font-medium text-[#2d0505]/90 text-center">
      Verify and improve identifications<br /><br />
      Share your knowledge with explorers<br /><br />
      Contribute to conservation and research
    </p>
    <p className="absolute top-[209px] left-[110px] w-[766px] text-sm font-light italic text-[#2d0505]/50">
      For those with experience in species identification who want to help others and support conservation.
    </p>
  </div>

  <Image
    src="/book.svg"
    alt="Decorative"
    width={290}
    height={290}
    className="absolute top-[854px] left-[215px]"
  />

  {/* Ways to Explore */}
  <h2 className="absolute top-[530px] left-[316px] w-[769px] text-5xl font-extrabold text-right bg-clip-text text-transparent mb-40"
  style={{
    background: 'linear-gradient(270deg, #7E604D 14.8%, #517E2A 62.28%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}>
  Ways you can explore
</h2>
</section>

      {/* FAQs */}
<section className="py-20 px-6 lg:px-12 justify-center-safe">
  <h2 className="text-[40px] font-bold bg-gradient-to-r from-[#7d5917] to-[#70cb3f] bg-clip-text text-transparent mb-12 text-left">
    Frequently Asked Questions (FAQs)
  </h2><br /><br />

  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {faqs.map((faq, i) => (
        <article
          key={i}
          className={`rounded-lg p-5 transition-all ${
            openIndex === i ? "bg-white shadow-lg" : "bg-[#f7f7f7]"
          }`}
        >
          <button
            className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
            onClick={() => toggleFAQ(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-${i}`}
            type="button"
          >
            <p className="font-semibold text-[#14511d] text-lg">
              {faq.question}
            </p>

            <div className="w-[34px] h-[34px] bg-[#d9d9d9]/30 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
              <span className="text-2xl select-none">
                {openIndex === i ? "−" : "+"}
              </span>
            </div>
          </button>

          {openIndex === i && (
            <div
              id={`faq-${i}`}
              className="mt-4 text-[#14511d] text-base leading-relaxed"
            >
              {faq.answer}
            </div>
          )}
        </article>
      ))}
    </div>
  </div>
</section>

      {/* Footer */}
<section className="relative h-[576px] overflow-hidden">
  <Image
    src="/footer.svg"
    alt="Footer Background"
    width={1440}
    height={800}
    className="absolute -bottom-[170px] left-0 w-full object-cover"
  />
  <Image
    src="/footermascot.svg"
    alt="SPOT Mascot"
    width={593}
    height={605}
    className="absolute bottom-0 right-[1%] z-10"
  />
</section>
    </main>
  );
}