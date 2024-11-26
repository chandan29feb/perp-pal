"use client";
import React, { useEffect, useState } from "react";
 
import Faq from "@/components/FAQ/Faq";
import axios from "axios";
import QuestionOptions from "@/components/QuestionOptions";
import { McqQuestion, FilterOption } from "@/types/type";
import CustomCardLoader from "@/components/CustomCardLoader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import {  logoBtnColor } from "@/data/data";
import { Banner } from "@/components/Banner";
import {
  setUserProfile,
  userProfile,
  userProfileLoading,
} from "@/data/functions";

const useFetchData = (
  url: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dataType?: string | null
) => {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(url);
        if (dataType === "Questions") {
          setData(data);
        } else {
          setData(
            data.map((item: any) => ({ id: item.id, name: item.className }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, setData, setLoading]);
};

const EPaper: React.FC = () => {
  const [questionloading, setQuestionLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [classFilter, setClassFilter] = useState<FilterOption[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<FilterOption[]>([]);
  const [chapterFilter, setChapterFilter] = useState<FilterOption[]>([]);
  const [levelFilter, setLevelFilter] = useState<FilterOption[]>([]);
  const [formattedText, setFormattedText] = useState<string>("");
  const [alreadyCall, setAlreadyCall] = useState<boolean>(false);
  const [loadingUserData, setLoadingUserData] = useState();
  const [selectedFilters, setSelectedFilters] = useState({
    classId: null as string | null,
    subjectId: null as string | null,
    chapterId: null as string | null,
    levelId: null as string | null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let text = window.location?.pathname.split("/").pop();
      text = text?.split("--").join(" ");
      if (text) {
        setFormattedText(text);
        getQuestions(text);

        const titleElement = document.getElementById('nextjs-tile') as HTMLTitleElement;
        if (titleElement) {
          titleElement.textContent = `${text} | Create and practice online papers`;
        }
      }
    }

  
    
  }, []);

  const getQuestions = async (text: string) => {
    setQuestionLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/get/questions`,
        { prompt: text }
      );

      const mcqQuestions = data.filter(
        (item) => item.questionType === "Single Choice"
      );
      setQuestions(mcqQuestions);

      setQuestionLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();
  const handlePracticeClick = async () => {
    if (alreadyCall) {
      return;
    }

    setAlreadyCall(true);
    try {
      setShowLoader(true);

      const userId = userProfile?._id ?? null;
      //  const { data } = await axios.post(`https://prep-pal.algofolks.com/api/Question/generate-guid`);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/questions`,
        questions
      );
      const quetionsIds = response.data?.quetionsIds;

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/startassesment`,
        { quetionsIds: quetionsIds, userId: userId }
      );
      const text = formattedText.trim().replace(/\s+/g, "--");
      console.log("data", data);
      //  debugger
      router.push(
        `/practice-screen?paper=${encodeURIComponent(text)}&id=${encodeURIComponent(data.saveStartAssesment._id)}`
      );
    } catch (error) {
      console.error("Error generating practice:", error);
      setAlreadyCall(false);
    }
  };

  useFetchData(
    `https://prep-pal.algofolks.com/api/Education/class`,
    setClassFilter,
    setLoading
  );

  const fetchFilterOptions = async (type: string, id: string) => {
    try {
      const endpoint =
        type === "subject"
          ? `https://prep-pal.algofolks.com/api/Education/subject/class/67069f86fc430151577d39fd`
          : type === "chapter"
            ? `https://prep-pal.algofolks.com/api/Education/chapter/subject/670786588730a1e5d31aa614`
            : `https://prep-pal.algofolks.com/api/Education/level`;

      const { data } = await axios.get(endpoint);

      return data.map((item: any) => ({
        id: item.subjectId || item.chapterId || item.id,
        name: item.subjectName || item.chapterName || item.levelName,
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchFilterOptions("subject", "67069f86fc430151577d39fd").then(
      setSubjectFilter
    );
    fetchFilterOptions("chapter", "670788242e0e06e67865a429").then(
      setChapterFilter
    );
    fetchFilterOptions("level", "chapterId").then(setLevelFilter);
    // fetchUserData();
  }, []);
  const handleFilterChange = (
    filter: "classId" | "subjectId" | "chapterId" | "levelId",
    value: string | null
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [filter]: value }));
  };

  return (
    <>
      <div id="e-paper" className="h-screen overflow-auto">
        <Banner notMainPage={true} loadingUserData={loadingUserData} />

        {/* <DemoBanner notMainPage={true} /> */}
        <div
          id="maidiv"
          className="practixe-main grid grid-cols-1 sm:grid-cols-12 gap-4 py-0 sm:py-4 sm:px-4 mt-4 lg:mt-0 lg:px-8"
        >
          <div className="px-4 sm:px-1 col-span-12 sm:col-span-9 md:col-span-9 lg:col-span-9   bg-white">
            <div className="flex justify-between relative">
              {questionloading === false ? (
                <>
                  <div id="qsn-text-main-id" className="mt-1 md:mt-0">
                    <div className="text-md font-medium">Your Questions</div>
                    <div className="text-gray-500 font-sm text-md pr-2  max-w-full h-auto break-words mt-4 md:mt-0">
                      {formattedText}
                    </div>
                  </div>

                  {showLoader == true ? (
                    <Loader />
                  ) : (
                    <div className="h-100  absolute right-0 -mt-[5px] md:static md:mt-0">
                      <button
                        type="button"
                        className="border border-gray-500 w-[132px] h-[42px] bg-transparent cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none hover:bg-gray-200 "
                        onClick={handlePracticeClick}
                        style={{
                          border: "1px solid rgb(226, 226, 226)",
                          color: "rgb(107 114 128)",
                        }}
                      >
                        Start Practice
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="w-full flex"
                  style={{
                    height: window.innerWidth < 768 ? "50px" : "80px",
                  }}
                >
                  <div
                    style={{ width: window.innerWidth < 768 ? "70%" : "77%" }}
                  >
                    <div
                      className="h-4"
                      style={{ width: window.innerWidth < 768 ? "60%" : "30%" }}
                    >
                      <CustomCardLoader
                        viewBox={`0 0 380 45`}
                        className="rounded-lg"
                        rectW="100%"
                        rectH={window.innerWidth < 768 ? "130" : "40"}
                      />
                    </div>

                    <div
                      style={{
                        width: window.innerWidth < 768 ? "100%" : "95%",
                        marginTop: "20px",
                      }}
                    >
                      <CustomCardLoader
                        viewBox={`0 0 380 25`}
                        className="rounded-lg"
                        rectW="100%"
                        rectH={window.innerWidth < 768 ? "100" : "15"}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      width: window.innerWidth < 768 ? "30%" : "15%",
                      marginLeft: window.innerWidth < 768 ? "10px" : "70px",
                    }}
                  >
                    <CustomCardLoader
                      viewBox={`0 0 280 105`}
                      className="rounded-lg"
                      rectW="100%"
                      rectH={window.innerWidth < 768 ? "80" : "80"}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className="py-2 mt-2"
              style={{ borderBottom: "1px solid #e2e2e2" }}
            ></div>

            <div className="mb-0 mt-3">
              {questionloading
                ? Array.from({ length: 20 }, (_, i) => (
                    <CustomCardLoader
                      key={i}
                      viewBox={`0 0 380 80`}
                      className={"mt-2"}
                      rectW="100%"
                      rectH="70"
                    />
                  ))
                : questions.map((item, index) => (
                    <QuestionOptions
                      _id={item._id}
                      questionId={item.questionId}
                      question={item.question}
                      options={item.options}
                      correctAnswer={item.correctAnswer}
                      key={item.questionId}
                      index={index + 1}
                      minTime={item.minTime}
                      maxTime={item.maxTime}
                      avgTime={item.avgTime}
                      showHints={item.showHints}
                    />
                  ))}
            </div>

            {showLoader === true ? (
              <Loader className={"flex justify-center"} />
            ) : (
              <button
                type="button"
                className={`text-white ${logoBtnColor}  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-0 w-full`}
                disabled={showLoader}
                onClick={handlePracticeClick}
              >
                Start Practice
              </button>
            )}
          </div>

          <div className="col-span-12 sm:col-span-3">
            <Faq title={""} description={""} imageUrl={""} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EPaper;
