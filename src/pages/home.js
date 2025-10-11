
import '../css/home.css';
import { GoogleLogin,googleLogout } from '@react-oauth/google';
const comments =[
  {
    "name": "Akshaya AJ",
    "comment": "Is this the remake of the 2018 game?"
  },
  {
    "name": "Gokul M",
    "comment": "Awesome !!! Waiting for this.",
    "subComments": [
      {
        "name": "Aarushi M",
        "comment": "Overrated as hell!!"
      },
      {
        "name": "Rahul M",
        "comment": "Game of the year!"
      }
    ]
  },
  {
    "name": "Brandon Routh",
    "comment": "This must be awesome",
    "subComments": [
      {
        "name": "Aarushi M",
        "comment": "Overrated as hell!!"
      },
      {
        "name": "Rahul M",
        "comment": "Game of the year!"
      },
      {
        "name": "Krishnan S",
        "comment": "Spiderman is better than this shit!"
      }
    ]
  }
]

function Home() {
  const responseMessage = (response) => {
    alert('Login Successfull!')
    console.log(response)
};
const errorMessage = (error) => {
    console.log(error);
};
    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
     let stat =  googleLogout();
     console.log(stat)
      // setProfile(null);
  };
  return (
    <div className="Home">
      <div className='container'>
        <div className='main-area'>
          <div className="latest"><span>Your Feed</span><button style={{ "float": "right" }}>New Post</button></div>
          <div className='post' width={"90%"} height={"70%%"} >
            <div className='profile-name'><img className='profile-pic' src='https://static.thenounproject.com/png/3918329-200.png'></img>Gokul M</div>
            <div style={{ "padding": "20px" }}>
              Let's sing about our feelings in this fun and popular Dream English Song. Original Song by Matt. Note: I am using ASL (American Sign ...</div>
            <div className='action-div'>

            </div>

          </div>


          <div className='comment-section'>
            <commentCompontent ></commentCompontent>
          </div>
          <textarea className="text-area">Whats in your mind?</textarea>


        </div>
        <div className='sub-area'>

        </div>
      </div>
    </div>
  );
}

export default Home;
