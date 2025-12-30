import React, { useState } from 'react';
import { FaTerminal, FaPaperPlane, FaDiscord, FaGithub, FaLinkedin, FaWifi } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DeveloperContact = () => {
  const [status, setStatus] = useState(0); // For the signal animation
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Increase signal strength based on form completion
    const filledFields = Object.values({ ...formData, [name]: value }).filter(v => v.length > 0).length;
    setStatus(filledFields * 33.3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate uplink
    Swal.fire({
      title: 'Establishing Uplink...',
      html: 'Encrypting message packets...',
      timer: 2000,
      background: '#0f172a',
      color: '#6366f1',
      didOpen: () => { Swal.showLoading(); }
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Message Transmitted',
        text: 'The developer has been notified via the DharLink protocol.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      setFormData({ name: "", email: "", message: "" });
      setStatus(0);
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT SIDE: INFO */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center gap-3 text-indigo-500 font-mono text-sm tracking-widest mb-4">
              <FaTerminal /> <span>SYSTEM CONTACT PROTOCOL</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
              TALK TO THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-600">ARCHITECT.</span>
            </h1>
          </div>

          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Have a bug to report, a feature to suggest, or want to collaborate on the DharLink ecosystem? Drop a packet.
          </p>

          {/* Social Uplinks */}
          <div className="flex gap-4">
            <SocialIcon icon={<FaGithub />} link="https://github.com" />
            <SocialIcon icon={<FaDiscord />} link="#" />
            <SocialIcon icon={<FaLinkedin />} link="#" />
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <FaWifi className={`${status > 0 ? 'text-indigo-500' : 'text-slate-700'} transition-colors duration-500`} size={24} />
                  {status === 100 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Signal Strength</p>
                  <div className="w-48 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${status}%` }} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: THE FORM */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Neighbor Name</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text" 
                placeholder="How should I call you?"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Uplink Address</label>
              <input 
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email" 
                placeholder="your@email.com"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Data Packet</label>
              <textarea 
                required
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Write your message here..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full group relative bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all overflow-hidden flex items-center justify-center gap-3"
            >
              <span className="relative z-10 uppercase tracking-tighter">Transmit Message</span>
              <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

const SocialIcon = ({ icon, link }) => (
  <a href={link} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500 transition-all">
    {icon}
  </a>
);

export default DeveloperContact;