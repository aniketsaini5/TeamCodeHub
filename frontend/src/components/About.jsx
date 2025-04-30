const About = () => {
    return (
        <section id="About" className="py-16 px-6 md:px-12 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About TeamCode Hub</h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <div className="order-2 md:order-1">
                        <img
                            src="logo.svg"
                            alt="Team collaboration"
                            className="w-full h-auto "
                        />
                    </div>

                    {/* Text Column */}
                    <div className="order-1 md:order-2">
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-gray-300 mb-6">
                            TeamCode was founded in 2025 with a simple yet powerful mission: to revolutionize how development teams collaborate on code. We believe that great software emerges from seamless teamwork and real-time collaboration.
                        </p>

                        <h3 className="text-2xl font-bold text-white mb-4">Why Choose TeamCode?</h3>
                        <ul className="text-gray-300 space-y-3">
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">✓</span>
                                <span>Built by developers, for developers</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">✓</span>
                                <span>Focused on performance and reliability</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">✓</span>
                                <span>Seamless integration with your existing workflow</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">✓</span>
                                <span>Dedicated support team available 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About