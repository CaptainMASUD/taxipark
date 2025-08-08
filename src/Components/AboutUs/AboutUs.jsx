import React from 'react';
import { UserCheck, Globe, Rocket, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-center text-teal-300 mb-12"
        >
          <Users className="inline-block mr-3 text-indigo-400" />
          We Are <span className="text-teal-400">Captains</span>
        </motion.h1>

        {/* Intro Section */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-center text-slate-300 mb-12 max-w-3xl mx-auto"
        >
          We are creators of exceptional digital experiences. From smart dashboards to intelligent to-do systems, we design and develop intuitive web applications that make life easier.
        </motion.p>

        {/* Our Works Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-6 text-indigo-300"
          >
            <Globe className="inline-block mr-2 text-teal-400" />
            Our Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern Portfolio',
                desc: 'Interactive dev portfolios with animations, gradients and 3D models.',
              },
              {
                title: 'Smart Todo System',
                desc: 'Track academic todos by course, section, type — fully filterable.',
              },
              {
                title: 'E-Commerce Admin UI',
                desc: 'Sleek React dashboards with charts, product management, and live orders.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-teal-500 transition"
              >
                <h3 className="text-xl font-semibold text-teal-300 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join Us Section */}
        <section className="text-center">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4 text-indigo-300"
          >
            <Rocket className="inline-block mr-2 text-teal-400" />
            Join the Crew
          </motion.h2>
          <p className="text-lg mb-6 text-slate-300 max-w-2xl mx-auto">
            We believe in building together. Collaborate, learn, and grow with our creative team. Join us on Discord and become a Captain today!
          </p>

          <a
            href="https://discord.gg/your-invite-code" // <- Replace this
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 transition text-white font-semibold text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
          >
            <UserCheck size={22} />
            Join Us on Discord
          </a>
        </section>

        {/* Sparkles at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex justify-center"
        >
          <Sparkles size={40} className="text-indigo-400 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
