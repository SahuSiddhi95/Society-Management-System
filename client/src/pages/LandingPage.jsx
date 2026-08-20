import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import demoVideo from "../assets/Screen Recording 2026-06-17 114522.mp4";
import toast from "react-hot-toast";
// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  coin: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4l3 3",
  tool: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  chart: "M18 20V10M12 20V4M6 20v-6",
  calendar: "M3 9h18M3 4h18v17H3zM8 2v4M16 2v4",
  check: "M20 6L9 17l-5-5",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm18 2l-10 7L2 6",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mapPin:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4l3 3",
  building: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  menu: "M3 12h18M3 6h18M3 18h18",
  x: "M18 6L6 18M6 6l12 12",
};

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = [
    "Features",
    "How it works",
    "Pricing",
    // "Testimonials",
    "Contact",
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-lg font-semibold text-gray-900">SocietyOS</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-login")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpen(!open)}
        >
          <Icon d={open ? Icons.x : Icons.menu} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <div className="w-full h-px bg-gray-100 my-2" />
          <button 
            onClick={() => { navigate("/admin-login"); setOpen(false); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-4 py-3.5 rounded-xl w-full shadow-md shadow-blue-100 active:scale-95 transition-transform"
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Trusted by 1+ societies across India
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
          Manage your society <span className="text-blue-600">smarter</span>,
          not harder
        </h1>

        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          Residents, dues, complaints, notices, and reports — all in one
          platform built for Indian residential societies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate("/admin-login")}
            className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1"
          >
            Sign In <Icon d={Icons.arrow} size={18} />
          </button>
          <button className="group w-full sm:w-auto bg-white text-gray-700 font-bold px-8 py-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
            onClick={() => window.open(demoVideo, "_blank")}
          >
            Watch demo <div className="group-hover:scale-110 transition-transform"><Icon d={Icons.star} size={18} /></div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          {[
            "No credit card needed",
            "Setup in 5 minutes",
            "Free for small societies",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="text-green-500">
                <Icon d={Icons.check} size={14} />
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { num: "2+", label: "Societies onboarded" },
    { num: "2+", label: "Residents managed" },
    { num: "₹40Cr+", label: "Dues collected" },
    { num: "98%", label: "Secretary satisfaction" },
  ];
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
        {stats.map((s) => (
          <div key={s.label} className="py-8 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{s.num}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Icons.users,
      color: "bg-blue-50 text-blue-600",
      title: "Resident management",
      desc: "Complete directory of residents, owners, and tenants with flat-wise records and contact details.",
    },
    {
      icon: Icons.coin,
      color: "bg-green-50 text-green-600",
      title: "Dues & fee collection",
      desc: "Track maintenance dues, send automated reminders, and accept online payments effortlessly.",
    },
    {
      icon: Icons.tool,
      color: "bg-orange-50 text-orange-600",
      title: "Complaint tracking",
      desc: "Residents raise complaints and track resolution. Assign to staff and close with one click.",
    },
    {
      icon: Icons.bell,
      color: "bg-purple-50 text-purple-600",
      title: "Notices & announcements",
      desc: "Broadcast society notices, event reminders, and emergency alerts via app or SMS instantly.",
    },
    {
      icon: Icons.chart,
      color: "bg-teal-50 text-teal-600",
      title: "Financial reports",
      desc: "Monthly income-expense statements, defaulter lists, and audit-ready reports with export.",
    },
    {
      icon: Icons.calendar,
      color: "bg-pink-50 text-pink-600",
      title: "Events & bookings",
      desc: "Manage clubhouse bookings, AGM schedules, and community events with conflict-free calendars.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
            Everything you need to run your society
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Built for secretaries, trustees, and residents alike.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
              >
                <Icon d={f.icon} size={22} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Contact our team",
      desc: "Reach out to our support team to create your custom society profile in minutes.",
    },
    {
      num: "02",
      title: "Add residents & flats",
      desc: "Import from Excel or add residents one by one. Assign flats, block, and floor automatically.",
    },
    {
      num: "03",
      title: "Set up dues structure",
      desc: "Define maintenance amount, frequency, and due dates. The system handles reminders.",
    },
    {
      num: "04",
      title: "Go live!",
      desc: "Invite residents via SMS or WhatsApp. They download the app and start using instantly.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            How it works
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
            Up and running in minutes
          </h2>
          <p className="text-gray-500">
            No technical expertise needed. Get your society live in 4 simple
            steps.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px bg-blue-100 z-0"
                  style={{
                    width: "calc(100% - 2rem)",
                    left: "calc(50% + 1.5rem)",
                  }}
                ></div>
              )}
              <div className="bg-blue-50 rounded-2xl p-6 text-center relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      per: "forever · up to 50 flats",
      featured: false,
      features: [
        "Resident directory",
        "Basic notices",
        "Complaint log",
        "Email support",
      ],
      cta: "Contact us",
      ctaStyle: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    },
    {
      name: "Society Pro",
      price: "₹100",
      per: "per month · unlimited flats",
      featured: true,
      features: [
        "Everything in Starter",
        "Online due collection",
        "Financial reports",
        "SMS & WhatsApp alerts",
        "Priority support",
      ],
      cta: "Contact us",
      ctaStyle: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      name: "Enterprise",
      price: "Custom",
      per: "for large townships & builders",
      featured: false,
      features: [
        "Everything in Pro",
        "Multiple societies",
        "Custom branding",
        "Dedicated account manager",
      ],
      cta: "Contact sales",
      ctaStyle: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500">
            No hidden charges. Scale as your society grows.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-white rounded-2xl p-7 flex flex-col ${p.featured ? "border-2 border-blue-500 shadow-lg shadow-blue-50 relative" : "border border-gray-100"}`}
            >
              {p.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  {p.name}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {p.price}
                </div>
                <div className="text-sm text-gray-400">{p.per}</div>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <span className="text-green-500 flex-shrink-0">
                      <Icon d={Icons.check} size={15} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.location.href = "#contact"}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${p.ctaStyle}`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    society: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/contact", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        societyName: form.society,
        message: form.message,
      });

      const data = response.data;

      if (data.success) {
        setSent(true);

        // Reset Form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          society: "",
          message: "",
        });

        toast.success("Message sent successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const contactDetails = [
    { icon: Icons.mail, label: "support@societyos.in" },
    { icon: Icons.phone, label: "+91 9876543210" },
    { icon: Icons.mapPin, label: "Indore, Madhya Pradesh" },
    { icon: Icons.clock, label: "Mon–Sat, 9 am – 7 pm IST" },
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Contact us
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
            Get in touch
          </h2>
          <p className="text-gray-500">
            We're happy to walk you through the platform or help with
            onboarding.
          </p>
        </div>

        <div className="bg-white text-gray-900 rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left info */}
          <div className="bg-blue-600 p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-3">Contact information</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Have questions? Our team is happy to help with onboarding,
                pricing, or a custom plan for your society.
              </p>
              <div className="flex flex-col gap-5">
                {contactDetails.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-3 text-sm text-blue-100"
                  >
                    <span className="text-white opacity-80">
                      <Icon d={c.icon} size={17} />
                    </span>
                    {c.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 flex gap-3">
              {["in", "tw", "fb"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs font-bold uppercase"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Icon d={Icons.check} size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Message sent!
                </h3>
                <p className="text-sm text-gray-500">
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">
                      First name
                    </label>
                    <input
                      required
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">
                      Last name
                    </label>
                    <input
                      required
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Surname"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Society name
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Name of Apartments"
                    value={form.society}
                    onChange={(e) =>
                      setForm({ ...form, society: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your society or question..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Send message <Icon d={Icons.arrow} size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"],
    },
    { title: "Company", links: ["About us", "Blog", "Careers", "Contact"] },
    {
      title: "Legal",
      links: ["Privacy policy", "Terms of service", "Refund policy"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-white font-semibold text-lg">SocietyOS</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Modern society management software built for Indian residential
            societies.
          </p>
        </div>

        {/* Columns */}
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-white text-sm font-semibold mb-4">{c.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2026 SocietyOS. All rights reserved.</span>
          <span>Made with care in Indore, India</span>
        </div>
      </div>
    </footer>
  );
}
export {
  Navbar,
  Icon,
  Hero,
  Stats,
  Features,
  HowItWorks,
  Pricing,
  Contact,
  Footer,
};
