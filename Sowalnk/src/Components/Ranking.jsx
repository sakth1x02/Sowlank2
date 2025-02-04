import React, { useEffect, useState } from "react";
import { CircleUser } from "lucide-react";
const Ranking = () => {
  const [users, setUsers] = useState([]);

  const RankingData = [
    {
      position: 1,
      name: "Person",
      positivePoints: 100,
      negativePoints: 10,
      totalPoints: 90,
    },
    {
      position: 2,
      name: "Person",
      positivePoints: 80,
      negativePoints: 7,
      totalPoints: 73,
    },
    {
      position: 3,
      name: "Person",
      positivePoints: 80,
      negativePoints: 7,
      totalPoints: 73,
    },
    {
      position: 4,
      name: "Person",
      positivePoints: 70,
      negativePoints: 3,
      totalPoints: 67,
    },
    {
      position: 5,
      name: "Person",
      positivePoints: 69,
      negativePoints: 3,
      totalPoints: 66,
    },
    {
      position: 6,
      name: "Person",
      positivePoints: 70,
      negativePoints: 5,
      totalPoints: 65,
    },
    {
      position: 7,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 8,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 9,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 10,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 11,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 12,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
    {
      position: 13,
      name: "Person",
      positivePoints: 80,
      negativePoints: 5,
      totalPoints: 75,
    },
  ];

  const currentPerson = {
    name: "Person 00",
    positivePoints: 25,
    negativePoints: 3,
    totalPoints: 22,
  };

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:1000/api/v1/user/users");
    const res = await response.json();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-100 p-6 min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Power Rankings
        </h1>
        <h1 className="text-4xl font-bold text-purple-800 mb-6">Sowalnk</h1>
      </div>
      <div className="overflow-auto w-full  h-96 max-w-4xl rounded-lg shadow-md">
        <table className="w-full text-left overflow-auto  border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Position</th>
              <th className="p-3">Name</th>
              <th className="p-3">Positive Points</th>
              <th className="p-3">Negative Points</th>
              <th className="p-3">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((person, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                } hover:bg-blue-100`}
              >
                <td className="p-3 pl-7 font-bold">{person?.position}</td>
                <td className="p-3">
                  <div className="flex gap-3 items-center">
                    <CircleUser className="w-6 h-6 inline-block" />
                    {person.name}
                  </div>
                </td>
                <td className="p-3">{person?.positivePoints}</td>
                <td className="p-3">{person?.negativePoints}</td>
                <td className="p-3 font-bold">{person?.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 w-full max-w-2xl bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          Current Person Level
        </h2>
        <div className="flex justify-between items-center">
          <div className="font-semibold">Name: {currentPerson.name}</div>
          <div className="flex gap-6">
            <div>Positive Points: {currentPerson.positivePoints}</div>
            <div>Negative Points: {currentPerson.negativePoints}</div>
            <div className="font-bold">
              Total Points: {currentPerson.totalPoints}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
