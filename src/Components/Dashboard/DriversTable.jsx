import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, ChevronDown, Edit, Trash2 } from 'lucide-react';

const DriversTable = ({ onAddDriver }) => {
  const [drivers] = useState([
    {
      id: 1,
      name: 'Rodion Raskolnikov',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1520390032345',
      connection: 'Active',
      price: 'BYN 1.20'
    },
    {
      id: 2,
      name: 'Elizabeth Bennet',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1235699702935',
      connection: 'Inactive',
      price: 'BYN 1.3'
    },
    {
      id: 3,
      name: 'Anna Karenina',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-9975634564570',
      connection: 'Active',
      price: 'BYN 1.2'
    },
    {
      id: 4,
      name: 'August Pullman',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-7946567456549',
      connection: 'Active',
      price: 'BYN 1.3'
    },
    {
      id: 5,
      name: 'Christian Grey',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1520390032345',
      connection: 'Active',
      price: 'BYN 1.3'
    },
    {
      id: 6,
      name: 'Robert Langdon',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1520390032345',
      connection: 'Active',
      price: 'BYN 1.3'
    },
    {
      id: 7,
      name: 'Lisbeth Salander',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1520390032345',
      connection: 'Inactive',
      price: 'BYN 1.3'
    },
    {
      id: 8,
      name: 'Atticus Finch',
      avatar: '/placeholder.svg?height=40&width=40',
      phone: '+1 (XXX) XXX-XXXX',
      license: 'DL-1520390032345',
      connection: 'Inactive',
      price: 'BYN 1.3'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Drivers</h1>
        <button
          onClick={onAddDriver}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contractor</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">
                <input type="checkbox" className="rounded bg-gray-600 border-gray-500" />
              </th>
              <th className="text-left p-4 text-gray-300 font-medium">Full Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Phone Number</th>
              <th className="text-left p-4 text-gray-300 font-medium">Driver's License</th>
              <th className="text-left p-4 text-gray-300 font-medium">Connection</th>
              <th className="text-left p-4 text-gray-300 font-medium">Current Price, km</th>
              <th className="text-left p-4 text-gray-300 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr key={driver.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4">
                  <input type="checkbox" className="rounded bg-gray-600 border-gray-500" />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={driver.avatar || "/placeholder.svg"}
                      alt={driver.name}
                      className="w-10 h-10 rounded-full bg-gray-600"
                    />
                    <span className="text-white font-medium">{driver.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">{driver.phone}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </td>
                <td className="p-4 text-gray-300">{driver.license}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      driver.connection === 'Active' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {driver.connection}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="p-4 text-white font-medium">{driver.price}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-400 text-sm">Showing 1-10 of 78</span>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">2</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">3</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriversTable;