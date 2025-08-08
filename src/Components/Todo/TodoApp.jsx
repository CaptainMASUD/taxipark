import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  X,
  ClipboardList,
  BookOpen,
  Trash,
  Calendar,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'https://todo-app-api-theta.vercel.app/api';

function Loader() {
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

export default function CourseTodoApp() {
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');

  const [selectedCourse, setSelectedCourse] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [todoDate, setTodoDate] = useState('');
  const [todoSection, setTodoSection] = useState('');
  const [todoType, setTodoType] = useState('Theory');
  const [todos, setTodos] = useState([]);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [coursesRes, todosRes] = await Promise.all([
          axios.get(`${API}/courses`),
          axios.get(`${API}/todos`),
        ]);
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
        setTodos(Array.isArray(todosRes.data) ? todosRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCourses([]);
        setTodos([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Re-fetch functions for after actions
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`);
      setTodos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    }
  };

  // Course submit
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) {
      alert('Please enter both course code and name.');
      return;
    }
    try {
      await axios.post(`${API}/courses`, {
        courseCode: courseCode.trim(),
        courseName: courseName.trim(),
      });
      setCourseCode('');
      setCourseName('');
      setShowCourseForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course.');
    }
  };

  // Todo submit
  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert('Please select a course.');
      return;
    }
    if (!todoTitle.trim()) {
      alert('Please enter a todo title.');
      return;
    }
    if (!todoDate) {
      alert('Please select a due date.');
      return;
    }
    if (!todoSection) {
      alert('Please select a section.');
      return;
    }
    try {
      await axios.post(`${API}/todos`, {
        course: selectedCourse,
        title: todoTitle.trim(),
        description: todoDescription.trim(),
        dueDate: todoDate,
        section: todoSection,
        type: todoType,
      });
      setSelectedCourse('');
      setTodoTitle('');
      setTodoDescription('');
      setTodoDate('');
      setTodoSection('');
      setTodoType('Theory');
      setShowTodoForm(false);
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo.');
    }
  };

  // Open modal
  const openDeleteModal = (type, id) => {
    setDeleteModal({ open: true, type, id });
  };

  // Close modal
  const closeDeleteModal = () => {
    if (!deleting) setDeleteModal({ open: false, type: '', id: null });
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    setDeleting(true);
    try {
      if (type === 'course') {
        await axios.delete(`${API}/courses/${id}`);
        fetchCourses();
      } else if (type === 'todo') {
        await axios.delete(`${API}/todos/${id}`);
        fetchTodos();
      }
      setDeleteModal({ open: false, type: '', id: null });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}.`);
    }
    setDeleting(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1427] via-[#112b3c] to-[#0c1427] p-8 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-12 text-teal-400 drop-shadow-lg flex items-center justify-center gap-3"
        >
          <BookOpen size={48} /> Course Todo Manager
        </motion.h1>

        {/* Buttons row */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-6">
          <button
            onClick={() => setShowCourseForm((v) => !v)}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors font-semibold shadow-lg text-gray-900"
          >
            {showCourseForm ? <X size={24} /> : <Plus size={24} />}
            {showCourseForm ? 'Close Course Form' : 'Add New Course'}
          </button>

          <button
            onClick={() => setShowTodoForm((v) => !v)}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 transition-colors font-semibold shadow-lg text-gray-900"
          >
            {showTodoForm ? <X size={24} /> : <Plus size={24} />}
            {showTodoForm ? 'Close Todo Form' : 'Add New Todo'}
          </button>
        </div>

        {/* Forms */}
        <div className="max-w-xl mx-auto space-y-12 mb-12">
          <AnimatePresence>
            {showCourseForm && (
              <motion.form
                onSubmit={handleCourseSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#112b3c] rounded-2xl p-8 shadow-lg border border-teal-500"
              >
                <h2 className="text-2xl font-bold mb-6 text-amber-400 flex items-center gap-3">
                  <ClipboardList size={28} />
                  Add New Course
                </h2>
                <input
                  type="text"
                  placeholder="Course Code (e.g. CSE101)"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-[#0c1427] border border-teal-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                  className="w-full mb-6 px-4 py-3 rounded-lg bg-[#0c1427] border border-teal-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-gray-900 font-semibold py-3 rounded-lg shadow-md flex justify-center items-center gap-3"
                >
                  <Plus size={20} /> Add Course
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTodoForm && (
              <motion.form
                onSubmit={handleTodoSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#112b3c] rounded-2xl p-8 shadow-lg border border-amber-500"
              >
                <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center gap-3">
                  <FileText size={28} />
                  Add New Todo
                </h2>

                <select
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(({ _id, courseCode, courseName }) => (
                    <option key={_id} value={_id}>
                      {courseCode} - {courseName}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Todo Title"
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  required
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={todoDescription}
                  onChange={(e) => setTodoDescription(e.target.value)}
                  rows={3}
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />

                <select
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={todoSection}
                  onChange={(e) => setTodoSection(e.target.value)}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="62_C">62_C</option>
                  <option value="62_C1">62_C1</option>
                  <option value="62_C2">62_C2</option>
                </select>

                <select
                  className="w-full mb-6 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={todoType}
                  onChange={(e) => setTodoType(e.target.value)}
                  required
                >
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                </select>

                <input
                  type="date"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                  required
                  className="w-full mb-6 px-4 py-3 rounded-lg bg-[#0c1427] border border-amber-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 transition-colors text-gray-900 font-semibold py-3 rounded-lg shadow-md flex justify-center items-center gap-3"
                >
                  <Calendar size={20} /> Add Todo
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Courses List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 border-b border-amber-600 pb-2 max-w-max flex items-center gap-3">
            <BookOpen size={28} /> All Courses
          </h2>
          {courses.length === 0 ? (
            <p className="text-gray-400 italic">No courses available. Add some!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map(({ _id, courseCode, courseName }) => (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#112b3c] rounded-xl p-5 shadow-lg flex justify-between items-center border border-teal-500"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-teal-300">{courseCode}</h3>
                    <p className="text-gray-300">{courseName}</p>
                  </div>
                  <button
                    onClick={() => openDeleteModal('course', _id)}
                    className="text-amber-400 hover:text-amber-600 transition-colors"
                    aria-label="Delete course"
                    disabled={deleting}
                  >
                    <Trash size={22} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Todos List */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-amber-400 border-b border-amber-600 pb-2 max-w-max flex items-center gap-3">
            <ClipboardList size={28} /> All Todos
          </h2>
          {todos.length === 0 ? (
            <p className="text-gray-400 italic">No todos available. Add some!</p>
          ) : (
            <div className="space-y-5 max-w-4xl mx-auto">
              {todos.map(({ _id, title, description, dueDate, course, section, type }) => (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#112b3c] rounded-xl p-6 shadow-lg border border-teal-400 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-teal-300">
                      {title}{' '}
                      <span className="text-amber-400 text-sm font-medium">
                        ({course?.courseCode || 'Unknown'})
                      </span>
                    </h3>
                    {description && <p className="text-gray-300 mt-1">{description}</p>}
                    <p className="text-gray-400 mt-2">
                      <span className="font-semibold">Section:</span> {section} |{' '}
                      <span className="font-semibold">Type:</span> {type}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Due: {new Date(dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => openDeleteModal('todo', _id)}
                    className="text-amber-400 hover:text-amber-600 transition-colors"
                    aria-label="Delete todo"
                    disabled={deleting}
                  >
                    <Trash size={22} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#112b3c] p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-100"
            >
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete this {deleteModal.type}?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
                >
                  {deleting && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
