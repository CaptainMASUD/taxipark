import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useShopContext } from '../../Context/ShopContext';

const Statistics = () => {
  const { handleShowDashboard } = useShopContext();

  // Sample data for the chart
  const data = [
    { name: 'Dell XPS 12', price: 90, total: 85, rating: 92 },
    { name: 'Dell XPS 13', price: 50, total: 60, rating: 75 },
    { name: 'Dell XPS 14', price: 85, total: 90, rating: 88 },
    { name: 'Dell XPS 15', price: 65, total: 75, rating: 70 },
    { name: 'Dell XPS 12', price: 35, total: 40, rating: 45 },
    { name: 'Dell XPS 13', price: 75, total: 70, rating: 80 },
    { name: 'Dell XPS 14', price: 65, total: 70, rating: 75 },
    { name: 'Dell XPS 15', price: 100, total: 95, rating: 98 },
    { name: 'Dell XPS 12', price: 95, total: 90, rating: 92 },
    { name: 'Dell XPS 13', price: 95, total: 100, rating: 98 },
    { name: 'Dell XPS 14', price: 100, total: 95, rating: 100 },
    { name: 'Dell XPS 15', price: 95, total: 90, rating: 95 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
 

      {/* Statistics Banner */}
      <section className="bg-purple-600 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Statistics</h1>
          <p className="max-w-2xl mx-auto">
            Explore the latest gadgets that will take your experience to the next level. From smart devices to
            the coolest accessories, we have it all!
          </p>
        </div>
      </section>

      {/* Statistics Content */}
      <section className="py-8 px-4 bg-gray-50 flex-grow">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold mb-6">Statistics</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <Bar 
                  dataKey="price" 
                  name="Price" 
                  fill="url(#colorPrice)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar 
                  dataKey="total" 
                  name="Total" 
                  fill="url(#colorTotal)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar 
                  dataKey="rating" 
                  name="Rating" 
                  fill="url(#colorRating)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Statistics;