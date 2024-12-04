import { useState, useEffect } from "react";

import {
	CheckCircle,
	Loader,
	AlertCircle,
	ArrowRight,
	RotateCw,
	MessageSquareWarning,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";

export default function Success() {
	const [order, setOrder] = useState([]);
	const [orderMessage, setOrderMessage] = useState("");

	const param = useParams();
	const urlParams = new URLSearchParams(window.location.search);
	const sessionId = urlParams.get("session_id");
	const paypalOrderId = urlParams.get("paypal_order_id");

	console.log(sessionId);
	console.log(paypalOrderId);
	console.log(param);

	useEffect(() => {
		const formdata = new FormData();

		formdata.append("order_oid", param.order_oid);
		formdata.append("session_id", sessionId);
		formdata.append("paypal_order_id", paypalOrderId);

		setOrderMessage("Processing Payment");

		try {
			apiInstance.post(`payment/payment-success/`, formdata).then((res) => {
				console.log(res.data);
				setOrderMessage(res.data.message);
			});
		} catch (error) {
			console.log(error);
		}
	}, []);

	console.log(orderMessage);

	return (
		<>
			<div className=" bg-gradient-to-br p-4">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col gap-8 items-center">
						{/* Success State */}
						{orderMessage === "Payment Successful" && (
							<>
								<div className="bg-white mt-32 max-w-[710px] p-8 rounded-lg shadow-lg">
									<CheckCircle className="w-16 h-16 text-green-500 mb-4" />
									<h1 className="text-3xl font-bold text-green-600 mb-4">
										Enrollment Successful!
									</h1>
									<p className="text-gray-600 mb-6">
										Hey there, your enrollment in to the courses was successful.
										Visit your{" "}
										<Link
											to="/student/dashboard"
											className="text-indigo-600 hover:underline"
										>
											Dashboard
										</Link>{" "}
										page to view the courses now.
									</p>
									<Link
										to="/student/courses"
										className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
									>
										View Enrolled Courses{" "}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Link>
								</div>
							</>
						)}

						{/* Processing State */}
						{orderMessage === "Processing Payment" && (
							<>
								<div className="bg-white mt-32 p-8 rounded-lg shadow-lg">
									<Loader className="w-16 h-16 text-yellow-500 mb-4 animate-spin" />
									<h1 className="text-3xl font-bold text-yellow-600 mb-4">
										Processing Payment
									</h1>
									<p className="text-gray-600 mb-6">
										Hey there, hold on while we process your payment. Please do
										not leave the page.
									</p>
								</div>
							</>
						)}

						{/* Already Paid State */}
						{orderMessage === "Payment Already Paid" && (
							<>
								<div className="bg-white mt-32 p-8 rounded-lg shadow-lg">
									<MessageSquareWarning className="w-16 h-16 text-yellow-500 mb-4" />
									<h1 className="text-3xl font-bold text-yellow-600 mb-4">
										Payment Already Paid
									</h1>
									<p className="text-gray-600 mb-6">
										Hey there, hold on while we process your payment. Please do
										not leave the page.
									</p>
								</div>
							</>
						)}

						{/* Failed State */}
						{orderMessage === "Payment Failed" && (
							<>
								<div className="bg-white mt-32 p-8 rounded-lg shadow-lg">
									<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
									<h1 className="text-3xl font-bold text-red-600 mb-4">
										Payment Failed 😔
									</h1>
									<p className="text-gray-600 mb-6">
										Unfortunately, your payment did not go through. Please try
										again.
									</p>
									<button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
										Try again <RotateCw className="ml-2 w-4 h-4" />
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
