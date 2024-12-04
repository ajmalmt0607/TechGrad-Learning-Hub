import { useState, useEffect, useContext } from "react";

import {
	Star,
	ShoppingCart,
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import CartId from "../plugins/CartId";
import GetCurrentAddress from "../plugins/UserCountry";
import UserData from "../plugins/UserData";
import Toast from "../plugins/Toast";
import apiInstance from "../../utils/axios";
import { CartContext } from "../plugins/Context";
import useAxios from "../../utils/useAxios";

const CourseSkeleton = () => (
	<div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
		<div className="h-48 bg-gray-300"></div>
		<div className="p-6">
			<div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
			<div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
			<div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
			<div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
			<div className="flex justify-between items-center">
				<div className="h-6 bg-gray-300 rounded w-1/4"></div>
				<div className="h-10 w-10 bg-gray-300 rounded-full"></div>
			</div>
		</div>
	</div>
);

export default function Search() {
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cartCount, setCartCount] = useContext(CartContext);

	const country = GetCurrentAddress().country;
	const userId = UserData()?.user_id;
	const cartId = CartId();

	const fetchCourse = async () => {
		setIsLoading(true);
		try {
			const res = await useAxios().get(`/course/course-list/`);
			setCourses(res.data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCourse();
	}, []);

	const addToCart = async (courseId, userId, price, country, cartId) => {
		const formdata = new FormData();
		formdata.append("course_id", courseId);
		formdata.append("user_id", userId);
		formdata.append("price", price);
		formdata.append("country_name", country);
		formdata.append("cart_id", cartId);

		try {
			await useAxios()
				.post(`course/cart/`, formdata)
				.then((res) => {
					console.log(res.data);
					Toast().fire({ icon: "success", title: "Added to Cart" });
				});

			// set cart count after adding to cart
			apiInstance.get(`course/cart-list/${CartId()}/`).then((res) => {
				setCartCount(res.data?.length);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// search Feature
	const [searchQuery, setsearchQuery] = useState("");

	const handleSearch = (e) => {
		const query = e.target.value.toLowerCase();
		setsearchQuery(query);

		if (query === "") {
			fetchCourse();
		} else {
			const course = courses.filter((course) => {
				return course.title.toLowerCase().includes(query);
			});
			setCourses(course);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 pt-20">
				<div className="max-w-7xl mx-auto space-y-8">
					<section className="bg-white p-5 rounded-lg shadow-lg">
						<h1 className="text-xl font-bold mb-4">
							Showing Results: for &quot;{searchQuery || " "}&quot;
						</h1>
						<div className="max-w-md">
							<input
								type="text"
								className="w-full px-3 py-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="Search Courses..."
								onChange={handleSearch}
							/>
						</div>
					</section>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{[...Array(8)].map((_, index) => (
								<CourseSkeleton key={index} />
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{courses?.slice(0, 8).map((course, index) => (
								<div
									key={index}
									className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col"
								>
									<Link
										to={`/course-detail/${course.slug}/`}
										className="flex-1 flex flex-col"
									>
										<div className="relative">
											<img
												src="https://geeksui.codescandy.com/geeks/assets/images/course/course-css.jpg"
												alt="Course thumbnail"
												className="w-full h-48 object-cover"
											/>
										</div>
										<div className="p-4 flex flex-col justify-between flex-1">
											<div className="flex items-center mb-4 space-x-2">
												<span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
													{course.level}
												</span>
												<span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
													{course.language}
												</span>
											</div>
											<h3 className="font-semibold text-lg mb-3 text-gray-900 line-clamp-2 leading-tight">
												{course.title}
											</h3>
											<p className="text-sm text-gray-600 mb-4 flex items-center">
												<Users size={16} className="mr-2" />
												By {course.teacher.full_name} •{" "}
												{course.students?.length} Student
												{course.students?.length !== 1 && "s"}
											</p>
											<div className="flex items-center mb-4">
												<div className="flex items-center mr-2">
													{[1, 2, 3, 4, 5].map((star) => (
														<Star
															key={star}
															size={16}
															className={
																star <= Math.round(course.average_rating)
																	? "text-yellow-400 fill-current"
																	: "text-gray-300"
															}
														/>
													))}
												</div>
												<span className="text-sm text-gray-600">
													{course.average_rating?.toFixed(1)} (
													{course.reviews?.length} reviews)
												</span>
											</div>
										</div>
									</Link>
									<div className="p-4 pt-0 flex justify-between items-center mt-auto">
										<span className="font-bold text-2xl text-indigo-600">
											${course.price}
										</span>
										<button
											className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
											onClick={(e) => {
												e.stopPropagation(); // Prevent navigation
												e.preventDefault(); // Ensure the default link click behavior doesn't occur
												// Call your add-to-cart function here
												addToCart(
													course.id,
													userId,
													course.price,
													country,
													cartId
												);
											}}
										>
											<ShoppingCart size={20} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					<nav className="flex justify-center space-x-2">
						<button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center">
							<ChevronLeft className="h-4 w-4 mr-1" /> Previous
						</button>
						<button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
							1
						</button>
						<button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center">
							Next <ChevronRight className="h-4 w-4 ml-1" />
						</button>
					</nav>

					<section className="bg-indigo-600 rounded-lg overflow-hidden">
						<div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 flex items-center">
							<div className="max-w-xl">
								<h2 className="text-3xl font-extrabold text-white sm:text-4xl">
									Become an instructor today
								</h2>
								<p className="mt-4 text-lg text-indigo-100">
									Instructors from around the world teach millions of students
									on Geeks. We provide the tools and skills to teach what you
									love.
								</p>
								<div className="mt-8">
									<Link
										href="#"
										className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
									>
										Start Teaching Today{" "}
										<ArrowRight className="ml-2 -mr-1 h-5 w-5" />
									</Link>
								</div>
							</div>
							<div className="hidden lg:block lg:flex-shrink-0">
								<img
									className="h-64 w-auto object-cover"
									src="https://geeksui.codescandy.com/geeks/assets/images/png/cta-instructor-1.png"
									alt="Become an instructor"
									width={300}
									height={256}
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
