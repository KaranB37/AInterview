
'use client'
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Import Chart.js for graphing
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [topCandidates, setTopCandidates] = useState([]);
    const [jobProfiles, setJobProfiles] = useState([]);

    useEffect(() => {
        // Generate static random data for candidates
        const generateRandomCandidates = () => {
            const profiles = ["Software Engineer", "Data Scientist", "Product Manager"];
            const generatedCandidates = [
                { name: "Candidate 1", jobProfile: "Data Scientist", correctAnswers: 0 },
                { name: "Candidate 2", jobProfile: "Data Scientist", correctAnswers: 1 },
                { name: "Candidate 3", jobProfile: "Data Scientist", correctAnswers: 0 },
                { name: "Candidate 4", jobProfile: "Data Scientist", correctAnswers: 4 },
                { name: "Candidate 5", jobProfile: "Software Engineer", correctAnswers: 3 },
                { name: "Candidate 6", jobProfile: "Software Engineer", correctAnswers: 2 },
                { name: "Candidate 7", jobProfile: "Product Manager", correctAnswers: 2 },
                { name: "Candidate 8", jobProfile: "Software Engineer", correctAnswers: 4 },
                { name: "Candidate 9", jobProfile: "Product Manager", correctAnswers: 1 },
                { name: "Candidate 10", jobProfile: "Software Engineer", correctAnswers: 5 },
                { name: "Candidate 11", jobProfile: "Data Scientist", correctAnswers: 3 },
                { name: "Candidate 12", jobProfile: "Data Scientist", correctAnswers: 2 },
                { name: "Candidate 13", jobProfile: "Product Manager", correctAnswers: 5 },
                { name: "Candidate 14", jobProfile: "Software Engineer", correctAnswers: 4 },
                { name: "Candidate 15", jobProfile: "Data Scientist", correctAnswers: 3 },
            ];

            return generatedCandidates;
        };

        const candidatesData = generateRandomCandidates();
        setCandidates(candidatesData);
        calculateTopCandidates(candidatesData);
    }, []);

    const calculateTopCandidates = (candidates) => {
        const profiles = {};
        candidates.forEach(candidate => {
            if (!profiles[candidate.jobProfile]) {
                profiles[candidate.jobProfile] = [];
            }
            profiles[candidate.jobProfile].push(candidate);
        });

        const topCandidates = {};
        for (const profile in profiles) {
            const sortedCandidates = profiles[profile].sort((a, b) => b.correctAnswers - a.correctAnswers);
            topCandidates[profile] = sortedCandidates.slice(0, 2); // Get top 2 candidates
        }

        setTopCandidates(topCandidates);
        setJobProfiles(Object.keys(topCandidates));
    };

    const getChartData = () => {
        const labels = candidates.map(candidate => candidate.name);
        const data = candidates.map(candidate => candidate.correctAnswers);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Correct Answers',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        };
    };

    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold'>Candidates Overview</h2>
            <table className='min-w-full mt-5'>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Name</th>
                        <th className='border px-4 py-2'>Job Profile</th>
                        <th className='border px-4 py-2'>Total Correct Answers</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td className='border px-4 py-2'>{candidate.name}</td>
                            <td className='border px-4 py-2'>{candidate.jobProfile}</td>
                            <td className='border px-4 py-2'>{candidate.correctAnswers}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className='text-2xl font-bold mt-10'>Top Candidates by Job Profile</h2>
            {jobProfiles.map((profile, index) => (
                <div key={index} className='mt-5'>
                    <h3 className='font-bold'>{profile}</h3>
                    <ul>
                        {topCandidates[profile].map((candidate, idx) => (
                            <li key={idx}>{candidate.name} - Correct Answers: {candidate.correctAnswers}</li>
                        ))}
                    </ul>
                </div>
            ))}

            <h2 className='text-2xl font-bold mt-10'>Performance Chart</h2>
            <Bar data={getChartData()} />
        </div>
    );
};

export default AdminPage;
