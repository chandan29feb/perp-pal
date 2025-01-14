"use client";
import { useRouter } from "next/navigation";
import "@/styles/global.css";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaSearch } from "react-icons/fa";

import ForgetPassword from "@/components/ForgetPassword";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { Banner } from "@/components/Banner";
import { cardData } from "@/data/cardData";
import {
  freePrompt,
  setFreePrompt,
  setUserProfile,
} from "@/data/functions";

import logo from "../../../images/logo1.png";
import { trackGAEvent } from "../(unauth)/googleAnalytics";
import Footer from "@/components/Footer";
import SharePreppal from "@/components/SharePreppal";
import PreppalFooter from "@/components/PreppalFooter";
import Blogs from "@/components/Blogs";

export default function Layout() {
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const [loadingUserData, setLoadingUserData] = useState(true);

  const [sharePreppal, setSharePreppal] = useState(false);
  const handleMicClick = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      let timeoutId: NodeJS.Timeout;
      recognition.start();
      recognition.onresult = (event: any) => {
        const results = event.results;
        const transcript = results[results.length - 1][0].transcript;
        setSearchText(transcript);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          recognition.stop();
        }, 2000);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };
      recognition.onend = () => {
        clearTimeout(timeoutId);
      };
    } else {
      alert("Your browser does not support speech recognition.");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/users/me`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const userData = await response.json();

        setUserProfile(userData.data);
      } else if (response.status === 400) {
        console.warn("User is not logged in or session has expired");

      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      setLoadingUserData(false);

    } finally {
      setLoadingUserData(false); // Set loading to false after fetching user data
    }
  };

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUserData();
    }

    setFreePrompt();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const routes = [
      `/e-paper/Create--a--basic--question--paper--on--Newton's--laws--of--motion--for--Class--9.`,
      `/e-paper/Generate--an--advanced--test--on--organic--chemistry--reactions--for--high--school--students.`,
      `/e-paper/Make--a--practice--paper--with--short--answers--on--probability--and--statistics.`,
      `/e-paper/Generate--an--MCQ-based--test--on--Life--Processes--for--Class--10--Biology.`,
      `/e-paper/Create--a--test--on--Trigonometric--Functions`,
      `/e-paper/Create--a--test--on--Chemical--Reactions--and--Equations.`,
      `/e-paper/Make--an--easy--practice--paper--on--Linear--Equations--in--Two--Variables.`,
      `/e-paper/Prepare--challenging--questions--on--Integrals--in--Mathematics.`,
    ];

    Promise.all(routes.map(route => router.prefetch(route)))
      .then(() => {
        console.log('All routes prefetched');
      })
      .catch((err) => {
        console.error('Error prefetching routes:', err);
      });

  }, []);

  const handleCardClick = (promptText: string) => {
    if (freePrompt == false) {
      setSharePreppal(true);
      return
    }
    const formattedText = promptText.replace(/\s+/g, "--");
    router.push(`/e-paper/${formattedText}`);
    // trackEvent(first_card);
    trackGAEvent("Card", "cardClick", promptText);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (freePrompt == false) {
      setSharePreppal(true);
      return
    }
    if (e.key === "Enter" && searchText.trim() !== "") {
      const formattedText = searchText.trim().replace(/\s+/g, "--");
      router.push(`/e-paper/${formattedText}`);
    }
  };

  const openModal = (isSignInModal: boolean) => {
    setIsSignIn(isSignInModal);
    setIsModalOpen(true);
    setIsForgetPassword(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsForgetPassword(false);
  };

  const openForgetPassword = () => {
    setIsForgetPassword(true);
    setIsSignIn(false);
    setIsModalOpen(true);
  };
  const handleLogin = () => {

    closeModal();
  };


  return (
    <div className="flex flex-col justify-between w-full h-[100vh]">
      <Banner notMainPage={false} loadingUserData={loadingUserData} />
      {
        sharePreppal && <SharePreppal setSharePreppal={setSharePreppal} />
      }
      <div className="px-4 sm:px-8" >
        <div className="flex flex-col lg:gap-5">
          <div className="my-5 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src={logo}
                alt="Google Logo"
                width={270}
                height={100}
                className="mx-auto h-[100px] object-contain"
              />
            </div>
          </div>
          {/* Search Bar */}
          <div className="mb-6 flex items-center justify-center   sm:px-4 lg:px-12 ">
            <div className="relative w-full max-w-lg sm:max-w-xl  md:max-w-[52.8%] ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a text to generate practice questions."
                className="h-10 w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-12 pr-10 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 sm:py-3 sm:pl-14 md:text-base" // Added md:text-base for larger text size on tablets and up
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-5">
                <FaMicrophone
                  className="cursor-pointer text-gray-400"
                  onClick={handleMicClick}
                />
              </span>
            </div>
          </div>

          {/* Card Section */}
          <div className="mb-4 grid grid-cols-1 sm: gap-4   sm:grid-cols-2   md:grid-cols-3 lg:grid-cols-4">
            {cardData.records.map((card: any) => (
              <button
                type="button"
                key={card.prompt_text}
                className="group relative cursor-pointer rounded-lg bg-gray-100 p-4 text-start shadow-md transition-shadow hover:shadow-lg"
                onClick={() => handleCardClick(card.prompt_text)}
              >
                <p className="text-gray-600">{card.prompt_text}</p>
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-gray-700 px-2 group-hover:block">
                  <span className="tooltiptext rounded py-1 text-sm text-gray-50">
                    {card.prompt_Description}
                  </span>
                  <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-gray-700" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="sticky bottom-0"> */}
      <Blogs />
      <PreppalFooter />
      <Footer />
      {/* </div> */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-8 flex flex-col items-center"> */}
          {isForgetPassword ? (
            <ForgetPassword
              onClose={closeModal}
              onSwitchToSignIn={() => {
                setIsForgetPassword(false);
                setIsSignIn(true); // Show Sign In form when switching from Forget Password
              }}

            />
          ) : isSignIn ? (
            <SignIn
              onClose={closeModal}
              onSwitchToSignUp={() => openModal(false)}
              onForgotPassword={openForgetPassword}
              onLogin={handleLogin}
            />
          ) : (
            <SignUp
              onClose={closeModal}
              onSwitchToSignIn={() => openModal(true)}

            />
          )}
        </div>
      )}
    </div>
  );
}
