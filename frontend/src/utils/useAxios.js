import axios from "axios";
import { getRefreshedToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constants";
import Cookies from "js-cookie";

const useAxios = () => {
	const accessToken = Cookies.get("access_token");

	const axiosInstance = axios.create({
		baseURL: API_BASE_URL,
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	axiosInstance.interceptors.request.use(async (req) => {
		if (isAccessTokenExpired(accessToken)) {
			try {
				const response = await getRefreshedToken();
				setAuthUser(response.access, response.refresh);
				req.headers.Authorization = `Bearer ${response.access}`;
			} catch (error) {
				console.error("Token refresh error", error);
				throw error; // Redirect to login in UI
			}
		}
		return req;
	});

	return axiosInstance;
};

export default useAxios;
