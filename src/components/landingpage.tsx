import { useState, useEffect } from 'react';


import {
  FileAudio,
  FileText,
  Search,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  X,
  Calendar,
  User,
  Upload
} from 'lucide-react';
import profile from "../assets/profile.png";
import pp1 from '../assets/PP-1.jpg';
import pp2 from '../assets/pp-2.jpg';
import pp3 from '../assets/pp-3.png';

interface NewsItem {
  title: string;
  content: string;
  readMoreUrl?: string;
  publishedAt?: string;
}

const services = [
  {
    title: "FIR Registration",
    description: "File a First Information Report online",
    icon: FileText
  },
  {
    title: "FIR Tracking",
    description: "Track the status of your FIR",
    icon: Search
  },
  {
    title: "IPC library",
    description: "Library of Indian Penal Code sections",
    icon: FileAudio
  }
];

const policeImages = [pp1, pp2, pp3];

const mockNews: NewsItem[] = [
  {
    title: "New Digital Policing Initiative Launched",
    content: "Government announces comprehensive digital transformation of police services across India.",
    publishedAt: "2025-05-28"
  },
  {
    title: "Crime Rate Drops by 15% with Technology Integration",
    content: "Latest statistics show significant improvement in law and order situation.",
    publishedAt: "2025-05-27"
  },
  {
    title: "Online FIR System Records 1 Million Registrations",
    content: "Milestone achievement in digital governance and citizen services.",
    publishedAt: "2025-05-26"
  },
  {
    title: "AI-Powered Crime Prevention Systems Deployed",
    content: "Advanced technology being used to predict and prevent criminal activities.",
    publishedAt: "2025-05-25"
  },
  {
    title: "Citizens Praise New Digital Police Services",
    content: "Feedback shows high satisfaction rates with online police services.",
    publishedAt: "2025-05-24"
  },
  {
    title: "Cybercrime Unit Strengthened with New Technology",
    content: "Enhanced capabilities to combat online crimes and digital fraud.",
    publishedAt: "2025-05-23"
  }
];

export const LandingPage = () => {
  const [showFIRForm, setShowFIRForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [voiceSamples, setVoiceSamples] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentType: '',
    description: '',
    witnessName: '',
    witnessPhone: '',
    policeStation: ''
  }); 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=');
        if (!response.ok) {
          throw new Error('News API failed');
        }
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          const formattedNews = data.articles.slice(0, 6).map((article: any) => ({
            title: article.title,
            content: article.description || "",
            readMoreUrl: article.url,
            publishedAt: article.publishedAt
          }));
          setNews(formattedNews);
        }
      } catch (error) {
        console.log('Using mock news data');
      }
    };

    fetchNews();
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % policeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVoiceSamples(filesArray);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDocuments(filesArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    voiceSamples.forEach((file) => {
      form.append("voiceSamples", file);
    });
    documents.forEach((file) => {
      form.append("documents", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/submit-fir", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to submit FIR");
      }

      const data = await response.json();
      console.log("FIR submitted:", data);
      alert("FIR submitted successfully! Confirmation will be sent to your email.");
      setShowFIRForm(false);
    } catch (error) {
      console.error("Error submitting FIR:", error);
      alert("There was an error submitting your FIR. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
     
      <nav className="bg-gray-900 py-4 px-6 flex items-center justify-between border-b border-gray-800 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src={profile} alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-green-400" />
          <h1 className="text-white text-2xl font-serif font-bold">NyayVidhi</h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="#services" className="text-gray-300 hover:text-green-400 transition-colors">Services</a>
          <a href="#news" className="text-gray-300 hover:text-green-400 transition-colors">News</a>
          <a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a>
        </div>
      </nav>

    
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {policeImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Police ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">Digital FIR Registration System</h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">File and track your FIR online with ease and transparency. Ensuring justice through digital governance.</p>
            <button
              onClick={() => setShowFIRForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 group shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Register FIR
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">Comprehensive digital police services designed to serve citizens efficiently and transparently</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="relative group"
                  onClick={() => {
                    if (service.title === "FIR Tracking" || service.title === "IPC library") {
                      window.location.href = "/track";
                    } else {
                      setShowFIRForm(true);
                    }
                  }}
                >
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 dark:border-zinc-700 group-hover:border-green-400">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <section id="news" className="bg-white dark:bg-zinc-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-4">Latest News</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">Stay updated with the latest developments in law enforcement and digital governance</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 6).map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{item.content}</p>
                {item.readMoreUrl && (
                  <a
                    href={item.readMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium hover:underline text-sm"
                  >
                    Read more <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    
      {showFIRForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">FIR Registration</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Please fill all required details accurately</p>
                </div>
                <button 
                  onClick={() => setShowFIRForm(false)} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Father's Name *</label>
                    <input 
                      type="text" 
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter father's name" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age *</label>
                    <input 
                      type="number" 
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter complete address" 
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

             
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Incident Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Incident *</label>
                    <input 
                      type="date" 
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time of Incident *</label>
                    <input 
                      type="time" 
                      name="incidentTime"
                      value={formData.incidentTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location of Incident *</label>
                    <input 
                      type="text" 
                      name="incidentLocation"
                      value={formData.incidentLocation}
                      onChange={handleInputChange}
                      placeholder="Enter exact location where incident occurred" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Incident *</label>
                    <select 
                      name="incidentType"
                      value={formData.incidentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Incident Type</option>
                      <option value="theft">Theft</option>
                      <option value="fraud">Fraud</option>
                      <option value="assault">Assault</option>
                      <option value="cybercrime">Cybercrime</option>
                      <option value="harassment">Harassment</option>
                      <option value="missing_person">Missing Person</option>
                      <option value="accident">Accident</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Police Station *</label>
                    <input 
                      type="text" 
                      name="policeStation"
                      value={formData.policeStation}
                      onChange={handleInputChange}
                      placeholder="Preferred police station" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detailed Description *</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the incident in detail..." 
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

            
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Witness Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Witness Name</label>
                    <input 
                      type="text" 
                      name="witnessName"
                      value={formData.witnessName}
                      onChange={handleInputChange}
                      placeholder="Enter witness name" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Witness Phone</label>
                    <input 
                      type="tel" 
                      name="witnessPhone"
                      value={formData.witnessPhone}
                      onChange={handleInputChange}
                      placeholder="Enter witness phone number" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-500" />
                  Evidence & Documents
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Voice Samples (if applicable)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="audio/*"
                      onChange={handleVoiceUpload}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {voiceSamples.length} audio file(s) selected
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supporting Documents/Photos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {documents.length} document(s) selected
                    </p>
                  </div>
                </div>
              </div>

             
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowFIRForm(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  Submit FIR
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-green-400" /> Emergency: 112</div>
              <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-green-400" /> support@nyayvidhi.gov.in</div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Headquarters</h3>
            <div className="flex items-start gap-2"><MapPin className="w-5 h-5 text-green-400 mt-1" /> Police HQ, Civil Lines, New Delhi - 110054</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 border-t border-gray-800 pt-6">© 2025 NyayVidhi. All rights reserved.</div>
      </footer>
    </div>
  );
}