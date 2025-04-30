import { Code, Users, Video, Github } from "lucide-react"

const Features = () => {
    return (
        <section id="Features" className="py-20 px-6 md:px-12 bg-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
                    <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Powerful tools designed to enhance your development workflow and team collaboration
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<Code className="h-8 w-8 text-purple-400" />}
                        title="Real-time Code Collaboration"
                        description="Edit & review code together in an online VS Code environment with live updates and zero latency."
                    />

                    <FeatureCard
                        icon={<Users className="h-8 w-8 text-purple-400" />}
                        title="Assign Roles "
                        description="Assign specific roles to team members based on their responsibilities and expertise."
                    />

                    <FeatureCard
                        icon={<Video className="h-8 w-8 text-purple-400" />}
                        title="Integrated Communication"
                        description="Connect with teammates through built-in chat and audio calls without switching applications."
                    />

                    <FeatureCard
                        icon={<Github className="h-8 w-8 text-purple-400" />}
                        title="GitHub Integration"
                        description="Seamlessly sync projects with GitHub repositories, making version control and collaboration effortless."
                    />
                </div>
            </div>
        </section>
    )
}

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-lg shadow-lg hover:shadow-purple-900/30 transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-purple-900/40 p-3 rounded-full w-fit mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <p className="text-gray-300">{description}</p>
        </div>
    )
}

export default Features