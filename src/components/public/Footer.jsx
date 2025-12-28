import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import certificates from "../../assets/certificates.png";
import location from "../../assets/location.svg";
import mail from "../../assets/mail.svg";
import contact from "../../assets/phone.svg";
const Footer = () => {
  return (
    <footer style={{
      background: "linear-gradient(to right, var(--primary-dark), var(--primary-light))"
    }} className="text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            {/* <h3 className="text-2xl font-bold text-white mb-4">RTQ Foods</h3> */}
            <img
              src={logo}
              alt="RTQ Foods Logo"
              className="logo-image h-[70px] filter invert brightness-0 contrast-100"
              width="auto"
              height={70}
            />
            <p className="text-gray-300 mb-5 leading-relaxed">
              Premium organic food products and spices. Quality you can trust.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
              <img src={require('../../assets/instagram.webp')} alt="Instagram" className="h-5 w-5 " />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white  text-white transition duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white  text-white transition duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-white  text-white transition duration-200"
                >
                  Track Order
                </Link>
              </li>
            </ul>

            <img src={certificates} alt="certificates" width="auto" height={70} className="certificates-image" />
          </div>

          {/* Contact Info */}
          <div>
  <h3 className="text-xl font-semibold text-white mb-4">
    Contact Info
  </h3>

  <div className="space-y-4 text-white">

    {/* Address */}
    <div className="flex items-center gap-3">
      <a 
    href="https://www.google.com/search?client=ms-android-samsung-rvo1&sca_esv=ea03128f0bbabd1b&hl=en-GB&cs=0&sxsrf=AE3TifPbbiGryMGyVnPQ3h4G-HZxYslYeg:1765003816725&kgmid=/g/11s91mdbhw&q=RTQ+FOODS+PVT+Ltd&shndl=30&shem=damc,shrtsdl&source=sh/x/loc/act/m1/4&kgs=dde04daa6bff9276&utm_source=damc,shrtsdl,sh/x/loc/act/m1/4" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-white"
  >
      <img src={location} alt="Location icon" className="w-8 h-8" />
      <span>73/49, 2nd St, Secretariat Colony, Kilpauk, Chennai, Tamil Nadu 600010</span>
      </a>
    </div>

    {/* Email */}
    <div className="flex items-center gap-3">
      <img src={mail} alt="Mail icon" className="w-8 h-8" />
      <span>md@rtqfoods.com</span>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-3">
      <img src={contact} alt="Phone icon" className="w-8 h-8" />
      <span>+91  9884198858</span>
    </div>

  </div>
</div>

          {/* <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Info
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex items-center gap-2">
                <div><img src={location} alt="Organic icon" /></div>
                <span>123 Food Street, Spice City, India</span>
              </div>
              <div className="flex items-center gap-2">
               <div><img src={mail} alt="Organic icon" /></div>
                <span>info@rtqfoods.com</span>
              </div>
              <div className="flex items-center gap-2">
               <div><img src={contact} alt="Organic icon" /></div>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p className="m-0 text-white">© 2024 RTQ Foods. All rights reserved.</p>
          <div className="flex gap-4 mt-3 m-0">
            <Link
              to="/privacy-policy"
              className="text-white hover:text-white transition duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white hover:text-white transition duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/terms"
              className="text-white hover:text-white transition duration-200"
            >
              Return & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
