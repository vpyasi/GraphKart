/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import laptopImg from '/src/assets/laptops.jpg';
import phoneImg from '/src/assets/phones.jpg';
import gamingImg from '/src/assets/gaming.jpg';
import tabletImg from '/src/assets/Tablets.jpg';
import smartWatchImg from '/src/assets/watches.jpg';
import camerasImg from '/src/assets/cameras.jpeg';
import printersImg from '/src/assets/printers.jpg';
import headphonesImg from '/src/assets/headphones.jpg';
import speakersImg from '/src/assets/speakers.jpg';
import mouseImg from '/src/assets/mouse.jpg';
import graphicscardImg from '/src/assets/graphicscards.jpg'
import webcamsImg from '/src/assets/webcams.jpg';
import monitorsImg from '/src/assets/monitors.jpg';

const HomePage = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category: string) => {
        navigate(`/category/${category}`);
    };

    return (
        <div className="w-full font-sans">
            {/* Hero Section */}
            <motion.section
                className="relative bg-gradient-to-r from-sky-100 to-indigo-200 py-32 text-center"
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-6xl font-extrabold text-indigo-700 mb-4 drop-shadow">
                    Your Ultimate Tech Destination
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
                    Handpicked gadgets, lightning deals, and seamless shopping — all in one place.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('popular-categories')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 transition"
                >
                    Shop Now
                </motion.button>
            </motion.section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-10 text-gray-800">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { title: 'Lightning Fast Delivery', icon: '⚡', desc: 'We deliver your tech essentials swiftly and safely.' },
                            { title: 'Secure Checkout', icon: '🔐', desc: 'Bank-level encrypted payments with complete transparency.' },
                            { title: 'Always-On Support', icon: '🛎️', desc: 'Reach us anytime. We’re just a message away!' },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-md"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section id="popular-categories" className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-10 text-gray-800">Explore Popular Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { label: 'Laptops', img: laptopImg },
                            { label: 'Phones', img: phoneImg },
                            { label: 'Gaming', img: gamingImg },
                            { label: 'Tablets', img: tabletImg },
                            { label: 'Smartwatches', img: smartWatchImg },
                            { label: 'Cameras', img: camerasImg },
                            { label: 'Printers', img: printersImg },
                            { label: 'Headphones', img: headphonesImg },
                            { label: 'Speakers', img: speakersImg },
                            { label: 'Mice', img: mouseImg },
                            { label: 'Graphics', img: graphicscardImg },
                            { label: 'Webcams', img: webcamsImg },
                            { label: 'Monitors', img: monitorsImg },

                        ].map((cat, i) => (
                            <motion.div
                                key={i}
                                onClick={() => handleCategoryClick(cat.label)}
                                className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transform hover:scale-105 transition-all"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <img src={cat.img} alt={cat.label} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <p className="text-indigo-600 font-semibold text-lg">{cat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                className="bg-indigo-700 text-white text-center py-20 px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl font-bold mb-4">Join Our Tech Community</h2>
                <p className="mb-6 text-lg max-w-2xl mx-auto">
                    Create your account today and enjoy member-only perks, smart recommendations, and more!
                </p>
                <motion.a
                    href="/login"
                    whileHover={{ scale: 1.05 }}
                    className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition"
                >
                    Get Started
                </motion.a>
            </motion.section>
        </div>
    );
};

export default HomePage;
