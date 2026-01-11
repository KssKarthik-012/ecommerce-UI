import React from 'react';
import PublicHeader from '../shared/PublicHeader';
import Footer from './Footer';
import {
  Leaf,
  ShieldCheck,
  Truck,
  Headset,
  Sparkles,
  HeartPulse,
  Package,
  Coffee,
  Droplets,
  Instagram,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="public-website">
      <PublicHeader />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-r from-green-50 via-green-100 to-green-200">
          <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                  <Leaf size={14} />
                  <span>100% Natural – About RTQ Foods</span>
                </div>
                <h1 className="mt-4  text-5xl md:text-6xl font-extrabold  font-bold  text-green-900 leading-tight">
                  Pure <span className=' text-green-700'>goodness</span>, <br />straight from nature
                </h1>
                <p className="mt-4 text-lg md:text-xl text-green-800 max-w-2xl">
                  We partner directly with farmers in the serene, cool hills to source the finest ingredients. With over eight years of dedication, we craft products that nourish the body and satisfy the senses.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl transition duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <ShieldCheck size={16} />
                    No artificial or non-organic elements
                  </span>
                  <span className="px-6 py-3 bg-white hover:bg-green-50 text-green-700 border border-green-700 rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    From farm to your cup
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-green-500/10 p-4 sm:!p-10">
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white shadow-sm p-2 py-4 sm:!p-5 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                      <HeartPulse className="text-green-700" size={28} />
                      <div className="flex flex-1 flex-col justify-center sm:!justify-start items-center sm:items-start">
                        <p className="font-semibold text-gray-900">8+ years</p>
                        <p className="text-sm text-gray-600 text-center sm:!text-left">of natural wellness</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white shadow-sm p-2 py-4 sm:!p-5 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                      <Truck className="text-green-700" size={28} />
                      <div className="flex flex-1 flex-col justify-center sm:!justify-start items-center sm:items-start">
                        <p className="font-semibold text-gray-900">Fast delivery</p>
                        <p className="text-sm text-gray-600 text-center sm:!text-left">2–3 days in South India</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white shadow-sm p-2 py-4 sm:!p-5 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                      <Headset className="text-green-700" size={28} />
                      <div className="flex flex-1 flex-col justify-center sm:!justify-start items-center sm:items-start">
                        <p className="font-semibold text-gray-900">24/7 support</p>
                        <p className="text-sm text-gray-600 text-center sm:!text-left">we are here for you</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white shadow-sm p-2 py-4 sm:!p-5 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                      <ShieldCheck className="text-green-700" size={28} />
                      <div className="flex flex-1 flex-col justify-center sm:!justify-start items-center sm:items-start">
                        <p className="font-semibold text-gray-900">100% natural</p>
                        <p className="text-sm text-gray-600 text-center sm:!text-left">pure ingredients only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-green-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Leaf className="text-green-700" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0">Our Mission</h2>
              </div>
              <p className="mt-3 text-gray-600">
                To craft products using only pure, natural ingredients, completely free from artificial or non-organic elements.
              </p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="text-green-700" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0">Our Vision</h2>
              </div>
              <p className="mt-3 text-gray-600">
                To share the goodness of our natural products with people across the world.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Products</h2>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Package className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">POSHAN – Instant Health Mix</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  A carefully crafted blend of pulses and wholesome ingredients that boosts energy and well-being.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Enhances energy levels</li>
                  <li>Supports overall growth and development</li>
                  <li>Rich in essential nutrients</li>
                  <li>Suitable for all age groups</li>
                </ul>
                <p className="mt-3 text-sm text-green-700 font-medium">A perfect herbal beverage to keep your body strong and nourished.</p>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Coffee className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">CARDAMOM – The Queen of Spices</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Rich in antioxidants and diuretic properties</li>
                  <li>Aids digestion and freshens breath</li>
                  <li>Antibacterial benefits to fight infections</li>
                  <li>Supports respiratory health</li>
                  <li>Helps with weight management</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Droplets className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">BLACK PEPPER – The King of Spices</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Boosts immunity and fights infections</li>
                  <li>Aids digestion and relieves cold and cough</li>
                  <li>Supports weight loss and improves metabolism</li>
                  <li>Enhances skin health</li>
                  <li>Helps manage stress and depression</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">Available in whole and powdered forms.</p>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">PRIMEVIT – Immunity Booster</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  A unique herbal mix designed to strengthen immunity by deeply nourishing your cells.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Supports a healthy immune system</li>
                  <li>Packed with essential nutrients</li>
                  <li>100% natural ingredients for optimal wellness</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Package className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">NATTU SAKKARAI – Natural Cane Sugar</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Chemical-free and unrefined</li>
                  <li>Retains natural minerals</li>
                  <li>Perfect for beverages and cooking</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Package className="text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-0">POSHAN HEALTH MIX – A Nutritious Start</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Power-packed with nutrients</li>
                  <li>Aids digestion and metabolism</li>
                  <li>Suitable for all age groups</li>
                </ul>
                <p className="mt-3 text-sm text-green-700 font-medium">Experience nature’s goodness in every sip.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Leaf className="text-green-700" />
                <p className="font-semibold text-gray-900 mb-0">100% NATURAL</p>
              </div>
              <p className="mt-2 text-gray-600">Every product is crafted with pure, natural goodness.</p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Truck className="text-green-700" />
                <p className="font-semibold text-gray-900 mb-0">FAST DELIVERY</p>
              </div>
              <p className="mt-2 text-gray-600">Delivery within 2–3 working days anywhere in South India.</p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Headset className="text-green-700" />
                <p className="font-semibold text-gray-900 mb-0">CUSTOMER SUPPORT</p>
              </div>
              <p className="mt-2 text-gray-600">24/7 assistance for product usage and help when you need it.</p>
            </div>
          </div>
        </section>

        {/* <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Taglines</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                'Pure Goodness, Straight from Nature.',
                'Sip the Purity, Taste the Wellness.',
                'Nature’s Best, Delivered to You.',
                'Fuel Your Body with 100% Natural Goodness.',
                'Healthy Living Starts with What You Consume.',
                'Traditional Taste, Modern Wellness.',
                'From Farm to Your Cup – The Natural Way.',
                'Revitalize Your Senses, One Sip at a Time.',
                'Wholesome, Pure, and Naturally Yours.'
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full bg-white border border-green-100 text-gray-800 px-4 py-2 text-sm shadow-sm">
                  <Sparkles size={14} className="text-green-700" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quotes for Inspiration</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '“Let food be thy medicine and medicine be thy food.” – Hippocrates',
              '“The closer you are to nature, the healthier you will be.”',
              '“Good health starts with good choices.”',
              '“Nourish your body, nurture your soul.”',
              '“Drink natural, live pure.”',
              '“A sip of health, a step towards wellness.”',
              '“Eat natural, stay fit, and live longer.”'
            ].map((q) => (
              <div key={q} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-green-700 shrink-0" />
                  <p className="text-gray-700">{q}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
                <p className="mt-2 text-gray-600">We provide the finest for society and have been doing so for the past 8 years.</p>
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
                  <div className="absolute inset-0 bg-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <MapPin />
                      </div>
                      <p className="mt-3 text-gray-700 font-medium">Find us on the map</p>
                      <p className="mt-1 text-sm text-gray-600">Open the location in Google Maps to navigate.</p>
                      <a
                        href="https://goo.gl/maps/zxzo6oXEyfiiBQ9B9"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-white text-sm font-medium"
                      >
                        <MapPin size={16} /> Open Maps
                      </a>
                    </div>
                  </div>
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

export default AboutPage;