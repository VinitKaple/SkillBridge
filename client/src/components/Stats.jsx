// Stats.jsx – Complete dashboard in one file
import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend
} from 'recharts';

// ---------- Data (you can change these numbers) ----------
const totalStudentsPlaced = 238;
const totalCompaniesVisited = 38;
const averagePackage = 4200000; // ₹11.5 LPA

const genderData = [
  { name: 'Male', value: 280 },
  { name: 'Female', value: 210 }
];

const companyPackageData = [
  { name: 'Google', package: 24 },
  { name: 'Microsoft', package: 18 },
  { name: 'Amazon', package: 16 },
  { name: 'Flipkart', package: 14 },
  { name: 'Infosys', package: 8 },
  { name: 'TCS', package: 7 },
  { name: 'Wipro', package: 6.5 },
  { name: 'Accenture', package: 7.5 },
];

const departmentData = [
  { name: 'CSE', students: 150 },
  { name: 'ECE', students: 120 },
  { name: 'ME', students: 90 },
  { name: 'CE', students: 60 },
  { name: 'EE', students: 45 },
  { name: 'IT', students: 35 },
  { name: 'Chemical', students: 20 },
];

// Color palettes
const GENDER_COLORS = ['#3B82F6', '#EC4899', '#10B981']; // blue, pink, emerald
const BAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316',
];

// Helper: format large numbers (K, M, B)
const formatNumber = (num) => {
  if (!num) return 0;
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num;
};

// ---------- Live chart generator (optional) ----------
const generateInitialData = () => {
  let price = 42000;
  return Array.from({ length: 20 }, (_, i) => {
    price += Math.random() * 200 - 100;
    return { time: i, price: Math.round(price) };
  });
};

// ---------- Main Component ----------
const Stats = () => {
  // For live chart
  const [liveData, setLiveData] = useState(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const lastPrice = prev[prev.length - 1].price;
        const newPrice = Math.round(lastPrice + (Math.random() * 300 - 150));
        return [...prev.slice(1), { time: prev.length, price: newPrice }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latestPrice = liveData[liveData.length - 1]?.price;
  const previousPrice = liveData[liveData.length - 2]?.price;
  const isUp = latestPrice >= previousPrice;

  // Stat cards data
  const statCards = [
    {
      title: 'Students Placed',
      value: formatNumber(totalStudentsPlaced),
      growth: 18,
      color: 'blue',
    },
    {
      title: 'Companies Visited',
      value: formatNumber(totalCompaniesVisited),
      growth: 12,
      color: 'teal',
    },
    {
      title: 'Highest Package',
      value: formatNumber(averagePackage),
      growth: 22,
      prefix: '₹',
      color: 'orange',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-600' },
    teal: { bg: 'bg-teal-600' },
    orange: { bg: 'bg-orange-500' },
  };

  return (
    <div className="space-y-6">
      {/* ---------- Stat Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 text-sm">{card.title}</h3>
              <MoreHorizontal size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {card.prefix}
                  {card.value}
                </h2>
                <p className="text-xs mt-1 text-green-500">+{card.growth}% increase</p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorMap[card.color].bg}`}>
                <span className="text-white text-sm font-semibold">+{card.growth}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Two Charts Side by Side ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-4">Gender Distribution of Placed Students</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            {genderData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: GENDER_COLORS[index] }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Average Package by Company Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-4">Average Package by Company (in LPA)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyPackageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="package" radius={[10, 10, 0, 0]}>
                  {companyPackageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---------- Placement by Department Bar Chart (full width) ---------- */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-gray-600 text-sm mb-4">Placements by Department</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" radius={[10, 10, 0, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- Live Share Market Chart (optional) ---------- */}
      
    </div>
  );
};

export default Stats;