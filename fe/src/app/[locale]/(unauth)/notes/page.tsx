'use client';
import React, { useState, useEffect } from 'react';
import { Banner } from '@/components/Banner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Footer from "../Footer/page";
import PreppalFooter from "@/components/PreppalFooter";
import CustomCardLoader from "@/components/CustomCardLoader";
import SubjectWiseLearning from '../subject-wise-learning/page'
const BoardPage = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const colors = ['#1b4f72', '#283747', '#4a235a', '#196f3d', '#116466', '#d35400'];
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const handleClassClick = (className) => setSelectedClass(className);
  const handleSubjectClick = (subject) => setSelectedSubject(subject);
  const classId = classes.find(cls => cls.className === selectedClass)?._id;

  // const classes = ['Class 12', 'Class 11', 'Class 10', 'Class 9', 'Class 8'];

  useEffect(() => {
    const fetchBoards = async () => {
      setLoadingUserData(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/board/getBoard`);
        const data = await res.json();
        setBoards(data.board);

      } catch (error) {
        setLoading(false);
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
        setLoadingUserData(false);
      }
    };

    fetchBoards();
  }, []);


  useEffect(() => {
    const fetchClasses = async () => {

      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/class/getClass`);
        const data = await res.json();
        setClasses(data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass) {
        setLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/subject/getSubject/?classId=${classId}`);
          const data = await res.json();
          setSubjects(data.subjects);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubjects();
  }, [selectedClass]);


  const handleImageClick = (subject) => router.push(`/subjects`);


  const renderNavigation = () => {
    let navigationText = '';
    if (selectedBoard) navigationText += `${selectedBoard} &nbsp; > &nbsp;`;
    if (selectedClass) navigationText += `  ${selectedClass} &nbsp; > &nbsp;`;
    if (selectedSubject) navigationText += selectedSubject;


    return (
      <div className="text-lg font-medium text-gray-900 mt-4">
        {selectedBoard && (
          <span>
            <span
              onClick={() => { setSelectedBoard(null); setSelectedClass(null); }}
              className="cursor-pointer hover:underline"
            >
              {selectedBoard} &gt;

            </span>

            {!selectedClass && (
              <span
                onClick={() => { setSelectedBoard(null); setSelectedClass(null); }}
                className="cursor-pointer hover:underline mx-1"
              >
                Change Board
              </span>
            )}
          </span>
        )}

        {selectedClass && (
          <span>
            <span
              onClick={() => { setSelectedClass(null); }}
              className="cursor-pointer hover:underline"
            >
              {selectedClass} &gt;
            </span>
            <span
              onClick={() => setSelectedClass(null)}
              className="cursor-pointer hover:underline mx-1"
            >
              Change Class
            </span>
          </span>
        )}

        {selectedSubject && (
          <span className="cursor-pointer">
            {selectedSubject}
          </span>
        )}
      </div>


    );
  };


  return (
    <div className="min-h-screen">
      <Banner notMainPage={true} loadingUserData={loadingUserData} />
      <div className="py-14 mb-7 bg-[#B3EFFF]">

        <div className="text-center  px-4">
          <h1 className="text-3xl font-extrabold text-white">
            <span className="block  tracking-tight text-cyan-400 text-4xl sm:text-5xl">
              India’s Trusted Platform
            </span>
            <span className="block tracking-tight font-extrabold text-gray-900 text-3xl sm:text-4xl mt-1">
              for Doubt Solving & Practice
            </span>
          </h1>
          <p className=" text-gray-900 font-light text-lg mt-4">Unlock the best learning experience with tailored practice questions.<br />Join thousands of students achieving academic excellence</p>
        </div>

      </div>



      <div className="px-4 sm:px-8  mb-8">

        {renderNavigation()}
        {loading && !selectedBoard ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-center shadow-lg"
                >
                  <CustomCardLoader
                    className=''
                    viewBox="0 0 100 50"
                    rectW="90%"
                    rectH="90"
                  />
                </div>
              ))}
          </div>
        ) : !selectedBoard ? (
          <>
            <div className='mb-6'>
              <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 text-center">Select Your Boards</h1>
              <p className='text-xl text-gray-500 text-center font-light'>Choose from india's leading educational board</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {boards.map((board, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedBoard(board.name)}
                  className="relative cursor-pointer p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-8"
                  style={{
                    backgroundImage: `url('/print_icon.png')`,
                    backgroundColor: board.color,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '30px 30px',
                    backgroundPosition: 'center',
                  }}
                >

                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl"></div>

                  <div className="relative flex flex-col items-center justify-center">
                    <Image
                      src={board.image}
                      alt={`${board.name} Logo`}
                      className="w-20 h-20 object-contain"
                      width={80}
                      height={80}
                    />
                    <h2 className="text-xl font-bold text-white text-center mt-4">
                      {board.name}
                    </h2>
                  </div>
                </div>
              ))}

            </div>


          </>
        ) : null}

        {selectedBoard && !selectedSubject && !selectedClass && (
          <div>
            {/* <h2 className="mt-8 text-2xl font-bold">Select Class</h2> */}
            <div className="flex gap-4 mt-3 w-full ">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  onClick={() => handleClassClick(classItem.className)}
                  style={{ backgroundImage: classItem.color }}
                  className={`h-48 w-48 p-14 flex text-center items-center justify-center rounded-xl cursor-pointer text-white font-bold text-xl transition-transform duration-100 ease-in-out hover:scale-105 
                    }`}
                >
                  <p className="text-4xl">{classItem.className}</p>
                </div>
              ))}

            </div>
            <div className="mt-6 text-gray-800 mb-8">
              <p className="font-light text-gray-500 text-lg">
                Select the class you are interested in from the options above. Each class has a unique color scheme to help you easily identify them. Once you select a class, you will be able to proceed with selecting the subject associated with that class. Feel free to explore and choose the class that suits your learning needs. If you're unsure about the class to choose, you can always come back and change your selection later. Each class provides different sets of resources tailored to the curriculum, so make sure to select the right one for your studies. We are here to help you navigate through the learning process, and selecting the right class is the first step towards your success!
              </p>
            </div>



          </div>
        )}
        {!selectedClass && (
          <SubjectWiseLearning
            handleImageClick={handleImageClick}
            selectedClass={selectedClass}
            classes={classes}
            loading={loading}
          />
        )}


        {selectedClass && (
          <div>
            <div className="flex flex-wrap gap-7 mt-7 mb-10">
              {loading ? (
                <>

                  {Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col px-20 py-5 rounded-lg shadow-lg transition-transform duration-300 ease-in-out cursor-pointer"
                        style={{ backgroundColor: "#f3f3f3" }}
                      >
                        <CustomCardLoader
                          className="w-16 h-16 object-cover rounded-t-lg"
                          viewBox="0 0 300 50"
                          rectW="90%"
                          rectH="90"
                        />

                      </div>
                    ))}
                </>
              ) : (

                subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex flex-col px-20 py-5 rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: subject.color }}
                    onClick={() => handleImageClick(subject.subjectName)}
                  >
                    <img
                      src={subject.image}
                      alt={subject.subjectName}
                      className="w-16 h-16 object-cover rounded-t-lg"
                    />
                    <p className="text-center text-sm font-semibold text-gray-500">
                      {subject.subjectName}
                    </p>
                  </div>
                ))

              )}


            </div>
          </div>
        )}

      </div>
      <PreppalFooter />
      <Footer />
    </div>
  );
};

export default BoardPage;