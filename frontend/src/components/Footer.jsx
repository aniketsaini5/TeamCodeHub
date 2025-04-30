import { Github, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="py-8 px-6 md:px-12 bg-gray-950">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="flex space-x-4 mb-4">
                    <SocialIcon icon={<Github className="h-5 w-5" />} href="#" />
                    <SocialIcon icon={<Twitter className="h-5 w-5" />} href="#" />
                    <SocialIcon icon={<Linkedin className="h-5 w-5" />} href="#" />
                </div>
                <div className="text-sm text-gray-400">© {currentYear} TeamCodeHub. All rights reserved.</div>
            </div>
        </footer>
    )
}



const SocialIcon = ({ icon, href }) => {
    return (
        <a
            href={href}
            className="text-gray-400 hover:text-purple-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    )
}

export default Footer
