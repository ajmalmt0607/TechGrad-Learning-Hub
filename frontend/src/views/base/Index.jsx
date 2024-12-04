import { Link } from "react-router-dom";
import { Book, GraduationCap, Users } from "lucide-react";

import home from "../../assets/home.svg";
import logo from "../../assets/techgrad.svg";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br px-20 bg-white">
			{/* Navigation */}
			<nav className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-12">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<img src={logo} alt="Logo" className="h-14 w-auto" />
						</Link>
					</div>
					<div className="hidden md:flex items-center space-x-8">
						<Link href="/" className="text-gray-700 hover:text-blue-600">
							Home
						</Link>
						<Link href="/courses" className="text-gray-700 hover:text-blue-600">
							Courses
						</Link>
						<Link
							href="/programs"
							className="text-gray-700 hover:text-blue-600"
						>
							Programs
						</Link>
						<Link href="/careers" className="text-gray-700 hover:text-blue-600">
							Careers
						</Link>
						<Link href="/about" className="text-gray-700 hover:text-blue-600">
							About Us
						</Link>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<Link to="/login" className="text-gray-700 hover:text-blue-600">
						Login
					</Link>
					<Link
						to="/register"
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Join Now
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					<div className="space-y-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
							Learning from the world's{" "}
							<span className="text-blue-700">Expert</span>{" "}
							<span className="text-blue-700">Professionals.</span>
						</h1>
						<p className="text-gray-600 text-lg md:text-xl max-w-lg">
							Learn from expert professionals and join the world's largest
							online community for programming.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								href="/start"
								className="bg-blue-700 text-white px-8 py-3 rounded-lg text-center hover:bg-blue-800 transition-colors"
							>
								Start Learning
							</Link>
							<Link
								href="/explore"
								className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg text-center hover:bg-blue-50 transition-colors"
							>
								Explore Courses
							</Link>
						</div>
					</div>

					{/* Hero Image */}
					<div className="relative top-10 ">
						<div className="w-full h-[400px] relative">
							<div className="absolute inset-0 flex items-center justify-center">
								<img
									src={home}
									alt="Learning Illustration"
									className="w-full h-full object-contain"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="flex gap-6 mt-4 md:mt-4">
					<div className="flex space-x-4 bg-white p-6 rounded-xl shadow-sm">
						<div className="bg-blue-100 p-3 rounded-full">
							<Book className="w-6 h-6 text-blue-700" />
						</div>
						<div>
							<div className="font-bold text-xl">200k+</div>
							<div className="text-gray-600">Course</div>
						</div>
					</div>
					<div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm">
						<div className="bg-blue-100 p-3 rounded-full">
							<Users className="w-6 h-6 text-blue-700" />
						</div>
						<div>
							<div className="font-bold text-xl">900k+</div>
							<div className="text-gray-600">Student</div>
						</div>
					</div>
					<div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm">
						<div className="bg-blue-100 p-3 rounded-full">
							<GraduationCap className="w-6 h-6 text-blue-700" />
						</div>
						<div>
							<div className="font-bold text-xl">100k+</div>
							<div className="text-gray-600">Instructor</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
