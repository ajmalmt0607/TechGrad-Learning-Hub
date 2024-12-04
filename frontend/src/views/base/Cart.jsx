import { useContext, useEffect, useState } from "react";

import { ShoppingCart, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import CartId from "../plugins/CartId";
import Toast from "../plugins/Toast";
import { CartContext } from "../plugins/Context";
import { userId } from "../../utils/constants";

export default function ModernCart() {
	const [cart, setCart] = useState([]);
	const [cartStats, setCartStats] = useState({});
	const [cartCount, setCartCount] = useContext(CartContext);
	const [bioData, setBioData] = useState({
		full_name: "",
		email: "",
		country: "",
	});

	const navigate = useNavigate();

	const fetchCartData = async () => {
		try {
			const cartResponse = await apiInstance.get(
				`course/cart-list/${CartId()}/`
			);
			const statsResponse = await apiInstance.get(`cart/stats/${CartId()}/`);
			setCart(cartResponse.data);
			setCartStats(statsResponse.data);
			setCartCount(cartResponse.data.length);
		} catch (error) {
			console.error("Error fetching cart data:", error);
		}
	};
	console.log(cart);

	useEffect(() => {
		fetchCartData();
	}, []);

	const handleBioDataChange = (e) => {
		setBioData({ ...bioData, [e.target.name]: e.target.value });
	};

	const deleteCartItem = async (itemId) => {
		try {
			await apiInstance.delete(
				`course/cart-item-delete/${CartId()}/${itemId}/`
			);
			Toast().fire({
				icon: "success",
				title: "Item removed from cart",
			});
			fetchCartData();
		} catch (error) {
			console.error("Error deleting cart item:", error);
		}
	};

	const createOrder = async (e) => {
		e.preventDefault();
		if (!cart.length) {
			Toast().fire({
				icon: "error",
				title: "Your cart is empty!",
			});
			return;
		}
		if (!bioData.full_name || !bioData.email || !bioData.country) {
			Toast().fire({
				icon: "error",
				title: "Please complete your personal details",
			});
			return;
		}

		try {
			const formData = new FormData();
			formData.append("full_name", bioData.full_name);
			formData.append("email", bioData.email);
			formData.append("country", bioData.country);
			formData.append("cart_id", CartId());
			formData.append("user_id", userId);

			const res = await apiInstance.post(`order/create-order/`, formData);
			navigate(`/student/checkout/${res.data.order_oid}`);
			Toast().fire({
				icon: "success",
				title: "Order placed successfully",
			});
			fetchCartData();
		} catch (error) {
			console.error("Order creation failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-extrabold text-gray-900">
					Your Shopping Cart
				</h1>
				<p className="text-base text-gray-600 max-w-2xl mt-2 mb-7">
					Explore our wide range of courses and start your learning journey
					today
				</p>

				<div className="bg-white shadow-xl rounded-lg overflow-hidden">
					<div className="md:flex">
						{/* Cart Items */}
						<div className="md:w-2/3 p-8">
							<h2 className="text-1xl font-bold text-gray-800 mb-6 flex items-center">
								<ShoppingCart className="mr-2" /> Cart Items ({cart.length})
							</h2>
							{cart.length > 0 ? (
								<ul className="divide-y divide-gray-200">
									{cart.map((course) => (
										<li key={course.id} className="py-6 flex items-center">
											<img
												src={course.course.image}
												alt={course.course.title}
												className="h-20 w-30 rounded-md object-cover"
											/>
											<div className="ml-4 flex-1">
												<h3 className="text-lg font-medium text-gray-900">
													{course.course.title}
												</h3>
												<p className="mt-1 text-lg text-indigo-600 font-semibold">
													₹{course.price}
												</p>
											</div>
											<button
												onClick={() => deleteCartItem(course.id)}
												className="text-red-500 hover:text-red-700 transition-colors"
											>
												<Trash2 className="h-6 w-6" />
											</button>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-center py-8">
									Your cart is empty
								</p>
							)}
						</div>

						{/* Order Summary */}
						<div className="md:w-1/3 bg-gray-50 p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">
								Order Summary
							</h2>
							<div className="space-y-4">
								<div className="flex justify-between">
									<span className="text-gray-600">Subtotal</span>
									<span className="font-medium">
										₹{cartStats.price?.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Tax</span>
									<span className="font-medium">
										₹{cartStats.tax?.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between text-lg font-bold">
									<span>Total</span>
									<span>₹{cartStats.total?.toFixed(2)}</span>
								</div>
							</div>

							<form onSubmit={createOrder} className="mt-8 space-y-4">
								<input
									type="text"
									name="full_name"
									placeholder="Full Name"
									value={bioData.full_name}
									onChange={handleBioDataChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
									required
								/>
								<input
									type="email"
									name="email"
									placeholder="Email Address"
									value={bioData.email}
									onChange={handleBioDataChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
									required
								/>
								<input
									type="text"
									name="country"
									placeholder="Country"
									value={bioData.country}
									onChange={handleBioDataChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
									required
								/>
								<button
									type="submit"
									className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
									disabled={cart.length === 0}
								>
									Proceed to Checkout
									<ChevronRight className="ml-2" />
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
