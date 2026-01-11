import React, { useState } from 'react';
import PublicHeader from '../shared/PublicHeader';
import Footer from './Footer';
import { MapPin, Phone, Mail, Instagram, Headset, Clock, User, AtSign, MessageSquare, ChevronDown  } from 'lucide-react';
import API_BASE_URL from '../../services/apiConfig';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const res = await fetch(`${API_BASE_URL}/static-pages/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Your enquiry has been sent. We will contact you shortly.');
        form.reset();
      } else {
        setError(data.message || 'Failed to send enquiry');
      }
    } catch (err) {
      console.error(err);
      setError('Network or server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-website">
      <PublicHeader />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-green-100 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(134,239,172,0.25),transparent_55%)]" />
          <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-green-300 to-green-200 blur-3xl opacity-40" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                  <Headset size={14} />
                  <span>We are here to help</span>
                </div>
                <h1 className="mt-4 text-5xl md:text-6xl font-extrabold text-green-900 leading-tight">
                  Contact <span className="text-green-700">RTQ Foods</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-green-800 max-w-2xl">
                  Have questions about our products, orders, or partnerships? Send us a message and we will get back within 24 hours.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://goo.gl/maps/zxzo6oXEyfiiBQ9B9"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl transition duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <MapPin size={16} /> View on Maps
                  </a>
                  <a
                    href="https://instagram.com/riyathirstquenchers?igshid=OTJlNzQ0NWM="
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-white hover:bg-green-50 text-green-700 border border-green-700 rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2"
                  >
                    <Instagram size={16} /> Instagram
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-green-50 border border-green-100 shadow-sm hover:shadow transition">
                    <div className="flex items-start gap-3">
                      <Phone className="text-green-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Phone</p>
                        <a href="tel:+919884198858" className="text-sm text-gray-700 hover:text-green-700">+91 9884198858</a>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-white to-green-50 border border-green-100 shadow-sm hover:shadow transition">
                    <div className="flex items-start gap-3">
                      <Mail className="text-green-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <a className="block text-sm text-gray-700 hover:text-green-700" href="md@rtqfoods.com">md@rtqfoods.com</a>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-0 bg-gradient-to-br from-white to-green-50 border border-green-100 shadow-sm hover:shadow transition">
                    <div className="p-5 flex items-start gap-3">
                      <MapPin className="text-green-700" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Address</p>
                        <p className="text-sm text-gray-700">RTQ FOODS, 73/49, 2nd St, Secretariat Colony, Kilpauk, Chennai, Tamil Nadu 600010</p>
                      </div>
                    </div>
                    <div className="h-px bg-green-100" />
                    <div className="p-5 flex items-start gap-3">
                      <Clock className="text-green-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Support Hours</p>
                        <p className="text-sm text-gray-700">Mon–Sat: 9:00 AM – 7:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative border-t border-green-100/70">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/60 backdrop-blur border border-green-100 p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">8+</div>
                <div>
                  <p className="font-semibold text-gray-900">Years Experience</p>
                  <p className="text-sm text-gray-600">Since 2017</p>
                </div>
              </div>
              <div className="rounded-xl bg-white/60 backdrop-blur border border-green-100 p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">2–3</div>
                <div>
                  <p className="font-semibold text-gray-900">Day Delivery</p>
                  <p className="text-sm text-gray-600">Across South India</p>
                </div>
              </div>
              <div className="rounded-xl bg-white/60 backdrop-blur border border-green-100 p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">24/7</div>
                <div>
                  <p className="font-semibold text-gray-900">Support</p>
                  <p className="text-sm text-gray-600">We’re here anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-green-100 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us an enquiry</h2>
              <p className="text-gray-600">Fill out the form and our team will reach out shortly.</p>
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Full name</label>
                  <div className="mt-2 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-2 relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-2 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <div className="mt-2 relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="What is this about?"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="How can we help you?"
                  />
                </div>
                <div className="sm:col-span-2 flex items-start gap-2">
                  <input id="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600" />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    I consent to RTQ Foods contacting me about my enquiry.
                  </label>
                </div>
                <div className="sm:col-span-2">
                  {success && <div className="mb-3 text-sm text-green-700">{success}</div>}
                  {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
                  <button disabled={loading} type="submit" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl transition duration-300 disabled:opacity-60">
                    {loading ? 'Sending...' : 'Submit enquiry'}
                  </button>
                </div>
              </form>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick help</h3>
              <ul className="mt-4 space-y-3 text-gray-700 text-sm">
                <li className="flex items-start gap-3"><span className="text-green-700">•</span> Product details, ingredients, or usage guidance</li>
                <li className="flex items-start gap-3"><span className="text-green-700">•</span> Order status, shipping, or returns</li>
                <li className="flex items-start gap-3"><span className="text-green-700">•</span> Wholesale and partnership enquiries</li>
              </ul>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+919884198858"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 !text-white text-sm font-medium justify-center"
                >
                  <Phone size={16} /> Call us
                </a>
                <a
                  href="mailto:md@rtqfoods.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-green-700 text-green-700 px-5 py-2.5 text-sm font-medium justify-center"
                >
                  <Mail size={16} /> Email us
                </a>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-4">
                <details className="group">
                  <summary className="cursor-pointer list-none flex items-center justify-between">
                    <span className="font-medium text-gray-900">Do you offer bulk/wholesale orders?</span>
                    <span className="text-green-700 group-open:rotate-180 transition"><ChevronDown size={16} /></span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">Yes. Share your requirements via the form, and our team will contact you.</p>
                </details>
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none flex items-center justify-between">
                    <span className="font-medium text-gray-900">How long does delivery take?</span>
                    <span className="text-green-700 group-open:rotate-180 transition"><ChevronDown size={16} /></span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">Typically 2–3 working days within South India.</p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Visit us</h2>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-green-700 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">RTQ FOODS</p>
                      <p className="text-gray-700">73/49, 2nd St, Secretariat Colony, Kilpauk, Chennai, Tamil Nadu 600010</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-green-700" />
                    <a className="text-gray-700 hover:text-green-700" href="tel:+919884198858">+91  9884198858</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="text-green-700 mt-0" />
                    <div className="space-y-1">
                      <a className="block text-gray-700 hover:text-green-700" href="md@rtqfoods.com">md@rtqfoods.com</a>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://goo.gl/maps/zxzo6oXEyfiiBQ9B9"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 !text-white text-sm font-medium"
                  >
                    <MapPin size={16} /> View on Google Maps
                  </a>
                  <a
                    href="https://instagram.com/riyathirstquenchers?igshid=OTJlNzQ0NWM="
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 !text-white text-sm font-medium"
                  >
                    <Instagram size={16} /> Follow on Instagram
                  </a>
                </div>
              </div>
              <div>
                <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white/0 shadow-sm">
                  <iframe
                    title="RTQ Foods Location"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15544.595017490255!2d80.2438188!3d13.0897574!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265b24b19ec9d%3A0x937dc979c50c0eac!2sRTQ%20FOODS%20PVT%20Ltd!5e0!3m2!1sen!2sjp!4v1760548435804!5m2!1sen!2sjp"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default ContactPage;