const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            title: "Create project & invite your team",
            description: "Start a new project and bring your developers together in one collaborative space."
        },
        {
            number: 2,
            title: "Assign roles & permissions",
            description: "Set specific access levels for team members based on their responsibilities."
        },
        {
            number: 3,
            title: "Code & collaborate in real-time",
            description: "Work together simultaneously with live updates and integrated communication tools."
        },
        {
            number: 4,
            title: "Deploy your project with one click",
            description: "Take your project live effortlessly with our streamlined deployment process."
        },
    ]

    return (
        <section id="HowItWorks" className="py-16 px-6 md:px-12 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Get started with TeamCode in four simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative bg-gray-800 rounded-lg p-8 shadow-lg border-t-4 border-purple-600 hover:transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="absolute -top-5 -left-3 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-white mt-3 mb-4">
                                {step.title}
                            </h3>
                            <p className="text-gray-300">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Progress Path - Visible on larger screens */}
                <div className="hidden lg:flex justify-center items-center mt-12">
                    <div className="h-1 bg-purple-600 w-2/3 relative">
                        {steps.map((step, index) => (
                            <div
                                key={`dot-${step.number}`}
                                className="absolute w-5 h-5 rounded-full bg-purple-600 border-4 border-gray-900"
                                style={{ left: `${(index / (steps.length - 1)) * 100}%`, top: '-10px' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks