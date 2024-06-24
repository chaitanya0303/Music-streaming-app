import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { email, password };
    axios
      .post("https://musicbackend-feog.onrender.com/login", payload)
      .then((res) => {
        console.log("login: " + res.data.Status);
        if (res.data.Status === "Success") {
          console.log(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/songs')
           alert("login successful")
        } else {
          alert("wrong credentials");
        }
      })
      .catch((err) => console.log(err));
  };

  let formHandle1 = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div style={{backgroundImage: "url('')", backgroundSize:"cover", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>

    <div className="flex items-center justify-center min-h-screen "> 
   
    <h2 style={{ position: "relative", bottom: "300px", right: "300px", transform: "scaleX(-1.5)",}} > <Link to="/" className='text-gray-500 hover:text-gray-900'><FaSignOutAlt/></Link></h2>

      <div className="relative  bg-red-300 p-8 rounded-md shadow-md overflow-hidden" style={{display:"flex",height:"420px",width:"550px"}}>
      <div>
        <img src='https://static.vecteezy.com/system/resources/previews/028/269/275/original/happy-cute-girl-listening-to-music-music-therapy-concept-illustration-vector.jpg' width='200px' style={{marginRight:"35px",height:"360px"}} />
      </div>
        <div className="relative z-10" style={{width:"270px"}}>  
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4"  >
              Login to user account
            </h2>
            
          </div>
          
      
          <form className="space-y-6" onSubmit={handleSubmit}>
       
          {/* <form className="space-y-6" onSubmit={handleSubmit}> */}
            {/* Email Input */}
            <div>
                
              <label htmlFor="email" className="block text-sm font-medium text-black-900 ">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black-900 ">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-white hover:bg-red-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-indigo-300 transition-all duration-300"
              >
                Log in
              </button>
              <br />
              <p className="mt-2 text-sm text-black">
                Don't have an account? Create
                <button
                  onClick={formHandle1}
                  className="ml-2 text-white hover:underline focus:outline-none focus:ring focus:border-indigo-300 transition-all duration-300"
                >
                  Signup
                </button>
              </p>
            </div>
          </form>
          {/* </form> */}
        </div>

        {/* Backside tilted background */}
        
      </div>
      </div>
    </div>
   
  );
};

export default Login;
