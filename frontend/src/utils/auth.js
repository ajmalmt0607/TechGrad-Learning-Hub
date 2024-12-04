import { userAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode"; // helps to decode the access and refresh token
import Cookie from "js-cookie";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";

export const login = async (email, password) => {
	try {
		const { data, status } = await axios.post(`user/token/`, {
			email,
			password,
		});

		if (status === 200) {
			setAuthUser(data.access, data.refresh);
		}
		return { data, error: null };
	} catch (error) {
		return {
			data: null,
			error: error.response.data?.detail || "something went wrong during login",
		};
	}
};

export const register = async (full_name, email, password, password2) => {
	try {
		const { data } = await axios.post(`user/register/`, {
			full_name,
			email,
			password,
			password2,
		});

		await login(email, password);
		return { data, error: null };
	} catch (error) {
		return {
			data: null,
			error:
				`${error.response.data.full_name} - ${error.response.data.email}` ||
				"something went wrong during registration",
		};
	}
};

export const logout = () => {
	Cookie.remove("access_token");
	Cookie.remove("refresh_token");
	userAuthStore.getState().setUser(null);
};

export const setUser = async () => {
	const access_token = Cookie.get("access_token");
	const refresh_token = Cookie.get("refresh_token");

	if (!access_token || !refresh_token) {
		// alert("Tokens does not exists");
		return;
	}

	if (isAccessTokenExpired(access_token)) {
		const response = getRefreshedToken(refresh_token);
		setAuthUser(response.access, response.refresh);
	} else {
		setAuthUser(access_token, refresh_token);
	}
};

export const setAuthUser = (access_token, refresh_token) => {
	Cookie.set("access_token", access_token, {
		expires: 1,
		secure: true,
	});

	Cookie.set("refresh_token", refresh_token, {
		expires: 7,
		secure: true,
	});

	const user = jwt_decode(access_token) ?? null;

	if (user) {
		userAuthStore.getState().setUser(user);
	}

	userAuthStore.getState().setLoading(false);
};

export const getRefreshedToken = async () => {
	const refresh_token = Cookie.get("refresh_token");
	const response = await axios.post(`user/token/refresh/`, {
		refresh: refresh_token,
	});
	return response.data;
};

export const isAccessTokenExpired = (access_token) => {
	try {
		const decodedToken = jwt_decode(access_token);
		return decodedToken.exp < Date.now / 1000;
	} catch (error) {
		console.log(error);
		return true;
	}
};