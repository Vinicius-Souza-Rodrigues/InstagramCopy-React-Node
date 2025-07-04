import { api, requestConfig } from '../utils/config'

const register = async(data) => {
    const config = requestConfig("POST", data)

    try {

        const res = await fetch(api + "/user/register", config).then((res) => res.json()).catch((err) => err)

        if (res.id) {
            localStorage.setItem("user", JSON.stringify(res))
        }

        console.log(res)
        return res;
    } catch (error) {
        console.log(error)
    }
}

const logout = () => {
    localStorage.removeItem("user")
}

const login = async(data) => {
    const config = requestConfig("POST", data)

    try {
        const res = await fetch(api + "/user/login", config)
            .then((res) => res.json())
            .catch((err) => err)
        if (res.id) {
            localStorage.setItem("user", JSON.stringify(res))
        }
        console.log(res)
        return res;

    } catch (error) {
        console.log(error)
    }
}

const authService = {
    register,
    logout,
    login
};

export default authService