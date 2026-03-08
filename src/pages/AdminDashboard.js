import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, FileText, Shield, X, AlertTriangle, 
  ChevronRight, Star, ThumbsUp, MessageSquare, EyeOff
} from 'lucide-react';

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // 1. STATE FOR REAL DATA FROM BACKEND
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reports, setReports] = useState([
    { id: 501, reporter: "Amit", target: "Rahul", type: "User", reason: "Spamming upload section" },
    { id: 502, reporter: "Priya", target: "Data Structures Unit 1", type: "Note", reason: "Incorrect formulas on Page 4" }
  ]);

  // 2. FETCH DATA FROM YOUR SPRING BOOT + TIDB BACKEND
  useEffect(() => {
    // Fetch Users from Backend
    axios.get('http://localhost:8080/api/profile')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
    
    // Fetch Resources from Backend
    axios.get('http://localhost:8080/api/resources')
      .then(res => setNotes(res.data))
      .catch(err => console.error("Error fetching resources:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans p-8 selection:bg-cyan-400 selection:text-black">
      
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-400 p-2 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Shield size={20} className="text-black" />
          </div>
          <h1 className="text-2xl font-black text-cyan-400 tracking-tighter uppercase">
            UNIBRIDGE <span className="text-white">ADMIN</span>
          </h1>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          {['dashboard', 'users', 'notes', 'reports'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setView(tab)} 
              className={`px-8 py-2 rounded-full text-[10px] font-black uppercase transition-all ${view === tab ? 'bg-cyan-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* DASHBOARD STATS */}
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-cyan-400 transition-all">
            <Users className="text-cyan-400 mb-4" size={32}/><p className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">Global_Students</p>
            <p className="text-4xl font-black tracking-tighter">{users.length}</p>
          </div>
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
            <FileText className="text-yellow-400 mb-4" size={32}/><p className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">Resource_Count</p>
            <p className="text-4xl font-black tracking-tighter">{notes.length}</p>
          </div>
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-red-500/20">
            <AlertTriangle className="text-red-500 mb-4" size={32}/><p className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">Active_Complaints</p>
            <p className="text-4xl font-black tracking-tighter">{reports.length}</p>
          </div>
        </div>
      )}

      {/* USERS LIST */}
      {view === 'users' && (
        <div className="max-w-4xl mx-auto bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-all group">
                  <td className="p-8 font-bold text-xl group-hover:text-cyan-400">{u.name}</td>
                  <td className="p-8 text-right">
                    <button onClick={() => setSelectedUser(u)} className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400 inline-flex items-center gap-2">
                      User Details <ChevronRight size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NOTES LIST */}
      {view === 'notes' && (
        <div className="max-w-4xl mx-auto bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <tbody>
              {notes.map(n => (
                <tr key={n.id} className="border-b border-white/5 hover:bg-yellow-400/5 transition-all group">
                  <td className="p-8 font-bold text-xl group-hover:text-yellow-400">{n.title || n.name}</td>
                  <td className="p-8 text-right">
                    <button onClick={() => setSelectedNote(n)} className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-yellow-400 inline-flex items-center gap-2">
                      Resource Details <ChevronRight size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTS PAGE */}
      {view === 'reports' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-black text-red-500 mb-6 uppercase tracking-widest px-4">Reports</h2>
          {reports.map(r => (
            <div key={r.id} className="bg-white/5 p-8 rounded-[2.5rem] border border-red-500/20 flex justify-between items-center hover:border-red-500 transition-all">
              <div>
                <span className="text-red-500 text-[9px] font-bold uppercase tracking-widest font-mono">Reported by: {r.reporter}</span>
                <h3 className="text-2xl font-black text-white italic tracking-tighter mt-1">{r.target}</h3>
                <p className="text-gray-500 text-sm mt-1">{r.reason}</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-cyan-400/10 text-cyan-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase border border-cyan-400/20 hover:bg-cyan-400 hover:text-black transition-all flex items-center gap-2">
                  <MessageSquare size={14}/> Warn
                </button>
                <button className="bg-white/5 text-gray-400 px-5 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white hover:text-black transition-all">
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: USER DETAILS */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-[#111] border border-cyan-400/30 p-12 rounded-[3.5rem] max-w-md w-full relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 text-gray-400 hover:text-white"><X size={28}/></button>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{selectedUser.name}</h2>
              <span className="mt-2 inline-block bg-cyan-400/10 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-400/20">{selectedUser.role || "Student"}</span>
            </div>
            <div className="space-y-4">
              <div className="bg-black/50 p-5 rounded-3xl border border-white/10">
                <p className="text-gray-500 text-[9px] uppercase font-mono mb-1">Identity_Email</p>
                <p className="text-white font-bold">{selectedUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}