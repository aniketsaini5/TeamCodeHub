import { useNavigate } from "react-router-dom";
import backImg from "../assets/Hero.webp";

const Hero = () => {
    const navigate = useNavigate();

    const handleCreateProject = () => {
        navigate("/Dashboard");
    };

    return (
        <section id="Hero" className="py-16 px-6 md:px-12 flex justify-center items-center ">
            <div className="max-w-5xl w-full rounded-lg overflow-hidden relative">
                {/* Background Image with Overlay */}
                <div className="relative h-96 md:h-[28rem] lg:h-[32rem]">
                    {/* Dull Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={backImg}
                            alt="Collaborative coding environment"
                            className="w-full h-full object-center opacity-30"
                        />
                    </div>

                    {/* Centered Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
                            Code Together, Build Faster!
                        </h1>
                        <p className="text-base text-border md:text-xl mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto text-white font-medium drop-shadow">
                            A powerful online coding platform for seamless collaboration and productivity for development teams.
                        </p>
                        <button
                            onClick={handleCreateProject}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-md text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;