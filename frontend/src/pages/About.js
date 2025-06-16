import React from 'react';
import { motion } from 'framer-motion';
import './css/About.css';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Header */}
    <div className="container-fluid p-0">
      <div className="row">
        <div className="col-12 text-center mt-3">
          <h1 className="homepage-title">
            <img src="/media/images/rabbit.png" alt="Rabbit" className="rabbit" />
            About PawFect Pantry
          </h1>
        </div>
      </div>
    </div>

    <hr className="solid my-4" />

    {/* Banner with overlay */}
    <div className="container-fluid p-0">
      <div className="row position-relative">
        <div className="col-12">
          <motion.img
            src="/media/images/about_banner.png"
            alt="Banner"
            className="img-fluid w-100 banner"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="banner-overlay-text">
            <h1>Our Company</h1>
            <p>Mission • Vision • Values</p>
            <p className="slogan">Where every bite is perfectly paw-picked.</p>
            <p className="slogan">From bowl to tail, we care for them all.</p>
            <p className="slogan">Thoughtfully selected. Lovingly delivered.</p>
            <p className="slogan">Because your pet deserves more than just food.</p>
          </div>
        </div>
      </div>
    </div>

    <hr className="solid my-4" />

    {/* Company Intro */}
    <div className="container">
      <div className="row my-5 align-items-center flex-column flex-md-row">
        <motion.div
          className="col-md-3 order-1 order-md-1 text-center text-md-start"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img
            src="/media/images/logo2.png"
            alt="Logo 2"
            className="img-fluid rounded shadow h-100 w-100 object-fit-cover"
          />
        </motion.div>
        <motion.div
          className="col-md-9 order-2 order-md-2 mt-5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="about-text">
            <p>PawFect Pantry is your trusted destination for premium pet food, accessories, and lifestyle products. Our mission is to deliver joy, nutrition, and long-term wellness to pets through a carefully curated selection of high-quality, delicious, and nourishing offerings — tailored to every breed, species, and dietary need.</p>
            <p>Whether you’re shopping for playful pups, curious cats, gentle rabbits, or exotic companions like ferrets, birds, or teacup pigs, our store is stocked with products we proudly stand behind. Every item is handpicked for safety, taste, and sustainability — because your pets deserve nothing but the best.</p>
            <p>At PawFect Pantry, we take pride in working with trusted suppliers and ethical producers around the world. From organic treats to eco-friendly toys and hypoallergenic meals, we are committed to promoting wellness without compromising on quality or values.</p>
            <p>Our e-commerce experience is built with pet parents in mind — fast loading, secure checkout, real-time inventory, and AI-powered recommendations to help you find the right products faster. Plus, with friendly customer support and speedy delivery, we’re always just a paw-click away.</p>
            <p>Beyond being a store, we’re a growing community of animal lovers. Whether you're a new pet owner or a seasoned caretaker of rare breeds, you'll find support, insights, and the joy of shopping with a brand that truly cares.</p>
            <p>Thank you for being part of the PawFect Pantry family. Together, let’s make every tail wag, every purr louder, and every home a happier place. 🐾</p>
          </div>
        </motion.div>
      </div>

      <hr className="solid my-4" />

      {/* Mission Section */}
<div className="row flex-column-reverse flex-md-row align-items-center">
        <motion.div
          className="col-md-9 order-2 order-md-1 mt-5 mt-md-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Our Mission</h2>
          <p className="section-paragraph">
            At PawFect Pantry, our mission is to deliver joy, nutrition, and meaningful moments through carefully curated pet essentials.
            We believe that pets are family — and just like any family member, they deserve the highest standard of care, nourishment, and love.
            Every product we offer reflects our promise of safety, sustainability, and happiness for all furry, feathered, or scaled companions.
          </p>
        </motion.div>
        <motion.div
          className="col-md-3 order-1 order-md-2 mt-5 text-center text-md-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/media/images/mission.gif" alt="Mission" className="img-fluid rounded shadow" />
        </motion.div>
      </div>

      <hr className="solid my-4" />

      {/* Vision Section */}
      <div className="row my-5 align-items-center flex-column flex-md-row">
        <motion.div
          className="col-md-3 order-1 order-md-1 text-center text-md-start"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/media/images/vision.gif" alt="Vision" className="img-fluid rounded shadow" />
        </motion.div>
        <motion.div
          className="col-md-9 order-2 order-md-2 mt-5"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Our Vision</h2>
          <p className="section-paragraph">
            Our vision is to become the most trusted and beloved pet brand globally — a brand that empowers pet parents to care for their animals with confidence, compassion, and convenience.
            Through innovative solutions, ethical sourcing, and community engagement, we envision a future where every pet’s tail wags a little more joyfully.
          </p>
        </motion.div>
      </div>

      <hr className="solid my-4" />

      {/* Values Section */}
      <div className="row flex-column-reverse flex-md-row align-items-center">
        <motion.div
          className="col-md-8 order-2 order-md-1 mt-4 mt-md-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Our Values</h2>
          <ul className="section-list">
            <li>🐾 <strong>Compassion for all animals</strong> — We care deeply for every creature, big or small.</li>
            <li>🌱 <strong>Sustainability-first philosophy</strong> — We choose planet-friendly, eco-conscious options in our supply chain.</li>
            <li>🔍 <strong>Transparency and ethical sourcing</strong> — Our partners are chosen based on trust, ethics, and traceability.</li>
            <li>📦 <strong>Thoughtful, customer-first service</strong> — We exist to make your life easier and your pet’s life better.</li>
            <li>💡 <strong>Continuous innovation</strong> — We embrace creativity to improve pet wellness and evolve with your needs.</li>
            <li>🌐 <strong>Community-driven culture</strong> — We listen, learn, and grow with our customers and their pets.</li>
          </ul>
        </motion.div>
        <motion.div
          className="col-md-4 order-1 order-md-2 mt-5 text-center text-md-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/media/images/values.gif" alt="Values" className="img-fluid rounded shadow" />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default About;
