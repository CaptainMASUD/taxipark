import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutList,
  Grid3x3,
  Search,
  ListFilter,
  BookOpen,
  Layers,
  Tag,
  Clock,
  Inbox,
} from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'https://todo-app-api-theta.vercel.app/api';

function getDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatCountdown(timeMs) {
  const totalSeconds = Math.max(0, Math.floor(timeMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function Loader() {
  // Windows style Microsoft spinner with Tailwind
  return (
    <div className="flex justify-center items-center mt-20">
      <svg
        className="animate-spin h-12 w-12 text-teal-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );
}

export default function TodoDisplay() {
  const [todos, setTodos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [todosRes, coursesRes] = await Promise.all([
          axios.get(`${API}/todos`),
          axios.get(`${API}/courses`),
        ]);
        setTodos(todosRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    }

    fetchData();

    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTodos = todos.filter(todo => {
    return (
      (!search || todo.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCourse || todo.course?._id === filterCourse) &&
      (!filterType || todo.type === filterType) &&
      (!filterSection || todo.section.toLowerCase().includes(filterSection.toLowerCase()))
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-teal-400 mb-8 text-center"
        >
          Upcoming Tasks
        </motion.h1>

        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search todos..."
              className="w-full p-3 pl-10 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          </div>

          <div className="flex gap-3">
            <button
              className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-teal-600' : 'bg-slate-700'} transition`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <LayoutList />
            </button>
            <button
              className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-teal-600' : 'bg-slate-700'} transition`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <Grid3x3 />
            </button>
            <button
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle Filters"
            >
              <ListFilter />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <select
              className="p-3 rounded-lg bg-slate-800 border border-slate-600 text-white"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>

            <select
              className="p-3 rounded-lg bg-slate-800 border border-slate-600 text-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Theory">Theory</option>
              <option value="Lab">Lab</option>
            </select>

            <input
              type="text"
              placeholder="Section (e.g., 62_C1)"
              className="p-3 rounded-lg bg-slate-800 border border-slate-600 text-white"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            />
          </div>
        )}

        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-slate-400 select-none">
            <Inbox size={48} className="mb-4" />
            <p className="text-xl font-semibold">No tasks found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'flex flex-col gap-3'}>
            {filteredTodos.map(todo => {
              const daysLeft = getDaysLeft(todo.dueDate);
              const now = new Date();
              const dueDateObj = new Date(todo.dueDate);
              const timeDiffMs = dueDateObj.getTime() + 86400000 - now.getTime();

              let badgeContent = null;
              let badgeClass = '';
              if (daysLeft === 1) {
                badgeClass = 'bg-red-600 text-white';
                badgeContent = (
                  <div className="flex items-center gap-1 font-semibold">
                    <Clock size={16} />
                    <span>Due Tomorrow: {formatCountdown(timeDiffMs)}</span>
                  </div>
                );
              } else if (daysLeft === 2) {
                badgeClass = 'bg-yellow-500 text-slate-900 font-semibold px-2 py-1 rounded';
                badgeContent = 'Due in 2 days';
              } else if (daysLeft === 3) {
                badgeClass = 'bg-orange-500 text-white font-semibold px-2 py-1 rounded';
                badgeContent = 'Due in 3 days';
              } else if (daysLeft > 3) {
                badgeClass = 'bg-green-600 text-white font-semibold px-2 py-1 rounded';
                badgeContent = `Due in ${daysLeft} days`;
              } else if (daysLeft === 0) {
                badgeClass = 'bg-red-700 text-white font-bold px-2 py-1 rounded';
                badgeContent = 'Due Today!';
              } else if (daysLeft < 0) {
                badgeClass = 'bg-gray-700 text-gray-400 italic px-2 py-1 rounded';
                badgeContent = 'Overdue';
              }

              return (
                <motion.div
                  key={todo._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-slate-800 rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-teal-500"
                >
                  <div className="flex flex-col space-y-1 flex-grow min-w-0">
                    <h3 className="text-xl font-semibold text-teal-300 truncate">{todo.title}</h3>
                    {todo.description && (
                      <p className="text-slate-400 text-sm line-clamp-2">{todo.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {todo.course?.courseCode} - {todo.course?.courseName}
                      </span>
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          todo.type === 'Lab' ? 'bg-teal-600 text-slate-900' : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <Layers size={14} />
                        {todo.type}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                        <Tag size={14} />
                        {todo.section}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 min-w-[140px] text-right">
                    {daysLeft === 1 ? (
                      <div className={`${badgeClass} inline-flex items-center justify-center w-full rounded px-2 py-1`}>
                        {badgeContent}
                      </div>
                    ) : (
                      <div className={`${badgeClass} font-semibold`}>
                        {badgeContent || <>Due: {new Date(todo.dueDate).toLocaleDateString()}</>}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
