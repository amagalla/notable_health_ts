import "./styles/styles.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export const App = () => {
  let res, resColors;
  const [results, setResults] = useState([]);
  const [colors, setColors] = useState([]);
  const [register, setRegister] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  // display all information here

  useEffect(() => {
    axios.get("http://localhost:3000/api/profiles/login").then((resp) => {
      setResults(resp.data.profile);
      setColors(resp.data.colors.splice(0, resp.data.profile.length));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    let result;

    const data = {
      first_name: register.first_name,
      last_name: register.last_name,
      email: register.email,
      password: register.password,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      result = await axios.post(
        "http://localhost:3000/api/profiles/register",
        data,
        headers
      );
    } catch (err) {
      console.log("this is err ", err);
    }

    console.log("This is result!! ", result);
  };

  res = results.map((element, i) => (
    <>
      <span key={i}>
        {element.first_name} {element.last_name}
      </span>
    </>
  ));

  resColors = colors.map((element, i) => (
    <>
      <span key={i}> {element.name}</span>
    </>
  ));

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <p>First Name</p>
            <input
              type="text"
              name="first_name"
              value={register.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>Last Name</p>
            <input
              type="text"
              name="last_name"
              value={register.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>email</p>
            <input
              type="text"
              name="email"
              value={register.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>password</p>
            <input
              type="text"
              name="password"
              value={register.password}
              onChange={handleChange}
            />
          </div>
          <input type="submit" />
        </form>
      </div>
      <div>{res}</div>
      <div>{resColors}</div>
    </>
  );
};
