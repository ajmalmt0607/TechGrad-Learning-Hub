import { useState, useEffect, useRef, useContext } from "react";

import { useParams } from "react-router-dom";
import moment from "moment";
import {
	Play,
	Lock,
	Twitter,
	Facebook,
	Linkedin,
	X,
	Star,
	Clock,
	Globe,
	Award,
	BookOpen,
	Users,
} from "lucide-react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useAxios from "../../utils/useAxios";
import CartId from "../plugins/CartId";
import GetCurrentAddress from "../plugins/UserCountry";
import UserData from "../plugins/UserData";
import Toast from "../plugins/Toast";
import { CartContext } from "../plugins/Context";
import apiInstance from "../../utils/axios";

const StarRating = ({ rating }) => (
	<div className="flex items-center">
		{[1, 2, 3, 4, 5].map((star) => (
			<Star
				key={star}
				className={`w-4 h-4 ${
					star <= rating
						? "text-yellow-400 fill-yellow-400"
						: "text-gray-300 fill-gray-300"
				}`}
			/>
		))}
	</div>
);

export default function CourseDetail() {
	const [course, setCourse] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [addToCartBtn, setAddToCartBtn] = useState("Add to Cart");
	const [cartCount, setCartCount] = useContext(CartContext);
	const [currentVideo, setCurrentVideo] = useState(null);
	const [currentVideoTitle, setCurrentVideoTitle] = useState("");
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
	const [wishlist, setWishlist] = useState([]);
	const [activeTab, setActiveTab] = useState("curriculum");
	const [openAccordion, setOpenAccordion] = useState("section-1");
	const [isInCart, setIsInCart] = useState(false);
	const [isVideoLoaded, setIsVideoLoaded] = useState(false);

	const videoRef = useRef(null);
	const param = useParams();
	const country = GetCurrentAddress().country;
	const userId = UserData().user_id;

	const fetchCourses = async () => {
		try {
			const res = await useAxios().get(`course/course-detail/${param.slug}/`);
			setCourse(res.data);
			if (res.data?.curriculum?.[0]?.variant_items?.[0]?.url) {
				setCurrentVideo(res.data.curriculum[0].variant_items[0].url);
				setCurrentVideoTitle(res.data.curriculum[0].variant_items[0].title);
			}
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const fetchWishlist = async () => {
		try {
			const res = await useAxios().get(`student/wishlist/${userId}/`);
			setWishlist(res.data.map((item) => item.course.id));
		} catch (error) {
			console.error("Error fetching wishlist:", error);
		}
	};

	const fetchCart = async () => {
		try {
			const res = await apiInstance.get(`course/cart-list/${CartId()}/`);
			setIsInCart(res.data.some((item) => item.course.id === course?.id));
			setCartCount(res.data.length);
		} catch (error) {
			console.error("Error fetching cart:", error);
		}
	};

	useEffect(() => {
		fetchCourses();
		fetchWishlist();
	}, []);

	useEffect(() => {
		if (course) {
			fetchCart();
		}
	}, [course]);

	const addToCart = async (courseId, userId, price, country, cartId) => {
		setAddToCartBtn("Adding to Cart...");
		const formdata = new FormData();
		formdata.append("course_id", courseId);
		formdata.append("user_id", userId);
		formdata.append("price", price);
		formdata.append("country_name", country);
		formdata.append("cart_id", cartId);

		try {
			await useAxios().post(`course/cart/`, formdata);
			setAddToCartBtn("Added to Cart");
			setIsInCart(true);
			Toast().fire({ icon: "success", title: "Added to Cart" });

			const res = await apiInstance.get(`course/cart-list/${CartId()}/`);
			setCartCount(res.data?.length);
		} catch (error) {
			console.error(error);
			setAddToCartBtn("Add to Cart");
		}
	};

	const toggleWishlist = async (courseId, event) => {
		event.preventDefault();
		event.stopPropagation();
		const formdata = new FormData();
		formdata.append("course_id", courseId);
		formdata.append("user_id", userId);

		try {
			await useAxios().post(`student/wishlist/${userId}/`, formdata);
			fetchWishlist();
			Toast().fire({ icon: "success", title: "Wishlist updated" });
		} catch (error) {
			console.error("Error updating wishlist:", error);
		}
	};

	const handleVideoClick = (videoUrl, videoTitle, isPreview) => {
		if (isPreview) {
			setCurrentVideo(videoUrl);
			setCurrentVideoTitle(videoTitle);
			setIsVideoModalOpen(true);
			setIsVideoLoaded(false); // Reset loading state for the new video
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen container mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<Skeleton height={400} />
						<Skeleton height={200} />
						<Skeleton height={400} />
					</div>
					<div className="lg:col-span-1">
						<Skeleton height={600} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<div className="bg-white rounded-xl shadow-sm overflow-hidden">
							<div className="relative aspect-video">
								<img
									src={course.image}
									alt={course.title}
									className="w-full h-full object-cover"
								/>
								<button
									className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity hover:bg-opacity-60"
									onClick={() => setIsVideoModalOpen(true)}
								>
									<Play className="w-16 h-16 text-white" />
								</button>
							</div>
							<div className="p-6">
								<h1 className="text-3xl font-bold mb-4">{course.title}</h1>
								<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
									<div className="flex items-center gap-1">
										<StarRating rating={course.average_rating || 0} />
										<span>({course.rating_count || 0})</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{course.student?.length || 0} students</span>
									</div>
									<div className="flex items-center gap-1">
										<Globe className="w-4 h-4" />
										<span>{course.language}</span>
									</div>
									<div className="flex items-center gap-1">
										<Globe className="w-4 h-4" />
										<span>{course.teacher?.full_name}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm overflow-hidden">
							<div className="border-b">
								<nav className="flex" aria-label="Tabs">
									{["overview", "curriculum", "instructor", "reviews"].map(
										(tab) => (
											<button
												key={tab}
												className={`py-4 px-6 text-sm font-medium ${
													activeTab === tab
														? "text-blue-600 border-b-2 border-blue-600"
														: "text-gray-500 hover:text-gray-700"
												}`}
												onClick={() => setActiveTab(tab)}
											>
												{tab.charAt(0).toUpperCase() + tab.slice(1)}
											</button>
										)
									)}
								</nav>
							</div>

							<div className="p-6">
								{activeTab === "overview" && (
									<div
										className="prose max-w-none"
										dangerouslySetInnerHTML={{ __html: course.description }}
									/>
								)}

								{activeTab === "curriculum" && (
									<div className="space-y-4">
										{course.curriculum?.map((section, index) => (
											<div
												key={`section-${index + 1}`}
												className="border rounded-lg overflow-hidden"
											>
												<button
													className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
													onClick={() =>
														setOpenAccordion(
															openAccordion === `section-${index + 1}`
																? ""
																: `section-${index + 1}`
														)
													}
												>
													<span className="font-medium">{section.title}</span>
													<svg
														className={`w-5 h-5 transition-transform ${
															openAccordion === `section-${index + 1}`
																? "transform rotate-180"
																: ""
														}`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</button>
												{openAccordion === `section-${index + 1}` && (
													<div className="p-4 bg-white">
														<div className="space-y-2">
															{section.variant_items?.map((item, idx) => (
																<div
																	key={idx}
																	className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
																		item.preview
																			? "cursor-pointer hover:bg-gray-50"
																			: "opacity-75"
																	}`}
																	onClick={() =>
																		handleVideoClick(
																			item.url,
																			item.title,
																			item.preview
																		)
																	}
																>
																	<div className="flex items-center gap-3">
																		{item.preview ? (
																			<Play className="w-4 h-4 text-blue-600" />
																		) : (
																			<Lock className="w-4 h-4 text-gray-400" />
																		)}
																		<span
																			className={
																				item.preview ? "text-blue-600" : ""
																			}
																		>
																			{item.title}
																		</span>
																		{item.preview && (
																			<span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
																				Preview
																			</span>
																		)}
																	</div>
																	<span className="text-sm text-gray-500">
																		{item.duration}
																	</span>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								)}

								{activeTab === "instructor" && (
									<div className="space-y-6">
										<div className="flex items-start gap-6">
											<img
												src={course.teacher?.image}
												alt={course.teacher?.full_name}
												className="w-24 h-24 rounded-lg object-cover"
											/>
											<div className="flex-1">
												<h3 className="text-xl font-semibold mb-2">
													{course.teacher?.full_name}
												</h3>
												<p className="text-gray-600 mb-4">
													{course.teacher?.bio}
												</p>
												<div className="flex items-center gap-4">
													{course.teacher?.facebook && (
														<a
															href={course.teacher?.facebook}
															target="_blank"
															rel="noopener noreferrer"
															className="text-gray-600 hover:text-blue-600 transition-colors"
														>
															<Facebook className="w-5 h-5" />
														</a>
													)}
													{course.teacher?.twitter && (
														<a
															href={course.teacher?.twitter}
															target="_blank"
															rel="noopener noreferrer"
															className="text-gray-600 hover:text-blue-400 transition-colors"
														>
															<Twitter className="w-5 h-5" />
														</a>
													)}
													{course.teacher?.linkedin && (
														<a
															href={course.teacher?.linkedin}
															target="_blank"
															rel="noopener noreferrer"
															className="text-gray-600 hover:text-blue-700 transition-colors"
														>
															<Linkedin className="w-5 h-5" />
														</a>
													)}
												</div>
											</div>
										</div>
									</div>
								)}

								{activeTab === "reviews" && (
									<div className="space-y-6">
										<div className="flex items-center justify-between mb-6">
											<h2 className="text-xl font-semibold">Student Reviews</h2>
											<div className="flex items-center gap-2">
												<StarRating rating={course.average_rating || 0} />
												<span className="font-medium">
													{course.average_rating || 0}/5
												</span>
											</div>
										</div>
										{course.reviews?.map((review, index) => (
											<div key={index} className="border-b pb-6 last:border-0">
												<div className="flex items-start gap-4">
													<img
														src={review.profile?.image}
														alt={review.profile?.full_name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<div className="flex-1">
														<div className="flex items-start justify-between">
															<div>
																<h4 className="font-medium">
																	{review.profile?.full_name}
																</h4>
																<div className="flex items-center gap-2 mt-1">
																	<StarRating rating={review.rating} />
																	<span className="text-sm text-gray-500">
																		{moment(review.date).fromNow()}
																	</span>
																</div>
															</div>
															{review.profile?.country && (
																<div className="text-sm text-gray-500">
																	{review.profile.country}
																</div>
															)}
														</div>
														<p className="mt-2 text-gray-600">
															{review.review}
														</p>
														{review.reply && (
															<div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg">
																<div className="flex items-center gap-2 mb-2">
																	<img
																		src={course.teacher?.image}
																		alt={course.teacher?.full_name}
																		className="w-8 h-8 rounded-full"
																	/>
																	<div>
																		<div className="font-medium">
																			{course.teacher?.full_name}
																		</div>
																		<div className="text-sm text-gray-500">
																			Instructor
																		</div>
																	</div>
																</div>
																<p className="text-gray-600">{review.reply}</p>
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
							<div className="mb-6">
								<div className="flex items-center justify-between mb-4">
									<div className="text-3xl font-bold">${course.price}</div>
									{course.original_price && (
										<div className="text-lg text-gray-500 line-through">
											${course.original_price}
										</div>
									)}
								</div>
								<div className="space-y-3">
									<button
										className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
											isInCart
												? "bg-green-600"
												: "bg-blue-600 hover:bg-blue-700"
										}`}
										onClick={() =>
											addToCart(
												course.id,
												userId,
												course.price,
												country,
												CartId()
											)
										}
										disabled={isInCart}
									>
										{isInCart ? "Added to Cart" : "Add to Cart"}
									</button>
									<button
										className="w-full py-3 px-4 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
										onClick={(e) => toggleWishlist(course.id, e)}
									>
										{wishlist.includes(course.id)
											? "Remove from Wishlist"
											: "Add to Wishlist"}
									</button>
								</div>
							</div>
							<div className="space-y-4">
								<h3 className="font-semibold text-lg">This course includes:</h3>
								<ul className="space-y-2">
									<li className="flex items-center gap-3">
										<Clock className="w-5 h-5 text-gray-400" />
										<span>{course.lectures?.length || 0} lectures</span>
									</li>
									<li className="flex items-center gap-3">
										<Globe className="w-5 h-5 text-gray-400" />
										<span>{course.language}</span>
									</li>
									<li className="flex items-center gap-3">
										<BookOpen className="w-5 h-5 text-gray-400" />
										<span>{course.level}</span>
									</li>
									<li className="flex items-center gap-3">
										<Award className="w-5 h-5 text-gray-400" />
										<span>Certificate of completion</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{isVideoModalOpen && currentVideo && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full">
						{/* Modal Header */}
						<div className="flex justify-between items-center p-4 border-b">
							<h3 className="text-lg font-semibold">{currentVideoTitle}</h3>
							<button
								onClick={() => setIsVideoModalOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						{/* Video Player */}
						<div
							className="aspect-video min-h-[360px] bg-black"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Plyr
								source={{
									type: "video",
									sources: [
										{
											src: currentVideo,
											type: "video/mp4",
										},
									],
								}}
								options={{
									controls: [
										"play-large",
										"play",
										"progress",
										"current-time",
										"mute",
										"volume",
										"captions",
										"settings",
										"pip",
										"airplay",
										"fullscreen",
									],
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
