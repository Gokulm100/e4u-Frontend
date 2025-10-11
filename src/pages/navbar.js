
import '../css/navbar.css';
import { GoogleLogin,googleLogout } from '@react-oauth/google';

function Navbar() {
  const responseMessage = (response) => {
    alert('Login Successfull!')
    console.log(response)
};
const errorMessage = (error) => {
    console.log(error);
};
  return (
    <div className="Navbar">
    <ul>
    <li><a class="active" href="#home">Home</a></li>
    <li><a href="#news">News</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#about">About</a></li>
    <li style={{"float":"right"}}><a>Login</a>
         </li>
    </ul>

    </div>
  );
}

export default Navbar;
