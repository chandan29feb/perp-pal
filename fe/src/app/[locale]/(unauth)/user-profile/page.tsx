'use client'
import { Banner } from '@/components/Banner'
import React,{useEffect,useState} from 'react'
import { FaPen } from 'react-icons/fa'
import axios from 'axios'
import { FaChartBar, FaClipboardList, FaClipboardCheck } from 'react-icons/fa'
import CustomCardLoader from '@/components/CustomCardLoader';
import { FilterLoader } from '@/data/data';
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
const userProfile = () => {
  const [aboutData, setAboutData] = useState({
    name:'',
    description: '',
    location: '',
    class: '',
    preparation: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    // Fetch data from the hardcoded "about" API
    axios.get(`${process.env.NEXT_PUBLIC_API_URI}/users/about`)
      .then((response) => {
        setAboutData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching about data:', error);
      });
  }, []);
  const [barData, setBarData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Lines of Code',
        data: [] as number[],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  })
    
  
      const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Lines of Code',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Months',
            },
          },
        },
      }

      useEffect(() => {
        // Fetch data from the API
        axios.get(`${process.env.NEXT_PUBLIC_API_URI}/users/graph`)
          .then((response) => {
            const { labels, data } = response.data
            setBarData({
              labels,
              datasets: [
                {
                  label: 'Lines of Code',
                  data,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            })
          })
          .catch((error) => {
            console.error('Error fetching bar chart data:', error)
          })
      }, [])

      const [statisticsData, setStatisticsData] = useState({
        projectView: 0,
        totalInterview: 0,
        totalProblemSolved: 0,
      });
      useEffect(()=>{
        axios.get(`${process.env.NEXT_PUBLIC_API_URI}/users/statistics`)
        .then((response)=>{
          setStatisticsData(response.data)
        }) .catch((error) => {
          console.error('Error fetching about data:', error);
        });
      },[])


      const [history, setHistory] = useState([]);

      useEffect(() => {
        
        const fetchHistoryData = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/history`);
            const data = await response.json();
            setHistory(data);
          } catch (error) {
            console.error("Error fetching history data:", error);
          }
        };
    
        fetchHistoryData();
      }, []);
  return (
    <>
    <div className='h-screen overflow-auto'>
      <Banner notMainPage={false} />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto py-8 px-4 pb-24">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-1 gap-6">
   
              {loading ? (
                  <CustomCardLoader viewBox={FilterLoader.viewBox} className={FilterLoader.className} rectW={FilterLoader.rectW} rectH={500}/> // Show loader while loading
                ) : (
                <div className="bg-gray-100 rounded-lg shadow-lg p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-blue-500">
                    <FaPen className="h-4 w-4" />
                  </button>
                  <div className="text-center">
                    <img src="/path-to-profile-image.jpg" alt="Profile" className="w-24 h-24 mx-auto rounded-full" />
                  <h2 className="text-md font-semibold mt-4">{aboutData.name}</h2>
                    <p className="text-gray-500 text-sm">{aboutData.location}</p>
                    <div className="mt-4">
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Connect</button>
                      <button className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">Message</button>
                    </div>
                  </div>
                  <div className="flex justify-around mt-6">
                    <div>
                      <p className="text-md font-bold">{aboutData.class}</p>
                      <p className="text-gray-500 text-md">Class</p>
                    </div>
                   
                    <div>
                      <p className="text-md font-bold">{aboutData.preparation}</p>
                      <p className="text-gray-500 text-md">Preparing For</p>
                    </div>
                  </div>
                </div>
                )}
           
           {loading ? (
                  <CustomCardLoader viewBox={FilterLoader.viewBox} className={FilterLoader.className} rectW={FilterLoader.rectW} rectH={150}/> // Show loader while loading
                ) : (
                <div className="bg-gray-100 rounded-lg shadow-lg p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-blue-500">
                    <FaPen className="h-4 w-4" />
                  </button>
                  <h3 className="text-md font-semibold text-center">About Me</h3>
                  <p className="text-gray-500 text-sm mt-2">{aboutData.description}</p>
                </div>
                )}
              </div>
            </div>

           
            <div className="col-span-1 md:col-span-9 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             
                <div className="bg-gray-100 rounded-lg shadow-lg p-4 text-center flex items-center">
                <div className="flex items-start mr-5">
          <FaChartBar className="text-3xl text-gray-700" />
        </div>
        <div className='flex flex-col justify-center items-center'>
                  <h3 className="text-md font-semibold text-gray-500">Project View</h3>
                  <p className="text-xl font-bold">{statisticsData.projectView}</p>
                  </div>
                </div >
                


                <div className="bg-gray-100 rounded-lg shadow-lg p-4 text-center flex items-center">
                <div className="flex items-start mr-5">
          <FaClipboardList className="text-3xl text-gray-700" />
        </div>
        <div className='flex flex-col justify-center items-center'>
                  <h3 className="text-md font-semibold text-gray-500">Total Interview</h3>
                  <p className="text-xl font-bold">{statisticsData.totalInterview}</p>
                  </div>
                </div>
          


                <div className="bg-gray-100 rounded-lg shadow-lg p-4 text-center flex items-center ">
  <div className="flex items-start mr-5">
    <FaClipboardCheck className="text-3xl text-gray-700" />
  </div>
  <div className='flex flex-col justify-center items-center'>
    <h3 className="text-md font-semibold text-gray-500">Total Problem Solved</h3>
    <p className="text-xl font-bold">{statisticsData.totalProblemSolved}</p>
  </div>
</div>
               
              </div>

              
              <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                  <h3 className="text-md font-semibold">Total data</h3>
               
                  <div className="mt-4" style={{ height: '200px' }}>
     
                    <Bar data={barData} options={barOptions} />
                  </div>
                
                </div>
            


                {loading ? (
                  <CustomCardLoader viewBox={FilterLoader.viewBox} className={FilterLoader.className} rectW={FilterLoader.rectW} rectH={120}/> // Show loader while loading
                ) : (
              <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                <h3 className="text-md font-semibold">History</h3>
                <ul className="mt-4">
                {history.map((job, index) => (
          <li key={index} className="flex justify-between py-2 text-gray-500">
            <span className="text-sm">{job.title}</span>
            <span className="text-sm">{job.duration}</span>
          </li>
        ))}
                </ul>
              </div>
                )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default userProfile